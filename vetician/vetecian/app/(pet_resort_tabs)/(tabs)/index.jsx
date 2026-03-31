import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../../../components/pet_resort/home/Home';
import PetResort from '../onboarding/pet_resort'

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      // screenOptions={{
        // headerShown: false,
        // swipeEnabled: false, // Disable swipe to open drawer
        // drawerLockMode: 'locked-closed', // Lock drawer when on certain screens
      // }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false, title: 'Dassboard' }}
      />
      <Drawer.Screen
        name="PetResort"
        component={PetResort}
        options={{ headerShown: false, title: 'Pet Resort' }}
      />
    </Drawer.Navigator>
  );
}