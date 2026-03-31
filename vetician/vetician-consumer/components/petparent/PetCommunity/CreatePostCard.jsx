import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

export default function CreatePostCard({ onPress }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatarPlaceholder}>
          <MaterialCommunityIcons name="paw" size={20} color={COLORS2.primary} />
        </View>
        <TouchableOpacity style={styles.inputMock} onPress={onPress} activeOpacity={0.8}>
          <MaterialCommunityIcons name="pencil-outline" size={15} color={COLORS2.subtext} />
          <Text style={styles.placeholder}>What's on your mind?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.8}>
          <MaterialCommunityIcons name="image-outline" size={17} color={COLORS2.primary} />
          <Text style={styles.actionText}>Photo</Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.8}>
          <MaterialCommunityIcons name="video-outline" size={17} color={COLORS2.primary} />
          <Text style={styles.actionText}>Video</Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.8}>
          <MaterialCommunityIcons name="tag-outline" size={17} color={COLORS2.primary} />
          <Text style={styles.actionText}>Tag Pet</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.postBtn} onPress={onPress} activeOpacity={0.85}>
          <MaterialCommunityIcons name="send" size={15} color="#fff" />
          <Text style={styles.postBtnText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS2.border,
    overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 12 },
      android: { elevation: 3 },
    }),
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  avatarPlaceholder: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS2.accent,
    borderWidth: 1.5, borderColor: COLORS2.border,
    alignItems: 'center', justifyContent: 'center',
  },
  inputMock: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS2.accent, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1, borderColor: COLORS2.border,
  },
  placeholder: { fontSize: 13.5, color: COLORS2.subtext },
  divider: { height: 1, backgroundColor: COLORS2.border },
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10, gap: 4,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 6 },
  actionText: { fontSize: 12.5, fontWeight: '600', color: COLORS2.primary },
  actionDivider: { width: 1, height: 18, backgroundColor: COLORS2.border, marginHorizontal: 2 },
  spacer: { flex: 1 },
  postBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS2.primary, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  postBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
