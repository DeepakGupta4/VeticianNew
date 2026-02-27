// Backend: routes/call.js
const express = require('express');
const router = express.Router();

// POST /api/call/initiate
router.post('/initiate', async (req, res) => {
  try {
    const { callerId, receiverId, callerData } = req.body;
    const io = req.app.get('io');
    
    const callId = `call-${Date.now()}`;
    const roomName = `room-${callerId}-${receiverId}-${Date.now()}`;
    
    console.log(`📞 Call from ${callerId} to ${receiverId}`);
    
    io.to(receiverId).emit('incoming-call', {
      callId,
      roomName,
      token: 'mock-token',
      callerData
    });
    
    res.json({ success: true, callId, roomName });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed' });
  }
});

module.exports = router;
