import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withSequence,
} from 'react-native-reanimated';
import { COLORS } from '../../../constant/theme';

// ─── HTML template for HLS stream inside WebView ───────────────
// Uses hls.js to play any HLS (.m3u8) stream
const buildHlsHtml = (streamUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; background:#000; }
    video { width:100vw; height:100vh; object-fit:cover; }
  </style>
</head>
<body>
  <video id="video" autoplay muted playsinline controls></video>
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <script>
    var video = document.getElementById('video');
    var src   = "${streamUrl}";
    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }
  </script>
</body>
</html>
`;

// ─── Props ──────────────────────────────────────────────────────
// streamUrl   : string | null  — HLS URL from backend (camera.streamUrl)
// streamType  : 'hls' | 'demo' — type of stream
// cameraName  : string         — e.g. "Room 1 Camera"
// ───────────────────────────────────────────────────────────────

const LiveCameraCard = ({ streamUrl = null, streamType = 'demo', cameraName = 'Live Camera' }) => {
  const [isMuted,      setIsMuted]      = useState(true);
  const [nightVision,  setNightVision]  = useState(false);
  const [isRecording,  setIsRecording]  = useState(false);
  const [recordingSecs,setRecordingSecs]= useState(0);
  const [timestamp,    setTimestamp]    = useState('');
  const [streamError,  setStreamError]  = useState(false);

  const recDotOpacity = useSharedValue(1);

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now  = new Date();
      const date = now.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
      const time = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
      setTimestamp(`${date} | ${time}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Recording timer
  useEffect(() => {
    if (!isRecording) { setRecordingSecs(0); return; }
    const id = setInterval(() => setRecordingSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  // Recording dot blink
  useEffect(() => {
    if (isRecording) {
      recDotOpacity.value = withRepeat(
        withSequence(withTiming(0, { duration:500 }), withTiming(1, { duration:500 })),
        -1, false
      );
    } else {
      recDotOpacity.value = 1;
    }
  }, [isRecording]);

  const recDotStyle = useAnimatedStyle(() => ({ opacity: recDotOpacity.value }));

  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  // ── Decide what to render inside camera frame ──
  const renderStream = () => {
    // Real HLS stream from resort camera
    if (streamUrl && streamType === 'hls' && !streamError) {
      return (
        <WebView
          source={{ html: buildHlsHtml(streamUrl) }}
          style={styles.cameraFeed}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          onError={() => setStreamError(true)}
          javaScriptEnabled
        />
      );
    }

    // Demo / fallback placeholder image
    return (
      <Image
        source={{ uri: 'https://media.istockphoto.com/id/2184260648/photo/border-collie-with-owner-training-in-a-public-park.jpg?s=612x612&w=0&k=20&c=qJsZdPzCEsWL7JQkhLPRUR2KSTaipCrUl3_o8Vk_-eg=' }}
        style={styles.cameraFeed}
        resizeMode="cover"
      />
    );
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="cctv" size={20} color="#2C2C2C" />
          <Text style={styles.cardTitle}>{cameraName}</Text>
        </View>
        <View style={[styles.statusBadge, streamError && styles.statusBadgeOffline]}>
          <View style={[styles.statusDot, { backgroundColor: streamError ? '#FF5252' : '#4CAF50' }]} />
          <Text style={styles.statusText}>{streamError ? 'Offline' : 'Online'}</Text>
        </View>
      </View>

      {/* Camera Frame */}
      <View style={styles.cameraContainer}>
        {renderStream()}

        {/* Night Vision tint */}
        {nightVision && (
          <View style={styles.nightVisionTint} pointerEvents="none">
            <View style={styles.nightVisionBadge}>
              <MaterialCommunityIcons name="weather-night" size={13} color="#4CAF50" />
              <Text style={styles.nightVisionText}>Night Vision</Text>
            </View>
          </View>
        )}

        {/* Live / REC badge */}
        <View style={styles.liveBadge}>
          <Animated.View style={[styles.liveDot,
            { backgroundColor: isRecording ? '#FF5252' : '#4CAF50' },
            isRecording && recDotStyle,
          ]} />
          <Text style={styles.liveText}>
            {isRecording ? `REC ${fmt(recordingSecs)}` : 'LIVE'}
          </Text>
        </View>

        {/* Timestamp */}
        <View style={styles.timestampBadge}>
          <MaterialCommunityIcons name="clock-outline" size={11} color="#fff" />
          <Text style={styles.timestampText}>{timestamp}</Text>
        </View>

        {/* Controls */}
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={[styles.controlButton, isRecording && styles.controlButtonActive]}
            onPress={() => setIsRecording(r => !r)}
          >
            <MaterialCommunityIcons
              name="record-circle-outline" size={20}
              color={isRecording ? '#FF5252' : '#fff'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, nightVision && styles.controlButtonActive]}
            onPress={() => setNightVision(n => !n)}
          >
            <MaterialCommunityIcons name="weather-night" size={20}
              color={nightVision ? '#4CAF50' : '#fff'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={() => setIsMuted(m => !m)}>
            <Ionicons
              name={isMuted ? 'volume-mute-outline' : 'volume-high-outline'}
              size={20} color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cameraInfo}>
        <Text style={styles.infoText}>Double tap for fullscreen  •  Pinch to zoom</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    marginBottom: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  cardTitle:  { fontSize: 16, fontWeight: '700', color: '#2C2C2C', marginLeft: 8 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  statusBadgeOffline: { backgroundColor: '#FFEBEE' },
  statusDot:  { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#2C2C2C' },

  cameraContainer: {
    borderRadius: 16, overflow: 'hidden',
    backgroundColor: '#000', aspectRatio: 16 / 9,
  },
  cameraFeed: { width: '100%', height: '100%' },

  nightVisionTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 60, 0, 0.35)',
    justifyContent: 'flex-start', alignItems: 'flex-end',
    padding: 10,
  },
  nightVisionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  nightVisionText: { color: '#4CAF50', fontSize: 11, fontWeight: '600' },

  liveBadge: {
    position: 'absolute', top: 10, left: 10,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, gap: 5,
  },
  liveDot:  { width: 8, height: 8, borderRadius: 4 },
  liveText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },

  timestampBadge: {
    position: 'absolute', bottom: 50, left: 10,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 10, gap: 4,
  },
  timestampText: { color: '#fff', fontSize: 10, fontWeight: '600' },

  cameraControls: {
    position: 'absolute', bottom: 10, right: 10,
    flexDirection: 'row', gap: 8,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 22, width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  controlButtonActive: {
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },

  cameraInfo: { marginTop: 8, alignItems: 'center' },
  infoText:   { fontSize: 11, color: '#999' },
});

export default LiveCameraCard;
