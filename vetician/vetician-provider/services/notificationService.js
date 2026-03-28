import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

// How notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  async registerForPushNotifications() {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return null;
    }

    // Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('vetician-provider', {
        name: 'Vetician Provider',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7CB342',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });

      await Notifications.setNotificationChannelAsync('appointments', {
        name: 'Appointments',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7CB342',
        sound: 'default',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: '2f6fd0a7-08ec-4c5f-bc9a-c0492f373e64',
      });
      this.expoPushToken = tokenData.data;
      await AsyncStorage.setItem('expoPushToken', this.expoPushToken);
      await this.savePushTokenToServer(this.expoPushToken);
      return this.expoPushToken;
    } catch (e) {
      console.error('Error getting push token:', e);
      return null;
    }
  }

  async savePushTokenToServer(token) {
    try {
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) return;
      await fetch(`${API_URL}/auth/save-push-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ pushToken: token, userType: 'veterinarian' }),
      });
    } catch (e) {
      console.log('Could not save push token to server:', e.message);
    }
  }

  // Show local notification immediately (for socket events when app is open)
  async showLocalNotification({ title, body, data = {}, channelId = 'vetician-provider' }) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId }),
      },
      trigger: null, // show immediately
    });
  }

  // Specific notification types
  async notifyNewAppointment(petName, petType, dateStr) {
    await this.showLocalNotification({
      title: '🐾 New Appointment Request!',
      body: `${petName} (${petType}) has booked an appointment for ${dateStr}`,
      data: { type: 'new_appointment', screen: '/(doc_tabs)/(tabs)/appointment' },
      channelId: 'appointments',
    });
  }

  async notifyAppointmentStatusUpdate(petName, status) {
    const statusMap = {
      confirmed: { emoji: '✅', msg: 'confirmed' },
      cancelled: { emoji: '❌', msg: 'cancelled' },
      completed: { emoji: '🎉', msg: 'completed' },
    };
    const s = statusMap[status] || { emoji: '🔔', msg: status };
    await this.showLocalNotification({
      title: `${s.emoji} Appointment ${s.msg}`,
      body: `Appointment for ${petName} has been ${s.msg}`,
      data: { type: 'appointment_status', screen: '/(doc_tabs)/(tabs)/appointment' },
      channelId: 'appointments',
    });
  }

  async notifyVerificationApproved() {
    await this.showLocalNotification({
      title: '🎉 Account Verified!',
      body: 'Congratulations! Your veterinarian account has been verified. You can now receive appointments.',
      data: { type: 'verification', screen: '/(doc_tabs)/(tabs)/index' },
    });
  }

  async notifyIncomingCall(callerName) {
    await this.showLocalNotification({
      title: '📞 Incoming Video Call',
      body: `${callerName || 'A pet parent'} is calling you`,
      data: { type: 'incoming_call' },
    });
  }

  // Setup listeners for notification taps (navigate on tap)
  setupListeners(onNotificationTap) {
    this.notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('🔔 Notification received:', notification);
    });

    this.responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('👆 Notification tapped:', data);
      if (onNotificationTap) onNotificationTap(data);
    });
  }

  removeListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  async getBadgeCount() {
    return await Notifications.getBadgeCountAsync();
  }

  async setBadgeCount(count) {
    await Notifications.setBadgeCountAsync(count);
  }

  async clearBadge() {
    await Notifications.setBadgeCountAsync(0);
  }
}

export default new NotificationService();
