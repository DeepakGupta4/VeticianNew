import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  ScrollView, Animated, Pressable, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS2 } from '../../../constant/theme';
import { NOTIFICATION_TYPES } from './mockNotifications';

// ── Type config with route mapping ──────────────────────────────
const TYPE_CONFIG = {
  [NOTIFICATION_TYPES.GROOMING]:    { icon: 'content-cut',           color: '#4CAF50', bg: '#E8F5E9', label: 'Grooming',       route: '/(vetician_tabs)/pages/Grooming' },
  [NOTIFICATION_TYPES.VET]:         { icon: 'stethoscope',            color: '#2196F3', bg: '#E3F2FD', label: 'Vet Consultation',route: '/(vetician_tabs)/pages/VideoConsultation' },
  [NOTIFICATION_TYPES.HOSTEL]:      { icon: 'home-heart',             color: '#9C27B0', bg: '#F3E5F5', label: 'Pet Hostel',      route: '/(vetician_tabs)/pages/Hostel' },
  [NOTIFICATION_TYPES.TRAINING]:    { icon: 'school',                 color: '#FF9800', bg: '#FFF3E0', label: 'Training',        route: '/(vetician_tabs)/pages/PetTraning' },
  [NOTIFICATION_TYPES.DAYCARE]:     { icon: 'baby-carriage',          color: '#E91E63', bg: '#FCE4EC', label: 'Daycare',         route: '/(vetician_tabs)/pages/School' },
  [NOTIFICATION_TYPES.VACCINATION]: { icon: 'needle',                 color: '#F44336', bg: '#FFEBEE', label: 'Vaccination',     route: '/(vetician_tabs)/pages/Vaccination' },
  [NOTIFICATION_TYPES.PAYMENT]:     { icon: 'receipt',                color: '#607D8B', bg: '#ECEFF1', label: 'Payment',         route: '/(vetician_tabs)/orders' },
  [NOTIFICATION_TYPES.ORDER]:       { icon: 'package-variant-closed', color: '#795548', bg: '#EFEBE9', label: 'Order',           route: '/(vetician_tabs)/orders' },
  [NOTIFICATION_TYPES.WATCHING]:    { icon: 'eye-check',              color: '#009688', bg: '#E0F2F1', label: 'Pet Watch',       route: '/(vetician_tabs)/pages/PetWatching' },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const NotificationDetailModal = ({ visible, notification, onClose }) => {
  const router    = useRouter();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 160 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 300, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!notification) return null;

  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG[NOTIFICATION_TYPES.ORDER];

  const handleNavigate = () => {
    onClose();
    setTimeout(() => router.push(config.route), 300);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <View style={styles.bigIcon}>
            <MaterialCommunityIcons name={config.icon} size={32} color={COLORS2.primary} />
          </View>
          <View style={styles.sheetTitleWrap}>
            <View style={styles.labelPill}>
              <MaterialCommunityIcons name={config.icon} size={10} color={COLORS2.primary} />
              <Text style={styles.serviceLabel}>{config.label}</Text>
            </View>
            <Text style={styles.sheetTitle} numberOfLines={2}>{notification.title}</Text>
            <View style={styles.timeRow}>
              <MaterialCommunityIcons name="clock-outline" size={11} color={COLORS2.subtext} />
              <Text style={styles.sheetTime}>{formatDate(notification.timestamp)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.75}>
            <MaterialCommunityIcons name="close" size={18} color={COLORS2.subtext} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          {/* Description */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="information-outline" size={14} color={COLORS2.primary} />
              <Text style={styles.sectionTitle}>Details</Text>
            </View>
            <Text style={styles.descText}>{notification.description}</Text>
          </View>

          {/* Extra details */}
          {notification.extraDetails && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <MaterialCommunityIcons name="clipboard-list-outline" size={14} color={COLORS2.primary} />
                <Text style={styles.sectionTitle}>Appointment Info</Text>
              </View>
              <View style={styles.detailsGrid}>
                {Object.entries(notification.extraDetails).map(([key, value]) => (
                  <View key={key} style={styles.detailRow}>
                    <Text style={styles.detailKey}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    </Text>
                    {Array.isArray(value) ? (
                      <View style={styles.tagsWrap}>
                        {value.map((v, i) => (
                          <View key={i} style={styles.tag}>
                            <Text style={styles.tagText}>{v}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.detailValue}>{value}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Pet tag */}
          {notification.petName && (
            <View style={styles.petRow}>
              <MaterialCommunityIcons name="paw" size={14} color={COLORS2.primary} />
              <Text style={styles.petName}>{notification.petName}</Text>
            </View>
          )}
        </ScrollView>

        {/* CTA Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.dismissBtn} onPress={onClose} activeOpacity={0.75}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={handleNavigate}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name={config.icon} size={16} color="#fff" />
            <Text style={styles.ctaBtnText}>Go to {config.label}</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS2.card,
    borderTopLeftRadius: 26, borderTopRightRadius: 26,
    maxHeight: '90%', overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 16 },
      android: { elevation: 12 },
    }),
  },
  handle: {
    width: 40, height: 4, backgroundColor: COLORS2.border,
    borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 2,
  },

  /* Header */
  sheetHeader: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: 16, gap: 12,
    backgroundColor: COLORS2.accent,
    borderBottomWidth: 1, borderBottomColor: COLORS2.border,
  },
  bigIcon: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: COLORS2.border,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  sheetTitleWrap: { flex: 1, gap: 4 },
  labelPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', borderRadius: 8,
    backgroundColor: COLORS2.primary,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  serviceLabel: { fontSize: 10, fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 },
  sheetTitle: { fontSize: 15, fontWeight: '800', color: COLORS2.text, lineHeight: 21 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sheetTime: { fontSize: 11.5, color: COLORS2.subtext },
  closeBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: COLORS2.accent, borderWidth: 1, borderColor: COLORS2.border,
    justifyContent: 'center', alignItems: 'center',
  },

  /* Body */
  body: { paddingHorizontal: 16 },
  section: {
    marginTop: 14, backgroundColor: COLORS2.bg,
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORS2.border,
  },
  sectionTitleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12, fontWeight: '800', color: COLORS2.primary,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  descText: { fontSize: 14, color: COLORS2.text, lineHeight: 21 },
  detailsGrid: { gap: 10 },
  detailRow: { gap: 3 },
  detailKey: { fontSize: 11, color: COLORS2.subtext, fontWeight: '600', textTransform: 'capitalize' },
  detailValue: { fontSize: 13, color: COLORS2.text, fontWeight: '600' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tag: {
    backgroundColor: COLORS2.accent, borderRadius: 8,
    paddingHorizontal: 9, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS2.border,
  },
  tagText: { fontSize: 11, color: COLORS2.primary, fontWeight: '600' },
  petRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 12, backgroundColor: COLORS2.accent,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS2.border, alignSelf: 'flex-start',
  },
  petName: { fontSize: 13, color: COLORS2.primary, fontWeight: '700' },

  /* Footer */
  footer: {
    flexDirection: 'row', gap: 10,
    padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1, borderTopColor: COLORS2.border,
    backgroundColor: COLORS2.card,
  },
  dismissBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS2.accent,
    borderWidth: 1.5, borderColor: COLORS2.border,
    borderRadius: 14, paddingVertical: 14,
  },
  dismissText: { fontSize: 14, fontWeight: '700', color: COLORS2.subtext },
  ctaBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 7,
    backgroundColor: COLORS2.primary,
    borderRadius: 14, paddingVertical: 14,
  },
  ctaBtnText: { fontSize: 14, color: '#fff', fontWeight: '800' },
});

export default NotificationDetailModal;
