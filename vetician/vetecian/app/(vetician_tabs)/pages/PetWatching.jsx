import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, SafeAreaView, Switch
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import CommonHeader from '../../../components/CommonHeader';

const { width } = Dimensions.get('window');

export default function PetWatchingScreen() {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Pet Watching" />
      
      {/* Coming Soon Overlay */}
      <View style={styles.comingSoonOverlay}>
        <MaterialIcons name="construction" size={60} color="#24A1DE" />
        <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
        <Text style={styles.comingSoonText}>Pet Watching feature is under development. We'll notify you once it's ready.</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={{opacity: 0.3}}>
        
        {/* --- Live Video Feed (Placeholder) --- */}
        <View style={styles.videoContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1541599540903-216a46ca1df0?q=80&w=1000' }} 
            style={styles.liveVideo}
          />
          <View style={styles.videoOverlay}>
            <Text style={styles.timestamp}>05 Feb 2026 | 02:30 PM</Text>
          </View>
          
          {/* Zoom & Fullscreen Controls */}
          <TouchableOpacity style={styles.fullScreenBtn}>
            <MaterialIcons name="fullscreen" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* --- Remote Controls --- */}
        <View style={styles.controlPanel}>
          <TouchableOpacity 
            style={[styles.controlBtn, isMicOn && styles.activeBtn]} 
            onPress={() => setIsMicOn(!isMicOn)}
          >
            <Ionicons name={isMicOn ? "mic" : "mic-off"} size={28} color={isMicOn ? "#fff" : "#444"} />
            <Text style={[styles.btnLabel, isMicOn && {color: '#fff'}]}>Talk</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlBtn, isRecording && styles.activeBtnRed]} 
            onPress={() => setIsRecording(!isRecording)}
          >
            <MaterialIcons name="videocam" size={28} color={isRecording ? "#fff" : "#444"} />
            <Text style={[styles.btnLabel, isRecording && {color: '#fff'}]}>Record</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn}>
            <MaterialIcons name="photo-camera" size={28} color="#444" />
            <Text style={styles.btnLabel}>Snapshot</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlBtn, {backgroundColor: '#FFF9C4'}]}>
            <FontAwesome5 name="bone" size={24} color="#FBC02D" />
            <Text style={[styles.btnLabel, {color: '#FBC02D'}]}>Treat</Text>
          </TouchableOpacity>
        </View>

        {/* --- Pet AI Status --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Analysis</Text>
          <View style={styles.statusCard}>
            <MaterialCommunityIcons name="dog" size={30} color="#24A1DE" />
            <View style={styles.statusInfo}>
              <Text style={styles.statusText}>Milo is <Text style={{fontWeight: 'bold'}}>Sleeping</Text></Text>
              <Text style={styles.statusSub}>Last active: 15 mins ago</Text>
            </View>
            <MaterialIcons name="trending-up" size={24} color="#10B981" />
          </View>
        </View>

        {/* --- Recent Moments --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Moments</Text>
            <TouchableOpacity><Text style={styles.seeAll}>View Gallery</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((id) => (
              <View key={id} style={styles.momentCard}>
                <Image 
                  source={{ uri: `https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=200` }} 
                  style={styles.momentImg}
                />
                <Text style={styles.momentTime}>Today, 10:20 AM</Text>
              </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  
  comingSoonOverlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 40
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#24A1DE',
    marginTop: 20,
    marginBottom: 10
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24
  },

  videoContainer: { width: width - 32, height: 220, alignSelf: 'center', backgroundColor: '#000', borderRadius: 15, marginTop: 10, overflow: 'hidden' },
  liveVideo: { width: '100%', height: '100%', opacity: 0.9 },
  videoOverlay: { position: 'absolute', top: 15, left: 15 },
  timestamp: { color: '#fff', fontSize: 12, backgroundColor: 'rgba(0,0,0,0.4)', padding: 4, borderRadius: 4 },
  fullScreenBtn: { position: 'absolute', bottom: 15, right: 15 },

  controlPanel: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: '#fff', marginTop: 15 },
  controlBtn: { alignItems: 'center', justifyContent: 'center', width: 75, height: 75, borderRadius: 15, backgroundColor: '#f0f0f0' },
  activeBtn: { backgroundColor: '#24A1DE' },
  activeBtnRed: { backgroundColor: '#FF5252' },
  btnLabel: { fontSize: 11, marginTop: 5, color: '#666', fontWeight: '500' },

  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  seeAll: { color: '#24A1DE', fontSize: 13 },

  statusCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  statusInfo: { flex: 1, marginLeft: 15 },
  statusText: { fontSize: 16, color: '#444' },
  statusSub: { fontSize: 12, color: '#999' },

  momentCard: { marginRight: 15, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', padding: 5 },
  momentImg: { width: 140, height: 100, borderRadius: 8 },
  momentTime: { fontSize: 11, color: '#666', marginTop: 5, textAlign: 'center' }
});