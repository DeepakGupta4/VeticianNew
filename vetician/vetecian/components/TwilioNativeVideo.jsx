import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  TwilioVideo, 
  TwilioVideoLocalView, 
  TwilioVideoParticipantView 
} from '@twilio/video-react-native-sdk';

const TwilioNativeVideo = ({ roomName, userName, onEndCall }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timer, setTimer] = useState(0);
  const twilioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    connectToRoom();
    timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      disconnectFromRoom();
    };
  }, []);

  const connectToRoom = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
      const userId = await AsyncStorage.getItem('userId');
      
      console.log('🔑 Fetching token for room:', roomName);
      
      const response = await fetch(`${apiUrl}/video/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: userId || userName,
          roomName: roomName
        })
      });

      const data = await response.json();
      
      if (!data.token) {
        throw new Error('No token received');
      }

      console.log('✅ Token received, connecting...');

      await TwilioVideo.connect(data.token, {
        roomName: roomName,
        enableAudio: true,
        enableVideo: true,
        enableNetworkQualityReporting: true,
        dominantSpeakerEnabled: true
      });

      console.log('✅ Connected to room');
      setIsConnected(true);

    } catch (error) {
      console.error('❌ Connection error:', error);
      Alert.alert('Connection Error', error.message);
      onEndCall();
    }
  };

  const disconnectFromRoom = () => {
    TwilioVideo.disconnect();
  };

  const toggleMute = () => {
    TwilioVideo.setLocalAudioEnabled(!isMuted);
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    TwilioVideo.setLocalVideoEnabled(!isVideoOff);
    setIsVideoOff(!isVideoOff);
  };

  const handleEndCall = () => {
    disconnectFromRoom();
    onEndCall();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Event listeners
  useEffect(() => {
    const participantConnected = TwilioVideo.addEventListener('roomDidConnect', (event) => {
      console.log('Room connected:', event);
      setIsConnected(true);
    });

    const participantAdded = TwilioVideo.addEventListener('participantConnected', (event) => {
      console.log('Participant connected:', event.participant);
      setParticipants(prev => [...prev, event.participant]);
    });

    const participantRemoved = TwilioVideo.addEventListener('participantDisconnected', (event) => {
      console.log('Participant disconnected:', event.participant);
      setParticipants(prev => prev.filter(p => p.sid !== event.participant.sid));
    });

    const roomDisconnected = TwilioVideo.addEventListener('roomDidDisconnect', (event) => {
      console.log('Room disconnected');
      onEndCall();
    });

    return () => {
      participantConnected.remove();
      participantAdded.remove();
      participantRemoved.remove();
      roomDisconnected.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Remote Video */}
      {participants.length > 0 ? (
        <TwilioVideoParticipantView
          style={styles.remoteVideo}
          key={participants[0].sid}
          trackIdentifier={{
            participantSid: participants[0].sid,
            videoTrackSid: participants[0].videoTrackSid
          }}
        />
      ) : (
        <View style={styles.waitingView}>
          <MaterialIcons name="person" size={80} color="#666" />
          <Text style={styles.waitingText}>Waiting for other participant...</Text>
        </View>
      )}

      {/* Local Video */}
      <TwilioVideoLocalView
        enabled={true}
        style={styles.localVideo}
      />

      {/* Call Info */}
      <View style={styles.callInfo}>
        <Text style={styles.callerName}>{userName}</Text>
        <Text style={styles.callTimer}>{formatTime(timer)}</Text>
        <Text style={styles.connectionStatus}>
          {isConnected ? 'Connected' : 'Connecting...'}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]} 
          onPress={toggleMute}
        >
          <MaterialIcons name={isMuted ? 'mic-off' : 'mic'} size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <MaterialIcons name="call-end" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isVideoOff && styles.controlButtonActive]} 
          onPress={toggleVideo}
        >
          <MaterialIcons name={isVideoOff ? 'videocam-off' : 'videocam'} size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  localVideo: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  waitingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
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
    bottom: 40,
    left: 0,
    right: 0,
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
});

export default TwilioNativeVideo;
