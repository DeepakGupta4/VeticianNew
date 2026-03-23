import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="consumer-login" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="otp" />
    </Stack>
  );
}