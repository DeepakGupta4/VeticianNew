import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Layout() {
  const router = useRouter();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user && user.role !== 'veterinarian') {
      router.replace('/(auth)/signin');
    }
  }, [user]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/onboarding_conf" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/veterinarian_detail" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/clinic" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/addclinicform" options={{ headerShown: false }} />
      <Stack.Screen name="profile_detail/veterinarian_screen" options={{ headerShown: false }} />
      <Stack.Screen name="newtreatment" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
    </Stack>
  );
}