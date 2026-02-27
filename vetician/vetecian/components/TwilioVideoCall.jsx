import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const TwilioVideoCall = ({ roomName, userName, token, onEndCall }) => {
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
      if (data.type === 'end-call') {
        onEndCall();
      } else if (data.type === 'error') {
        console.error('Video call error:', data.message);
        onEndCall();
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        onMessage={handleMessage}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        )}
        startInLoadingState={true}
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
});

export default TwilioVideoCall;
