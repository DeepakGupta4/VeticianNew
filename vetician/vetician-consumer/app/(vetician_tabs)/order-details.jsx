import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS2, STATUS_COLORS } from '../../components/petparent/orders/colors';
import { ORDERS_DATA, SERVICE_ICONS } from '../../components/petparent/orders/ordersData';
import OrderDetails from '../../components/petparent/orders/OrderDetails';
import ActionButtons from '../../components/petparent/orders/ActionButtons';

const G = {
  dark:   '#2E5E10',
  mid:    '#3D7A18',
  base:   '#558B2F',
  pale:   '#C5E1A5',
  tint:   'rgba(255,255,255,0.12)',
  border: 'rgba(255,255,255,0.22)',
};

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const order       = ORDERS_DATA.find((o) => o.id === orderId);
  const statusStyle = order ? (STATUS_COLORS[order.status] || STATUS_COLORS.Completed) : null;
  const svcIcon     = order ? (SERVICE_ICONS[order.serviceType] || { name: 'paw', color: '#fff' }) : null;

  const handleRebook = useCallback((o) => {
    Alert.alert('Rebook Service', `Rebook ${o.service} for ${o.pet.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => Alert.alert('Booked!', 'Your service has been rebooked.') },
    ]);
  }, []);

  const handleSupport = useCallback(() => {
    router.push('/(vetician_tabs)/help');
  }, []);

  const handleInvoice = useCallback((o) => {
    Alert.alert('Download Invoice', `Invoice for ${o.id} will be downloaded shortly.`, [{ text: 'OK' }]);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={G.dark} />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Single Green Hero (header + banner merged) ── */}
        <View style={styles.hero}>
          {/* Decorative circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          {/* Nav row — back left, share right */}
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.75}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Order Details</Text>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.75}>
              <MaterialCommunityIcons name="share-variant-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Service icon */}
          {order && (
            <>
              <View style={styles.heroIconRing}>
                <View style={styles.heroIconInner}>
                  <MaterialCommunityIcons name={svcIcon.name} size={34} color="#fff" />
                </View>
              </View>

              <Text style={styles.heroService}>{order.service}</Text>
              <Text style={styles.heroId}>{order.id}</Text>

              {/* Status pill */}
              <View style={[styles.heroPill, { backgroundColor: statusStyle.bg }]}>
                <View style={[styles.heroPillDot, { backgroundColor: statusStyle.text }]} />
                <Text style={[styles.heroPillText, { color: statusStyle.text }]}>{order.status}</Text>
              </View>

              {/* Stats strip */}
              <View style={styles.statsStrip}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="currency-inr" size={14} color={G.pale} />
                  <Text style={styles.statVal}>{order.currency}{order.price.toLocaleString('en-IN')}</Text>
                  <Text style={styles.statLbl}>Amount</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="calendar-month-outline" size={14} color={G.pale} />
                  <Text style={styles.statVal}>{order.time}</Text>
                  <Text style={styles.statLbl}>{order.date}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="map-marker-outline" size={14} color={G.pale} />
                  <Text style={styles.statVal}>{order.location}</Text>
                  <Text style={styles.statLbl}>{order.serviceType}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* ── Detail Sections ── */}
        <View style={styles.body}>
          <OrderDetails order={order} />
          {order && (
            <ActionButtons
              order={order}
              onRebook={handleRebook}
              onSupport={handleSupport}
              onInvoice={handleInvoice}
            />
          )}
          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: G.dark,
  },
  scroll: { flex: 1 },
  content: { flexGrow: 1, backgroundColor: '#F0F4EE' },

  /* ── Hero ── */
  hero: {
    backgroundColor: G.base,
    paddingBottom: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: G.tint,
    top: -60,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: G.tint,
    bottom: -40,
    left: -30,
  },

  /* Nav row inside hero */
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 14,
    paddingBottom: 24,
    gap: 12,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: G.tint,
    borderWidth: 1,
    borderColor: G.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
    textAlign: 'center',
  },

  /* Icon */
  heroIconRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroIconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: G.mid,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroService: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.4,
    marginBottom: 4,
    textAlign: 'center',
  },
  heroId: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.8,
    marginBottom: 14,
    fontWeight: '500',
  },

  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  heroPillDot: { width: 7, height: 7, borderRadius: 3.5 },
  heroPillText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },

  statsStrip: {
    flexDirection: 'row',
    backgroundColor: G.dark,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 4,
  },
  statVal: { fontSize: 13, fontWeight: '700', color: '#fff', textAlign: 'center' },
  statLbl: { fontSize: 10, color: G.pale, fontWeight: '500', textAlign: 'center', letterSpacing: 0.3 },

  /* ── Body ── */
  body: {
    backgroundColor: '#F0F4EE',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 8,
  },
});
