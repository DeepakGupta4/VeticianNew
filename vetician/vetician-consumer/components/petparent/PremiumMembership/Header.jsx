// components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS2 } from './colors';

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        iconColor={COLORS2.text}
        size={22}
        onPress={() => router.back()}
        style={styles.backBtn}
      />
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Premium Membership</Text>
        <Text style={styles.subtitle}>Give your pet the best care experience</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: COLORS2.primary,
  },
  backBtn: {
    marginRight: 4,
    backgroundColor:COLORS2.secondary,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS2.card,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS2.accent,
    marginTop: 1,
  },
});
