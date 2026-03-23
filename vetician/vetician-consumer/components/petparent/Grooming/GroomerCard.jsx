import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Switch } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS } from '../../../constant/theme2';

// ── GroomerCard ───────────────────────────────────────────────────
export const GroomerCard = ({ groomer, onBook }) => {
  const [booked, setBooked] = useState(false);
  return (
    <View style={gStyles.card}>
      <View style={gStyles.avatar}>
        <Icon name={groomer.icon} size={26} color={COLORS.primary} />
      </View>
      <View style={gStyles.info}>
        <Text style={gStyles.name}>{groomer.name}</Text>
        <View style={gStyles.metaRow}>
          <Icon name="star" size={13} color={COLORS.secondary} />
          <Text style={gStyles.meta}>{groomer.rating} · {groomer.exp} · {groomer.distance}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[gStyles.btn, booked && gStyles.btnBooked]}
        onPress={() => { setBooked(v => !v); onBook?.(groomer); }}
        activeOpacity={0.85}
      >
        <Text style={gStyles.btnText}>{booked ? 'Booked' : 'Book'}</Text>
      </TouchableOpacity>
    </View>
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
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
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

// ── BookingSection ────────────────────────────────────────────────
const DATES = [
  { label: 'Today', num: '12' }, { label: 'Thu', num: '13' },
  { label: 'Fri',   num: '14' }, { label: 'Sat', num: '15' },
  { label: 'Sun',   num: '16' },
];
const TIMES = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

export const BookingSection = ({ selectedPet }) => {
  const [dateIdx,   setDateIdx]   = useState(0);
  const [time,      setTime]      = useState('11:00 AM');
  const [homeOn,    setHomeOn]    = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) return (
    <View style={bStyles.confirmed}>
      <View style={bStyles.confIcon}>
        <Icon name="check-decagram" size={36} color={COLORS.white} />
      </View>
      <Text style={bStyles.confTitle}>Booking Confirmed!</Text>
      <Text style={bStyles.confDetail}>
        {DATES[dateIdx].label}, {DATES[dateIdx].num} Mar  ·  {time}{'\n'}
        {homeOn ? 'Home Service' : 'Salon Visit'}{'\n'}
        {selectedPet ? `${selectedPet.name} · ${selectedPet.breed}` : ''}
      </Text>
      <TouchableOpacity style={bStyles.confBtn} onPress={() => setConfirmed(false)}>
        <Icon name="calendar-plus" size={15} color={COLORS.primary} style={{ marginRight: 6 }} />
        <Text style={bStyles.confBtnText}>Book Another</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={bStyles.card}>
      <View style={bStyles.titleRow}>
        <Icon name="calendar-check-outline" size={19} color={COLORS.primary} />
        <Text style={bStyles.title}>Book Appointment</Text>
      </View>

      <Text style={bStyles.label}>Select Date</Text>
      <View style={bStyles.dateRow}>
        {DATES.map((d, i) => (
          <TouchableOpacity
            key={i}
            style={[bStyles.datePill, dateIdx === i && bStyles.pillOn]}
            onPress={() => setDateIdx(i)}
          >
            <Text style={[bStyles.dayTxt, dateIdx === i && { color: COLORS.white }]}>{d.label}</Text>
            <Text style={[bStyles.numTxt, dateIdx === i && { color: COLORS.white }]}>{d.num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={bStyles.label}>Select Time</Text>
      <View style={bStyles.timeRow}>
        {TIMES.map(t => (
          <TouchableOpacity
            key={t}
            style={[bStyles.timePill, time === t && bStyles.pillOn]}
            onPress={() => setTime(t)}
          >
            <Text style={[bStyles.timeTxt, time === t && { color: COLORS.white }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={bStyles.homeRow}>
        <View style={bStyles.homeLabelRow}>
          <Icon name="home-outline" size={17} color={COLORS.primary} />
          <View style={{ marginLeft: 8 }}>
            <Text style={bStyles.homeTitle}>Home Service</Text>
            <Text style={bStyles.homeSub}>Groomer visits your home</Text>
          </View>
        </View>
        <Switch
          value={homeOn}
          onValueChange={setHomeOn}
          trackColor={{ false: '#ccc', true: COLORS.secondary }}
          thumbColor={COLORS.white}
        />
      </View>

      <TouchableOpacity style={bStyles.cta} onPress={() => setConfirmed(true)} activeOpacity={0.88}>
        <Icon name="calendar-star" size={18} color={COLORS.white} style={{ marginRight: 8 }} />
        <Text style={bStyles.ctaText}>Book Grooming Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const bStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  titleRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title:        { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginLeft: 8 },
  label:        { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  dateRow:      { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  datePill:     { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 11, backgroundColor: '#f5f5f5', minWidth: 52, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent', marginRight: 7, marginBottom: 7 },
  pillOn:       { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dayTxt:       { fontSize: 10, fontWeight: '600', color: COLORS.textMuted },
  numTxt:       { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  timeRow:      { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  timePill:     { borderRadius: 9, paddingVertical: 8, paddingHorizontal: 11, backgroundColor: '#f5f5f5', borderWidth: 1.5, borderColor: 'transparent', marginRight: 8, marginBottom: 8 },
  timeTxt:      { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  homeRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f5faf0', borderRadius: 12, padding: 13, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  homeLabelRow: { flexDirection: 'row', alignItems: 'center' },
  homeTitle:    { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  homeSub:      { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  cta:          { backgroundColor: COLORS.secondary, borderRadius: RADIUS.btn, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  ctaText:      { color: COLORS.white, fontWeight: '800', fontSize: 14, letterSpacing: 0.2 },
  confirmed:    { backgroundColor: COLORS.primary, borderRadius: RADIUS.card, padding: 28, alignItems: 'center', marginBottom: 24 },
  confIcon:     { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  confTitle:    { fontSize: 18, fontWeight: '900', color: COLORS.white, marginBottom: 6 },
  confDetail:   { fontSize: 12.5, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  confBtn:      { backgroundColor: COLORS.white, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center' },
  confBtnText:  { color: COLORS.primary, fontWeight: '800', fontSize: 13 },
});
