// components/Header.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../constant/theme';

export default function Header({ onProfilePress }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar backgroundColor={COLORS.primaryGreen} barStyle="light-content" translucent />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Day / Play School</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={onProfilePress} activeOpacity={0.8}>
          <MaterialCommunityIcons name="account-circle-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.subtitleBanner}>
        <MaterialCommunityIcons name="information-outline" size={15} color={COLORS.white} />
        <Text style={styles.subtitleText}>
          A safe and fun place where your pet can play, socialize and stay active during the day.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  subtitleBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 28,
  },
  subtitleText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 19,
  },
});
