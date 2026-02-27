import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Package, Users, Gift, Bell, HelpCircle, Settings as SettingsIcon, ChevronLeft } from 'lucide-react-native';

const Header = ({ title, router }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <ChevronLeft size={24} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={styles.placeholder} />
  </View>
);

export function PetCare() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Header title="Pet Care Tips" router={router} />
      <View style={styles.content}>
        <BookOpen size={80} color="#F59E0B" />
        <Text style={styles.title}>Pet Care Tips</Text>
        <Text style={styles.subtitle}>Expert advice for your pets</Text>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
    </View>
  );
}

export function Orders() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Header title="Orders & Purchases" router={router} />
      <View style={styles.content}>
        <Package size={80} color="#8B5CF6" />
        <Text style={styles.title}>Orders & Purchases</Text>
        <Text style={styles.subtitle}>Your order history</Text>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
    </View>
  );
}

export function Community() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Header title="Pet Community" router={router} />
      <View style={styles.content}>
        <Users size={80} color="#14B8A6" />
        <Text style={styles.title}>Pet Community</Text>
        <Text style={styles.subtitle}>Connect with other pet parents</Text>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
    </View>
  );
}

export function Rewards() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Header title="Rewards & Points" router={router} />
      <View style={styles.content}>
        <Gift size={80} color="#F59E0B" />
        <Text style={styles.title}>Rewards & Points</Text>
        <Text style={styles.subtitle}>Earn rewards and special offers</Text>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
    </View>
  );
}

export function Notifications() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Header title="Notifications" router={router} />
      <View style={styles.content}>
        <Bell size={80} color="#6366F1" />
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Your alerts and updates</Text>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
    </View>
  );
}

export function Help() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Header title="Help & Support" router={router} />
      <View style={styles.content}>
        <HelpCircle size={80} color="#64748B" />
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>Get assistance and FAQs</Text>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
    </View>
  );
}

export function Settings() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Header title="Settings" router={router} />
      <View style={styles.content}>
        <SettingsIcon size={80} color="#64748B" />
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>App preferences and account settings</Text>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
    </View>
  );
}

// Default export for the route
export default function ProfileSections() {
  return <Settings />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#4E8D7C', 
    paddingTop: 40, 
    paddingBottom: 12, 
    paddingHorizontal: 16 
  },
  backButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
    flex: 1, 
    textAlign: 'center' 
  },
  placeholder: { width: 40 },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#2C3E50', 
    marginTop: 20 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#7D7D7D', 
    marginTop: 8, 
    textAlign: 'center' 
  },
  comingSoon: { 
    marginTop: 16, 
    fontSize: 14, 
    color: '#4E8D7C', 
    fontWeight: '600' 
  }
});
