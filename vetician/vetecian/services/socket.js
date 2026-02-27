import { io } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'https://vetician-backend-kovk.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId, userType) {
    if (this.socket?.connected) {
      console.log('✅ Socket already connected');
      return;
    }

    console.log(`🔌 Connecting to socket server: ${SOCKET_URL}`);
    console.log(`👤 User ID: ${userId}, Type: ${userType}`);

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      
      if (userType === 'veterinarian') {
        console.log(`📤 Emitting join-veterinarian with ID: ${userId}`);
        this.socket.emit('join-veterinarian', userId);
      } else if (userType === 'petparent') {
        console.log(`📤 Emitting join-petparent with ID: ${userId}`);
        this.socket.emit('join-petparent', userId);
      } else if (userType === 'paravet') {
        console.log(`📤 Emitting join-paravet with ID: ${userId}`);
        this.socket.emit('join-paravet', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
    });
  }

  onNewAppointment(callback) {
    if (!this.socket) {
      console.log('⚠️ Socket not initialized for onNewAppointment');
      return;
    }
    console.log('👂 Listening for new-appointment events');
    this.socket.on('new-appointment', (data) => {
      console.log('🔔 Received new-appointment event:', data);
      callback(data);
    });
  }

  onAppointmentStatusUpdate(callback) {
    if (!this.socket) {
      console.log('⚠️ Socket not initialized for onAppointmentStatusUpdate');
      return;
    }
    console.log('👂 Listening for appointment-status-update events');
    this.socket.on('appointment-status-update', (data) => {
      console.log('🔔 Received appointment-status-update event:', data);
      callback(data);
    });
  }

  onNewBooking(callback) {
    if (!this.socket) {
      console.log('⚠️ Socket not initialized for onNewBooking');
      return;
    }
    console.log('👂 Listening for new-booking events');
    this.socket.on('new-booking', (data) => {
      console.log('🔔 Received new-booking event:', data);
      callback(data);
    });
  }

  onVerificationApproved(callback) {
    if (!this.socket) {
      console.log('⚠️ Socket not initialized for onVerificationApproved');
      return;
    }
    console.log('👂 Listening for verification-approved events');
    this.socket.on('verification-approved', (data) => {
      console.log('🔔 Received verification-approved event:', data);
      callback(data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();