import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CommunityCard from './CommunityCard';
import { COLORS2 } from '../../../constant/theme';

export default function CommunityList({ communities, onPress }) {
  if (!communities || communities.length === 0) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Breed & Topic Communities</Text>
      {communities.map((c) => (
        <CommunityCard key={c.id} community={c} onPress={onPress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS2.text,
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
  },
});
