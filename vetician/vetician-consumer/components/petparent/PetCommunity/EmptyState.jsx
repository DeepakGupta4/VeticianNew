import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

export default function EmptyState({ message = 'No posts yet', sub = 'Be the first to share something!' }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="paw-off" size={36} color={COLORS2.shadow} />
      </View>
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.sub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 44,
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS2.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 6,
  },
  sub: {
    fontSize: 13,
    color: COLORS2.subtext,
    textAlign: 'center',
    lineHeight: 19,
  },
});
