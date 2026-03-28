import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ScrollView, SafeAreaView, StatusBar, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stethoscope, Clock, CalendarDays, X, Plus, MapPin, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddClinic() {
  const router = useRouter();

  const handleAddClinic = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) { Alert.alert('Error', 'User not authenticated'); return; }
      router.push('onboarding/addclinicform');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to proceed');
    }
  };

  const features = [
    { icon: Clock,       color: '#2563EB', bg: '#DBEAFE', text: 'Manage clinic hours and availability' },
    { icon: CalendarDays,color: '#7CB342', bg: '#D1FAE5', text: 'Set up services and appointment slots' },
    { icon: Stethoscope, color: '#9333EA', bg: '#E9D5FF', text: 'Handle treatments and medical records' },
    { icon: Users,       color: '#EA580C', bg: '#FED7AA', text: 'Manage staff and permissions' },
    { icon: MapPin,      color: '#0891B2', bg: '#CFFAFE', text: 'Show your clinic location to pet owners' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />

      {/* Header */}
      <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>My Clinic</Text>
            <Text style={styles.headerSub}>Register your veterinary clinic</Text>
          </View>
          <TouchableOpacity onPress={() => router.replace('/(doc_tabs)/(tabs)/profile')} style={styles.closeBtn}>
            <X size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon + Title Card */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Plus size={32} color="#fff" />
          </View>
          <Text style={styles.cardTitle}>Register Your Veterinary Clinic</Text>
          <Text style={styles.cardSubtitle}>
            Join our network of professional veterinarians and start managing your clinic digitally
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.sectionTitle}>What you can do</Text>
          {features.map((f, i) => (
            <View key={i} style={[styles.featureRow, i < features.length - 1 && styles.featureBorder]}>
              <View style={[styles.featureIcon, { backgroundColor: f.bg }]}>
                <f.icon size={20} color={f.color} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddClinic} activeOpacity={0.85}>
          <Plus size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add New Clinic</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },

  scroll: { flex: 1 },
  content: { padding: 16 },

  card: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 24, marginBottom: 14, alignItems: 'center',
    elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  iconCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#7CB342', justifyContent: 'center',
    alignItems: 'center', marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', textAlign: 'center', marginBottom: 8 },
  cardSubtitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },

  featuresCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, marginBottom: 14,
    elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 14 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  featureBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  featureIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  featureText: { fontSize: 14, color: '#444', flex: 1, fontWeight: '500' },

  addButton: {
    backgroundColor: '#7CB342', borderRadius: 14,
    paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    elevation: 3, shadowColor: '#7CB342',
    shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
