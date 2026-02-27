import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import socketService from '../services/socket';

export default function SimpleVideoCall({ token, roomName, onCallEnd, remoteUserData, isInitiator, callId, socket }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timer, setTimer] = useState(0);
  const [connectionState, setConnectionState] = useState('connecting');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const iceCandidatesQueue = useRef([]);

  useEffect(() => {
    initializeCall();
    
    // Setup call end listener
    const handleCallEndEvent = (data) => {
      if (data.roomName === roomName) {
        console.log('📴 Call ended by remote user');
        handleEndCall();
      }
    };
    
    socketService.socket?.on('call-ended', handleCallEndEvent);
    
    return () => {
      socketService.socket?.off('call-ended', handleCallEndEvent);
      cleanup();
    };
  }, []);

  const initializeCall = async () => {
    try {
      console.log('📹 Initializing WebRTC call...');
      
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Create peer connection
      await createPeerConnection();
      
      // Setup socket listeners
      setupSocketListeners();
      
      // Join call room
      const socketToUse = socket || socketService.socket;
      socketToUse?.emit('join-call', { roomName, userId: 'user-' + Date.now() });
      
      console.log('🔵 Joined room:', roomName, 'isInitiator:', isInitiator);
      
      startTimer();
      
    } catch (error) {
      console.error('❌ Error initializing call:', error);
      Alert.alert('Error', 'Failed to access camera/microphone');
      handleEndCall();
    }
  };

  const createPeerConnection = async () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    peerConnectionRef.current = new RTCPeerConnection(configuration);

    // Add local stream tracks
    localStreamRef.current.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    // Handle remote stream
    peerConnectionRef.current.ontrack = (event) => {
      console.log('📹 Remote track received');
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setConnectionState('connected');
      }
    };

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        const socketToUse = socket || socketService.socket;
        socketToUse?.emit('ice-candidate', {
          roomName,
          candidate: event.candidate
        });
      }
    };

    // Connection state
    peerConnectionRef.current.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnectionRef.current.connectionState);
      setConnectionState(peerConnectionRef.current.connectionState);
    };

    // Create and send offer if initiator
    if (isInitiator) {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      const socketToUse = socket || socketService.socket;
      console.log('📤 Sending offer to room:', roomName);
      socketToUse?.emit('offer', { roomName, offer });
    }
  };

  const setupSocketListeners = () => {
    const socketToUse = socket || socketService.socket;
    if (!socketToUse) return;

    // Remove old listeners first
    socketToUse.off('offer');
    socketToUse.off('answer');
    socketToUse.off('ice-candidate');

    // Handle offer (only for non-initiator)
    if (!isInitiator) {
      socketToUse.on('offer', async (data) => {
        if (data.roomName !== roomName) return;
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
          // Process queued ICE candidates
          while (iceCandidatesQueue.current.length > 0) {
            const candidate = iceCandidatesQueue.current.shift();
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socketToUse.emit('answer', { roomName, answer });
        }
      });
    }

    // Handle answer (only for initiator)
    if (isInitiator) {
      socketToUse.on('answer', async (data) => {
        if (data.roomName !== roomName) return;
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          // Process queued ICE candidates
          while (iceCandidatesQueue.current.length > 0) {
            const candidate = iceCandidatesQueue.current.shift();
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        }
      });
    }

    // Handle ICE candidate
    socketToUse.on('ice-candidate', async (data) => {
      if (data.roomName !== roomName) return;
      if (peerConnectionRef.current && data.candidate) {
        if (peerConnectionRef.current.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else {
          iceCandidatesQueue.current.push(data.candidate);
        }
      }
    });
  };

  const startTimer = () => {
    timerIntervalRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
  };

  const cleanup = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    // Remove socket listeners
    if (socketService.socket) {
      socketService.socket.off('offer');
      socketService.socket.off('answer');
      socketService.socket.off('ice-candidate');
    }
  };

  const handleEndCall = () => {
    cleanup();
    const socketToUse = socket || socketService.socket;
    socketToUse?.emit('end-call', { callId, roomName });
    onCallEnd();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Video calls only supported on web</Text>
        <TouchableOpacity style={styles.endButton} onPress={handleEndCall}>
          <Text style={styles.endButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <video ref={remoteVideoRef} autoPlay playsInline style={styles.remoteVideo} />
      <video ref={localVideoRef} autoPlay playsInline muted style={styles.localVideo} />
      
      <View style={styles.callInfo}>
        <Text style={styles.callerName}>{remoteUserData?.name || 'User'}</Text>
        <Text style={styles.callTimer}>{formatTime(timer)}</Text>
        <Text style={styles.connectionStatus}>{connectionState}</Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlButton, isMuted && styles.controlButtonActive]} onPress={toggleMute}>
          <MaterialIcons name={isMuted ? 'mic-off' : 'mic'} size={28} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <MaterialIcons name="call-end" size={32} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.controlButton, isVideoOff && styles.controlButtonActive]} onPress={toggleVideo}>
          <MaterialIcons name={isVideoOff ? 'videocam-off' : 'videocam'} size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  remoteVideo: { width: '100%', height: '100%', objectFit: 'cover' },
  localVideo: { position: 'absolute', top: 60, right: 20, width: 120, height: 160, borderRadius: 12, objectFit: 'cover', border: '2px solid white' },
  callInfo: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 8 },
  callerName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  callTimer: { color: 'white', fontSize: 14, marginTop: 4 },
  connectionStatus: { color: '#4CAF50', fontSize: 12, marginTop: 4 },
  controls: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 },
  controlButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  controlButtonActive: { backgroundColor: '#FF3B30' },
  endCallButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'white', fontSize: 16, textAlign: 'center', marginTop: 100 },
  endButton: { backgroundColor: '#FF3B30', padding: 16, borderRadius: 8, margin: 20, alignItems: 'center' },
  endButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
