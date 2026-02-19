import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

/**
 * Entry point for the paravet onboarding flow
 * Redirects to Step 1 (Welcome)
 */
export default function OnboardingIndex() {
  const router = useRouter();

  useEffect(() => {
    // Small delay to ensure router is ready
    const timer = setTimeout(() => {
      router.replace('./step1_welcome');
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  // Show loading while redirecting
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#00B0FF" />
    </View>
  );
}
