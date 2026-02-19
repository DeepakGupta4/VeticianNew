import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { signOut } from '../../../store/slices/authSlice';
import { User, Mail, Calendar, MapPin, Phone, CreditCard as Edit, LogOut, Menu } from 'lucide-react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const navigation = useNavigation();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(signOut());
            router.replace('/(auth)/signin');
          },
        },
      ]
    );
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const profileStats = [
    { icon: User, label: 'Activities', value: '12', color: '#FF9500' },
    { icon: Calendar, label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '2023', color: '#5856D6' },
    { icon: MapPin, label: 'Location', value: user?.location ? user.location.split(',')[0] : 'Unknown', color: '#34C759' },
  ];

  const profileInfo = [
    { icon: Mail, label: 'Email', value: user?.email || 'Not provided' },
    { icon: Phone, label: 'Phone', value: user?.phone || 'Not provided' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Menu size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.greeting}>Your Profile</Text>
          <Text style={styles.subtitle}>Manage your account details</Text>
        </View>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={40} color="#FF9500" />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={16} color="#FF9500" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.name || 'User Name'}</Text>
      </View>

      <View style={styles.statsContainer}>
        {profileStats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderTopColor: stat.color }]}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
              <stat.icon size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoList}>
          {profileInfo.map((info, index) => (
            <View key={index} style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: `${info.icon === Mail ? '#007AFF20' : '#FF950020'}` }]}>
                <info.icon size={20} color={info.icon === Mail ? '#007AFF' : '#FF9500'} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{info.label}</Text>
                <Text style={styles.infoValue}>{info.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Account Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#5856D610' }]}>
            <View style={[styles.actionIcon, { backgroundColor: '#5856D620' }]}>
              <Edit size={20} color="#5856D6" />
            </View>
            <Text style={styles.actionTitle}>Edit Profile</Text>
            <Text style={styles.actionDescription}>Update your personal details</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#FF3B3010' }]}
            onPress={handleSignOut}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FF3B3020' }]}>
              <LogOut size={20} color="#FF3B30" />
            </View>
            <Text style={styles.actionTitle}>Sign Out</Text>
            <Text style={styles.actionDescription}>Log out of your account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FF9500',
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
  },
  menuButton: {
    marginRight: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    marginTop: -30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF950020',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF9500',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderTopWidth: 4,
    elevation: 2,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  profileInfo: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  infoList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f5',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  actionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});