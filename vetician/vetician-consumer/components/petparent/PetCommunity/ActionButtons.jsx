import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

export default function ActionButtons({ likes, comments, shares, liked: initialLiked, postId, isAdmin, onDelete, onReport }) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.actionBtn, liked && styles.actionBtnLiked]}
          onPress={toggleLike}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons
            name={liked ? 'heart' : 'heart-outline'}
            size={15}
            color={liked ? COLORS2.primary : COLORS2.subtext}
          />
          <Text style={[styles.actionText, liked && styles.actionTextLiked]}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
          <MaterialCommunityIcons name="comment-outline" size={15} color={COLORS2.subtext} />
          <Text style={styles.actionText}>{comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
          <MaterialCommunityIcons name="share-outline" size={15} color={COLORS2.subtext} />
          <Text style={styles.actionText}>{shares}</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          onPress={() => setMenuOpen((v) => !v)}
          activeOpacity={0.75}
          style={styles.moreBtn}
        >
          <MaterialCommunityIcons name="dots-horizontal" size={18} color={COLORS2.subtext} />
        </TouchableOpacity>
      </View>

      {menuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => { setMenuOpen(false); onReport && onReport(postId); }}
          >
            <View style={styles.menuIconWrap}>
              <MaterialCommunityIcons name="flag-outline" size={14} color={COLORS2.primary} />
            </View>
            <Text style={styles.menuText}>Report Post</Text>
          </TouchableOpacity>
          {isAdmin && (
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => { setMenuOpen(false); onDelete && onDelete(postId); }}
            >
              <View style={styles.menuIconWrap}>
                <MaterialCommunityIcons name="delete-outline" size={14} color={COLORS2.primary} />
              </View>
              <Text style={styles.menuText}>Delete Post</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 10, marginTop: 8,
    borderTopWidth: 1, borderTopColor: COLORS2.border, gap: 6,
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS2.accent, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: COLORS2.border,
  },
  actionBtnLiked: { backgroundColor: COLORS2.accent, borderColor: COLORS2.secondary },
  actionText: { fontSize: 12, color: COLORS2.subtext, fontWeight: '600' },
  actionTextLiked: { color: COLORS2.primary },
  moreBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: COLORS2.accent, borderWidth: 1, borderColor: COLORS2.border,
    alignItems: 'center', justifyContent: 'center',
  },
  menu: {
    marginTop: 8, backgroundColor: COLORS2.card,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS2.border, overflow: 'hidden',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10 },
  menuItemBorder: { borderTopWidth: 1, borderTopColor: COLORS2.border },
  menuIconWrap: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: COLORS2.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  menuText: { fontSize: 13, color: COLORS2.text, fontWeight: '600' },
});
