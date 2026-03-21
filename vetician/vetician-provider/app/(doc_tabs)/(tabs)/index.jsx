import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Home as HomeIcon, Calendar, Users, Stethoscope, FileText, User, Settings, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import Home from '../../../components/veterinarian/home/Home';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }) {
    const dispatch = useDispatch();
    
    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove(['token', 'userId', 'user', 'refreshToken']);
            dispatch({ type: 'auth/signOut' });
            router.replace('/(auth)/signin');
        } catch (error) {
            console.error('Logout error:', error);
            router.replace('/(auth)/signin');
        }
    };

    const menuItems = [
        { icon: HomeIcon, label: 'Dashboard', route: '/(doc_tabs)/(tabs)' },
        { icon: Calendar, label: 'Appointments', route: '/(doc_tabs)/(tabs)/appointment' },
        { icon: Users, label: 'Patients', route: '/(doc_tabs)/(tabs)/patients' },
        { icon: Stethoscope, label: 'Surgeries', route: '/(doc_tabs)/(tabs)/surgeries' },
        { icon: FileText, label: 'Medical Records', route: '/(doc_tabs)/records' },
        { icon: User, label: 'Profile', route: '/(doc_tabs)/(tabs)/profile' },
        { icon: Settings, label: 'Settings', route: '/(doc_tabs)/settings' },
    ];

    return (
        <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>Veterinarian</Text>
                <Text style={styles.drawerSubtitle}>Dashboard Menu</Text>
            </View>

            <View style={styles.menuItems}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => router.push(item.route)}
                    >
                        <item.icon size={22} color="#1a1a1a" />
                        <Text style={styles.menuText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
                <LogOut size={22} color="#FF3B30" />
                <Text style={[styles.menuText, { color: '#FF3B30' }]}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    drawerHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        marginBottom: 10,
    },
    drawerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    drawerSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
    },
    menuItems: {
        flex: 1,
        paddingTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16,
    },
    menuText: {
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    logoutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 10,
    },
});

export default function AppDrawer() {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: 280,
                },
            }}
        >
            <Drawer.Screen
                name="Home"
                component={Home}
                options={{ title: 'Dashboard' }}
            />
        </Drawer.Navigator>
    );
}