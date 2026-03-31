import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'react-native';
import { COLORS2 } from '../../../constant/theme';
import ActionButtons from './ActionButtons';

const MOCK_COMMENTS = [
  {
    id: 'c1',
    userName: 'Deepa Singh',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80',
    avatarInitials: 'DS',
    text: 'Absolutely adorable! Happy birthday Bruno! 🎂🐾',
    time: '1 hour ago',
  },
  {
    id: 'c2',
    userName: 'Vikram Bose',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    avatarInitials: 'VB',
    text: 'GSDs grow up so fast. Cherish every moment with them!',
    time: '45 min ago',
  },
];

export default function PostDetailsScreen({ post, onBack }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);

  const sendComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: `c${Date.now()}`,
      userName: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
      avatarInitials: 'ME',
      text: comment.trim(),
      time: 'Just now',
    };
    setComments((prev) => [...prev, newComment]);
    setComment('');
  };

  const handleDelete = (postId) => {
    Alert.alert('Delete Post', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS2.card} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS2.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Post */}
          <Animated.View entering={FadeInDown.springify()} style={styles.postCard}>
            <View style={styles.postHeader}>
              {post.avatar ? (
                <Image source={{ uri: post.avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{post.avatarInitials}</Text>
                </View>
              )}
              <View>
                <Text style={styles.userName}>{post.userName}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.community}>{post.community}</Text>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.time}>{post.time}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.postText}>{post.text}</Text>
            <ActionButtons
              likes={post.likes}
              comments={post.comments}
              shares={post.shares}
              liked={post.liked}
              postId={post.id}
              isAdmin={post.isAdmin}
              onDelete={handleDelete}
              onReport={() => Alert.alert('Reported', 'Thank you for reporting this post.')}
            />
          </Animated.View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsHeading}>Comments ({comments.length})</Text>
            {comments.map((c, i) => (
              <Animated.View key={c.id} entering={FadeInDown.delay(i * 60).springify()} style={styles.commentCard}>
                {c.avatar ? (
                  <Image source={{ uri: c.avatar }} style={styles.commentAvatarImage} />
                ) : (
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>{c.avatarInitials}</Text>
                  </View>
                )}
                <View style={styles.commentBody}>
                  <View style={styles.commentMeta}>
                    <Text style={styles.commentUser}>{c.userName}</Text>
                    <Text style={styles.commentTime}>{c.time}</Text>
                  </View>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor={COLORS2.subtext}
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !comment.trim() && styles.sendBtnDisabled]}
            onPress={sendComment}
            activeOpacity={0.8}
            disabled={!comment.trim()}
          >
            <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS2.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: COLORS2.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS2.border,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS2.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontSize: 16, fontWeight: '700', color: COLORS2.text,
  },
  spacer: { width: 38 },
  postCard: {
    backgroundColor: COLORS2.card,
    margin: 16,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS2.border,
    shadowColor: COLORS2.shadow,
    shadowOpacity: 0.13,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  postHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS2.accent, borderWidth: 1.5, borderColor: COLORS2.border, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: COLORS2.border },
  avatarText: { fontWeight: '700', fontSize: 15, color: COLORS2.primary },
  userName: { fontSize: 14, fontWeight: '700', color: COLORS2.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  community: { fontSize: 11.5, color: COLORS2.primary, fontWeight: '600' },
  dot: { color: COLORS2.subtext, fontSize: 11 },
  time: { fontSize: 11.5, color: COLORS2.subtext },
  postText: { fontSize: 14.5, color: COLORS2.text, lineHeight: 22 },
  commentsSection: { paddingHorizontal: 16, paddingBottom: 16 },
  commentsHeading: { fontSize: 14, fontWeight: '700', color: COLORS2.text, marginBottom: 12 },
  commentCard: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  commentAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS2.accent,
    borderWidth: 1, borderColor: COLORS2.border,
    alignItems: 'center', justifyContent: 'center',
  },
  commentAvatarImage: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1.5, borderColor: COLORS2.border,
  },
  commentAvatarText: { fontWeight: '700', fontSize: 13, color: COLORS2.primary },
  commentBody: { flex: 1 },
  commentMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  commentUser: { fontSize: 13, fontWeight: '700', color: COLORS2.text },
  commentTime: { fontSize: 11, color: COLORS2.subtext },
  commentText: { fontSize: 13.5, color: COLORS2.text, lineHeight: 19 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    backgroundColor: COLORS2.card,
    borderTopWidth: 1,
    borderTopColor: COLORS2.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS2.accent,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS2.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS2.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS2.shadow },
});
