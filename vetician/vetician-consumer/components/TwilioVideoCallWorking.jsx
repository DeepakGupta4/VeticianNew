import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TwilioVideoCallWorking = ({ roomName, userName, onEndCall }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
      const userId = await AsyncStorage.getItem('userId');
      
      const response = await fetch(`${apiUrl}/video/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: userId || userName,
          roomName: roomName
        })
      });

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        setLoading(false);
      }
    } catch (error) {
      console.error('Token error:', error);
      Alert.alert('Error', 'Failed to connect to video call');
      onEndCall();
    }
  };

  if (loading || !token) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Create HTML with Twilio Video SDK
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
      top: 0;
      left: 0;
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
      z-index: 10;
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
      z-index: 20;
    }
    button {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      border: none;
      font-size: 24px;
      cursor: pointer;
      background: rgba(255,255,255,0.3);
      color: white;
      display: flex;
      align-items: center;
      justify-Content: center;
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
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10;
    }
  </style>
</head>
<body>
  <div id="status">Connecting...</div>
  <div id="remote-media"></div>
  <div id="local-media"></div>
  <div id="controls">
    <button id="mute-audio" onclick="toggleAudio()">🎤</button>
    <button id="end-call" onclick="endCall()">📞</button>
    <button id="mute-video" onclick="toggleVideo()">📹</button>
  </div>

  <script>
    const { connect, createLocalVideoTrack } = Twilio.Video;
    let room;
    let localAudioTrack;
    let localVideoTrack;
    let audioMuted = false;
    let videoMuted = false;

    async function startCall() {
      try {
        document.getElementById('status').textContent = 'Connecting...';
        
        room = await connect('${token}', {
          name: '${roomName}',
          audio: true,
          video: { width: 640, height: 480, frameRate: 24 }
        });

        console.log('Connected to room:', room.name);
        document.getElementById('status').textContent = 'Connected';
        setTimeout(() => {
          document.getElementById('status').style.display = 'none';
        }, 2000);

        // Local tracks
        room.localParticipant.tracks.forEach(publication => {
          if (publication.track) {
            const track = publication.track;
            if (track.kind === 'video') {
              document.getElementById('local-media').appendChild(track.attach());
              localVideoTrack = track;
            } else if (track.kind === 'audio') {
              localAudioTrack = track;
            }
          }
        });

        // Remote participants
        room.participants.forEach(participantConnected);
        room.on('participantConnected', participantConnected);
        room.on('participantDisconnected', participantDisconnected);

      } catch (error) {
        console.error('Connection error:', error);
        document.getElementById('status').textContent = 'Connection failed';
        window.ReactNativeWebView?.postMessage(JSON.stringify({ 
          type: 'error', 
          message: error.message 
        }));
      }
    }

    function participantConnected(participant) {
      console.log('Participant connected:', participant.identity);

      participant.tracks.forEach(publication => {
        if (publication.isSubscribed) {
          trackSubscribed(publication.track);
        }
      });

      participant.on('trackSubscribed', trackSubscribed);
      participant.on('trackUnsubscribed', trackUnsubscribed);
    }

    function participantDisconnected(participant) {
      console.log('Participant disconnected:', participant.identity);
    }

    function trackSubscribed(track) {
      if (track.kind === 'video') {
        document.getElementById('remote-media').appendChild(track.attach());
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
      window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'end-call' }));
    }

    // Start call
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
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === 'end-call' || data.type === 'error') {
            onEndCall();
          }
        }}
        onPermissionRequest={(request) => {
          if (request.nativeEvent.resources.includes('camera') || 
              request.nativeEvent.resources.includes('microphone')) {
            request.nativeEvent.grant(request.nativeEvent.resources);
          }
        }}
      />
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default TwilioVideoCallWorking;
