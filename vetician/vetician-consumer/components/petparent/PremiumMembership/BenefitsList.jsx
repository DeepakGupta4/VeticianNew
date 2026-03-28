import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BenefitItem from './BenefitItem';
import { COLORS2 } from './colors';

const benefits = [
  { icon: 'stethoscope',     title: 'Priority Vet Consultation',    description: 'Skip the queue and get first access to verified veterinarians anytime.' },
  { icon: 'content-cut',     title: 'Discount on Grooming',         description: 'Enjoy up to 20% off on every grooming session booked through the app.' },
  { icon: 'heart-pulse',     title: 'Free Monthly Health Check',    description: 'Get a routine health check for your pet at no extra cost every month.' },
  { icon: 'star-circle',     title: 'Early Access to Services',     description: 'Be the first to access new services and exclusive launches before anyone else.' },
  { icon: 'dog',             title: 'Exclusive Pet Training',       description: 'Book premium training slots with expert trainers at member-only rates.' },
  { icon: 'home-city',       title: 'Hostel Discounts',             description: 'Save 15% on every pet hostel stay when you book as a premium member.' },
];

export default function BenefitsList() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Membership Benefits</Text>
      <Text style={styles.sectionSubtitle}>Everything included in your plan</Text>
      {benefits.map((b, i) => (
        <BenefitItem key={i} icon={b.icon} title={b.title} description={b.description} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS2.subtext,
    marginBottom: 16,
  },
});
