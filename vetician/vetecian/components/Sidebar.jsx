import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Home, User, Calendar, Settings, LogOut, Heart, Stethoscope, Video, MapPin, Bell, Briefcase, GraduationCap, Scissors, Hotel, Eye } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUser } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Sidebar({ visible, onClose }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const menuItems = [
    { icon: Home, label: 'Dashboard', route: '/(vetician_tabs)/(tabs)' },
    { icon: Video, label: 'Video Consultation', route: 'pages/VideoConsultation' },
    { icon: MapPin, label: 'Doorstep Service', route: 'pages/DoorStep' },
    { icon: Eye, label: 'Pet Watching', route: 'pages/PetWatching' },
    { icon: Hotel, label: 'Book a Hostel', route: 'pages/Hostel' },
    { icon: GraduationCap, label: 'Day/Play School', route: 'pages/School' },
    { icon: Briefcase, label: 'Pet Training', route: 'pages/PetTraning' },
    { icon: Scissors, label: 'Pet Grooming', route: 'pages/Groming' },
    { icon: Stethoscope, label: 'Find Clinics', route: 'pages/ClinicListScreen' },
    { icon: Bell, label: 'Notifications', route: 'pages/Notifications' },
    { icon: Heart, label: 'Pets', route: 'pages/PetList' },
  ];

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'userId', 'user', 'refreshToken']);
    dispatch(signOutUser());
    onClose();
    router.replace('/(auth)/signin');
  };

  const handleNavigate = (route) => {
    onClose();
    router.push(route);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.sidebar}
          onPress={(e) => e.stopPropagation()}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email || ''}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
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
            </ScrollView>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={22} color="#F44336" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  sidebar: {
    width: '75%',
    maxWidth: 300,
    height: '100%',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#F8F9FA',
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  menu: {
    flex: 1,
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
    backgroundColor: '#FFF5F5',
  },
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    marginLeft: 16,
    fontWeight: '600',
  },
});
