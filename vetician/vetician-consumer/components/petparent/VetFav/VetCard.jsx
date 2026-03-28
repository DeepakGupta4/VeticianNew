import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Linking,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 as C } from './colors';

export default function VetCard({ vet, onPress, onRemove, onCall, onBook }) {
  const [imgError, setImgError] = useState(false);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.975, { damping: 15, stiffness: 300 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, []);

  const handleCall = useCallback(() => {
    Linking.openURL(`tel:${vet.phone}`).catch(() =>
      Alert.alert('Error', 'Unable to make a call on this device.')
    );
  }, [vet.phone]);

  const confirmRemove = () => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${vet.name} from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => onRemove(vet.id) },
      ]
    );
  };

  return (
    <Animated.View style={[s.cardWrap, animStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={s.card}
      >
        {/* Main Row */}
        <View style={s.mainRow}>
          {/* Avatar */}
          {vet.image && !imgError ? (
            <Image
              source={{ uri: vet.image }}
              style={s.avatar}
              onError={() => setImgError(true)}
            />
          ) : (
            <View style={[s.avatar, s.avatarFallback]}>
              <Text style={s.initials}>{vet.initials}</Text>
            </View>
          )}

          {/* Info */}
          <View style={s.info}>
            <View style={s.nameRow}>
              <Text style={s.name} numberOfLines={1}>{vet.name}</Text>
              <View style={[s.availPill, { backgroundColor: vet.available ? C.accent : '#F5F5F5' }]}>
                <View style={[s.availDot, { backgroundColor: vet.available ? C.secondary : C.subtext }]} />
                <Text style={[s.availTxt, { color: vet.available ? C.primary : C.subtext }]}>
                  {vet.available ? 'Open' : 'Busy'}
                </Text>
              </View>
            </View>

            <Text style={s.spec}>{vet.specialization}</Text>

            <View style={s.clinicRow}>
              <MaterialCommunityIcons name="hospital-building" size={11} color={C.subtext} />
              <Text style={s.clinic} numberOfLines={1}>{vet.clinic} · {vet.location}</Text>
            </View>

            <View style={s.metaRow}>
              <MetaPill icon="star" value={String(vet.rating)} primary />
              <MetaPill icon="map-marker-outline" value={vet.distance} />
              <MetaPill icon="briefcase-outline" value={vet.experience} />
            </View>
          </View>

          <View style={s.arrowBox}>
            <MaterialCommunityIcons name="chevron-right" size={16} color={C.primary} />
          </View>
        </View>

        {/* Fee strip */}
        <View style={s.feeStrip}>
          <MaterialCommunityIcons name="currency-inr" size={12} color={C.subtext} />
          <Text style={s.feeTxt}>{vet.fee} <Text style={s.feeLabel}>consultation</Text></Text>
        </View>

        <View style={s.divider} />

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity style={s.callBtn} onPress={handleCall} activeOpacity={0.8}>
            <MaterialCommunityIcons name="phone-outline" size={13} color={C.primary} />
            <Text style={s.callTxt}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.bookBtn} onPress={() => onBook(vet)} activeOpacity={0.8}>
            <MaterialCommunityIcons name="calendar-check-outline" size={13} color="#FFFFFF" />
            <Text style={s.bookTxt}>Book</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.removeBtn} onPress={confirmRemove} activeOpacity={0.8}>
            <MaterialCommunityIcons name="trash-can-outline" size={15} color={C.subtext} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function MetaPill({ icon, value, primary = false }) {
  return (
    <View style={s.metaPill}>
      <MaterialCommunityIcons name={icon} size={11} color={primary ? C.primary : C.subtext} />
      <Text style={[s.metaTxt, primary && s.metaTxtPrimary]}>{value}</Text>
    </View>
  );
}

// Inline C reference won't work in StyleSheet.create, so we use the values directly
const s = StyleSheet.create({
  cardWrap: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D6E8C4',
    shadowColor: '#558B2F',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    paddingBottom: 8,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D6E8C4',
    backgroundColor: '#F1F8E9',
    flexShrink: 0,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontSize: 20, fontWeight: '800', color: '#558B2F' },
  info: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: { fontSize: 15, fontWeight: '700', color: '#2D3A1F', flex: 1, marginRight: 6 },
  availPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  availDot: { width: 5, height: 5, borderRadius: 3 },
  availTxt: { fontSize: 10, fontWeight: '700' },
  spec: { fontSize: 12, color: '#558B2F', fontWeight: '600', marginBottom: 3 },
  clinicRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 5 },
  clinic: { fontSize: 11, color: '#6B7B5E', flex: 1 },
  metaRow: { flexDirection: 'row', gap: 10 },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaTxt: { fontSize: 11, color: '#6B7B5E', fontWeight: '500' },
  metaTxtPrimary: { color: '#558B2F', fontWeight: '700' },
  arrowBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1F8E9',
    borderWidth: 1,
    borderColor: '#D6E8C4',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  feeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  feeTxt: { fontSize: 12, color: '#2D3A1F', fontWeight: '700' },
  feeLabel: { fontSize: 11, color: '#6B7B5E', fontWeight: '400' },
  divider: { height: 1, backgroundColor: '#E8F0E1', marginHorizontal: 14 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    paddingHorizontal: 14,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#558B2F',
    backgroundColor: '#F1F8E9',
  },
  callTxt: { fontSize: 12, fontWeight: '700', color: '#558B2F' },
  bookBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#558B2F',
  },
  bookTxt: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  removeBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#E8F0E1',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
