import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

function formatMembers(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

export default function CommunityCard({ community, onPress }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[animStyle, styles.wrapper]}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(community)}
        activeOpacity={0.92}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
      >
        {/* Left accent bar */}
        <View style={styles.accentBar} />

        <View style={styles.body}>
          <View style={styles.topRow}>
            {/* Real breed image */}
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: community.image }}
                style={styles.image}
                resizeMode="cover"
              />
              {community.joined && (
                <View style={styles.joinedDot}>
                  <MaterialCommunityIcons name="check" size={8} color="#fff" />
                </View>
              )}
            </View>

            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>{community.name}</Text>
                {community.joined && (
                  <View style={styles.joinedBadge}>
                    <MaterialCommunityIcons name="check-circle" size={10} color={COLORS2.primary} />
                    <Text style={styles.joinedText}>Joined</Text>
                  </View>
                )}
              </View>
              <View style={styles.categoryRow}>
                <MaterialCommunityIcons name="tag-outline" size={11} color={COLORS2.secondary} />
                <Text style={styles.categoryLabel}>{community.category}</Text>
              </View>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS2.shadow} />
          </View>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>{community.description}</Text>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <MaterialCommunityIcons name="account-group-outline" size={13} color={COLORS2.subtext} />
              <Text style={styles.footerText}>{formatMembers(community.members)} members</Text>
            </View>
            <View style={styles.footerDot} />
            <View style={styles.footerItem}>
              <MaterialCommunityIcons name="circle" size={7} color={COLORS2.secondary} />
              <Text style={styles.footerText}>Active now</Text>
            </View>
            <View style={styles.footerDot} />
            <View style={styles.footerItem}>
              <MaterialCommunityIcons name="post-outline" size={13} color={COLORS2.subtext} />
              <Text style={styles.footerText}>Daily posts</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 16, marginBottom: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS2.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS2.border,
    overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 12 },
      android: { elevation: 3 },
    }),
  },
  accentBar: { width: 4, backgroundColor: COLORS2.primary },
  body: { flex: 1, padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  imageWrap: { position: 'relative', flexShrink: 0 },
  image: {
    width: 54, height: 54, borderRadius: 14,
    borderWidth: 1.5, borderColor: COLORS2.border,
  },
  joinedDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS2.primary,
    borderWidth: 2, borderColor: COLORS2.card,
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  name: { fontSize: 14.5, fontWeight: '800', color: COLORS2.text, flex: 1 },
  joinedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: COLORS2.accent, borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 1, borderColor: COLORS2.border,
  },
  joinedText: { fontSize: 10, fontWeight: '700', color: COLORS2.primary },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  categoryLabel: { fontSize: 11, fontWeight: '700', color: COLORS2.secondary, letterSpacing: 0.3 },
  description: { fontSize: 12.5, color: COLORS2.subtext, lineHeight: 18, marginBottom: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 11, color: COLORS2.subtext, fontWeight: '500' },
  footerDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS2.border },
});
