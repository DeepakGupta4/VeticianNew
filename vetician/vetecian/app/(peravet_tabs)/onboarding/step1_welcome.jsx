import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Smile, Activity, Star, TrendingUp, ChevronRight } from 'lucide-react-native';

export default function Step1Welcome() {
  const router = useRouter();

  const benefits = [
    {
      icon: 'visibility',
      title: 'Increased Visibility',
      description: 'Get visible to pet owners searching for paravet professionals in your area'
    },
    {
      icon: 'consult',
      title: 'Home Visit Requests',
      description: 'Accept home service requests and provide care at pet owners\' doorsteps'
    },
    {
      icon: 'earnings',
      title: 'Steady Earnings',
      description: 'Earn money through service requests and collaborate with veterinarians'
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to Vetician</Text>
        <Text style={styles.subtitle}>Paravet Partner Program</Text>
      </View>

      {/* Welcome Message */}
      <View style={styles.contentContainer}>
        <View style={styles.messageBox}>
          <Text style={styles.messageTitle}>Help pets across your city with your expertise</Text>
          <Text style={styles.messageText}>
            Welcome to Vetician's Paravet Partner Program. Provide post-op care, vaccinations, and other non-critical pet services from the comfort of pet owners' homes.
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.sectionTitle}>Why Join Vetician?</Text>
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
              <ChevronRight size={20} color="#999" />
            </View>
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => router.push('./step2_eligibility')}
        >
          <Text style={styles.primaryButtonText}>GET STARTED</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => router.replace('/(peravet_tabs)/(tabs)/home')}
        >
          <Text style={styles.secondaryButtonText}>SKIP FOR NOW</Text>
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
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  contentContainer: {
    padding: 24,
  },
  messageBox: {
    backgroundColor: '#E8F4FD',
    borderLeftWidth: 4,
    borderLeftColor: '#00B0FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  benefitIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: '#00B0FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
