import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { io } from 'socket.io-client';
import TwilioNativeVideoCall from '../../../components/TwilioNativeVideoCall';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'https://vetician-backend-kovk.onrender.com';

export default function VideoCallScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [callState, setCallState] = useState('calling');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [ringTimer, setRingTimer] = useState(30);
  const [actualRoomName, setActualRoomName] = useState(params.roomName);
  const ringIntervalRef = useRef(null);
  const socketRef = useRef(null);
  const listenersSetup = useRef(false);

  useEffect(() => {
    let mounted = true;

    const setupCall = async () => {
      const userId = await AsyncStorage.getItem('userId');
      console.log('🔵 Setting up call for userId:', userId);
      
      // Create dedicated socket for this call
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: false,
        forceNew: true
      });

      // Wait for connection then join
      socketRef.current.on('connect', () => {
        console.log('🔵 Socket connected, joining rooms');
        socketRef.current.emit('join-petparent', userId);
        socketRef.current.emit('join-call', {
          roomName: params.roomName,
          userId: 'pet-parent-' + Date.now()
        });
        console.log('✅ Joined rooms:', userId, params.roomName);
      });

      // Setup listeners AFTER connection
      socketRef.current.on('call-accepted', (data) => {
        console.log('✅ Call accepted event received:', data);
        if (mounted) {
          if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
          setActualRoomName(data.roomName);
          setCallState('connected');
          setShowVideoCall(true);
        }
      });

      socketRef.current.on('call-rejected', (data) => {
        console.log('❌ Call rejected event received:', data);
        if (mounted) {
          if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
          setCallState('ended');
          setTimeout(() => router.back(), 2000);
        }
      });

      listenersSetup.current = true;
    };

    setupCall();

    // Start ring timer
    ringIntervalRef.current = setInterval(() => {
      setRingTimer(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      mounted = false;
      if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleTimeout = () => {
    setCallState('timeout');
    if (socketRef.current) {
      socketRef.current.emit('end-call', {
        callId: params.callId,
        roomName: params.roomName
      });
    }
    setTimeout(() => router.back(), 2000);
  };

  const handleEndCall = () => {
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    if (socketRef.current) {
      socketRef.current.emit('end-call', {
        callId: params.callId,
        roomName: params.roomName
      });
    }
    router.back();
  };

  if (showVideoCall) {
    return (
      <TwilioNativeVideoCall
        roomName={actualRoomName}
        userName={params.receiverName || 'Pet Parent'}
        onEndCall={handleEndCall}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: params.receiverImg || 'https://ui-avatars.com/api/?name=Doctor&size=150' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{params.receiverName || 'Doctor'}</Text>
        <Text style={styles.status}>
          {callState === 'calling' ? `Calling... (${ringTimer}s)` : 
           callState === 'timeout' ? 'No Answer' :
           callState === 'ended' ? 'Call Ended' : 'Connecting...'}
        </Text>
      </View>

      <TouchableOpacity style={styles.endButton} onPress={handleEndCall}>
        <MaterialIcons name="call-end" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    color: '#999',
  },
  endButton: {
    alignSelf: 'center',
    backgroundColor: '#FF3B30',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
