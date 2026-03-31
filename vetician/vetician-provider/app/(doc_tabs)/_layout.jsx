import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
  const router = useRouter();
  const { user } = useSelector(state => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (user && user.role !== 'veterinarian') {
      setTimeout(() => router.replace('/(auth)/signin'), 0);
    }
  }, [user, isReady]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/onboarding_conf" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/veterinarian_detail" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/clinic" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/addclinicform" options={{ headerShown: false }} />
      <Stack.Screen name="profile_detail/veterinarian_screen" options={{ headerShown: false }} />
      <Stack.Screen name="newtreatment" options={{ headerShown: false }} />
      <Stack.Screen name="medical-records" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
      <Stack.Screen name="terms" options={{ headerShown: false }} />
      <Stack.Screen name="pending-approval" options={{ headerShown: false }} />
    </Stack>
  );
}