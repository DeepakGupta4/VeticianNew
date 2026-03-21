import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, ChevronLeft } from 'lucide-react-native';

export default function Favorites() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorite Vets</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <Heart size={80} color="#EF4444" />
        <Text style={styles.title}>Favorite Vets</Text>
        <Text style={styles.subtitle}>Your saved veterinarians</Text>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#4E8D7C', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' },
  placeholder: { width: 40 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#2C3E50', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#7D7D7D', marginTop: 8, textAlign: 'center' },
  comingSoon: { marginTop: 16, fontSize: 14, color: '#4E8D7C', fontWeight: '600' }
});
