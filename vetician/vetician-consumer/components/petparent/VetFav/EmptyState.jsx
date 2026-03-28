import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS2 as C } from './colors';

/**
 * EmptyState Component
 * Displayed when the user has no favorite vets.
 *
 * Props:
 *  - onExplore {function}  Optional override for the Explore button action
 */
export default function EmptyState({ onExplore }) {
  const router = useRouter();

  const handleExplore = () => {
    if (onExplore) {
      onExplore();
    } else {
      router.push('/explore-vets');
    }
  };

  return (
    <View style={s.container}>
      <View style={s.iconBox}>
        <MaterialCommunityIcons
          name="heart-outline"
          size={36}
          color={C.primary}
        />
      </View>

      <Text style={s.title}>No favorite vets yet</Text>
      <Text style={s.subtitle}>
        Add vets you trust to quickly{'\n'}book appointments anytime.
      </Text>

      <TouchableOpacity
        style={s.btn}
        onPress={handleExplore}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="stethoscope"
          size={16}
          color="#FFFFFF"
          style={{ marginRight: 6 }}
        />
        <Text style={s.btnTxt}>Explore Vets</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 400,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#F1F8E9',
    borderWidth: 2,
    borderColor: '#E8F0E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3A1F',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7B5E',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 20,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#558B2F',
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 12,
  },
  btnTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
