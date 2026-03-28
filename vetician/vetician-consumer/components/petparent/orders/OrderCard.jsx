import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2, STATUS_COLORS } from './colors';
import { SERVICE_ICONS } from './ordersData';

const STATUS_DOT = {
  Active:    '#4CAF50',
  Completed: '#9E9E9E',
  Cancelled: '#EF5350',
};

const OrderCard = ({ order, onPress, onRebook, index }) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 380, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 380, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.Completed;
  const svcIcon     = SERVICE_ICONS[order.serviceType] || { name: 'paw', color: COLORS2.primary };

  const accentColor =
    order.status === 'Active'    ? COLORS2.primary :
    order.status === 'Completed' ? '#9E9E9E'       : '#EF9A9A';

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity style={styles.card} onPress={() => onPress(order)} activeOpacity={0.9}>

        {/* Left accent stripe */}
        <View style={[styles.stripe, { backgroundColor: accentColor }]} />

        <View style={styles.inner}>
          {/* ── Top row ── */}
          <View style={styles.topRow}>
            {/* Icon box */}
            <View style={[styles.iconBox, { backgroundColor: svcIcon.color + '18' }]}>
              <MaterialCommunityIcons name={svcIcon.name} size={22} color={svcIcon.color} />
            </View>

            {/* Service + pet info */}
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName} numberOfLines={1}>{order.service}</Text>
              <View style={styles.petRow}>
                <MaterialCommunityIcons name="paw" size={12} color={COLORS2.subtext} />
                <Text style={styles.petName}>{order.pet.name} · {order.pet.breed}</Text>
              </View>
              <Text style={styles.orderId}>{order.id}</Text>
            </View>

            {/* Status badge */}
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: STATUS_DOT[order.status] }]} />
              <Text style={[styles.statusText, { color: statusStyle.text }]}>{order.status}</Text>
            </View>
          </View>

          {/* ── Divider ── */}
          <View style={styles.divider} />

          {/* ── Meta row ── */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar-month-outline" size={13} color={COLORS2.subtext} />
              <Text style={styles.metaText}>{order.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="clock-outline" size={13} color={COLORS2.subtext} />
              <Text style={styles.metaText}>{order.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker-outline" size={13} color={COLORS2.subtext} />
              <Text style={styles.metaText}>{order.location}</Text>
            </View>
          </View>

          {/* ── Price + actions ── */}
          <View style={styles.bottomRow}>
            <View style={styles.priceWrap}>
              <Text style={styles.priceLabel}>Total</Text>
              <Text style={styles.price}>{order.currency}{order.price.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => onPress(order)} activeOpacity={0.75}>
                <MaterialCommunityIcons name="eye-outline" size={14} color={COLORS2.primary} />
                <Text style={styles.btnOutlineText}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: accentColor === '#EF9A9A' ? '#EF5350' : COLORS2.primary }]} onPress={() => onRebook(order)} activeOpacity={0.8}>
                <MaterialCommunityIcons
                  name={order.status === 'Active' ? 'map-marker-path' : 'refresh'}
                  size={14}
                  color="#fff"
                />
                <Text style={styles.btnPrimaryText}>{order.status === 'Active' ? 'Track' : 'Rebook'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 18,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS2.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#2D3A1F',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.10,
        shadowRadius: 14,
      },
      android: { elevation: 5 },
    }),
  },
  stripe: {
    width: 5,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  inner: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  serviceInfo: {
    flex: 1,
    gap: 3,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS2.text,
    letterSpacing: -0.2,
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  petName: {
    fontSize: 12,
    color: COLORS2.subtext,
  },
  orderId: {
    fontSize: 10,
    color: '#B0BEC5',
    letterSpacing: 0.4,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS2.border,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS2.subtext,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceWrap: {
    gap: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS2.subtext,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS2.primary,
    letterSpacing: -0.3,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS2.accent,
    borderWidth: 1,
    borderColor: COLORS2.shadow,
  },
  btnOutlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS2.primary,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  btnPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default OrderCard;
