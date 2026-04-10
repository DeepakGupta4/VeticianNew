import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import Header from '../../../components/petparent/DayPlaySchool/Header';
import DaycareServiceCard from '../../../components/petparent/DayPlaySchool/DaycareServiceCard';
import DailyScheduleCard from '../../../components/petparent/DayPlaySchool/DailyScheduleCard';
import PetSelectorCard from '../../../components/petparent/DayPlaySchool/PetSelectorCard';
import DaycarePlanCard from '../../../components/petparent/DayPlaySchool/DaycarePlanCard';
import CaretakerCard from '../../../components/petparent/DayPlaySchool/CaretakerCard';
import SafetyCard from '../../../components/petparent/DayPlaySchool/SafetyCard';
import DaycareBookingSection from '../../../components/petparent/DayPlaySchool/DaycareBookingSection';
import { COLORS2 } from '../../../constant/theme';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Fallback plans in case API fails
const FALLBACK_PLANS = [
  { id: '1', name: 'Boarding', duration: '24 hours', price: '₹900', priceValue: 900, desc: 'Full day and night boarding with meals and care' },
  { id: '2', name: 'Day Boarding', duration: '8 to 10 hours', price: '₹600', priceValue: 600, desc: 'Daytime boarding with supervised activities' },
  { id: '3', name: 'Day Park', duration: '1.5 to 2 hours', price: '₹400', priceValue: 400, desc: 'Short playtime session at our park' },
  { id: '4', name: 'Day School', duration: '26 days, 8 hours per day', price: '₹13,650', priceValue: 13650, desc: 'Monthly package with full day training and care' },
  { id: '5', name: 'Play School', duration: '26 days, 3 hours per day', price: '₹8,650', priceValue: 8650, desc: 'Monthly package with half day activities' },
];

const SERVICES = [
  { icon: 'shield-paw', label: 'Supervised Playtime', desc: 'Trained staff watch over your pet at all times.' },
  { icon: 'dog-side', label: 'Group Socialization', desc: 'Friendly interactions with other pets.' },
  { icon: 'home-heart', label: 'Indoor Play Area', desc: 'Safe, climate-controlled indoor zone.' },
  { icon: 'tree', label: 'Outdoor Play Area', desc: 'Fresh air and open space for active pets.' },
  { icon: 'sleep', label: 'Rest & Nap Time', desc: 'Cozy rest spots between play sessions.' },
  { icon: 'food-apple', label: 'Feeding & Hydration', desc: 'Timely meals and fresh water throughout.' },
];

export default function SchoolScreen() {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState('Rocky');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching pricing plans from:', `${API_URL}/daycare/plans`);
      
      const response = await fetch(`${API_URL}/daycare/plans`);
      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📡 Response data:', data);
      
      if (data.success && data.plans) {
        // Format plans for display
        const formattedPlans = data.plans.map(plan => ({
          id: plan._id,
          name: plan.name,
          duration: plan.duration,
          price: `₹${plan.price.toLocaleString('en-IN')}`,
          priceValue: plan.price,
          desc: plan.description
        }));
        setPlans(formattedPlans);
        console.log('✅ Pricing plans loaded:', formattedPlans.length, 'plans');
      } else {
        console.error('❌ API returned success:false or no plans');
        console.log('🔄 Using fallback plans');
        setPlans(FALLBACK_PLANS);
      }
    } catch (error) {
      console.error('❌ Error fetching pricing plans:', error);
      console.error('❌ Error details:', error.message);
      console.log('🔄 Using fallback plans');
      setPlans(FALLBACK_PLANS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <Header onMenuPress={() => router.back()} onProfilePress={() => {}} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.label}>Our Services</Text>
        {SERVICES.map((s, i) => (
          <DaycareServiceCard key={s.label} {...s} delay={i * 40} />
        ))}

        <Text style={styles.label}>Daily Schedule</Text>
        <DailyScheduleCard />

        <Text style={styles.label}>Your Pets</Text>
        <PetSelectorCard selected={selectedPet} onSelect={setSelectedPet} />

        <Text style={styles.label}>Available Plans</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS2.primary} />
            <Text style={styles.loadingText}>Loading pricing plans...</Text>
          </View>
        ) : plans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pricing plans available</Text>
          </View>
        ) : (
          plans.map(plan => (
            <DaycarePlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.name}
              onSelect={() => setSelectedPlan(plan.name)}
              onBook={() => {}}
            />
          ))
        )}

        <Text style={styles.label}>Your Caretaker</Text>
        <CaretakerCard />

        <Text style={styles.label}>Safety Standards</Text>
        <SafetyCard />

        <Text style={styles.label}>Book a Slot</Text>
        <DaycareBookingSection 
          selectedPlan={selectedPlan} 
          selectedPlanPrice={plans.find(p => p.name === selectedPlan)?.priceValue}
          onBook={() => {}} 
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS2.bg,
  },
  scroll: {
    padding: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 10,
    marginTop: 6,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS2.subtext,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS2.subtext,
  },
});
