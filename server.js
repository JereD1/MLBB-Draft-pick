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

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  
  const io = new Server(server, {
    cors: {
      origin: isProduction ? '*' : ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST'],
      credentials: true
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

  expressApp.get('/api/socket-test', (req, res) => {
    res.json({ 
      socketIO: 'working',
      clients: connectedClients,
      environment: isProduction ? 'production' : 'local',
      socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
      timestamp: new Date().toISOString()
    });
  });

  expressApp.use((req, res) => {
    return handler(req, res);
  });

  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 Server Started Successfully!    ║
╟───────────────────────────────────────╢
║   Local: http://${hostname}:${port}
║   Socket URL: ${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'}
║   Socket.IO: ✅ Ready                 ║
║   Environment: ${isProduction ? 'Production' : 'Development'}         ║
║   Clients: ${connectedClients}                     ║
╚═══════════════════════════════════════╝
    `);
  });
});