# URGENT: Backend Socket.io Not Working

## Problem:
Socket connects but immediately disconnects. Backend is not handling socket events.

## Fix Required in Backend:

### In your server.js or app.js, ADD THIS CODE:

```javascript
const http = require('http');
const socketIo = require('socket.io');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id);

  // Handle veterinarian join
  socket.on('join-veterinarian', (userId) => {
    socket.join(userId);
    console.log(`👨‍⚕️ Veterinarian ${userId} joined room`);
  });

  // Handle pet parent join
  socket.on('join-petparent', (userId) => {
    socket.join(userId);
    console.log(`👤 Pet parent ${userId} joined room`);
  });

  // Handle call response
  socket.on('call-response', (data) => {
    console.log('📞 Call response:', data);
    if (data.accepted) {
      io.emit('call-accepted', data);
    } else {
      io.emit('call-rejected', data);
    }
  });

  // Handle join call
  socket.on('join-call', (data) => {
    socket.join(data.roomName);
    socket.to(data.roomName).emit('user-joined', data);
    console.log(`👥 User joined room: ${data.roomName}`);
  });

  // Handle end call
  socket.on('end-call', (data) => {
    io.to(data.roomName).emit('call-ended', data);
    console.log(`📴 Call ended: ${data.callId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// IMPORTANT: Use 'server' instead of 'app' to listen
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Create routes/call.js:

```javascript
const express = require('express');
const router = express.Router();

router.post('/initiate', async (req, res) => {
  try {
    const { callerId, receiverId, callerData } = req.body;
    const io = req.app.get('io');
    
    console.log(`📞 Call from ${callerId} to ${receiverId}`);
    
    const callId = `call-${Date.now()}`;
    const roomName = `room-${callerId}-${receiverId}-${Date.now()}`;
    
    // Emit to specific user room
    io.to(receiverId).emit('incoming-call', {
      callId,
      roomName,
      token: 'mock-token',
      callerData
    });
    
    console.log(`✅ Call event emitted to ${receiverId}`);
    
    res.json({ success: true, callId, roomName });
  } catch (error) {
    console.error('❌ Call error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

### Add route in server.js:

```javascript
const callRoutes = require('./routes/call');
app.use('/api/call', callRoutes);
```

## Key Points:
1. Use `http.createServer(app)` not just `app`
2. Socket.io must listen on `server` not `app`
3. Handle ALL socket events (join-veterinarian, join-petparent, etc.)
4. Use `io.to(userId).emit()` to send to specific user
5. Make sure `server.listen()` not `app.listen()`

## After Fix:
1. Redeploy backend
2. Restart frontend app
3. Test call - should work!
