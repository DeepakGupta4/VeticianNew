import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/onboarding_conf" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/veterinarian_detail" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/clinic" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/addclinicform" options={{ headerShown: false }} />
      <Stack.Screen name="profile_detail/veterinarian_screen" options={{ headerShown: false }} />
    </Stack>
  );
}