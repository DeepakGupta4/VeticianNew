import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Activity, Star, TrendingUp, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function Step1Welcome() {
  const router = useRouter();

  const benefits = [
    {
      icon: 'visibility',
      title: 'Increased Visibility',
      description: 'Get visible to pet owners searching for paravet professionals in your area',
    },
    {
      icon: 'consult',
      title: 'Home Visit Requests',
      description: "Accept home service requests and provide care at pet owners' doorsteps",
    },
    {
      icon: 'earnings',
      title: 'Steady Earnings',
      description: 'Earn money through service requests and collaborate with veterinarians',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to Vetician</Text>
          <Text style={styles.subtitle}>Complete Your Paravet Profile</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.introText}>
          Let's get you started with Vetician Paravet Program. This will give you access to home visit requests, client bookings, and steady earnings.
        </Text>

        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                {benefit.icon === 'visibility' && <Activity size={24} color="#00B0FF" />}
                {benefit.icon === 'consult' && <TrendingUp size={24} color="#34C759" />}
                {benefit.icon === 'earnings' && <Star size={24} color="#FF9500" />}
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
              <ChevronRight size={20} color="#666" />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('./step2_eligibility')}
        >
          <Text style={styles.primaryButtonText}>CREATE MY PARAVET PROFILE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
    padding: 24,
  },
  introText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 32,
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF5020',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
