import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
<<<<<<< HEAD
import Home from '../../../components/pet_resort/Home/Home';
=======
import Home from '../../../components/pet_resort/home/Home';
>>>>>>> 503b468ae40b1a97a5e5412cdc313245d24f4375
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