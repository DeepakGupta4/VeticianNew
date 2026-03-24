// components/petparent/Vaccination/TimePickerDrawer.jsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  ScrollView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 as COLORS } from '../../../constant/theme';

const ITEM_H = 48;
const VISIBLE = 5; // odd number so selected is centred

const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function Drum({ items, selectedIndex, onSelect }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
  }, []);

  const handleScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
    if (idx >= 0 && idx < items.length) onSelect(idx);
  };

  return (
    <View style={d.drumWrap}>
      {/* Selection highlight */}
      <View style={d.highlight} pointerEvents="none" />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{ paddingVertical: ITEM_H * Math.floor(VISIBLE / 2) }}
        style={d.scroll}
      >
        {items.map((item, i) => (
          <TouchableOpacity
            key={item}
            style={d.item}
            onPress={() => {
              onSelect(i);
              ref.current?.scrollTo({ y: i * ITEM_H, animated: true });
            }}
            activeOpacity={0.7}
          >
            <Text style={[d.itemText, i === selectedIndex && d.itemTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

/**
 * TimePickerDrawer
 * Props:
 *   visible   – boolean
 *   value     – Date
 *   onClose   – () => void
 *   onConfirm – (date: Date) => void
 */
export default function TimePickerDrawer({ visible, value, onClose, onConfirm }) {
  const initial = value instanceof Date && !isNaN(value) ? value : new Date();
  const rawH    = initial.getHours();
  const initAM  = rawH < 12;
  const initH12 = rawH % 12 === 0 ? 12 : rawH % 12;

  const [hourIdx,   setHourIdx]   = useState(initH12 - 1);   // 0-based index into HOURS (1..12)
  const [minIdx,    setMinIdx]    = useState(initial.getMinutes());
  const [isAM,      setIsAM]      = useState(initAM);

  const displayHour = HOURS[hourIdx];
  const displayMin  = MINUTES[minIdx];
  const displayAmPm = isAM ? 'AM' : 'PM';

  const handleConfirm = () => {
    const d = new Date(value instanceof Date && !isNaN(value) ? value : new Date());
    let h24 = parseInt(displayHour, 10);
    if (isAM && h24 === 12) h24 = 0;
    if (!isAM && h24 !== 12) h24 += 12;
    d.setHours(h24, parseInt(displayMin, 10), 0, 0);
    onConfirm(d);
  };

  const fmt12 = `${displayHour}:${displayMin} ${displayAmPm}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={s.overlay} onPress={onClose} activeOpacity={1}>
        <TouchableOpacity activeOpacity={1} style={s.sheet}>
          {/* Handle */}
          <View style={s.handle} />

          {/* Header */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <View style={s.headerIcon}>
                <MaterialIcons name="schedule" size={18} color={COLORS.primary} />
              </View>
              <View>
                <Text style={s.headerTitle}>Select Time</Text>
                <Text style={s.headerSub}>{fmt12}</Text>
              </View>
            </View>
            <TouchableOpacity style={s.closeBtn} onPress={onClose}>
              <MaterialIcons name="close" size={18} color={COLORS.subtext} />
            </TouchableOpacity>
          </View>

          {/* Drum row */}
          <View style={s.drumRow}>
            <Drum items={HOURS}   selectedIndex={hourIdx} onSelect={setHourIdx} />
            <Text style={s.colon}>:</Text>
            <Drum items={MINUTES} selectedIndex={minIdx}  onSelect={setMinIdx}  />

            {/* AM / PM toggle */}
            <View style={s.ampmCol}>
              {['AM', 'PM'].map((label) => (
                <TouchableOpacity
                  key={label}
                  style={[s.ampmBtn, (label === 'AM') === isAM && s.ampmBtnActive]}
                  onPress={() => setIsAM(label === 'AM')}
                >
                  <Text style={[s.ampmText, (label === 'AM') === isAM && s.ampmTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View style={s.actions}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.confirmBtn} onPress={handleConfirm}>
              <MaterialIcons name="check" size={16} color={COLORS.white} />
              <Text style={s.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: Platform.OS === 'ios' ? 24 : 8 }} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const d = StyleSheet.create({
  drumWrap:       { flex: 1, height: ITEM_H * VISIBLE, overflow: 'hidden' },
  scroll:         { flex: 1 },
  highlight:      {
    position: 'absolute', left: 0, right: 0,
    top: ITEM_H * Math.floor(VISIBLE / 2),
    height: ITEM_H,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    zIndex: 0,
  },
  item:           { height: ITEM_H, alignItems: 'center', justifyContent: 'center' },
  itemText:       { fontSize: 20, color: COLORS.subtext, fontWeight: '500' },
  itemTextActive: { fontSize: 22, color: COLORS.primary, fontWeight: '800' },
});

const s = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: COLORS.card, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20 },
  handle:     { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  headerTitle:{ fontSize: 15, fontWeight: '700', color: COLORS.text },
  headerSub:  { fontSize: 12, color: COLORS.subtext },
  closeBtn:   { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  drumRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 24 },
  colon:      { fontSize: 28, fontWeight: '800', color: COLORS.text, marginHorizontal: 4, marginBottom: 4 },
  ampmCol:    { gap: 8, marginLeft: 12 },
  ampmBtn:    { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: COLORS.accent, borderWidth: 1.5, borderColor: COLORS.border },
  ampmBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  ampmText:   { fontSize: 13, fontWeight: '700', color: COLORS.subtext },
  ampmTextActive: { color: COLORS.white },
  actions:    { flexDirection: 'row', gap: 10 },
  cancelBtn:  { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 13, borderWidth: 1, borderColor: COLORS.border },
  cancelText: { fontSize: 14, fontWeight: '600', color: COLORS.subtext },
  confirmBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 13 },
  confirmText:{ fontSize: 14, fontWeight: '700', color: COLORS.white },
});
