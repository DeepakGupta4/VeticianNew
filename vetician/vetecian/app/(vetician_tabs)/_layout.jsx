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
      <Stack.Screen name="pages/VideoCall" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/DoorStep" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/PetWatching" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/Hostel" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/School" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/PetTraning" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/Groming" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/Notifications" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/PetList" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/BookScreen" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/MyBookings" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/MedicalRecords" options={{ headerShown: false }}/>
      <Stack.Screen name="pages/Appointments" options={{ headerShown: false }}/>
      <Stack.Screen name="pets" options={{ headerShown: false }}/>
      <Stack.Screen name="appointments" options={{ headerShown: false }}/>
      <Stack.Screen name="medical-records" options={{ headerShown: false }}/>
      <Stack.Screen name="favorites" options={{ headerShown: false }}/>
      <Stack.Screen name="pet-care" options={{ headerShown: false }}/>
      <Stack.Screen name="orders" options={{ headerShown: false }}/>
      <Stack.Screen name="community" options={{ headerShown: false }}/>
      <Stack.Screen name="rewards" options={{ headerShown: false }}/>
      <Stack.Screen name="notifications" options={{ headerShown: false }}/>
      <Stack.Screen name="help" options={{ headerShown: false }}/>
      <Stack.Screen name="settings" options={{ headerShown: false }}/>
    </Stack>
  );
}