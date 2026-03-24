import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="signin" options={{ href: '/signin' }} />
      <Stack.Screen name="signup" options={{ href: '/signup' }} />
      <Stack.Screen name="phone" />
      <Stack.Screen name="otp" />
    </Stack>
  );
}