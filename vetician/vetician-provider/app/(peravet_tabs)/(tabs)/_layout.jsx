import { Tabs, useRouter } from 'expo-router';
import { Home, User, Settings, Calendar } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

export default function TabLayout() {
  const router = useRouter();
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    checkApproval();
  }, []);

  const checkApproval = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      if (!token || !userId) {
        router.replace('/(auth)/signin');
        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${API_URL}/paravet/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 404) {
        router.replace('/(peravet_tabs)/onboarding');
        return;
      }
      if (!res.ok) return; // network error - dashboard dikhne do

      const data = await res.json();
      const appStatus = data.data?.applicationStatus;

      if (appStatus?.approvalStatus === 'approved') {
        return; // dashboard allow
      } else if (appStatus?.submitted === true) {
        router.replace('/(peravet_tabs)/pending-approval');
      } else {
        router.replace('/(peravet_tabs)/onboarding');
      }
    } catch (e) {
      // timeout ya network error - dashboard dikhne do
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e1e5e9',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home size={size} color={color} /> }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings', tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Settings size={size} color={color} /> }} />
      <Tabs.Screen name="help" options={{ href: null }} />
      <Tabs.Screen name="ProfileDetails" options={{ href: null }} />
    </Tabs>
  );
}
