import { Stack } from 'expo-router';
// import HealthTipsScreen from './pages/HealthTipsScreen'

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/onboarding_conf" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/parent_detail" options={{ headerShown: false }} />
      <Stack.Screen name="pages/ClinicListScreen" options={{ headerShown: false }} />
      <Stack.Screen name="pages/QuickTour" options={{ headerShown: false }} />
      <Stack.Screen name="pages/ClinicDetailScreen" options={{ headerShown: false, presentation: 'modal' }}/>
      <Stack.Screen name="pages/PetDetail" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/EditPetScreen" options={{ headerShown: false }}/>
    </Stack>
  );
}