// components/EmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

const EmptyState = ({ filter }) => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <MaterialCommunityIcons
        name="bell-off-outline"
        size={52}
        color={COLORS2.secondary}
      />
    </View>
    <Text style={styles.title}>
      {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
    </Text>
    <Text style={styles.subtitle}>
      {filter === 'unread'
        ? "You've read all your notifications 🎉"
        : "We'll notify you when something needs your attention"}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: COLORS2.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS2.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export { EmptyState };


// ─────────────────────────────────────────────────────────────
// components/Loader.js  – Skeleton loader
// ─────────────────────────────────────────────────────────────
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const SkeletonBox = ({ style }) => {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 700 }),
      -1,
      true
    );
  }, []);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[{ backgroundColor: COLORS2.border, borderRadius: 6 }, style, animStyle]}
    />
  );
};

const SkeletonCard = () => (
  <View style={skStyles.card}>
    <SkeletonBox style={skStyles.icon} />
    <View style={skStyles.lines}>
      <SkeletonBox style={skStyles.lineShort} />
      <SkeletonBox style={skStyles.lineLong} />
      <SkeletonBox style={skStyles.lineMed} />
      <SkeletonBox style={skStyles.lineBtn} />
    </View>
  </View>
);

const Loader = () => (
  <View style={{ paddingTop: 10 }}>
    {[1, 2, 3, 4].map((i) => (
      <SkeletonCard key={i} />
    ))}
  </View>
);

const skStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: COLORS2.card,
    margin: 14,
    marginVertical: 6,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  icon: { width: 46, height: 46, borderRadius: 13 },
  lines: { flex: 1, gap: 8 },
  lineShort: { height: 10, width: '35%' },
  lineLong:  { height: 13, width: '90%' },
  lineMed:   { height: 11, width: '70%' },
  lineBtn:   { height: 28, width: '38%', borderRadius: 8, marginTop: 2 },
});

export { Loader };


// ─────────────────────────────────────────────────────────────
// components/NotificationsList.js
// ─────────────────────────────────────────────────────────────
import { FlatList } from 'react-native';
import NotificationCard from './NotificationCard';
import NotificationDetailModal from './NotificationDetailModal';
import { useState } from 'react';

const NotificationsList = ({
  notifications,
  loading,
  filter,
  onMarkAsRead,
  onDelete,
}) => {
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = (notification) => {
    onMarkAsRead(notification.id);
    setSelectedNotif(notification);
    setModalVisible(true);
  };

  const handleViewDetails = (notification) => {
    onMarkAsRead(notification.id);
    setSelectedNotif(notification);
    setModalVisible(true);
  };

  const handleNavigate = (route) => {
    // TODO: router.push(route)
    console.log('Navigate to:', route);
  };

  if (loading) return <Loader />;

  if (!notifications || notifications.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onPress={handleCardPress}
            onDelete={onDelete}
            onViewDetails={handleViewDetails}
          />
        )}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />

      <NotificationDetailModal
        visible={modalVisible}
        notification={selectedNotif}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export { NotificationsList };
