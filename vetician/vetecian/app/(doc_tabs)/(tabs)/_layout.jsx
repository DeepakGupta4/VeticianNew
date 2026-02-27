import { Tabs } from 'expo-router';
import { Home, User, Users, Calendar } from 'lucide-react-native';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../../../store/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#4E8D7C',
            tabBarInactiveTintColor: '#6B7280',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
              height: 75,
              paddingBottom: 12,
              paddingTop: 8
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              marginTop: 4
            },
            tabBarIconStyle: {
              marginBottom: 0
            }
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <View style={{ alignItems: 'center' }}>
                  <Home size={26} color={color} strokeWidth={focused ? 2.5 : 2} />
                </View>
              )
            }}
          />
          <Tabs.Screen
            name="patients"
            options={{
              title: 'Patients',
              tabBarIcon: ({ color, focused }) => (
                <View style={{ alignItems: 'center' }}>
                  <Users size={26} color={color} strokeWidth={focused ? 2.5 : 2} />
                </View>
              )
            }}
          />
          <Tabs.Screen
            name="appointment"
            options={{
              title: 'Appointments',
              tabBarIcon: ({ color, focused }) => (
                <View style={{ alignItems: 'center' }}>
                  <Calendar size={26} color={color} strokeWidth={focused ? 2.5 : 2} />
                </View>
              )
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, focused }) => (
                <View style={{ alignItems: 'center' }}>
                  <User size={26} color={color} strokeWidth={focused ? 2.5 : 2} />
                </View>
              )
            }}
          />
          <Tabs.Screen name="surgeries" options={{ href: null }} />
        </Tabs>
      </PersistGate>
    </Provider>
  );
}
