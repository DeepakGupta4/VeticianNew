import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { signOutUser } from '../../../store/slices/authSlice';

const API_URL = 'https://vetician-backend-kovk.onrender.com/api/auth';

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    unverifiedVets: 0,
    verifiedVets: 0,
    unverifiedClinics: 0,
    verifiedClinics: 0,
    unverifiedResorts: 0,
    verifiedResorts: 0,
    unverifiedParavets: 0,
    verifiedParavets: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [unverifiedVets, verifiedVets, unverifiedClinics, verifiedClinics, unverifiedResorts, verifiedResorts, unverifiedParavets, verifiedParavets] = await Promise.all([
        axios.post(`${API_URL}/admin/unverified`, {}, config),
        axios.post(`${API_URL}/admin/verified`, {}, config),
        axios.post(`${API_URL}/admin/unverified/clinic`, {}, config),
        axios.post(`${API_URL}/admin/verified/clinic`, {}, config),
        axios.post(`${API_URL}/admin/unverified/petresort`, {}, config),
        axios.post(`${API_URL}/admin/verified/petresort`, {}, config),
        axios.get(`https://vetician-backend-kovk.onrender.com/api/paravet/admin/unverified`, config),
        axios.get(`https://vetician-backend-kovk.onrender.com/api/paravet/verified`, config),
      ]);

      setStats({
        unverifiedVets: unverifiedVets.data.count || 0,
        verifiedVets: verifiedVets.data.count || 0,
        unverifiedClinics: unverifiedClinics.data.count || 0,
        verifiedClinics: verifiedClinics.data.count || 0,
        unverifiedResorts: unverifiedResorts.data.count || 0,
        verifiedResorts: verifiedResorts.data.count || 0,
        unverifiedParavets: unverifiedParavets.data.data?.length || 0,
        verifiedParavets: verifiedParavets.data.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log('Logout button clicked');
    
    const performLogout = async () => {
      console.log('Logging out...');
      await AsyncStorage.multiRemove(['token', 'userId', 'user', 'refreshToken']);
      dispatch(signOutUser());
      router.replace('/(auth)/signin');
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        await performLogout();
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: performLogout },
        ]
      );
    }
  };

  const StatCard = ({ title, count, icon, color, pending, onPress }) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statCount}>{count}</Text>
        {pending > 0 && <Text style={styles.statPending}>{pending} pending</Text>}
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E8D7C" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={fetchStats} style={styles.headerButton}>
            <Ionicons name="refresh" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
            <Ionicons name="log-out-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Veterinarians"
          count={stats.verifiedVets}
          icon="people"
          color="#4E8D7C"
          pending={stats.unverifiedVets}
          onPress={() => router.push('/(admin_tabs)/(tabs)/veterinarians')}
        />
        <StatCard
          title="Clinics"
          count={stats.verifiedClinics}
          icon="business"
          color="#FF6B6B"
          pending={stats.unverifiedClinics}
          onPress={() => router.push('/(admin_tabs)/(tabs)/clinics')}
        />
        <StatCard
          title="Pet Resorts"
          count={stats.verifiedResorts}
          icon="home"
          color="#4ECDC4"
          pending={stats.unverifiedResorts}
          onPress={() => router.push('/(admin_tabs)/(tabs)/petresorts')}
        />
        <StatCard
          title="Paravets"
          count={stats.verifiedParavets}
          icon="medical"
          color="#9B59B6"
          pending={stats.unverifiedParavets}
          onPress={() => router.push('/(admin_tabs)/(tabs)/paravets')}
        />
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(admin_tabs)/(tabs)/veterinarians')}
        >
          <Ionicons name="checkmark-circle-outline" size={24} color="#4E8D7C" />
          <Text style={styles.actionText}>Pending Verifications: {stats.unverifiedVets + stats.unverifiedClinics + stats.unverifiedResorts + stats.unverifiedParavets}</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#4E8D7C', marginTop: 10 }]}
          onPress={() => router.push('/(admin_tabs)/create-veterinarian')}
        >
          <Ionicons name="person-add-outline" size={24} color="#FFF" />
          <Text style={[styles.actionText, { color: '#FFF' }]}>Create Veterinarian</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FF6B6B', marginTop: 10 }]}
          onPress={() => router.push('/(admin_tabs)/create-clinic')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#FFF" />
          <Text style={[styles.actionText, { color: '#FFF' }]}>Create Clinic</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#9B59B6', marginTop: 10 }]}
          onPress={() => router.push('/(admin_tabs)/create-paravet')}
        >
          <Ionicons name="medical-outline" size={24} color="#FFF" />
          <Text style={[styles.actionText, { color: '#FFF' }]}>Create Paravet</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4E8D7C',
    paddingTop: 50,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statsGrid: {
    padding: 15,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    marginRight: 15,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statPending: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 5,
  },
  quickActions: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});
