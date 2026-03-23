// import React, { useState } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   Image, Dimensions, SafeAreaView, Switch
// } from 'react-native';
// import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
// import CommonHeader from '../../../components/CommonHeader';

// const { width } = Dimensions.get('window');

// export default function PetWatchingScreen() {
//   const [isMicOn, setIsMicOn] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);

//   return (
//     <SafeAreaView style={styles.container}>
//       <CommonHeader title="Pet Watching" />
//       <ScrollView showsVerticalScrollIndicator={false}>
        
//         {/* --- Live Video Feed (Placeholder) --- */}
//         <View style={styles.videoContainer}>
//           <Image 
//             source={{ uri: 'https://images.unsplash.com/photo-1541599540903-216a46ca1df0?q=80&w=1000' }} 
//             style={styles.liveVideo}
//           />
//           <View style={styles.videoOverlay}>
//             <Text style={styles.timestamp}>05 Feb 2026 | 02:30 PM</Text>
//           </View>
          
//           {/* Zoom & Fullscreen Controls */}
//           <TouchableOpacity style={styles.fullScreenBtn}>
//             <MaterialIcons name="fullscreen" size={28} color="white" />
//           </TouchableOpacity>
//         </View>

//         {/* --- Remote Controls --- */}
//         <View style={styles.controlPanel}>
//           <TouchableOpacity 
//             style={[styles.controlBtn, isMicOn && styles.activeBtn]} 
//             onPress={() => setIsMicOn(!isMicOn)}
//           >
//             <Ionicons name={isMicOn ? "mic" : "mic-off"} size={28} color={isMicOn ? "#fff" : "#444"} />
//             <Text style={[styles.btnLabel, isMicOn && {color: '#fff'}]}>Talk</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.controlBtn, isRecording && styles.activeBtnRed]} 
//             onPress={() => setIsRecording(!isRecording)}
//           >
//             <MaterialIcons name="videocam" size={28} color={isRecording ? "#fff" : "#444"} />
//             <Text style={[styles.btnLabel, isRecording && {color: '#fff'}]}>Record</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.controlBtn}>
//             <MaterialIcons name="photo-camera" size={28} color="#444" />
//             <Text style={styles.btnLabel}>Snapshot</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={[styles.controlBtn, {backgroundColor: '#FFF9C4'}]}>
//             <FontAwesome5 name="bone" size={24} color="#FBC02D" />
//             <Text style={[styles.btnLabel, {color: '#FBC02D'}]}>Treat</Text>
//           </TouchableOpacity>
//         </View>

//         {/* --- Pet AI Status --- */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Activity Analysis</Text>
//           <View style={styles.statusCard}>
//             <MaterialCommunityIcons name="dog" size={30} color="#24A1DE" />
//             <View style={styles.statusInfo}>
//               <Text style={styles.statusText}>Milo is <Text style={{fontWeight: 'bold'}}>Sleeping</Text></Text>
//               <Text style={styles.statusSub}>Last active: 15 mins ago</Text>
//             </View>
//             <MaterialIcons name="trending-up" size={24} color="#10B981" />
//           </View>
//         </View>

//         {/* --- Recent Moments --- */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Recent Moments</Text>
//             <TouchableOpacity><Text style={styles.seeAll}>View Gallery</Text></TouchableOpacity>
//           </View>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {[1, 2, 3].map((id) => (
//               <View key={id} style={styles.momentCard}>
//                 <Image 
//                   source={{ uri: `https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=200` }} 
//                   style={styles.momentImg}
//                 />
//                 <Text style={styles.momentTime}>Today, 10:20 AM</Text>
//               </View>
//             ))}
//           </ScrollView>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f7fa' },

//   videoContainer: { width: width - 32, height: 220, alignSelf: 'center', backgroundColor: '#000', borderRadius: 15, marginTop: 10, overflow: 'hidden' },
//   liveVideo: { width: '100%', height: '100%', opacity: 0.9 },
//   videoOverlay: { position: 'absolute', top: 15, left: 15 },
//   timestamp: { color: '#fff', fontSize: 12, backgroundColor: 'rgba(0,0,0,0.4)', padding: 4, borderRadius: 4 },
//   fullScreenBtn: { position: 'absolute', bottom: 15, right: 15 },

