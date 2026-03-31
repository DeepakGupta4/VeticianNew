import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { COLORS2 } from '../../constant/theme';
import { INITIAL_DATA } from '../../components/petparent/rewards/rewardsData';
import Header from '../../components/petparent/rewards/Header';
import RewardBalanceCard from '../../components/petparent/rewards/RewardBalanceCard';
import EarnPointsCard from '../../components/petparent/rewards/EarnPointsCard';
import RewardsList from '../../components/petparent/rewards/RewardsList';
import MyRewards from '../../components/petparent/rewards/MyRewards';
import ActivityHistory from '../../components/petparent/rewards/ActivityHistory';
import ReferralCard from '../../components/petparent/rewards/ReferralCard';
import Loader from '../../components/petparent/rewards/Loader';

export default function RewardsScreen() {
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(INITIAL_DATA.points);
  const [rewards, setRewards] = useState(INITIAL_DATA.availableRewards);
  const [myRewards, setMyRewards] = useState(INITIAL_DATA.myRewards);
  const [history, setHistory] = useState(INITIAL_DATA.activityHistory);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const handleRedeem = useCallback((reward) => {
    setPoints((prev) => prev - reward.pointsRequired);
    setRewards((prev) => prev.map((r) => (r.id === reward.id ? { ...r, redeemed: true } : r)));
    setMyRewards((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: reward.title,
        code: 'VET' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        expiry: '31 Dec 2025',
        status: 'Active',
      },
    ]);
    setHistory((prev) => [
      {
        id: Date.now(),
        label: `${reward.title} redeemed → -${reward.pointsRequired} pts`,
        points: -reward.pointsRequired,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
      ...prev,
    ]);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS2.primary} />
        <Loader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS2.primary} />
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <RewardBalanceCard points={points} />
        <EarnPointsCard />
        <RewardsList rewards={rewards} points={points} onRedeem={handleRedeem} />
        <MyRewards rewards={myRewards} />
        <ReferralCard />
        <ActivityHistory history={history} />
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS2.primary },
  content: { padding: 16, paddingTop: 20, backgroundColor: COLORS2.bg },
});
