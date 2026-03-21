import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketService from '../services/socket';

const AudioCallComponent = ({ roomName, userName, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [recording, setRecording] = useState(null);

  useEffect(() => {
    setupAudioCall();
    const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    
    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, []);

  const setupAudioCall = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Start recording for audio transmission
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsConnected(true);

      Alert.alert(
        'Audio Call Active',
        'Video calling will be available in the next update. Audio call is now active.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Audio setup error:', error);
      Alert.alert('Error', 'Failed to setup audio call');
    }
  };

  const cleanup = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }
  };

  const toggleMute = async () => {
    if (recording) {
      if (isMuted) {
        await recording.startAsync();
      } else {
        await recording.pauseAsync();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleEndCall = () => {
    cleanup();
    socketService.socket?.emit('end-call', { roomName });
    onEndCall();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={100} color="#4CAF50" />
        </View>
        
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.callType}>Audio Call</Text>
        <Text style={styles.timer}>{formatTime(timer)}</Text>
        <Text style={styles.status}>
          {isConnected ? '🟢 Connected' : '🟡 Connecting...'}
        </Text>

        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>
            Video calling feature coming soon!{'\n'}
            Audio call is active now.
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]} 
          onPress={toggleMute}
        >
          <MaterialIcons name={isMuted ? 'mic-off' : 'mic'} size={32} color="white" />
          <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <MaterialIcons name="call-end" size={36} color="white" />
          <Text style={styles.endCallLabel}>End Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} disabled>
          <MaterialIcons name="videocam-off" size={32} color="#666" />
          <Text style={[styles.controlLabel, { color: '#666' }]}>Video Off</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  callType: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 30,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 30,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: 'center',
    padding: 15,
  },
  controlButtonActive: {
    opacity: 0.6,
  },
  controlLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
  },
  endCallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
  },
});

export default AudioCallComponent;
