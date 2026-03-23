import React from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

const TwilioVideoCall = ({ roomName, userName, token, onEndCall }) => {
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // WebView doesn't support getUserMedia on Android
  return (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Video Call Feature Coming Soon</Text>
        <Text style={styles.errorSubtext}>We're working on implementing native video calling. This feature will be available in the next update.</Text>
        <TouchableOpacity style={styles.backButton} onPress={onEndCall}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://sdk.twilio.com/js/video/releases/2.27.0/twilio-video.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; overflow: hidden; }
    #remote-media { width: 100vw; height: 100vh; }
    #local-media { 
      position: absolute; 
      top: 20px; 
      right: 20px; 
      width: 120px; 
      height: 160px; 
      border-radius: 8px; 
      overflow: hidden;
      border: 2px solid #4CAF50;
    }
    video { width: 100%; height: 100%; object-fit: cover; }
    #controls {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 15px;
    }
    button {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }
    #end-call { background: #F44336; }
    #mute-audio { background: #333; }
    #mute-video { background: #333; }
  </style>
</head>
<body>
  <div id="remote-media"></div>
  <div id="local-media"></div>
  <div id="controls">
    <button id="mute-audio" onclick="toggleAudio()">🎤</button>
    <button id="end-call" onclick="endCall()">📞</button>
    <button id="mute-video" onclick="toggleVideo()">📹</button>
  </div>

  <script>
    const Twilio = window.Twilio;
    let room;
    let localAudioTrack;
    let localVideoTrack;
    let audioMuted = false;
    let videoMuted = false;

    async function connectToRoom() {
      try {
        room = await Twilio.Video.connect('${token}', {
          name: '${roomName}',
          audio: true,
          video: { width: 640 }
        });

        console.log('Connected to room:', room.name);

        // Attach local tracks
        room.localParticipant.tracks.forEach(publication => {
          if (publication.track) {
            document.getElementById('local-media').appendChild(publication.track.attach());
            if (publication.track.kind === 'audio') localAudioTrack = publication.track;
            if (publication.track.kind === 'video') localVideoTrack = publication.track;
          }
        });

        // Handle remote participants
        room.participants.forEach(participantConnected);
        room.on('participantConnected', participantConnected);
        room.on('participantDisconnected', participantDisconnected);

      } catch (error) {
        console.error('Error connecting:', error);
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: error.message }));
      }
    }

    function participantConnected(participant) {
      console.log('Participant connected:', participant.identity);

      participant.tracks.forEach(publication => {
        if (publication.isSubscribed) {
          attachTrack(publication.track);
        }
      });

      participant.on('trackSubscribed', attachTrack);
      participant.on('trackUnsubscribed', detachTrack);
    }

    function participantDisconnected(participant) {
      console.log('Participant disconnected:', participant.identity);
    }

    function attachTrack(track) {
      document.getElementById('remote-media').appendChild(track.attach());
    }

    function detachTrack(track) {
      track.detach().forEach(element => element.remove());
    }

    function toggleAudio() {
      if (localAudioTrack) {
        if (audioMuted) {
          localAudioTrack.enable();
          document.getElementById('mute-audio').style.background = '#333';
        } else {
          localAudioTrack.disable();
          document.getElementById('mute-audio').style.background = '#F44336';
        }
        audioMuted = !audioMuted;
      }
    }

    function toggleVideo() {
      if (localVideoTrack) {
        if (videoMuted) {
          localVideoTrack.enable();
          document.getElementById('mute-video').style.background = '#333';
        } else {
          localVideoTrack.disable();
          document.getElementById('mute-video').style.background = '#F44336';
        }
        videoMuted = !videoMuted;
      }
    }

    function endCall() {
      if (room) {
        room.disconnect();
      }
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'end-call' }));
    }

    // Start connection
    connectToRoom();
  </script>
</body>
</html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', data);
      
      if (data.type === 'end-call') {
        onEndCall();
      } else if (data.type === 'error') {
        console.error('Video call error:', data.message);
        setError(data.message);
        setLoading(false);
      } else if (data.type === 'connected') {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      setError('Failed to parse WebView message');
    }
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError('WebView failed to load: ' + nativeEvent.description);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Connecting to video call...</Text>
        </View>
      )}
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        onMessage={handleMessage}
        onError={handleError}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('HTTP error:', nativeEvent.statusCode);
          setError(`HTTP Error: ${nativeEvent.statusCode}`);
        }}
        onPermissionRequest={(request) => {
          console.log('Permission requested:', request.nativeEvent.resources);
          if (request.nativeEvent.resources.includes('camera') || 
              request.nativeEvent.resources.includes('microphone')) {
            request.nativeEvent.grant(request.nativeEvent.resources);
          }
        }}
        onLoadEnd={() => {
          console.log('WebView loaded');
          setTimeout(() => setLoading(false), 2000);
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 999,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
});

export default TwilioVideoCall;
