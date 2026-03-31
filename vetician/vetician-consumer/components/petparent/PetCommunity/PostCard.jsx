import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActionButtons from './ActionButtons';
import { COLORS2 } from '../../../constant/theme';

function Avatar({ avatar, initials }) {
  if (avatar) {
    return (
      <Image source={{ uri: avatar }} style={styles.avatarImage} />
    );
  }
  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

export default function PostCard({ post, index = 0, onPress, onDelete, onReport }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress && onPress(post)}
        activeOpacity={0.92}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Avatar avatar={post.avatar} initials={post.avatarInitials} />
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{post.userName}</Text>
              {post.isAdmin && (
                <View style={styles.adminBadge}>
                  <MaterialCommunityIcons name="shield-check" size={10} color="#fff" />
                  <Text style={styles.adminText}>Admin</Text>
                </View>
              )}
            </View>
            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="paw" size={11} color={COLORS2.secondary} />
              <Text style={styles.petName}>{post.petName}</Text>
              <Text style={styles.dot}>·</Text>
              <MaterialCommunityIcons name="clock-outline" size={11} color={COLORS2.subtext} />
              <Text style={styles.time}>{post.time}</Text>
            </View>
          </View>

          <View style={styles.communityPill}>
            <MaterialCommunityIcons name="account-group" size={10} color={COLORS2.primary} />
            <Text style={styles.communityText} numberOfLines={1}>{post.community}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Post Text */}
        <Text style={styles.postText}>{post.text}</Text>

        {/* Actions */}
        <ActionButtons
          likes={post.likes}
          comments={post.comments}
          shares={post.shares}
          liked={post.liked}
          postId={post.id}
          isAdmin={post.isAdmin}
          onDelete={onDelete}
          onReport={onReport}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS2.border,
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 12 },
      android: { elevation: 3 },
    }),
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 4 },
  avatarWrap: { position: 'relative' },
  avatarImage: {
    width: 46, height: 46, borderRadius: 23,
    borderWidth: 2, borderColor: COLORS2.border,
  },
  avatarFallback: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: COLORS2.accent,
    borderWidth: 1.5, borderColor: COLORS2.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontWeight: '800', fontSize: 15, color: COLORS2.primary },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 11, height: 11, borderRadius: 5.5,
    backgroundColor: COLORS2.secondary,
    borderWidth: 2, borderColor: COLORS2.card,
  },
  userInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  userName: { fontSize: 14, fontWeight: '800', color: COLORS2.text },
  adminBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: COLORS2.primary, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  adminText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  petName: { fontSize: 11.5, color: COLORS2.secondary, fontWeight: '600' },
  dot: { color: COLORS2.border, fontSize: 10 },
  time: { fontSize: 11.5, color: COLORS2.subtext },
  communityPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: COLORS2.accent, borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS2.border,
    maxWidth: 110,
  },
  communityText: { fontSize: 10, fontWeight: '700', color: COLORS2.primary, flex: 1 },
  divider: { height: 1, backgroundColor: COLORS2.border, marginVertical: 10 },
  postText: { fontSize: 14, color: COLORS2.text, lineHeight: 22, marginBottom: 4 },
});
