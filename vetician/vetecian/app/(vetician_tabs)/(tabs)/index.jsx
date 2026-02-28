import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../pages/Home';
import PetList from '../pages/PetList'
import ClinicListScreen from '../pages/ClinicListScreen';
import HealthTipsScreen from '../pages/HealthTipsScreen'
import VideoCall from '../pages/VideoCall';
import Doorstep from '../pages/DoorStep';
import PetWatching from '../pages/PetWatching';
import BookHostel from '../pages/Hostel';
import DayPlaySchool from '../pages/School';
import PetTraining from '../pages/PetTraning';
import Grooming from '../pages/Groming';
import Notifications from '../pages/Notifications';
import MyBookings from '../pages/MyBookings';

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
        name="MyBookings"
        component={MyBookings}
        options={{ headerShown: false, title: 'My Bookings' }}
      />
      <Drawer.Screen
        name="VideoCall"
        component={VideoCall}
        options={{ headerShown: false, title: 'Video Consultation' }}
      />
      <Drawer.Screen
        name="Doorstep"
        component={Doorstep}
        options={{ headerShown: false, title: 'Doorstep Service' }}
      />
      <Drawer.Screen
        name="PetWatching"
        component={PetWatching}
        options={{ headerShown: false, title: 'Pet Watching' }}
      />
      <Drawer.Screen
        name="BookHostel"
        component={BookHostel}
        options={{ headerShown: false, title: 'Book a Hostel' }}
      />
      <Drawer.Screen
        name="DayPlaySchool"
        component={DayPlaySchool}
        options={{ headerShown: false, title: 'Day/Play School' }}
      />
      <Drawer.Screen
        name="PetTraining"
        component={PetTraining}
        options={{ headerShown: false, title: 'Pet Training' }}
      />
      <Drawer.Screen
        name="Grooming"
        component={Grooming}
        options={{ headerShown: false, title: 'Pet Grooming' }}
      />
      <Drawer.Screen
        name="ClinicList"
        component={ClinicListScreen}
        options={{ headerShown: false, title: 'Find Clinics' }}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
        options={{ headerShown: false, title: 'Notifications' }}
      />
      <Drawer.Screen
        name="Pets"
        component={PetList}
        options={{ headerShown: false, title: 'Pets' }}
      />
      
      
      {/* <Drawer.Screen
        name="ParentDetail"
        component={ParentDetail}
        options={{ headerShown: false, title: 'Parent Details' }}
      /> */}
      
      <Drawer.Screen
        name="HealthTips"
        component={HealthTipsScreen}
        options={{ headerShown: false, title: 'Health Tips' }}
      />
      
    </Drawer.Navigator>
  );
}