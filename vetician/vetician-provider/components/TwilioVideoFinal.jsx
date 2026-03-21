import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TwilioVideoFinal = ({ roomName, userName, onEndCall }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState([]);

  const addDebug = (msg) => {
    console.log('🔍', msg);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      addDebug('Starting token fetch...');
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
      const userId = await AsyncStorage.getItem('userId');
      
      addDebug(`API URL: ${apiUrl}`);
      addDebug(`User ID: ${userId}`);
      addDebug(`Room Name: ${roomName}`);
      
      const response = await fetch(`${apiUrl}/video/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: userId || userName || 'user-' + Date.now(),
          roomName: roomName
        })
      });

      addDebug(`Response status: ${response.status}`);
      
      const data = await response.json();
      addDebug(`Response data received`);
      
      if (data.token) {
        addDebug('✅ Token received successfully');
        setToken(data.token);
        setLoading(false);
      } else {
        throw new Error(data.error || 'No token in response');
      }
    } catch (err) {
      addDebug(`❌ Error: ${err.message}`);
      setError(`Token Error: ${err.message}`);
      setLoading(false);
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      addDebug(`WebView message: ${data.type}`);
      
      if (data.type === 'log') {
        addDebug(`WebView: ${data.message}`);
      } else if (data.type === 'error') {
        addDebug(`WebView Error: ${data.message}`);
        setError(`Video Error: ${data.message}`);
      } else if (data.type === 'connected') {
        addDebug('✅ Video call connected');
        setLoading(false);
      } else if (data.type === 'end-call') {
        addDebug('Call ended by user');
        onEndCall();
      }
    } catch (err) {
      addDebug(`Message parse error: ${err.message}`);
    }
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    addDebug(`WebView error: ${nativeEvent.description}`);
    setError(`WebView Error: ${nativeEvent.description}`);
  };

  if (loading && !token) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.statusText}>Fetching token...</Text>
        <View style={styles.debugContainer}>
          {debugInfo.slice(-5).map((info, i) => (
            <Text key={i} style={styles.debugText}>{info}</Text>
          ))}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <MaterialIcons name="error-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorTitle}>Connection Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Debug Info:</Text>
          {debugInfo.map((info, i) => (
            <Text key={i} style={styles.debugText}>{info}</Text>
          ))}
        </View>
        <TouchableOpacity style={styles.retryButton} onPress={fetchToken}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={onEndCall}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="https://sdk.twilio.com/js/video/releases/2.27.0/twilio-video.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      background: #000; 
      overflow: hidden; 
      width: 100vw; 
      height: 100vh;
      position: fixed;
    }
    #remote-media { 
      width: 100vw; 
      height: 100vh; 
      position: absolute;
      background: #1a1a1a;
    }
    #remote-media video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    #local-media { 
      position: absolute; 
      top: 60px; 
      right: 20px; 
      width: 120px; 
      height: 160px; 
      border-radius: 12px; 
      overflow: hidden;
      border: 2px solid #4CAF50;
      background: #333;
    }
    #local-media video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    #controls {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 20px;
    }
    button {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      border: none;
      font-size: 24px;
      background: rgba(255,255,255,0.3);
      color: white;
    }
    #end-call { 
      background: #F44336; 
      width: 70px;
      height: 70px;
      border-radius: 35px;
    }
    .muted { background: #F44336 !important; }
    #status {
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 12px;
      max-width: 80%;
    }
  </style>
</head>
<body>
  <div id="status">Initializing...</div>
  <div id="remote-media"></div>
  <div id="local-media"></div>
  <div id="controls">
    <button id="mute-audio" onclick="toggleAudio()">🎤</button>
    <button id="end-call" onclick="endCall()">📞</button>
    <button id="mute-video" onclick="toggleVideo()">📹</button>
  </div>

  <script>
    function sendMessage(type, message) {
      window.ReactNativeWebView?.postMessage(JSON.stringify({ type, message }));
    }

    function updateStatus(msg) {
      document.getElementById('status').textContent = msg;
      sendMessage('log', msg);
    }

    const { connect } = Twilio.Video;
    let room;
    let localAudioTrack;
    let localVideoTrack;
    let audioMuted = false;
    let videoMuted = false;

    async function startCall() {
      try {
        updateStatus('Connecting to Twilio...');
        
        if (!window.Twilio || !window.Twilio.Video) {
          throw new Error('Twilio SDK not loaded');
        }

        updateStatus('Requesting permissions...');
        
        room = await connect('${token}', {
          name: '${roomName}',
          audio: true,
          video: { width: 640, height: 480, frameRate: 24 },
          bandwidthProfile: {
            video: {
              mode: 'collaboration',
              maxSubscriptionBitrate: 2500000
            }
          },
          preferredVideoCodecs: ['VP8', 'H264'],
          networkQuality: { local: 1, remote: 1 }
        });

        updateStatus('Connected to room!');
        sendMessage('connected', 'Room connected');
        
        setTimeout(() => {
          document.getElementById('status').style.display = 'none';
        }, 3000);

        // Local tracks
        room.localParticipant.tracks.forEach(publication => {
          if (publication.track) {
            const track = publication.track;
            if (track.kind === 'video') {
              document.getElementById('local-media').appendChild(track.attach());
              localVideoTrack = track;
              updateStatus('Local video attached');
            } else if (track.kind === 'audio') {
              localAudioTrack = track;
              updateStatus('Local audio attached');
            }
          }
        });

        // Remote participants
        room.participants.forEach(participantConnected);
        room.on('participantConnected', participantConnected);
        room.on('participantDisconnected', participantDisconnected);
        
        room.on('disconnected', () => {
          updateStatus('Disconnected from room');
          sendMessage('end-call', 'Room disconnected');
        });

      } catch (error) {
        updateStatus('Error: ' + error.message);
        sendMessage('error', error.message);
        console.error('Connection error:', error);
      }
    }

    function participantConnected(participant) {
      updateStatus('Participant joined: ' + participant.identity);

      participant.tracks.forEach(publication => {
        if (publication.isSubscribed) {
          trackSubscribed(publication.track);
        }
      });

      participant.on('trackSubscribed', trackSubscribed);
      participant.on('trackUnsubscribed', trackUnsubscribed);
    }

    function participantDisconnected(participant) {
      updateStatus('Participant left: ' + participant.identity);
    }

    function trackSubscribed(track) {
      if (track.kind === 'video') {
        document.getElementById('remote-media').appendChild(track.attach());
        updateStatus('Remote video connected');
      }
    }

    function trackUnsubscribed(track) {
      track.detach().forEach(element => element.remove());
    }

    function toggleAudio() {
      if (localAudioTrack) {
        if (audioMuted) {
          localAudioTrack.enable();
          document.getElementById('mute-audio').classList.remove('muted');
        } else {
          localAudioTrack.disable();
          document.getElementById('mute-audio').classList.add('muted');
        }
        audioMuted = !audioMuted;
      }
    }

    function toggleVideo() {
      if (localVideoTrack) {
        if (videoMuted) {
          localVideoTrack.enable();
          document.getElementById('mute-video').classList.remove('muted');
        } else {
          localVideoTrack.disable();
          document.getElementById('mute-video').classList.add('muted');
        }
        videoMuted = !videoMuted;
      }
    }

    function endCall() {
      if (room) {
        room.disconnect();
      }
      sendMessage('end-call', 'User ended call');
    }

    // Start call
    updateStatus('Starting call...');
    startCall();
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        mediaPlaybackRequiresUserGesture={false}
        onMessage={handleWebViewMessage}
        onError={handleWebViewError}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          addDebug(`HTTP Error: ${nativeEvent.statusCode}`);
        }}
        onPermissionRequest={(request) => {
          addDebug(`Permission requested: ${request.nativeEvent.resources.join(', ')}`);
          if (request.nativeEvent.resources.includes('camera') || 
              request.nativeEvent.resources.includes('microphone')) {
            request.nativeEvent.grant(request.nativeEvent.resources);
            addDebug('Permissions granted');
          }
        }}
        onLoadEnd={() => addDebug('WebView loaded')}
        onLoadStart={() => addDebug('WebView loading...')}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Connecting...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  errorTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  debugContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    maxHeight: 300,
  },
  debugTitle: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  debugText: {
    color: '#ccc',
    fontSize: 11,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});

export default TwilioVideoFinal;
