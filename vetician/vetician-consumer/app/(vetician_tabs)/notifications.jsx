// screens/NotificationsScreen.js
import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Header from '../../components/petparent/notifications/Header';
import FilterTabs from '../../components/petparent/notifications/FilterTabs';
import { NotificationsList } from '../../components/petparent/notifications/NotificationsList';
import { useNotifications } from '../../components/petparent/notifications/useNotifications';
import { COLORS2 } from '../../constant/theme';

/**
 * NotificationsScreen
 *
 * Entry point for the Notifications page.
 * Used in Expo Router as:
 *   app/(dashboard)/notifications.js   (or wherever in your route tree)
 *
 * Props / params: none (userId resolved from auth context internally)
 */
const NotificationsScreen = () => {
  const {
    notifications,
    loading,
    filter,
    setFilter,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications('pet_parent_001'); // Replace with real userId from auth context

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS2.card} />

      {/* 1 ── Header */}
      <Header
        unreadCount={unreadCount}
        onMarkAllRead={markAllAsRead}
      />

      {/* 2 ── Filter Tabs */}
      <FilterTabs
        activeFilter={filter}
        onFilterChange={setFilter}
        unreadCount={unreadCount}
      />

      {/* 3 ── Notifications List */}
      <View style={styles.listContainer}>
        <NotificationsList
          notifications={notifications}
          loading={loading}
          filter={filter}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS2.bg,
  },
  listContainer: {
    flex: 1,
    backgroundColor: COLORS2.bg,
  },
});

export default NotificationsScreen;
