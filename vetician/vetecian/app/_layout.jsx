import '../global.css';
import { Slot, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

function NoInternetBanner({ onRetry }) {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>⚠️ No internet connection</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
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
      router.replace('/(auth)/consumer-login');
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

  const { isConnected, checkConnection } = useNetworkStatus();

  return (
    <>
      {!isConnected && <NoInternetBanner onRetry={checkConnection} />}
      {children}
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <AuthGuard>
            <Slot />
            <StatusBar style="auto" />
          </AuthGuard>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
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
  banner: {
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 999,
  },
  bannerText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  retryBtn: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  retryText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
