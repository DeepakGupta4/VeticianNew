import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS2 } from './colors';

const Loader = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={COLORS2.primary} />
    <Text style={styles.text}>Loading your orders...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  text: { fontSize: 14, color: COLORS2.subtext, fontWeight: '500' },
});

export default Loader;
