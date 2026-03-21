import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SectionTitle({ title, sub, titleColor }) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, titleColor && { color: titleColor }]}>{title}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:  { marginBottom: 14, marginTop: 4 },
  title: { fontSize: 18, fontWeight: '800', color: '#1a1a1a', letterSpacing: -0.2 },
  sub:   { fontSize: 13, color: '#888', marginTop: 3 },
});
