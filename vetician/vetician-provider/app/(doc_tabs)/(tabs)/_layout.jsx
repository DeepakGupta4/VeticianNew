import { Tabs, useRouter } from 'expo-router';
import { Home, User, Users, Calendar } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../../../store/store';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketService from '../../../services/socket';
import notificationService from '../../../services/notificationService';
import IncomingCallScreen from '../../../components/IncomingCallScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RootLayout() {
  const router = useRouter();
  const [incomingCall, setIncomingCall] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const unreadCountRef = useRef(0);

  const incrementBadge = async () => {
    const newCount = unreadCountRef.current + 1;
    unreadCountRef.current = newCount;
    setUnreadCount(newCount);
    await notificationService.setBadgeCount(newCount);
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Register for push notifications
        await notificationService.registerForPushNotifications();

        // Setup notification tap listener — navigate to correct screen
        notificationService.setupListeners((data) => {
          if (data?.screen) router.push(data.screen);
        });

        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          socketService.connect(userId, 'veterinarian');

          // New appointment notification
          socketService.onNewAppointment(async (data) => {
            const petName = data.petName || 'A pet';
            const petType = data.petType || '';
            const dateStr = data.date ? new Date(data.date).toLocaleDateString() : 'soon';
            await notificationService.notifyNewAppointment(petName, petType, dateStr);
            await incrementBadge();
          });

          // Appointment status update notification
          socketService.onAppointmentStatusUpdate(async (data) => {
            await notificationService.notifyAppointmentStatusUpdate(
              data.petName || 'Pet',
              data.status
            );
            await incrementBadge();
          });

          // Verification approved notification
          socketService.onVerificationApproved(async () => {
            await notificationService.notifyVerificationApproved();
            await incrementBadge();
          });

          // Incoming call
          socketService.onIncomingCall(async (callData) => {
            setIncomingCall(callData);
            await notificationService.notifyIncomingCall(
              callData?.callerData?.name || 'Pet Parent'
            );
          });
        }
      } catch (error) {
        console.error('❌ Error initializing:', error);
      }
    };

    init();

    return () => {
      socketService.disconnect();
      notificationService.removeListeners();
    };
  }, []);

  const handleAcceptCall = () => {
    if (!incomingCall) return;
    
    console.log('✅ Call accepted');
    socketService.emitCallResponse({
      callId: incomingCall.callId,
      accepted: true
    });

    setIncomingCall(null);
    
    router.push({
      pathname: '/pages/VideoCallScreen',
      params: {
        callId: incomingCall.callId,
        roomName: incomingCall.roomName,
        token: incomingCall.token || 'mock-token',
        receiverId: incomingCall.callerId,
        receiverName: incomingCall.callerData?.name || 'Pet Parent',
        receiverImg: incomingCall.callerData?.img,
        isInitiator: 'false'
      }
    });
  };

  const handleRejectCall = () => {
    if (!incomingCall) return;
    
    console.log('❌ Call rejected');
    socketService.emitCallResponse({
      callId: incomingCall.callId,
      accepted: false
    });
    
    setIncomingCall(null);
  };
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Tabs
          tabBar={(props) => <CustomTabBar {...props} unreadCount={unreadCount} />}
          screenOptions={{ headerShown: false }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="patients" options={{ href: null }} />
          <Tabs.Screen name="appointment" />
          <Tabs.Screen name="profile" />
          <Tabs.Screen name="surgeries" options={{ href: null }} />
        </Tabs>

        <IncomingCallScreen
          visible={!!incomingCall}
          callerData={incomingCall?.callerData}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      </PersistGate>
    </Provider>
  );
}

function CustomTabBar({ state, navigation, unreadCount = 0 }) {
  const { bottom } = useSafeAreaInsets();

  // In pages where bottom nav should be hidden
  const hiddenScreens = ['patients', 'surgeries', 'appointment'];
  const currentRoute = state.routes[state.index]?.name;
  if (hiddenScreens.includes(currentRoute)) return null;

  const tabs = [
    { name: 'index',       label: 'Home',         Icon: Home },
    { name: 'patients',    label: 'Patients',     Icon: Users },
    { name: 'appointment', label: 'Appointments', Icon: Calendar },
    { name: 'profile',     label: 'Profile',      Icon: User },
  ];

  return (
    <View style={[styles.tabBar, { paddingBottom: bottom || 8 }]}>
      {tabs.map((tab) => {
        const route = state.routes.find(r => r.name === tab.name);
        if (!route) return null;
        const isFocused = state.routes[state.index]?.name === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) navigation.navigate(tab.name);
            }}
            activeOpacity={0.7}
          >
            {isFocused && <View style={styles.activeIndicator} />}
            <View style={{ position: 'relative' }}>
              <tab.Icon size={24} color={isFocused ? '#7CB342' : '#999'} strokeWidth={isFocused ? 2.5 : 2} />
              {tab.name === 'index' && unreadCount > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    minHeight: 72,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -10,
    width: 32,
    height: 3,
    backgroundColor: '#7CB342',
    borderRadius: 2,
  },
  tabLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 3,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#7CB342',
    fontWeight: '700',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
});