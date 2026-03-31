import React, { useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, PanResponder, Dimensions, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';
import { NOTIFICATION_TYPES } from './mockNotifications';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = -SCREEN_W * 0.35;

const TYPE_CONFIG = {
  [NOTIFICATION_TYPES.GROOMING]:    { icon: 'content-cut',           label: 'Grooming' },
  [NOTIFICATION_TYPES.VET]:         { icon: 'stethoscope',            label: 'Vet' },
  [NOTIFICATION_TYPES.HOSTEL]:      { icon: 'home-heart',             label: 'Hostel' },
  [NOTIFICATION_TYPES.TRAINING]:    { icon: 'school-outline',         label: 'Training' },
  [NOTIFICATION_TYPES.DAYCARE]:     { icon: 'account-child-outline',  label: 'Daycare' },
  [NOTIFICATION_TYPES.VACCINATION]: { icon: 'needle',                 label: 'Vaccination' },
  [NOTIFICATION_TYPES.PAYMENT]:     { icon: 'receipt',                label: 'Payment' },
  [NOTIFICATION_TYPES.ORDER]:       { icon: 'package-variant-closed', label: 'Order' },
  [NOTIFICATION_TYPES.WATCHING]:    { icon: 'eye-check-outline',      label: 'Pet Watch' },
};

const formatTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const NotificationCard = ({ notification, onPress, onDelete, onViewDetails }) => {
  const config     = TYPE_CONFIG[notification.type] || TYPE_CONFIG[NOTIFICATION_TYPES.ORDER];
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity    = useRef(new Animated.Value(1)).current;
  const cardScale  = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dy) < 20,
      onPanResponderMove: (_, g) => { if (g.dx < 0) translateX.setValue(g.dx); },
      onPanResponderRelease: (_, g) => {
        if (g.dx < SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.timing(translateX, { toValue: -SCREEN_W, duration: 250, useNativeDriver: true }),
            Animated.timing(opacity,    { toValue: 0,          duration: 250, useNativeDriver: true }),
          ]).start(() => onDelete(notification.id));
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const onPressIn  = () => Animated.spring(cardScale, { toValue: 0.98, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(cardScale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.wrapper, { opacity }]} {...panResponder.panHandlers}>

      {/* Swipe-to-delete reveal */}
      <View style={styles.deleteLayer}>
        <MaterialCommunityIcons name="trash-can-outline" size={22} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </View>

      {/* Card */}
      <Animated.View style={[
        styles.card,
        !notification.isRead && styles.cardUnread,
        { transform: [{ translateX }, { scale: cardScale }] },
      ]}>
        {/* Left accent bar */}
        <View style={[styles.accentBar, !notification.isRead && styles.accentBarUnread]} />

        <TouchableOpacity
          style={styles.inner}
          activeOpacity={0.92}
          onPress={() => onPress(notification)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          {/* Icon */}
          <View style={[styles.iconWrap, !notification.isRead && styles.iconWrapUnread]}>
            <MaterialCommunityIcons name={config.icon} size={22} color={COLORS2.primary} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Top row: type pill + time */}
            <View style={styles.topRow}>
              <View style={styles.typePill}>
                <MaterialCommunityIcons name={config.icon} size={10} color={COLORS2.primary} />
                <Text style={styles.typeLabel}>{config.label}</Text>
              </View>
              <View style={styles.timeRow}>
                <MaterialCommunityIcons name="clock-outline" size={11} color={COLORS2.subtext} />
                <Text style={styles.time}>{formatTime(notification.timestamp)}</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={[styles.title, !notification.isRead && styles.titleUnread]} numberOfLines={2}>
              {notification.title}
            </Text>

            {/* Description */}
            <Text style={styles.description} numberOfLines={2}>
              {notification.description}
            </Text>

            {/* Pet tag + View Details */}
            <View style={styles.bottomRow}>
              {notification.petName && (
                <View style={styles.petTag}>
                  <MaterialCommunityIcons name="paw" size={11} color={COLORS2.primary} />
                  <Text style={styles.petName}>{notification.petName}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => onViewDetails(notification)}
                activeOpacity={0.75}
              >
                <Text style={styles.detailsBtnText}>View Details</Text>
                <MaterialCommunityIcons name="chevron-right" size={13} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Unread dot */}
          {!notification.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 14, marginVertical: 5,
    borderRadius: 18, overflow: 'hidden',
  },
  deleteLayer: {
    position: 'absolute', right: 0, top: 0, bottom: 0, width: '38%',
    backgroundColor: '#C62828', borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    flexDirection: 'row', gap: 6,
  },
  deleteText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 18, borderWidth: 1, borderColor: COLORS2.border,
    flexDirection: 'row', overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  cardUnread: {
    backgroundColor: COLORS2.accent,
    borderColor: COLORS2.primary,
    borderWidth: 1.5,
  },
  accentBar: {
    width: 4, backgroundColor: COLORS2.border,
  },
  accentBarUnread: { backgroundColor: COLORS2.primary },

  inner: {
    flex: 1, flexDirection: 'row', alignItems: 'flex-start',
    padding: 14, gap: 12,
  },

  iconWrap: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: COLORS2.accent,
    borderWidth: 1.5, borderColor: COLORS2.border,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  iconWrapUnread: {
    backgroundColor: '#fff',
    borderColor: COLORS2.primary,
  },

  content: { flex: 1, gap: 5 },

  topRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  typePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS2.accent,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: COLORS2.border,
  },
  typeLabel: {
    fontSize: 10, fontWeight: '800', color: COLORS2.primary,
    textTransform: 'uppercase', letterSpacing: 0.4,
  },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  time: { fontSize: 11, color: COLORS2.subtext },

  title: {
    fontSize: 14, fontWeight: '600', color: COLORS2.text, lineHeight: 20,
  },
  titleUnread: { fontWeight: '800', color: COLORS2.text },

  description: {
    fontSize: 12.5, color: COLORS2.subtext, lineHeight: 18,
  },

  bottomRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 2,
  },
  petTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS2.accent, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: COLORS2.border,
  },
  petName: { fontSize: 11, color: COLORS2.primary, fontWeight: '700' },

  detailsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8, backgroundColor: COLORS2.primary,
    borderWidth: 1, borderColor: COLORS2.primary,
  },
  detailsBtnText: { fontSize: 11.5, color: '#fff', fontWeight: '700' },

  unreadDot: {
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: COLORS2.primary, marginTop: 4, flexShrink: 0,
  },
});

export default NotificationCard;