//   controlPanel: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: '#fff', marginTop: 15 },
//   controlBtn: { alignItems: 'center', justifyContent: 'center', width: 75, height: 75, borderRadius: 15, backgroundColor: '#f0f0f0' },
//   activeBtn: { backgroundColor: '#24A1DE' },
//   activeBtnRed: { backgroundColor: '#FF5252' },
//   btnLabel: { fontSize: 11, marginTop: 5, color: '#666', fontWeight: '500' },

//   section: { padding: 20 },
//   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
//   seeAll: { color: '#24A1DE', fontSize: 13 },

//   statusCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
//   statusInfo: { flex: 1, marginLeft: 15 },
//   statusText: { fontSize: 16, color: '#444' },
//   statusSub: { fontSize: 12, color: '#999' },

//   momentCard: { marginRight: 15, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', padding: 5 },
//   momentImg: { width: 140, height: 100, borderRadius: 8 },
//   momentTime: { fontSize: 11, color: '#666', marginTop: 5, textAlign: 'center' }
// });

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  Card,
  Chip,
  IconButton,
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
  Divider,
} from 'react-native-paper';
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import CommonHeader from '../../../components/CommonHeader';

const { width } = Dimensions.get('window');

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7CB342',
    secondary: '#558B2F',
    tertiary: '#558B2F',
    error: '#EF4444',
    background: '#F5F7FA',
  },
};

