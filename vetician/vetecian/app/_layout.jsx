import '../global.css';
import { Slot, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

function AuthGuard({ children }) {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/signin');
    } else if (isAuthenticated && inAuthGroup) {
      const role = user?.role || 'vetician';
      
      switch(role) {
        case 'admin':
          router.replace('/(admin_tabs)');
          break;
        case 'veterinarian':
          router.replace('/(doc_tabs)');
          break;
        case 'pet_resort':
          router.replace('/(pet_resort_tabs)');
          break;
        case 'paravet':
          router.replace('/(peravet_tabs)/(tabs)');
          break;
        default:
          router.replace('/(vetician_tabs)');
      }
    }
  }, [segments, isAuthenticated, user, navigationState?.key]);

  return children;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <AuthGuard>
          <Slot />
          <StatusBar style="auto" />
        </AuthGuard>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
});
