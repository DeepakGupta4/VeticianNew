import { Stack } from 'expo-router';
import { ParavetOnboardingProvider } from '../../contexts/ParavetOnboardingContext';

export default function Layout() {
  return (
    <ParavetOnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </ParavetOnboardingProvider>
  );
}