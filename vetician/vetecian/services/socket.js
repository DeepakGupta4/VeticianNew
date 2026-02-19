// Temporarily disabled socket.io-client due to React Native compatibility issues
// import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId, userType) {
    console.log('Socket service temporarily disabled');
    // TODO: Implement React Native compatible socket connection
  }

  onNewBooking(callback) {
    console.log('Socket service temporarily disabled');
  }

  onBookingUpdated(callback) {
    console.log('Socket service temporarily disabled');
  }

  disconnect() {
    console.log('Socket service temporarily disabled');
  }
}

export default new SocketService();