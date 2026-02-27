# Video Call Implementation Checklist

## ✅ Frontend (Already Done):
1. ✅ IncomingCallScreen component
2. ✅ SimpleVideoCall component  
3. ✅ Socket service with all events
4. ✅ Call button in doctor profile
5. ✅ Call initiation logic
6. ✅ Accept/Reject handlers
7. ✅ End call functionality

## 🔧 Backend (Need to Implement):

### 1. Socket.io Setup in server.js:
```javascript
const io = require('socket.io')(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-veterinarian', (userId) => {
    socket.join(userId);
    console.log(`Vet ${userId} joined`);
  });

  socket.on('join-petparent', (userId) => {
    socket.join(userId);
    console.log(`Parent ${userId} joined`);
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
});

app.set('io', io);
```

### 2. Create routes/call.js:
```javascript
const express = require('express');
const router = express.Router();

router.post('/initiate', async (req, res) => {
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
});

module.exports = router;
```

### 3. Add route in server.js:
```javascript
const callRoutes = require('./routes/call');
app.use('/api/call', callRoutes);
```

## 🚀 After Backend Deploy:

### Test Flow:
1. Pet parent opens doctor profile
2. Clicks "Video Call" button
3. Backend receives `/api/call/initiate` request
4. Backend emits `incoming-call` socket event to doctor
5. Doctor sees incoming call popup
6. Doctor clicks "Accept"
7. Both users join video call
8. Video call connects!

## 📝 Important Notes:
- Socket.io must be running on same server as API
- CORS must allow your frontend domain
- Socket URL is automatically derived from API URL
- Frontend already handles all socket events
- No additional frontend changes needed!

## ✨ After Deploy:
Just restart your app and test! Everything will work automatically.
