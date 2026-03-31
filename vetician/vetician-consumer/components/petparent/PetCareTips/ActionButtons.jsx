import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Share, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { COLORS2 } from './colors.jsx';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ActionButtons = ({ tip, isSaved, onSave, isHelpful, onMarkHelpful, helpfulCount, savedCount }) => {
  const saveScale    = useSharedValue(1);
  const helpfulScale = useSharedValue(1);
  const saveRotate   = useSharedValue(0);

  const saveAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const helpfulAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: helpfulScale.value }],
  }));

  const handleSave = () => {
    saveScale.value = withSequence(
      withSpring(1.3, { damping: 8, stiffness: 200 }),
      withSpring(1,   { damping: 12 })
    );
    onSave(tip.id);
  };

  const handleHelpful = () => {
    helpfulScale.value = withSequence(
      withSpring(1.35, { damping: 8, stiffness: 200 }),
      withSpring(1,    { damping: 12 })
    );
    onMarkHelpful(tip.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this pet care tip: "${tip.title}" — Learn more on Vetician!`,
        title: tip.title,
      });
    } catch {
      Alert.alert('Share failed', 'Unable to share this tip right now.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Save */}
      <AnimatedTouchable
        style={[styles.btn, isSaved && styles.btnSaveActive, saveAnimStyle]}
        onPress={handleSave}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons
          name={isSaved ? 'bookmark' : 'bookmark-outline'}
          size={18}
          color={isSaved ? '#fff' : COLORS2.primary}
        />
        <View style={styles.btnInner}>
          <Text style={[styles.btnLabel, isSaved && styles.btnLabelActive]}>
            {isSaved ? 'Saved' : 'Save'}
          </Text>
          <Text style={[styles.btnCount, isSaved && styles.btnCountActive]}>
            {savedCount}
          </Text>
        </View>
      </AnimatedTouchable>

      {/* Share */}
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
        <MaterialCommunityIcons name="share-variant-outline" size={18} color={COLORS2.primary} />
        <Text style={styles.shareBtnText}>Share</Text>
      </TouchableOpacity>

      {/* Helpful */}
      <AnimatedTouchable
        style={[styles.btn, isHelpful && styles.btnHelpfulActive, helpfulAnimStyle]}
        onPress={handleHelpful}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons
          name={isHelpful ? 'thumb-up' : 'thumb-up-outline'}
          size={18}
          color={isHelpful ? '#fff' : COLORS2.primary}
        />
        <View style={styles.btnInner}>
          <Text style={[styles.btnLabel, isHelpful && styles.btnLabelActive]}>
            {isHelpful ? 'Helpful!' : 'Helpful'}
          </Text>
          <Text style={[styles.btnCount, isHelpful && styles.btnCountActive]}>
            {helpfulCount}
          </Text>
        </View>
      </AnimatedTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS2.card,
    borderTopWidth: 1,
    borderTopColor: COLORS2.border,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS2.primary,
    gap: 6,
    backgroundColor: COLORS2.card,
  },
  btnSaveActive: {
    backgroundColor: COLORS2.primary,
    borderColor: COLORS2.primary,
  },
  btnHelpfulActive: {
    backgroundColor: COLORS2.secondary,
    borderColor: COLORS2.secondary,
  },
  btnInner: {
    alignItems: 'center',
    gap: 1,
  },
  btnLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS2.primary,
    lineHeight: 14,
  },
  btnLabelActive: {
    color: '#fff',
  },
  btnCount: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS2.subtext,
    lineHeight: 12,
  },
  btnCountActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
    gap: 6,
    backgroundColor: COLORS2.accent,
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS2.primary,
  },
});

export default ActionButtons;
