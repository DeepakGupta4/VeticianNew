import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  BackHandler,
} from 'react-native';
import { Text, Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { PawPrint } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7CB342',
    secondary: '#558B2F',
  },
};

export default function VeticianWelcomeScreen() {
  const router = useRouter();
  const duration = 3000;
  const autoNavigate = true;

  const handleComplete = async () => {
    await AsyncStorage.setItem('welcomeShown', 'true');
    router.replace('/(vetician_tabs)/(tabs)');
  };
  // Animation values
  const [fadeInIcon] = useState(new Animated.Value(0));
  const [scaleIcon] = useState(new Animated.Value(0.6));
  const [fadeInText] = useState(new Animated.Value(0));
  const [slideUpText] = useState(new Animated.Value(50));
  const [fadeInButton] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  // Loading indicator animation
  const [dot1Anim] = useState(new Animated.Value(0));
  const [dot2Anim] = useState(new Animated.Value(0));
  const [dot3Anim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Prevent back button on Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Prevent going back
    });

    // Staggered animation sequence
    Animated.sequence([
      // Icon fade and scale in
      Animated.parallel([
        Animated.timing(fadeInIcon, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleIcon, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Text fade and slide in
      Animated.parallel([
        Animated.timing(fadeInText, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpText, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Button fade in
      Animated.timing(fadeInButton, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Loading dots animation
    const createDotAnimation = (dotAnim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotAnim, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createDotAnimation(dot1Anim, 0);
    createDotAnimation(dot2Anim, 150);
    createDotAnimation(dot3Anim, 300);

    // Auto-navigate after specified duration
    if (autoNavigate && handleComplete) {
      const timer = setTimeout(() => {
        handleComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [
    fadeInIcon,
    scaleIcon,
    fadeInText,
    slideUpText,
    fadeInButton,
    pulseAnim,
    dot1Anim,
    dot2Anim,
    dot3Anim,
  ]);

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor="#7CB342" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Animated Icon */}
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                opacity: fadeInIcon,
                transform: [
                  { scale: scaleIcon },
                  { scale: pulseAnim },
                ],
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <PawPrint size={96} color="#fff" strokeWidth={1.2} />
            </View>
          </Animated.View>

          {/* Welcome Text */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeInText,
                transform: [{ translateY: slideUpText }],
              },
            ]}
          >
            <Text style={styles.welcomeLabel}>Welcome to</Text>
            <Text style={styles.appName}>Vetician</Text>
            <Text style={styles.tagline}>
              Your Pet's Health Companion
            </Text>
          </Animated.View>

          {/* Skip Button */}
          <Animated.View
            style={[
              styles.skipButtonContainer,
              {
                opacity: fadeInButton,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => handleComplete()}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Loading Indicator Dots */}
          <View style={styles.dotsContainer}>
            <Animated.View
              style={[
                styles.dot,
                {
                  transform: [{ translateY: dot1Anim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  transform: [{ translateY: dot2Anim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  transform: [{ translateY: dot3Anim }],
                },
              ]}
            />
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7CB342',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  // Icon Styles
  iconWrapper: {
    marginBottom: 60,
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Text Styles
  textContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  welcomeLabel: {
    fontSize: 28,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  appName: {
    fontSize: 56,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
  },

  // Skip Button Styles
  skipButtonContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Loading Dots Styles
  dotsContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 10,
    height: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});