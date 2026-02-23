// app/(vetician_tabs)/(tabs)/Layout.jsx
import { Tabs } from 'expo-router';
import { Home, User, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4E8D7C',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e1e5e9',
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color, size }) => <Home size={24} color={color} strokeWidth={2.5} /> 
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarIcon: ({ color, size }) => <User size={24} color={color} strokeWidth={2.5} /> 
        }} 
      />
      <Tabs.Screen name="ProfileDetails" options={{ href: null }} />
    </Tabs>
  );
}