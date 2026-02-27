// Backend: server.js or app.js

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store socket connections
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Join veterinarian
  socket.on('join-veterinarian', (userId) => {
    socket.join(userId);
    userSockets.set(userId, socket.id);
    console.log(`Veterinarian ${userId} joined`);
  });

  // Join pet parent
  socket.on('join-petparent', (userId) => {
    socket.join(userId);
    userSockets.set(userId, socket.id);
    console.log(`Pet parent ${userId} joined`);
  });

  // Call response (accept/reject)
  socket.on('call-response', (data) => {
    console.log('Call response:', data);
    if (data.accepted) {
      io.emit('call-accepted', data);
    } else {
      io.emit('call-rejected', data);
    }
  });

  // User joined call
  socket.on('join-call', (data) => {
    socket.join(data.roomName);
    socket.to(data.roomName).emit('user-joined', data);
    console.log(`User joined room: ${data.roomName}`);
  });

  // End call
  socket.on('end-call', (data) => {
    io.to(data.roomName).emit('call-ended', data);
    console.log(`Call ended: ${data.callId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
  });
});

// Make io available to routes
app.set('io', io);

// Add call routes
const callRoutes = require('./routes/call');
app.use('/api/call', callRoutes);
