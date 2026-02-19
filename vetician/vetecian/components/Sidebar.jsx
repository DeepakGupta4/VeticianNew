import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Home, User, Calendar, Settings, LogOut, Heart, Stethoscope, Video, MapPin } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUser } from '../store/slices/authSlice';

export default function Sidebar({ visible, onClose }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const menuItems = [
    { icon: Home, label: 'Home', route: '/(vetician_tabs)/(tabs)' },
    { icon: Heart, label: 'My Pets', route: 'pages/PetList' },
    { icon: Calendar, label: 'Appointments', route: 'pages/Appointments' },
    { icon: Stethoscope, label: 'Clinics', route: 'pages/ClinicListScreen' },
    { icon: Video, label: 'Video Call', route: 'pages/VideoCall' },
    { icon: MapPin, label: 'Doorstep', route: 'pages/DoorStep' },
    { icon: User, label: 'Profile', route: '/(vetician_tabs)/(tabs)/profile' },
    { icon: Settings, label: 'Settings', route: 'settings' },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(signOutUser()).unwrap();
      onClose();
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      onClose();
      router.replace('/(auth)/signin');
    }
  };

  const handleNavigate = (route) => {
    onClose();
    router.push(route);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          <View style={styles.header}>
            <View>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || ''}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.menu}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.route)}
              >
                <item.icon size={22} color="#4E8D7C" />
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={22} color="#F44336" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 20,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
  },
  menu: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    marginLeft: 16,
    fontWeight: '600',
  },
});
