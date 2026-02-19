import { Stack } from 'expo-router';
import { ParavetOnboardingProvider } from '../../../contexts/ParavetOnboardingContext';

export default function OnboardingLayout() {
  return (
    <ParavetOnboardingProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ParavetOnboardingProvider>
  );
}
