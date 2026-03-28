import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS2 as C, COLORS2 } from './colors';

/**
 * Header Component
 * Used in both FavoriteVetsScreen and VetDetailsScreen.
 *
 * Props:
 *  - title    {string}  Screen title (default: 'Favorite Vets')
 *  - subtitle {string}  Small text below title
 *  - count    {number|null}  If provided, shows a green badge with the count
 *  - onBack   {function}  Override back navigation (optional)
 */
export default function Header({
  title = 'Favorite Vets',
  subtitle = 'Your trusted veterinarians',
  count = null,
  onBack = null,
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={s.header}>
      <TouchableOpacity style={s.backBtn} onPress={handleBack} activeOpacity={0.7}>
        <MaterialCommunityIcons name="arrow-left" size={22} color={'black'} />
      </TouchableOpacity>

      <View style={s.titleWrap}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.subtitle}>{subtitle}</Text>
      </View>

      {count !== null && (
        <View style={s.badge}>
          <Text style={s.badgeText}>{count}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS2.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    
    borderBottomColor: '#E8F0E1',
    // iOS shadow
    shadowColor: '#C5D9A8',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // Android shadow
    elevation: 2,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E8F0E1',
    backgroundColor: '#E8FAD1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS2.card,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS2.accent,
    marginTop: 1,
  },
  badge: {
    backgroundColor: COLORS2.secondary,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
    minWidth: 26,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
