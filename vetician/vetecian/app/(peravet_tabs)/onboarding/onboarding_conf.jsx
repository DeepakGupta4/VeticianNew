import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OnboardingConf() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Onboarding Configuration</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
