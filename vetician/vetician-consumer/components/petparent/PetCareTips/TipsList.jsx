import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS2 } from './colors.jsx';
import TipCard from './TipCard';

const TipsList = ({ tips, onPressTip, onSaveTip, savedTips }) => {
  if (!tips || tips.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>All Tips ({tips.length})</Text>
      {tips.map((tip, index) => (
        <TipCard
          key={tip.id}
          tip={tip}
          index={index}
          onPress={onPressTip}
          onSave={onSaveTip}
          isSaved={savedTips.includes(tip.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 30,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS2.subtext,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
});

export default TipsList;
