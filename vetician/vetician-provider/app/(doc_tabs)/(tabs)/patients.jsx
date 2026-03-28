import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, SafeAreaView,
  StatusBar, Platform, TextInput, RefreshControl
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PawPrint, Search, X, User, Video, Building } from 'lucide-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

const PET_COLORS = ['#7CB342', '#558B2F', '#F59E0B', '#10B981', '#6366F1', '#EC4899'];

export default function PatientsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAppointments(data.appointments || []);
    } catch (e) {
      console.error('Fetch error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchAppointments(); };

  // Unique patients by petName + petType
  const uniquePatients = Object.values(
    appointments.reduce((acc, appt) => {
      const key = `${appt.petName}-${appt.petType}`;
      if (!acc[key]) {
        acc[key] = {
          key,
          petName: appt.petName,
          petType: appt.petType,
          breed: appt.breed,
          petPic: appt.petPic,
          contactInfo: appt.contactInfo,
          bookingType: appt.bookingType,
          lastVisit: appt.date,
          totalVisits: 1,
          lastStatus: appt.status,
          illness: appt.illness,
        };
      } else {
        acc[key].totalVisits += 1;
        if (new Date(appt.date) > new Date(acc[key].lastVisit)) {
          acc[key].lastVisit = appt.date;
          acc[key].lastStatus = appt.status;
          acc[key].illness = appt.illness;
        }
      }
      return acc;
    }, {})
  );

  const filtered = uniquePatients.filter(p =>
    p.petName.toLowerCase().includes(search.toLowerCase()) ||
    p.petType.toLowerCase().includes(search.toLowerCase()) ||
    (p.breed || '').toLowerCase().includes(search.toLowerCase())
  );

  const getColor = (name) => PET_COLORS[name?.charCodeAt(0) % PET_COLORS.length] || '#7CB342';

  const renderItem = ({ item }) => {
    const color = getColor(item.petName);
    return (
      <View style={styles.card}>
        {/* Avatar */}
        {item.petPic ? (
          <Image source={{ uri: item.petPic }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: `${color}20` }]}>
            <PawPrint size={22} color={color} />
          </View>
        )}

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.petName}>{item.petName}</Text>
          <Text style={styles.petBreed}>
            {item.petType}{item.breed ? ` • ${item.breed}` : ''}
          </Text>
          {item.illness ? (
            <Text style={styles.illness} numberOfLines={1}>{item.illness}</Text>
          ) : null}
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              {item.bookingType === 'video'
                ? <Video size={11} color="#7CB342" />
                : <Building size={11} color="#7CB342" />
              }
              <Text style={styles.metaText}>
                {item.bookingType === 'video' ? 'Video' : 'In-Clinic'}
              </Text>
            </View>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>
              {new Date(item.lastVisit).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Right */}
        <View style={styles.cardRight}>
          <View style={[styles.visitBadge, { backgroundColor: `${color}15` }]}>
            <Text style={[styles.visitCount, { color }]}>{item.totalVisits}</Text>
            <Text style={[styles.visitLabel, { color }]}>
              {item.totalVisits === 1 ? 'visit' : 'visits'}
            </Text>
          </View>
          {item.contactInfo ? (
            <View style={styles.contactRow}>
              <User size={11} color="#999" />
              <Text style={styles.contactText} numberOfLines={1}>{item.contactInfo}</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />

      {/* Header */}
      <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Patients</Text>
            <Text style={styles.headerSub}>
              {uniquePatients.length} total patient{uniquePatients.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.replace('/(doc_tabs)/(tabs)/profile')} style={styles.closeBtn}>
            <X size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={16} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, type or breed..."
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#7CB342" />
          <Text style={styles.loaderText}>Loading patients...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7CB342']} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <PawPrint size={52} color="#ddd" />
              <Text style={styles.emptyTitle}>
                {search ? 'No results found' : 'No patients yet'}
              </Text>
              <Text style={styles.emptySub}>
                {search ? 'Try a different search term' : 'Patients will appear here after appointments'}
              </Text>
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
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 24,
    paddingHorizontal: 14, paddingVertical: 10, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },

  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  loaderText: { marginTop: 12, color: '#7CB342', fontSize: 14 },

  listContent: { padding: 16, paddingBottom: 100, backgroundColor: '#F5F5F5' },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 16,
    padding: 14, marginBottom: 12,
    elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  avatarPlaceholder: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  cardInfo: { flex: 1 },
  petName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  petBreed: { fontSize: 12, color: '#888', marginTop: 2 },
  illness: { fontSize: 11, color: '#aaa', marginTop: 2 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, color: '#999' },
  metaDot: { fontSize: 11, color: '#ccc' },

  cardRight: { alignItems: 'center', marginLeft: 10 },
  visitBadge: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
  },
  visitCount: { fontSize: 18, fontWeight: '800' },
  visitLabel: { fontSize: 9, fontWeight: '600' },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6, maxWidth: 70 },
  contactText: { fontSize: 10, color: '#999' },

  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginTop: 16 },
  emptySub: { fontSize: 13, color: '#999', marginTop: 6, textAlign: 'center', paddingHorizontal: 32 },
});
