import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, SafeAreaView,
  StatusBar, Platform, RefreshControl
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Clock, X, CheckCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import notificationService from '../../services/notificationService';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

const formatTime = (date) => {
  const diffMs = new Date() - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchNotifications(); }, []);

  // Clear badge when notifications screen opens
  useEffect(() => {
    notificationService.clearBadge();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_URL}/auth/notifications?userType=Veterinarian`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications || []);
    } catch (e) {
      console.error('Error fetching notifications:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchNotifications(); };

  const markAsRead = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(`${API_URL}/auth/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error('Error marking as read:', e);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(unread.map(n => markAsRead(n._id)));
    await notificationService.clearBadge();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.cardUnread]}
      onPress={() => markAsRead(item._id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrap, { backgroundColor: item.isRead ? '#F0F0F0' : '#7CB34220' }]}>
        <Bell size={20} color={item.isRead ? '#999' : '#7CB342'} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={[styles.cardTitle, !item.isRead && styles.cardTitleUnread]} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.cardMessage} numberOfLines={2}>{item.message}</Text>
        <View style={styles.cardMeta}>
          <Clock size={11} color="#999" />
          <Text style={styles.cardTime}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />

      {/* Header */}
      <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSub}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
                <CheckCheck size={18} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => router.replace('/(doc_tabs)/(tabs)/profile')} style={styles.closeBtn}>
              <X size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#7CB342" />
          <Text style={styles.loaderText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7CB342']} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Bell size={52} color="#ddd" />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySub}>You'll see notifications here when you receive them</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    paddingTop: Platform.OS === 'android' ? 12 : 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  markAllBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },

  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 12, color: '#7CB342', fontSize: 14 },

  listContent: { padding: 16, paddingBottom: 100 },

  card: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#fff', borderRadius: 16,
    padding: 14, marginBottom: 12, gap: 12,
    elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  cardUnread: { backgroundColor: '#F0FFF0', borderLeftWidth: 3, borderLeftColor: '#7CB342' },
  iconWrap: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  cardContent: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#555', flex: 1 },
  cardTitleUnread: { color: '#1A1A1A', fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#7CB342', marginLeft: 6 },
  cardMessage: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardTime: { fontSize: 11, color: '#999' },

  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginTop: 16 },
  emptySub: { fontSize: 13, color: '#999', marginTop: 6, textAlign: 'center', paddingHorizontal: 32 },
});
