import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';
import PostCard from './PostCard';
import EmptyState from './EmptyState';
import { COMMUNITY_POSTS } from './communityData';

function formatMembers(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

export default function CommunityDetailsScreen({ community, onBack, onPostPress }) {
  const [joined, setJoined] = useState(community.joined);
  const [members, setMembers] = useState(community.members);
  const [posts, setPosts] = useState(COMMUNITY_POSTS[community.id] || []);

  const handleJoinLeave = () => {
    if (joined) {
      Alert.alert('Leave Community', `Leave ${community.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => { setJoined(false); setMembers((m) => m - 1); } },
      ]);
    } else {
      setJoined(true);
      setMembers((m) => m + 1);
    }
  };

  const handleDeletePost = (postId) => {
    Alert.alert('Delete Post', 'Delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setPosts((prev) => prev.filter((p) => p.id !== postId)) },
    ]);
  };

  const handleReportPost = () => {
    Alert.alert('Post Reported', 'Thank you. Our moderators will review it.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS2.primary} />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        {/* Nav */}
        <View style={styles.navRow}>
          <TouchableOpacity onPress={onBack} style={styles.navBtn} activeOpacity={0.75}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.navSpacer} />
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.75}>
            <MaterialCommunityIcons name="dots-horizontal" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Identity */}
        <View style={styles.heroBody}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name="account-group" size={34} color="#fff" />
          </View>
          <Text style={styles.heroName}>{community.name}</Text>
          <View style={styles.heroCategoryRow}>
            <MaterialCommunityIcons name="tag-outline" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroCategoryText}>{community.category}</Text>
          </View>
          <Text style={styles.heroDesc}>{community.description}</Text>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-group-outline" size={16} color={COLORS2.primary} />
            <Text style={styles.statVal}>{formatMembers(members)}</Text>
            <Text style={styles.statLbl}>Members</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="post-outline" size={16} color={COLORS2.primary} />
            <Text style={styles.statVal}>{posts.length}</Text>
            <Text style={styles.statLbl}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="leaf" size={16} color={COLORS2.primary} />
            <Text style={styles.statVal}>Active</Text>
            <Text style={styles.statLbl}>Status</Text>
          </View>
        </View>

        {/* Join / Leave */}
        <TouchableOpacity
          style={[styles.joinBtn, joined && styles.joinBtnLeave]}
          onPress={handleJoinLeave}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name={joined ? 'account-minus-outline' : 'account-plus-outline'}
            size={17}
            color={joined ? COLORS2.primary : '#fff'}
          />
          <Text style={[styles.joinBtnText, joined && styles.joinBtnTextLeave]}>
            {joined ? 'Leave Community' : 'Join Community'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Posts */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.postsContent}>
        <View style={styles.postsHeader}>
          <MaterialCommunityIcons name="forum-outline" size={16} color={COLORS2.primary} />
          <Text style={styles.postsHeading}>Community Posts</Text>
          <View style={styles.postsBadge}>
            <Text style={styles.postsBadgeText}>{posts.length}</Text>
          </View>
        </View>

        {posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              onPress={onPostPress}
              onDelete={handleDeletePost}
              onReport={handleReportPost}
            />
          ))
        ) : (
          <EmptyState
            message="No posts yet"
            sub={`Be the first to post in ${community.name}!`}
          />
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS2.bg },
  hero: {
    backgroundColor: COLORS2.primary,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -50, right: -40,
  },
  circle2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)', bottom: 10, left: -20,
  },
  navRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  navBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  navSpacer: { flex: 1 },
  heroBody: { alignItems: 'center', marginBottom: 16 },
  heroIcon: {
    width: 70, height: 70, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  heroName: { fontSize: 20, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 4 },
  heroCategoryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  heroCategoryText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.8)', letterSpacing: 0.3 },
  heroDesc: { fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 19 },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: COLORS2.border,
    marginBottom: 14,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statDivider: { width: 1, backgroundColor: COLORS2.border, marginVertical: 4 },
  statVal: { fontSize: 14, fontWeight: '800', color: COLORS2.text },
  statLbl: { fontSize: 10, color: COLORS2.subtext, fontWeight: '500' },
  joinBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 14, paddingVertical: 12, gap: 8,
  },
  joinBtnLeave: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderColor: COLORS2.border,
  },
  joinBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  joinBtnTextLeave: { color: COLORS2.primary },
  postsContent: { paddingTop: 16 },
  postsHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 12,
  },
  postsHeading: { fontSize: 15, fontWeight: '800', color: COLORS2.text, flex: 1 },
  postsBadge: {
    backgroundColor: COLORS2.accent, borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, borderColor: COLORS2.border,
  },
  postsBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS2.primary },
});
