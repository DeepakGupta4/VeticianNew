import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../../components/petparent/PremiumMembership/Header';
import HeroSection from '../../../components/petparent/PremiumMembership/HeroSection';
import BenefitsList from '../../../components/petparent/PremiumMembership/BenefitsList';
import PlansSection from '../../../components/petparent/PremiumMembership/PlansSection';
import ServicesIncluded from '../../../components/petparent/PremiumMembership/ServicesIncluded';
import TrustCard from '../../../components/petparent/PremiumMembership/TrustCard';
import MembershipStatus from '../../../components/petparent/PremiumMembership/MembershipStatus';
import { COLORS2 } from '../../../components/petparent/PremiumMembership/colors';

export default function MembershipScreen() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [expiry, setExpiry] = useState('');
  const [previousPlans, setPreviousPlans] = useState([]);

  const handleSubscribed = ({ planName, expiry: newExpiry, billing }) => {
    if (isSubscribed && activePlan) {
      setPreviousPlans(prev => [
        { planName: activePlan, expiry, billing },
        ...prev,
      ]);
    }
    setActivePlan(planName);
    setExpiry(newExpiry);
    setIsSubscribed(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HeroSection />
        <MembershipStatus
          isSubscribed={isSubscribed}
          planName={activePlan}
          expiry={expiry}
          previousPlans={previousPlans}
        />
        <BenefitsList />
        <PlansSection onSubscribed={handleSubscribed} />
        <ServicesIncluded />
        <TrustCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS2.bg },
  scroll: { flex: 1, backgroundColor: COLORS2.bg },
  content: { paddingBottom: 60 },
});
