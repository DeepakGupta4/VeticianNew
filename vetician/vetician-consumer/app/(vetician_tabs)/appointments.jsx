import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, ChevronLeft } from 'lucide-react-native';

export default function Appointments() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <Calendar size={80} color="#EC4899" />
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subtitle}>Your upcoming and past appointments</Text>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#4E8D7C', paddingBottom: 16, paddingHorizontal: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' },
  placeholder: { width: 40 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#2C3E50', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#7D7D7D', marginTop: 8, textAlign: 'center' },
  comingSoon: { marginTop: 16, fontSize: 14, color: '#4E8D7C', fontWeight: '600' }
});
