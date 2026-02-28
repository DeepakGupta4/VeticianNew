import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TwilioNativeVideoCall = ({ roomName, userName, onEndCall }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    fetchTwilioToken();
    const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTwilioToken = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
      const userId = await AsyncStorage.getItem('userId');
      
      console.log('🔑 Fetching Twilio token for room:', roomName);
      
      const response = await fetch(`${apiUrl}/video/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: userId || userName,
          roomName: roomName
        })
      });

      const data = await response.json();
      
      if (response.ok && data.token) {
        console.log('✅ Token received');
        setToken(data.token);
        setLoading(false);
      } else {
        throw new Error(data.error || 'Failed to get token');
      }
    } catch (err) {
      console.error('❌ Token fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Connecting to video call...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#FF3B30" />
          <Text style={styles.errorText}>Connection Error</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity style={styles.backButton} onPress={onEndCall}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // For now, show a placeholder with call controls
  // Native Twilio SDK integration will be added here
  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <View style={styles.placeholderVideo}>
          <MaterialIcons name="videocam" size={80} color="#666" />
          <Text style={styles.placeholderText}>Video Call Active</Text>
          <Text style={styles.roomText}>Room: {roomName}</Text>
        </View>
      </View>

      <View style={styles.callInfo}>
        <Text style={styles.callerName}>{userName}</Text>
        <Text style={styles.callTimer}>{formatTime(timer)}</Text>
        <Text style={styles.connectionStatus}>Connected</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]} 
          onPress={() => setIsMuted(!isMuted)}
        >
          <MaterialIcons name={isMuted ? 'mic-off' : 'mic'} size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallButton} onPress={onEndCall}>
          <MaterialIcons name="call-end" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isVideoOff && styles.controlButtonActive]} 
          onPress={() => setIsVideoOff(!isVideoOff)}
        >
          <MaterialIcons name={isVideoOff ? 'videocam-off' : 'videocam'} size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          📱 Native video calling will be available in the next update.
        </Text>
        <Text style={styles.infoSubtext}>
          Audio call is active. Video streaming coming soon.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorSubtext: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderVideo: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  roomText: {
    color: '#999',
    fontSize: 14,
    marginTop: 10,
  },
  callInfo: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 8,
  },
  callerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  callTimer: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },
  connectionStatus: {
    color: '#4CAF50',
    fontSize: 12,
    marginTop: 4,
  },
  controls: {
    position: 'absolute',
    bottom: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#FF3B30',
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  infoSubtext: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default TwilioNativeVideoCall;
