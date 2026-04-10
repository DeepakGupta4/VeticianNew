import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS } from '../../../constant/theme2';

// ── GroomerCard ───────────────────────────────────────────────────
export const GroomerCard = ({ groomer, selected, onBook }) => {
  return (
    <TouchableOpacity
      style={[gStyles.card, selected && gStyles.cardSelected]}
      onPress={() => onBook?.(groomer)}
      activeOpacity={0.85}
    >
      <View style={gStyles.avatar}>
        <Icon name={groomer.icon} size={26} color={selected ? COLORS.white : COLORS.primary} />
      </View>
      <View style={gStyles.info}>
        <Text style={[gStyles.name, selected && { color: COLORS.white }]}>{groomer.name}</Text>
        <View style={gStyles.metaRow}>
          <Icon name="star" size={13} color={selected ? COLORS.white : COLORS.secondary} />
          <Text style={[gStyles.meta, selected && { color: 'rgba(255,255,255,0.9)' }]}>{groomer.rating} · {groomer.exp} · {groomer.distance}</Text>
        </View>
      </View>
      {selected && (
        <Icon name="check-circle" size={24} color={COLORS.white} />
      )}
    </TouchableOpacity>
  );
};

const gStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  info: { flex: 1 },
  name: { fontSize: FONT.groomerName, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  meta: { fontSize: FONT.groomerMeta, color: COLORS.textMuted, marginLeft: 5 },
  btn: { backgroundColor: COLORS.secondary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  btnBooked: { backgroundColor: COLORS.primary },
  btnText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
});

// ── GroomingAddonCard ─────────────────────────────────────────────
export const GroomingAddonCard = ({ addon }) => {
  const [on, setOn] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !on;
    setOn(next);
    Animated.spring(anim, { toValue: next ? 1 : 0, friction: 6, useNativeDriver: true }).start();
  };

  const thumbX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });

  return (
    <View style={aStyles.card}>
      <View style={aStyles.left}>
        <View style={aStyles.iconBox}>
          <Icon name={addon.icon} size={20} color={COLORS.primary} />
        </View>
        <View>
          <Text style={aStyles.name}>{addon.name}</Text>
          <Text style={aStyles.price}>{addon.price}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={toggle}
        style={[aStyles.track, { backgroundColor: on ? COLORS.secondary : '#d0d0d0' }]}
        activeOpacity={0.9}
      >
        <Animated.View style={[aStyles.thumb, { transform: [{ translateX: thumbX }] }]} />
      </TouchableOpacity>
    </View>
  );
};

const aStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.icon,
    backgroundColor: COLORS.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  name:  { fontSize: FONT.body, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  price: { fontSize: 11.5, color: COLORS.secondary, fontWeight: '700' },
  track: { width: 46, height: 26, borderRadius: 13, padding: 2 },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

// ── GroomingTipCard ───────────────────────────────────────────────
export const GroomingTipCard = ({ tip }) => (
  <View style={tStyles.card}>
    <View style={tStyles.iconBox}>
      <Icon name={tip.icon} size={19} color={COLORS.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={tStyles.title}>{tip.title}</Text>
      <Text style={tStyles.body}>{tip.body}</Text>
    </View>
  </View>
);

const tStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.tint,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: 12,
  },
  title: { fontSize: FONT.body, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 3 },
  body:  { fontSize: FONT.howDesc, color: COLORS.textMuted, lineHeight: 17 },
});
