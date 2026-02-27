const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Make io accessible to routes
app.set('io', io);

/* =========================
   CORS Middleware (FIRST - before everything)
========================= */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// IMPORT ROUTES
console.log('📦 Loading routes...');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const paravetRoutes = require('./routes/paravetRoutes');
const parentRoutes = require('./routes/parentRoutes');
const doorstepRoutes = require('./routes/doorstepRoutes');
const vetRoutes = require('./routes/vetRoutes');
const uploadRoutes = require('./routes/upload');
const appointmentRoutes = require('./routes/appointmentRoutes');
const patientRoutes = require('./routes/patientRoutes');
const surgeryRoutes = require('./routes/surgeryRoutes');
console.log('📹 Loading video call routes...');
const videoCallRoutes = require('./routes/videoCall');
const veterinariansRoutes = require('./routes/veterinarians');
const callRoutes = require('./routes/call');
console.log('✅ All routes loaded');
const { errorHandler } = require('./middleware/errorHandler');

/* =========================
   MongoDB Connection
========================= */
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI missing in .env');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((error) => {
    console.error('❌ MongoDB connection failed', error.message);
    process.exit(1);
  });

/* =========================
   API Routes
========================= */
console.log('🔗 Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/paravet', paravetRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/doorstep', doorstepRoutes);
app.use('/api/clinics', vetRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/surgeries', surgeryRoutes);
console.log('📹 Registering video route at /api/video');
app.use('/api/video', videoCallRoutes);
app.use('/api/veterinarians', veterinariansRoutes);
app.use('/api/call', callRoutes);
console.log('✅ All routes registered');

/* =========================
   Health Check
========================= */
app.get('/', (req, res) => {
  res.send('🚀 Server is running & DB connected');
});

// Test endpoint for CORS
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS is working!', timestamp: new Date().toISOString() });
});

app.post('/api/test', (req, res) => {
  res.json({ message: 'POST request successful!', body: req.body });
});

/* =========================
   Error Handler (MUST BE LAST)
========================= */
app.use(errorHandler);

/* =========================
   Socket.io Connection (Updated)
========================= */
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('join-paravet', (paravetId) => {
    socket.join(`paravet-${paravetId}`);
    console.log(`👨‍⚕️ Paravet ${paravetId} joined`);
  });

  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined`);
  });

  socket.on('join-veterinarian', (vetId) => {
    socket.join(vetId);  // Join without prefix
    console.log(`🩺 Veterinarian ${vetId} joined room: ${vetId}`);
    console.log(`📊 Active rooms:`, Array.from(socket.rooms));
  });

  socket.on('join-petparent', (userId) => {
    socket.join(userId);  // Join without prefix
    console.log(`🐾 Pet Parent ${userId} joined room: ${userId}`);
    console.log(`📊 Active rooms:`, Array.from(socket.rooms));
  });

  socket.on('call-response', (data) => {
    console.log('📞 Call response received:', data);
    if (data.accepted) {
      // Extract callerId from roomName (format: room-callerId-receiverId-timestamp)
      const roomParts = data.roomName.split('-');
      const callerId = roomParts[1];
      
      // Emit to both room and caller's user room
      io.to(data.roomName).emit('call-accepted', data);
      io.to(callerId).emit('call-accepted', data);
      console.log(`✅ Call accepted event sent to room: ${data.roomName} and caller: ${callerId}`);
    } else {
      const roomParts = data.roomName.split('-');
      const callerId = roomParts[1];
      
      io.to(data.roomName).emit('call-rejected', data);
      io.to(callerId).emit('call-rejected', data);
      console.log(`❌ Call rejected event sent to room: ${data.roomName} and caller: ${callerId}`);
    }
  });

  socket.on('join-call', (data) => {
    socket.join(data.roomName);
    socket.to(data.roomName).emit('user-joined', data);
    console.log(`👥 User joined call room: ${data.roomName}`);
  });

  socket.on('end-call', (data) => {
    console.log(`📴 End call request for room: ${data.roomName}`);
    io.to(data.roomName).emit('call-ended', data);
    socket.leave(data.roomName);
    console.log(`📴 Call ended and left room: ${data.roomName}`);
  });

  // WebRTC signaling
  socket.on('offer', (data) => {
    socket.to(data.roomName).emit('offer', data);
    console.log(`📤 Offer sent to room: ${data.roomName}`);
  });

  socket.on('answer', (data) => {
    io.to(data.roomName).emit('answer', data);
    console.log(`📤 Answer sent to room: ${data.roomName}`);
  });

  socket.on('ice-candidate', (data) => {
    io.to(data.roomName).emit('ice-candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server live at http://localhost:${PORT}`);
});
