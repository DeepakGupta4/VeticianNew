// Run this in your React Native app to clear old tokens
// You can add this as a button in your app or run it once

import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(['token', 'userId', 'refreshToken', 'user']);
    console.log('✅ Auth data cleared successfully');
    console.log('💡 Please log in again');
    return true;
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    return false;
  }
};

// To see all stored keys
export const debugStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('📦 All AsyncStorage keys:', keys);
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      console.log(`${key}:`, value?.substring(0, 50) + '...');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
