const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NEXT_PUBLIC_SOCKET_URL && process.env.NEXT_PUBLIC_SOCKET_URL.includes('railway.app');
const hostname = isProduction ? '0.0.0.0' : 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

console.log('🔄 Preparing Next.js...');
console.log(`Environment: ${dev ? 'Development' : 'Production'}`);
console.log(`Socket URL: ${process.env.NEXT_PUBLIC_SOCKET_URL || 'Not set'}`);

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  
  // ⭐ Socket.IO Configuration with CORS for Vercel
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://mlbb-draft-pick.vercel.app',
        'https://mlbb-draft-pick-production.up.railway.app',
        process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null,
        '*'
      ].filter(Boolean),
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true
  });

  // ⭐ State Management
  let currentState = null;
  let connectedClients = 0;

  // ⭐ Socket.IO Event Handlers
  io.on('connection', (socket) => {
    connectedClients++;
    console.log(`✅ Client connected: ${socket.id} | Total: ${connectedClients}`);
    console.log(`   Transport: ${socket.conn.transport.name}`);
    console.log(`   Address: ${socket.handshake.address}`);

    // Send current state to new client
    socket.on('request-state', (callback) => {
      if (typeof callback === 'function') {
        if (currentState) {
          console.log(`📤 Sending state to ${socket.id}`);
          callback(currentState);
        } else {
          console.log(`📭 No state available for ${socket.id}`);
          callback(null);
        }
      }
    });

    // Handle draft updates
    socket.on('draft:update', (state) => {
      console.log(`📡 Draft update from ${socket.id}`);
      currentState = state;
      socket.broadcast.emit('draft:update', state);
    });

    // Handle draft reset
    socket.on('draft:reset', () => {
      console.log(`🔄 Draft reset from ${socket.id}`);
      currentState = null;
      io.emit('draft:reset');
    });

    // Handle hero selection
    socket.on('hero:select', (data) => {
      console.log(`🎯 Hero selected: ${data.heroId} by ${socket.id}`);
      socket.broadcast.emit('hero:select', data);
    });

    // Handle hero ban
    socket.on('hero:ban', (data) => {
      console.log(`🚫 Hero banned: ${data.heroId} by ${socket.id}`);
      socket.broadcast.emit('hero:ban', data);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      connectedClients--;
      console.log(`❌ Client disconnected: ${socket.id} | Total: ${connectedClients}`);
      console.log(`   Reason: ${reason}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`⚠️ Socket error from ${socket.id}:`, error);
    });
  });

  // ⭐ Health Check / Test Endpoint
  expressApp.get('/api/socket-test', (req, res) => {
    res.json({ 
      status: 'healthy',
      socketIO: 'working',
      clients: connectedClients,
      environment: isProduction ? 'production' : 'development',
      socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || `http://${hostname}:${port}`,
      hasState: currentState !== null,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version
    });
  });

  // ⭐ API endpoint to get current state (REST fallback)
  expressApp.get('/api/draft-state', (req, res) => {
    res.json({
      state: currentState,
      clients: connectedClients,
      timestamp: new Date().toISOString()
    });
  });

  // ⭐ API endpoint to reset state (REST fallback)
  expressApp.post('/api/draft-reset', (req, res) => {
    currentState = null;
    io.emit('draft:reset');
    res.json({ 
      success: true, 
      message: 'Draft reset successfully' 
    });
  });

  // ⭐ Handle all Next.js routes - FIXED
  expressApp.use((req, res) => {
    return handler(req, res);
  });

  // ⭐ Start Server
  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`
╔════════════════════════════════════════════════╗
║      🚀 Server Started Successfully!          ║
╟────────────────────────────────────────────────╢
║   URL: http://${hostname}:${port.toString().padEnd(28)} ║
║   Socket URL: ${(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000').padEnd(24)} ║
║   Socket.IO: ✅ Ready                          ║
║   Environment: ${(isProduction ? 'Production' : 'Development').padEnd(27)} ║
║   Clients: ${connectedClients.toString().padEnd(32)} ║
║   Node: ${process.version.padEnd(33)} ║
╟────────────────────────────────────────────────╢
║   Health Check: /api/socket-test              ║
║   Draft State: /api/draft-state               ║
║   Draft Reset: /api/draft-reset               ║
╚════════════════════════════════════════════════╝
    `);
  });

  // ⭐ Graceful Shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, closing server gracefully...');
    io.close(() => {
      console.log('✅ Socket.IO closed');
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
    });
  });

  process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, closing server gracefully...');
    io.close(() => {
      console.log('✅ Socket.IO closed');
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
    });
  });
}).catch((err) => {
  console.error('❌ Error preparing Next.js:', err);
  process.exit(1);
});