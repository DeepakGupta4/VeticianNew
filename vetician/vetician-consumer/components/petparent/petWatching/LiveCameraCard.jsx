import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const LiveCameraCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [nightVision, setNightVision] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('Online');

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    // Simulate camera loading
    setTimeout(() => setIsLoading(false), 2000);

    // Animated loading pulse
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1);
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      console.log('Fullscreen mode');
    });

  const composed = Gesture.Simultaneous(pinchGesture, doubleTap);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <MaterialIcon name="cctv" size={20} color="black" />
          <Text style={styles.cardTitle}>Live Camera Feed</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={[
            styles.statusDot,
            { backgroundColor: cameraStatus === 'Online' ? '#4CAF50' : '#FF5252' }
          ]} />
          <Text style={styles.statusText}>{cameraStatus}</Text>
        </View>
      </View>

      <GestureDetector gesture={composed}>
        <View style={styles.cameraContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Animated.View style={[styles.loadingPulse, animatedStyle]}>
                <MaterialIcon name="video" size={48} color="#6FA83A" />
              </Animated.View>
              <ActivityIndicator size="large" color="#6FA83A" style={{ marginTop: 16 }} />
              <Text style={styles.loadingText}>Connecting to camera...</Text>
            </View>
          ) : (
            <>
              <Image
                source={{ uri: 'https://media.istockphoto.com/id/2184260648/photo/border-collie-with-owner-training-in-a-public-park.jpg?s=612x612&w=0&k=20&c=qJsZdPzCEsWL7JQkhLPRUR2KSTaipCrUl3_o8Vk_-eg=' }}
                style={styles.cameraFeed}
                resizeMode="cover"
              />
              
              {nightVision && (
                <View style={styles.nightVisionOverlay}>
                  <MaterialIcon name="weather-night" size={16} color="#4CAF50" />
                  <Text style={styles.nightVisionText}>Night Vision</Text>
                </View>
              )}

              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.controlButton}>
                  <Icon name="expand-outline" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <MaterialIcon name="camera-flip" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <Icon name="camera-outline" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setIsMuted(!isMuted)}
                >
                  <Icon
                    name={isMuted ? 'volume-mute-outline' : 'volume-high-outline'}
                    size={22}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </GestureDetector>

      <View style={styles.cameraInfo}>
        <Text style={styles.infoText}> Double tap for fullscreen • Pinch to zoom</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop:16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C2C2C',
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  cameraContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
    aspectRatio: 16 / 9,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  loadingPulse: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(111, 168, 58, 0.2)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
  },
  cameraFeed: {
    width: '100%',
    height: '100%',
  },
  nightVisionOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  nightVisionText: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cameraInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#757575',
  },
});

export default LiveCameraCard;