export default function PetWatchingScreen() {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Animated recording indicator
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isRecording, pulseAnim]);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <CommonHeader title="Pet Watching" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* --- Live Video Feed --- */}
          <View style={styles.videoSection}>
            <Surface style={styles.videoContainer}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1541599540903-216a46ca1df0?q=80&w=1000',
                }}
                style={styles.liveVideo}
              />

              {/* Live Badge */}
              <View style={styles.liveBadge}>
                <Animated.View
                  style={[
                    styles.recordingDot,
                    { opacity: isRecording ? pulseAnim : 1 },
                  ]}
                >
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: isRecording ? '#FF5252' : '#10B981' },
                    ]}
                  />
                </Animated.View>
                <Text style={styles.liveText}>
                  {isRecording ? 'RECORDING' : 'LIVE'}
                </Text>
              </View>

              {/* Timestamp */}
              <View style={styles.timestampBadge}>
                <MaterialIcons name="access-time" size={12} color="#fff" />
                <Text style={styles.timestamp}>05 Feb 2026 | 02:30 PM</Text>
              </View>

              {/* Fullscreen Button */}
              <IconButton
                icon="fullscreen"
                iconColor="#fff"
                size={28}
                style={styles.fullscreenBtn}
                onPress={() => {}}
              />
            </Surface>
          </View>

          {/* --- Control Panel --- */}
          <Surface style={styles.controlPanel}>
            <View style={styles.controlGrid}>
              {/* Talk Button */}
              <TouchableOpacity
                onPress={() => setIsMicOn(!isMicOn)}
                style={styles.controlBtnWrapper}
              >
                <Surface
                  style={[
                    styles.controlBtn,
                    isMicOn && styles.controlBtnActive,
                  ]}
                >
                  <Ionicons
                    name={isMicOn ? 'mic' : 'mic-off'}
                    size={32}
                    color={isMicOn ? '#fff' : theme.colors.primary}
                  />
                </Surface>
                <Text
                  variant="labelSmall"
                  style={[
                    styles.controlLabel,
                    isMicOn && styles.controlLabelActive,
                  ]}
                >
                  Talk
                </Text>
              </TouchableOpacity>

              {/* Record Button */}
              <TouchableOpacity
                onPress={() => setIsRecording(!isRecording)}
                style={styles.controlBtnWrapper}
              >
                <Surface
                  style={[
                    styles.controlBtn,
                    isRecording && styles.controlBtnRecording,
                  ]}
                >
                  <MaterialIcons
                    name="videocam"
                    size={32}
                    color={isRecording ? '#fff' : theme.colors.primary}
                  />
                </Surface>
                <Text
                  variant="labelSmall"
                  style={[
                    styles.controlLabel,
                    isRecording && styles.controlLabelActive,
                  ]}
                >
                  Record
                </Text>
              </TouchableOpacity>

              {/* Snapshot Button */}
              <TouchableOpacity style={styles.controlBtnWrapper}>
                <Surface style={styles.controlBtn}>
                  <MaterialIcons
                    name="photo-camera"
                    size={32}
                    color={theme.colors.primary}
                  />
                </Surface>
                <Text variant="labelSmall" style={styles.controlLabel}>
                  Photo
                </Text>
              </TouchableOpacity>

              {/* Treat Button */}
              <TouchableOpacity style={styles.controlBtnWrapper}>
                <Surface style={[styles.controlBtn, styles.treatBtn]}>
                  <FontAwesome5 name="bone" size={28} color="#FBC02D" />
                </Surface>
                <Text
                  variant="labelSmall"
                  style={[styles.controlLabel, { color: '#FBC02D' }]}
                >
                  Treat
                </Text>
              </TouchableOpacity>
            </View>
          </Surface>

          {/* --- Pet Activity Status --- */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Activity Analysis
            </Text>

            <Card style={styles.statusCard}>
              <Card.Content style={styles.statusCardContent}>
                <View style={styles.statusIconContainer}>
                  <MaterialCommunityIcons
                    name="dog"
                    size={40}
                    color={theme.colors.primary}
                  />
                </View>

                <View style={styles.statusInfoContainer}>
                  <Text variant="bodyMedium" style={styles.statusMainText}>
                    Milo is{' '}
                    <Text style={{ fontWeight: '800' }}>Sleeping Peacefully</Text>
                  </Text>
                  <Text variant="labelSmall" style={styles.statusSubText}>
                    Last active 15 mins ago
                  </Text>
                  <View style={styles.healthIndicators}>
                    <Chip
                      label="Heart Rate: 85 BPM"
                      size="small"
                      icon="heart"
                      style={styles.healthChip}
                      textStyle={styles.healthChipText}
                    />
                    <Chip
                      label="Normal"
                      size="small"
                      icon="check-circle"
                      style={styles.healthChipGreen}
                      textStyle={styles.healthChipTextGreen}
                    />
                  </View>
                </View>

                <View style={styles.statusTrend}>
                  <MaterialIcons
                    name="trending-up"
                    size={28}
                    color={theme.colors.primary}
                  />
                  <Text variant="labelSmall" style={styles.trendText}>
                    +5% Activity
                  </Text>
                </View>
              </Card.Content>
            </Card>

            {/* Additional Status Items */}
            <View style={styles.miniStatusContainer}>
              <Surface style={styles.miniStatus}>
                <MaterialCommunityIcons
                  name="thermometer"
                  size={20}
                  color="#FF6B6B"
                />
                <Text variant="labelSmall" style={styles.miniStatusText}>
                  Temperature: 38.5°C
                </Text>
              </Surface>

              <Surface style={styles.miniStatus}>
                <MaterialCommunityIcons
                  name="water"
                  size={20}
                  color="#4ECDC4"
                />
                <Text variant="labelSmall" style={styles.miniStatusText}>
                  Hydration: Good
                </Text>
              </Surface>
            </View>
          </View>

          {/* --- Recent Moments --- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Recent Moments
              </Text>
              <TouchableOpacity>
                <Text style={styles.viewAllLink}>View All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.momentScroll}
            >
              {[1, 2, 3, 4].map((id) => (
                <Card key={id} style={styles.momentCard}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=200',
                    }}
                    style={styles.momentImage}
                  />
                  <Card.Content style={styles.momentContent}>
                    <Text
                      variant="labelSmall"
                      style={styles.momentTime}
                      numberOfLines={1}
                    >
                      Today, 10:{20 + id}0 AM
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </ScrollView>
          </View>

          {/* --- Alerts & Notifications --- */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Today's Alerts
            </Text>

            <Card style={styles.alertCard}>
              <Card.Content style={styles.alertCardContent}>
                <View
                  style={[
                    styles.alertIcon,
                    { backgroundColor: '#FFF3E0' },
                  ]}
                >
                  <MaterialIcons name="info" size={24} color="#FF9800" />
                </View>
                <View style={styles.alertInfo}>
                  <Text variant="labelLarge" style={styles.alertTitle}>
                    Unusual Activity Detected
                  </Text>
                  <Text variant="labelSmall" style={styles.alertTime}>
                    10 mins ago • Barking detected
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </Card.Content>
            </Card>

            <Card style={styles.alertCard}>
              <Card.Content style={styles.alertCardContent}>
                <View
                  style={[
                    styles.alertIcon,
                    { backgroundColor: '#E8F5E9' },
                  ]}
                >
                  <MaterialIcons name="check-circle" size={24} color="#10B981" />
                </View>
                <View style={styles.alertInfo}>
                  <Text variant="labelLarge" style={styles.alertTitle}>
                    Treat Dispensed
                  </Text>
                  <Text variant="labelSmall" style={styles.alertTime}>
                    2 hours ago • Auto-dispense enabled
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </Card.Content>
            </Card>
          </View>

          {/* --- Quick Actions --- */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Actions
            </Text>

            <View style={styles.actionGrid}>
              <Button
                mode="outlined"
                icon="bell"
                style={styles.actionBtn}
                contentStyle={styles.actionBtnContent}
                labelStyle={styles.actionBtnLabel}
                textColor={theme.colors.primary}
                onPress={() => {}}
              >
                Notify Me
              </Button>

              <Button
                mode="outlined"
                icon="clock-outline"
                style={styles.actionBtn}
                contentStyle={styles.actionBtnContent}
                labelStyle={styles.actionBtnLabel}
                textColor={theme.colors.primary}
                onPress={() => {}}
              >
                Schedule
              </Button>

              <Button
                mode="outlined"
                icon="share-variant"
                style={styles.actionBtn}
                contentStyle={styles.actionBtnContent}
                labelStyle={styles.actionBtnLabel}
                textColor={theme.colors.primary}
                onPress={() => {}}
              >
                Share
              </Button>

              <Button
                mode="outlined"
                icon="cog"
                style={styles.actionBtn}
                contentStyle={styles.actionBtnContent}
                labelStyle={styles.actionBtnLabel}
                textColor={theme.colors.primary}
                onPress={() => {}}
              >
                Settings
              </Button>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Video Section
  videoSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  videoContainer: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  liveVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Live Badge
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dot: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Timestamp Badge
  timestampBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timestamp: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Fullscreen Button
  fullscreenBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Control Panel
  controlPanel: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    elevation: 2,
  },
  controlGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  controlBtnWrapper: {
    alignItems: 'center',
    width: '23%',
  },
  controlBtn: {
    width: 70,
    height: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    elevation: 1,
  },
  controlBtnActive: {
    backgroundColor: theme.colors.primary,
    elevation: 4,
  },
  controlBtnRecording: {
    backgroundColor: '#FF5252',
    elevation: 4,
  },
  treatBtn: {
    backgroundColor: '#FFF9C4',
  },
  controlLabel: {
    marginTop: 8,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  controlLabelActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '800',
    color: '#1a1a1a',
  },
  viewAllLink: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  // Status Card
  statusCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  statusCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  statusIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusInfoContainer: {
    flex: 1,
  },
  statusMainText: {
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 2,
  },
  statusSubText: {
    color: '#999',
    marginBottom: 8,
  },
  healthIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  healthChip: {
    backgroundColor: '#FFF3E0',
    height: 28,
  },
  healthChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF9800',
  },
  healthChipGreen: {
    backgroundColor: '#E8F5E9',
    height: 28,
  },
  healthChipTextGreen: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
  },
  statusTrend: {
    alignItems: 'center',
    marginLeft: 8,
  },
  trendText: {
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },

  // Mini Status
  miniStatusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStatus: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    elevation: 1,
  },
  miniStatusText: {
    marginLeft: 8,
    color: '#333',
    fontWeight: '600',
  },

  // Moments
  momentScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  momentCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  momentImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  momentContent: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  momentTime: {
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Alerts
  alertCard: {
    marginBottom: 12,
    borderRadius: 14,
    elevation: 1,
  },
  alertCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    color: '#1a1a1a',
    fontWeight: '700',
    marginBottom: 2,
  },
  alertTime: {
    color: '#999',
  },

  // Quick Actions
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionBtn: {
    width: '48%',
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  actionBtnContent: {
    paddingVertical: 8,
  },
  actionBtnLabel: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Bottom Spacer
  bottomSpacer: {
    height: 20,
  },
});