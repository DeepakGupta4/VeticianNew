import '../global.css';
import { Slot, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

function AuthGuard({ children }) {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const isNavigating = useRef(false);

  useEffect(() => {
    if (!navigationState?.key) return;

    SplashScreen.hideAsync().catch(() => {});

    const inAuthGroup = segments[0] === '(auth)';

    if (isNavigating.current) return;

    // Sirf unauthenticated user ko signin pe bhejo
    if (!isAuthenticated && !inAuthGroup) {
      isNavigating.current = true;
      router.replace('/(auth)/signin');
      setTimeout(() => { isNavigating.current = false; }, 1000);
    }
    // Authenticated users ko AuthGuard redirect NAHI karega
    // Har role ka apna signin logic handle karega
  }, [segments, isAuthenticated, navigationState?.key]);

  return children;
}

function AppContent() {
  const [rehydrated, setRehydrated] = useState(false);

  return (
    <PersistGate
      loading={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      }
      persistor={persistor}
      onBeforeLift={() => setRehydrated(true)}
    >
      <AuthGuard>
        <Slot />
        <StatusBar style="auto" />
      </AuthGuard>
    </PersistGate>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
}
