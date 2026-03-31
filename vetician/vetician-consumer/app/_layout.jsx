import '../global.css';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { store, persistor } from '../store/store';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PersistGate } from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator } from 'react-native';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Suppress fontfaceobserver timeout warnings
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('timeout exceeded') || args[0]?.includes?.('fontfaceobserver')) {
      return; // Suppress font loading timeout errors
    }
    originalError.apply(console, args);
  };
}

function AuthGuard({ children }) {
  const router    = useRouter();
  const segments  = useSegments();
  const [ready, setReady] = useState(false);

  const { isAuthenticated } = useSelector(state => state.auth);

  // Splash screen hide karo sirf jab redux rehydrate ho jaaye
  useEffect(() => {
    if (!ready) {
      setReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }
  }, []);

  // Navigation guard
  useEffect(() => {
    if (!ready) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/signin');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(vetician_tabs)');
    }
  }, [ready, segments, isAuthenticated]);

  return children;
}

// PersistGate loading fallback - rehydration ke waqt dikhega
function LoadingFallback() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#55882F" />
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<LoadingFallback />} persistor={persistor}>
          <AuthGuard>
            <Slot />
            <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />
          </AuthGuard>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
