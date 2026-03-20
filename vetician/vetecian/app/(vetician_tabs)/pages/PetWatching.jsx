// import React, { useState } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   Image, Dimensions, SafeAreaView, Switch
// } from 'react-native';
// import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
// import CommonHeader from '../../../components/CommonHeader';
// import PetWatchingScreen from '../../../components/petparent/petWatching/PetWatchingScreen';

// const { width } = Dimensions.get('window');

// export default function PetWatchingPage() {
//   const [isMicOn, setIsMicOn] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);

//   return (
//     <SafeAreaView style={styles.container}>
//       <CommonHeader title="Pet Watching" />

//       <PetWatchingScreen/>

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f7fa' },

//   comingSoonOverlay: {
//     position: 'absolute',
//     top: 100,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//     paddingHorizontal: 40
//   },
//   comingSoonTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#24A1DE',
//     marginTop: 20,
//     marginBottom: 10
//   },
//   comingSoonText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 24
//   },

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
import { View, ScrollView, StyleSheet, Text } from 'react-native';

// ── Import all components ──
import AppHeader from '../../../components/petparent/petWatching/AppHeader';
import LiveCameraCard from '../../../components/petparent/petWatching/LiveCameraCard'
import ActivityTimeline from '../../../components/petparent/petWatching/ActivityTimeline';
import PetGallery from '../../../components/petparent/petWatching/PetGallery';
import HealthStatusCard from '../../../components/petparent/petWatching/HealthStatusCard';
import ChatWidget from '../../../components/petparent/petWatching/ChatWidget';
import EmergencyAlert from '../../../components/petparent/petWatching/EmergencyAlert';
import RemoteInteractionPanel from '../../../components/petparent/petWatching/RemoteInteractionPanel';
import DrawerMenu from '../../../components/petparent/petWatching/DrawerMenu';



import { COLORS } from '../../../constant/theme';


export default function PetWatchingScreen() {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('watch');

  return (
    <View style={styles.screen}>

      {/* ──  Side Drawer (rendered above everything) ──
      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      /> */}

      {/* ── Scrollable page content ── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Header — green gradient + pet card */}
        <AppHeader onMenuPress={() => setDrawerOpen(true)} />

        <Text style={{marginTop:10, fontSize:16, marginLeft:20, fontWeight: 600
        }}>Good Evening, Max watching</Text>

        {/* 2. Emergency alert — shown when pet stress detected */}
        <EmergencyAlert />

        {/* 3. Live camera feed */}
        <LiveCameraCard isLive={true} />

        {/* 4. Activity timeline (horizontal scroll) */}
        <ActivityTimeline />

       

        {/* 6. Health metrics (horizontal scroll) */}
        <HealthStatusCard />

        {/* 8. Remote interaction: speak / toy / call */}
        <RemoteInteractionPanel />

        {/* 9. Live chat with resort staff */}
        {/* <ChatWidget /> */}

        {/* Bottom spacer */}
        <View style={{ height: 24 }} />
      </ScrollView>

    </View>
  );
}

// ─────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
