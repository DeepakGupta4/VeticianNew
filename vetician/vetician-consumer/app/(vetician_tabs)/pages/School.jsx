import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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

const SERVICES = [
  { icon: 'shield-paw', label: 'Supervised Playtime', desc: 'Trained staff watch over your pet at all times.' },
  { icon: 'dog-side', label: 'Group Socialization', desc: 'Friendly interactions with other pets.' },
  { icon: 'home-heart', label: 'Indoor Play Area', desc: 'Safe, climate-controlled indoor zone.' },
  { icon: 'tree', label: 'Outdoor Play Area', desc: 'Fresh air and open space for active pets.' },
  { icon: 'sleep', label: 'Rest & Nap Time', desc: 'Cozy rest spots between play sessions.' },
  { icon: 'food-apple', label: 'Feeding & Hydration', desc: 'Timely meals and fresh water throughout.' },
];

const PLANS = [
  { name: 'Half Day Care', duration: '4 hours', price: '₹349', desc: 'Perfect for busy mornings.' },
  { name: 'Full Day Care', duration: '8 hours', price: '₹649', desc: 'All-day supervised fun.' },
  { name: 'Weekly Play Plan', duration: '5 days', price: '₹2,799', desc: 'Best value for regulars.' },
];

export default function SchoolScreen() {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState('Rocky');
  const [selectedPlan, setSelectedPlan] = useState(null);

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
        {PLANS.map(plan => (
          <DaycarePlanCard
            key={plan.name}
            plan={plan}
            isSelected={selectedPlan === plan.name}
            onSelect={() => setSelectedPlan(plan.name)}
            onBook={() => {}}
          />
        ))}

        <Text style={styles.label}>Your Caretaker</Text>
        <CaretakerCard />

        <Text style={styles.label}>Safety Standards</Text>
        <SafetyCard />

        <Text style={styles.label}>Book a Slot</Text>
        <DaycareBookingSection selectedPlan={selectedPlan} onBook={() => {}} />

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
});
