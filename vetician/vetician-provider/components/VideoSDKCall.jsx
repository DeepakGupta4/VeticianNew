import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Only import VideoSDK on mobile platforms
let MeetingProvider, useMeeting, useParticipant, RTCView, MediaStream;

if (Platform.OS !== 'web') {
  try {
    const videoSDK = require('@videosdk.live/react-native-sdk');
    MeetingProvider = videoSDK.MeetingProvider;
    useMeeting = videoSDK.useMeeting;
    useParticipant = videoSDK.useParticipant;
    RTCView = videoSDK.RTCView;
    const webrtc = require('react-native-webrtc');
    MediaStream = webrtc.MediaStream;
  } catch (error) {
    console.log('VideoSDK not available on this platform');
  }
}

function ParticipantView({ participantId }) {
  const { webcamStream, webcamOn } = useParticipant(participantId);

  return webcamOn && webcamStream ? (
    <RTCView
      streamURL={new MediaStream([webcamStream.track]).toURL()}
      objectFit="cover"
      style={styles.remoteVideo}
    />
  ) : (
    <View style={styles.noVideo}>
      <MaterialIcons name="person" size={80} color="#666" />
      <Text style={styles.noVideoText}>Camera Off</Text>
    </View>
  );
}

function MeetingView({ onEndCall, userName }) {
  const [timer, setTimer] = useState(0);
  const { join, leave, toggleMic, toggleWebcam, participants, localParticipant } = useMeeting({
    onMeetingJoined: () => {
      console.log('Meeting joined');
    },
    onMeetingLeft: () => {
      console.log('Meeting left');
      onEndCall();
    },
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    join();
    const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMic = () => {
    toggleMic();
    setIsMuted(!isMuted);
  };

  const handleToggleWebcam = () => {
    toggleWebcam();
    setIsVideoOff(!isVideoOff);
  };

  const handleEndCall = () => {
    leave();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const participantIds = [...participants.keys()];

  return (
    <View style={styles.container}>
      {/* Remote Video */}
      {participantIds.length > 0 ? (
        <ParticipantView participantId={participantIds[0]} />
      ) : (
        <View style={styles.waitingView}>
          <MaterialIcons name="person" size={80} color="#666" />
          <Text style={styles.waitingText}>Waiting for other participant...</Text>
        </View>
      )}

      {/* Local Video */}
      {localParticipant && (
        <View style={styles.localVideoContainer}>
          <ParticipantView participantId={localParticipant.id} />
        </View>
      )}

      {/* Call Info */}
      <View style={styles.callInfo}>
        <Text style={styles.callerName}>{userName}</Text>
        <Text style={styles.callTimer}>{formatTime(timer)}</Text>
        <Text style={styles.connectionStatus}>Connected</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]} 
          onPress={handleToggleMic}
        >
          <MaterialIcons name={isMuted ? 'mic-off' : 'mic'} size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <MaterialIcons name="call-end" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isVideoOff && styles.controlButtonActive]} 
          onPress={handleToggleWebcam}
        >
          <MaterialIcons name={isVideoOff ? 'videocam-off' : 'videocam'} size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const VideoSDKCall = ({ roomName, userName, onEndCall }) => {
  // VideoSDK only works on mobile
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={60} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Not Available on Web</Text>
          <Text style={styles.errorText}>VideoSDK calls are only available on mobile devices.</Text>
          <Text style={styles.errorText}>Please use the mobile app for video calls.</Text>
          <TouchableOpacity style={styles.backButton} onPress={onEndCall}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
      const userId = await AsyncStorage.getItem('userId');
      
      const response = await fetch(`${apiUrl}/videosdk/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: roomName,
          participantId: userId || userName
        })
      });

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        setLoading(false);
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Token fetch error:', error);
      Alert.alert('Error', 'Failed to get video token');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Connecting...</Text>
      </View>
    );
  }

  return (
    <MeetingProvider
      config={{
        meetingId: roomName,
        micEnabled: true,
        webcamEnabled: true,
        name: userName,
      }}
      token={token}
    >
      <MeetingView onEndCall={onEndCall} userName={userName} />
    </MeetingProvider>
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
  localVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  noVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  noVideoText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
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
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 30,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default VideoSDKCall;
