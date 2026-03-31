import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

const ProfileCard = ({ profile, onEditPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 4 }).start();

  const initials = profile.name
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <View style={styles.card}>
      <View style={styles.infoRow}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.infoText}>
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="phone-outline" size={12} color={COLORS2.subtext} />
            <Text style={styles.detail}>{profile.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="email-outline" size={12} color={COLORS2.subtext} />
            <Text style={styles.detail}>{profile.email}</Text>
          </View>
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={onEditPress}
          onPressIn={onIn}
          onPressOut={onOut}
          activeOpacity={1}
        >
          <MaterialCommunityIcons name="account-edit-outline" size={16} color="#fff" />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 18, borderWidth: 1, borderColor: COLORS2.border, padding: 20,
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 66, height: 66, borderRadius: 33,
    backgroundColor: COLORS2.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: COLORS2.border,
  },
  initials: { color: '#fff', fontSize: 22, fontWeight: '800' },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: COLORS2.secondary,
    borderWidth: 2, borderColor: COLORS2.card,
  },
  infoText: { flex: 1, gap: 3 },
  name: { fontSize: 17, fontWeight: '800', color: COLORS2.text, marginBottom: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  detail: { fontSize: 12.5, color: COLORS2.subtext },
  editBtn: {
    backgroundColor: COLORS2.primary, borderRadius: 12,
    paddingVertical: 12, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 7,
  },
  editBtnText: { color: '#fff', fontWeight: '700', fontSize: 14, letterSpacing: 0.2 },
});

export default ProfileCard;
