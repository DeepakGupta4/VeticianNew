import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import PlanCard from './PlanCard';
import { COLORS2 } from './colors';

const plans = [
  {
    plan: 'Basic',
    price: '499',
    yearlyPrice: '4,999',
    period: 'month',
    recommended: false,
    features: [
      '1 Vet Consultation / month',
      '5% discount on grooming',
      'Email support',
      'Access to basic health tips',
    ],
  },
  {
    plan: 'Standard',
    price: '999',
    yearlyPrice: '9,999',
    period: 'month',
    recommended: true,
    features: [
      '3 Vet Consultations / month',
      '15% discount on grooming & training',
      '1 free health check / month',
      'Priority support (chat + call)',
      'Early service access',
    ],
  },
  {
    plan: 'Premium',
    price: '1,999',
    yearlyPrice: '19,999',
    period: 'month',
    recommended: false,
    features: [
      'Unlimited Vet Consultations',
      '25% discount on all services',
      '2 free health checks / month',
      '24/7 dedicated support',
      'Exclusive training sessions',
      '20% hostel discount',
    ],
  },
];

export default function PlansSection({ onSubscribed }) {
  const [selected, setSelected] = useState(1);
  const [isYearly, setIsYearly] = useState(false);

  const selectedPlan = plans[selected];
  const displayPrice = isYearly ? selectedPlan.yearlyPrice : selectedPlan.price;
  const displayPeriod = isYearly ? 'year' : 'month';

  const handleSubscribe = () => {
    Alert.alert(
      `Subscribe to ${selectedPlan.plan}`,
      `You are about to subscribe to the ${selectedPlan.plan} plan.\n\nAmount: ₹${displayPrice}/${displayPeriod}\nBilling: ${isYearly ? 'Yearly' : 'Monthly'}\n\nProceed to payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: () => {
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + (isYearly ? 12 : 1));
            const expiry = expiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            Alert.alert('🎉 Subscribed!', `Welcome to ${selectedPlan.plan} membership! Your plan is now active.`);
            if (onSubscribed) onSubscribed({ planName: selectedPlan.plan, expiry, billing: isYearly ? 'Yearly' : 'Monthly', price: displayPrice, period: displayPeriod });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <MaterialCommunityIcons name="crown" size={20} color={COLORS2.primary} />
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        </View>
        <Text style={styles.sectionSub}>Unlock premium care for your pet</Text>
      </View>

      {/* Billing toggle */}
      <View style={styles.toggleWrapper}>
        <TouchableOpacity
          style={[styles.toggleBtn, !isYearly && styles.toggleBtnActive]}
          onPress={() => setIsYearly(false)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="calendar-month" size={14} color={!isYearly ? '#fff' : COLORS2.subtext} />
          <Text style={[styles.toggleText, !isYearly && styles.toggleTextActive]}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, isYearly && styles.toggleBtnActive]}
          onPress={() => setIsYearly(true)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="calendar-check" size={14} color={isYearly ? '#fff' : COLORS2.subtext} />
          <Text style={[styles.toggleText, isYearly && styles.toggleTextActive]}>Yearly</Text>
          <View style={[styles.savePill, isYearly && styles.savePillActive]}>
            <MaterialCommunityIcons name="tag" size={10} color={isYearly ? '#fff' : '#5D4037'} />
            <Text style={[styles.savePillText, isYearly && styles.savePillTextActive]}>SAVE 17%</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Plan cards */}
      {plans.map((p, i) => (
        <PlanCard
          key={i}
          {...p}
          selected={selected === i}
          onSelect={() => setSelected(i)}
          isYearly={isYearly}
        />
      ))}

      {/* Subscribe CTA */}
      <TouchableOpacity onPress={handleSubscribe} activeOpacity={0.88}>
        <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.subscribeBtn}>
          <MaterialCommunityIcons name="crown" size={20} color="#fff" />
          <Text style={styles.subscribeBtnLabel}>
            Subscribe to {selectedPlan.plan} — ₹{displayPrice}/{displayPeriod}
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>Cancel anytime · No hidden charges · Secure payment</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 28,
  },
  sectionHeader: {
    marginBottom: 18,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS2.text,
  },
  sectionSub: {
    fontSize: 13,
    color: COLORS2.subtext,
    marginLeft: 28,
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: COLORS2.accent,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  toggleBtnActive: {
    backgroundColor: COLORS2.primary,
    elevation: 2,
    shadowColor: COLORS2.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS2.subtext,
  },
  toggleTextActive: {
    color: '#fff',
  },
  savePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F9A825',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    elevation: 2,
    shadowColor: '#F9A825',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  savePillActive: {
    backgroundColor: '#fff',
  },
  savePillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  savePillTextActive: {
    color: COLORS2.primary,
  },
  subscribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    marginTop: 4,
    elevation: 5,
    shadowColor: COLORS2.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  subscribeBtnLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS2.subtext,
    marginTop: 12,
    marginBottom: 8,
  },
});
