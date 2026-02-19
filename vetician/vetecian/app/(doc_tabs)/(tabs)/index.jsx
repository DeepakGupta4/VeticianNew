// import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../../../components/veterinarian/home/Home';
// import Veterinarian from '../onboarding/veterinarian_detail'
// import Clinic from '../onboarding/clinic'
// import VeterinarianScreen from '../profile_detail/veterinarian_screen';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
        //   screenOptions={{
        //      headerShown: true,
        //      title: 'Dassboard'
        //      swipeEnabled: false, // Disable swipe to open drawer
        //      drawerLockMode: 'locked-closed', // Lock drawer when on certain screens
        //   }}
        >
            <Drawer.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false, title: 'Dassboard' }}
            />
        </Drawer.Navigator>
    );
}