const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0'; // ⭐ IMPORTANT: Use 0.0.0.0 for Railway
const port = parseInt(process.env.PORT || '3000', 10); // ⭐ Use Railway's PORT

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

console.log('🔄 Preparing Next.js...');

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  
  // ⭐ IMPORTANT: Allow all origins for CORS
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  let currentState = null;
  let connectedClients = 0;

  io.on('connection', (socket) => {
    connectedClients++;
    console.log(`✅ Client connected: ${socket.id} | Total: ${connectedClients}`);

    socket.on('request-state', (callback) => {
      if (currentState) {
        console.log(`📤 Sending state to ${socket.id}`);
        callback(currentState);
      } else {
        callback(null);
      }
    });

    socket.on('draft:update', (state) => {
      console.log(`📡 Draft update from ${socket.id}`);
      currentState = state;
      socket.broadcast.emit('draft:update', state);
    });

    socket.on('draft:reset', () => {
      console.log('🔄 Draft reset');
      currentState = null;
      io.emit('draft:reset');
    });

    socket.on('disconnect', () => {
      connectedClients--;
      console.log(`❌ Client disconnected: ${socket.id} | Total: ${connectedClients}`);
    });
  });

  // Test endpoint
  expressApp.get('/api/socket-test', (req, res) => {
    res.json({ 
      socketIO: 'working',
      clients: connectedClients,
      timestamp: new Date().toISOString()
    });
  });

  // Handle all Next.js routes
  expressApp.use((req, res) => {
    return handler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 Server Started Successfully!    ║
╟───────────────────────────────────────╢
║   URL: http://${hostname}:${port}        ║
║   Socket.IO: ✅ Ready                 ║
║   Environment: ${dev ? 'Development' : 'Production'}         ║
╚═══════════════════════════════════════╝
    `);
  });
});