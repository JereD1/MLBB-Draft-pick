// ============================================================================
// FIXED server.js - Compatible with Next.js 15
// FILE: server.js (REPLACE ENTIRE FILE)
// ============================================================================

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Initialize Next.js
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

console.log('🔄 Preparing Next.js...');

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  
  // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  let currentState = null;
  let connectedClients = 0;

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    connectedClients++;
    console.log(`✅ Client connected: ${socket.id} | Total clients: ${connectedClients}`);

    // Send current state to new client
    socket.on('request-state', (callback) => {
      if (currentState) {
        console.log(`📤 Sending state to ${socket.id}`);
        callback(currentState);
      } else {
        callback(null);
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
      console.log('🔄 Draft reset');
      currentState = null;
      io.emit('draft:reset');
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      connectedClients--;
      console.log(`❌ Client disconnected: ${socket.id} | Total clients: ${connectedClients}`);
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

  // Handle all Next.js routes - FIXED for Next.js 15
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
}).catch((err) => {
  console.error('❌ Error starting server:', err);
  process.exit(1);
});