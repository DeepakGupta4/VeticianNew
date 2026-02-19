import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TourCarousel from '../onboarding/TourCarousel';

export default function QuickTour() {
  const router = useRouter();

  const handleSkipTour = async () => {
    await AsyncStorage.setItem('tourCompleted', 'true');
    router.replace('/(vetician_tabs)');
  };

  const handleTourComplete = async () => {
    await AsyncStorage.setItem('tourCompleted', 'true');
    router.replace('/(vetician_tabs)');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkipTour}>
        <Text style={styles.skipText}>Skip Tour</Text>
      </TouchableOpacity>
      
      <TourCarousel onComplete={handleTourComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});