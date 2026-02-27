# Video Call Implementation - Backend Setup

## Files Created:
1. `routes/call.js` - Call API endpoints
2. `socket-setup.js` - Socket.io configuration

## Steps to Implement:

### 1. Install Dependencies (if not already installed):
```bash
npm install socket.io
```

### 2. In your main server file (server.js or app.js):

Add this code:
```javascript
const io = require('socket.io')(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-veterinarian', (userId) => {
    socket.join(userId);
    userSockets.set(userId, socket.id);
    console.log(`Veterinarian ${userId} joined`);
  });

  socket.on('join-petparent', (userId) => {
    socket.join(userId);
    userSockets.set(userId, socket.id);
    console.log(`Pet parent ${userId} joined`);
  });

  socket.on('call-response', (data) => {
    if (data.accepted) {
      io.emit('call-accepted', data);
    } else {
      io.emit('call-rejected', data);
    }
  });

  socket.on('join-call', (data) => {
    socket.join(data.roomName);
    socket.to(data.roomName).emit('user-joined', data);
  });

  socket.on('end-call', (data) => {
    io.to(data.roomName).emit('call-ended', data);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

app.set('io', io);
```

### 3. Create routes/call.js:
```javascript
const express = require('express');
const router = express.Router();

router.post('/initiate', async (req, res) => {
  try {
    const { callerId, receiverId, callerData } = req.body;
    const io = req.app.get('io');
    
    const callId = `call-${Date.now()}`;
    const roomName = `room-${callerId}-${receiverId}-${Date.now()}`;
    
    io.to(receiverId).emit('incoming-call', {
      callId,
      roomName,
      token: 'mock-token',
      callerData
    });
    
    res.json({ success: true, callId, roomName });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
```

### 4. Add route to your app:
```javascript
const callRoutes = require('./routes/call');
app.use('/api/call', callRoutes);
```

### 5. Test:
- Start backend server
- Pet parent clicks "Video Call" button
- Doctor should receive incoming call popup
- Accept/Reject should work
- Video call should connect

## Frontend is already done! Just implement backend changes above.
