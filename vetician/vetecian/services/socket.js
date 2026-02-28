import { io } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'https://vetician-backend-kovk.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.userType = null;
  }

  connect(userId, userType) {
    if (this.socket?.connected) {
      console.log('⚠️ Socket already connected');
      return;
    }

    this.userId = userId;
    this.userType = userType;

    console.log(`🔵 Connecting socket for ${userType}:`, userId);
    console.log(`🌐 Socket URL:`, SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('🟢 Socket connected, joining rooms again');
      if (userType === 'veterinarian') {
        console.log(`📤 Emitting join-veterinarian with userId: ${userId}`);
        this.socket.emit('join-veterinarian', userId);
      } else if (userType === 'petparent') {
        console.log(`📤 Emitting join-petparent with userId: ${userId}`);
        this.socket.emit('join-petparent', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected');
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('🔴 Socket error:', error.message);
    });
  }

  ensureConnection() {
    if (!this.socket?.connected && this.userId && this.userType) {
      this.connect(this.userId, this.userType);
    }
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

  onIncomingCall(callback) {
    if (!this.socket) {
      console.log('⚠️ Socket not initialized for onIncomingCall');
      return;
    }
    console.log('👂 Listening for incoming-call events');
    this.socket.on('incoming-call', (data) => {
      console.log('📞 Received incoming-call event:', data);
      callback(data);
    });
  }

  emitCallResponse(response) {
    this.ensureConnection();
    if (!this.socket) return;
    this.socket.emit('call-response', response);
  }

  emitJoinCall(data) {
    this.ensureConnection();
    if (!this.socket) return;
    this.socket.emit('join-call', data);
  }

  emitEndCall(data) {
    if (!this.socket) return;
    this.socket.emit('end-call', data);
  }

  onCallAccepted(callback) {
    if (!this.socket) return;
    this.socket.off('call-accepted'); // Remove old listeners
    this.socket.on('call-accepted', callback);
  }

  onCallRejected(callback) {
    if (!this.socket) return;
    this.socket.off('call-rejected'); // Remove old listeners
    this.socket.on('call-rejected', callback);
  }

  onCallEnded(callback) {
    if (!this.socket) return;
    this.socket.on('call-ended', callback);
  }

  onUserJoined(callback) {
    if (!this.socket) return;
    this.socket.on('user-joined', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();