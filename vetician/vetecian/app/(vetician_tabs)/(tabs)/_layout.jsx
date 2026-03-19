// app/(vetician_tabs)/(tabs)/Layout.jsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4E8D7C',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          backgroundColor: '#FFFFFF',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="clinic" 
        options={{ 
          title: 'Clinic', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical-outline" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="pet" 
        options={{ 
          title: 'Pet', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw-outline" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen name="ProfileDetails" options={{ href: null }} />
      <Tabs.Screen name="../pages/ClinicListScreen" options={{ href: null }} />
      <Tabs.Screen name="../pages/ClinicDetailScreen" options={{ href: null }} />
      <Tabs.Screen name="../pages/PetList" options={{ href: null }} />
      <Tabs.Screen name="../pages/BookScreen" options={{ href: null }} />
      <Tabs.Screen name="../pages/VideoConsultation" options={{ href: null }} />
      <Tabs.Screen name="../pages/Hostel" options={{ href: null }} />
    </Tabs>
  );
}