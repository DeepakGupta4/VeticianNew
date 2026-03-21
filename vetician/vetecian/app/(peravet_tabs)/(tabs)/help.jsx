// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, ScrollView, TouchableOpacity, StyleSheet, 
//   TextInput, Alert, Modal, Image, Platform 
// } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Button } from '../../../components/NovaUI/Button';

// const HelpSupportApp = () => {
//   const [view, setView] = useState('dashboard'); // 'dashboard' or 'raiseTicket'
//   const [tickets, setTickets] = useState([
//     { id: 'PV-9921', issue: 'Payment Payout Delay', status: 'In Progress', color: '#FEF3C7', textColor: '#92400E' },
//     { id: 'PV-8842', issue: 'App crashing on upload', status: 'Resolved', color: '#D1FAE5', textColor: '#065F46' },
//   ]);

//   // Form States
//   const [issueType, setIssueType] = useState('');
//   const [description, setDescription] = useState('');
//   const [priority, setPriority] = useState('Medium');

//   // Logic: Handle Ticket Submission
//   const handleSubmitTicket = () => {
//     if (!issueType || !description) {
//       Alert.alert("Error", "Please fill in all mandatory fields.");
//       return;
//     }

//     const newTicket = {
//       id: `PV-${Math.floor(Math.random() * 9000) + 1000}`,
//       issue: issueType,
//       status: 'Open',
//       color: '#DBEAFE',
//       textColor: '#1E40AF'
//     };

//     setTickets([newTicket, ...tickets]);
//     Alert.alert("Success", `Ticket ${newTicket.id} created successfully!`);
//     setView('dashboard');
//     // Clear form
//     setIssueType('');
//     setDescription('');
//   };

//   // UI Component: Dashboard
//   const Dashboard = () => (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Paravet Support</Text>
//         <View style={styles.statsCard}>
//           <Text style={styles.statsText}>⚡ Avg. Response: 2 Hours</Text>
//         </View>
//       </View>

//       {/* Active Tickets Section */}
//       <Text style={styles.sectionTitle}>My Tickets ({tickets.length})</Text>
//       {tickets.map((t) => (
//         <View key={t.id} style={styles.ticketCard}>
//           <View>
//             <Text style={styles.ticketId}>ID: #{t.id}</Text>
//             <Text style={styles.ticketIssue}>{t.issue}</Text>
//           </View>
//           <View style={[styles.statusBadge, { backgroundColor: t.color }]}>
//             <Text style={[styles.statusText, { color: t.textColor }]}>{t.status}</Text>
//           </View>
//         </View>
//       ))}

//       {/* Grid Menu */}
//       <View style={styles.grid}>
//         <MenuCard icon="plus-circle" label="Raise Ticket" color="#4F46E5" onPress={() => setView('raiseTicket')} />
//         <MenuCard icon="chat" label="Live Chat" color="#10B981" onPress={() => Alert.alert("Coming Soon", "Live chat will be available in the next update.")} />
//         <MenuCard icon="phone" label="Call Admin" color="#3B82F6" />
//         <MenuCard icon="help-circle" label="FAQs" color="#F59E0B" />
//         <MenuCard icon="bug" label="Report Bug" color="#EF4444" />
//         <MenuCard icon="file-document" label="Policies" color="#6B7280" />
//       </View>

//       <Button variant="danger" size="lg" onPress={() => Alert.alert("Emergency", "Connecting to Admin Escalation Line...")} style={styles.emergencyBtn}>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <MaterialCommunityIcons name="alert-octagon" size={24} color="white" />
//           <Text style={styles.emergencyText}>Emergency Escalation</Text>
//         </View>
//       </Button>
//     </ScrollView>
//   );

//   // UI Component: Raise Ticket Form
//   const RaiseTicketForm = () => (
//     <ScrollView style={styles.container}>
//       <TouchableOpacity onPress={() => setView('dashboard')} style={styles.backBtn}>
//         <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
//         <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Back to Dashboard</Text>
//       </TouchableOpacity>

//       <Text style={styles.formTitle}>Raise a Support Ticket</Text>

//       <Text style={styles.label}>Issue Type*</Text>
//       <TextInput 
//         style={styles.input} 
//         placeholder="e.g. Payment Issue, Booking Error" 
//         value={issueType}
//         onChangeText={setIssueType}
//       />

//       <Text style={styles.label}>Priority</Text>
//       <View style={styles.priorityRow}>
//         {['Low', 'Medium', 'High'].map((p) => (
//           <TouchableOpacity 
//             key={p} 
//             style={[styles.priorityBtn, priority === p && styles.priorityBtnActive]} 
//             onPress={() => setPriority(p)}
//           >
//             <Text style={[styles.priorityBtnText, priority === p && { color: '#fff' }]}>{p}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <Text style={styles.label}>Description*</Text>
//       <TextInput 
//         style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
//         placeholder="Describe your problem in detail..." 
//         multiline
//         value={description}
//         onChangeText={setDescription}
//       />

//       <TouchableOpacity style={styles.uploadBtn}>
//         <MaterialCommunityIcons name="camera" size={20} color="#4B5563" />
//         <Text style={{ marginLeft: 10, color: '#4B5563' }}>Upload Screenshot (Optional)</Text>
//       </TouchableOpacity>

//       {/* Hidden Feature: Auto Device Info */}
//       <View style={styles.infoBox}>
//         <Text style={styles.infoText}>📱 Device: {Platform.OS === 'ios' ? 'iPhone' : 'Android'} | App v2.0.4</Text>
//       </View>

//       <Button variant="primary" size="lg" onPress={handleSubmitTicket}>
//         Submit Ticket
//       </Button>
//     </ScrollView>
//   );

//   return view === 'dashboard' ? <Dashboard /> : <RaiseTicketForm />;
// };

// // Sub-components
// const MenuCard = ({ icon, label, color, onPress }) => (
//   <TouchableOpacity style={styles.card} onPress={onPress}>
//     <MaterialCommunityIcons name={icon} size={28} color={color} />
//     <Text style={styles.cardLabel}>{label}</Text>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20, paddingTop: 50 },
//   header: { marginBottom: 20 },
//   title: { fontSize: 26, fontWeight: 'bold', color: '#1F2937' },
//   statsCard: { backgroundColor: '#E0E7FF', padding: 8, borderRadius: 20, alignSelf: 'flex-start', marginTop: 5, paddingHorizontal: 15 },
//   statsText: { color: '#4338CA', fontSize: 12, fontWeight: 'bold' },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15, color: '#374151' },
//   ticketCard: { 
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10,
//     shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
//   },
//   ticketId: { fontSize: 11, color: '#9CA3AF' },
//   ticketIssue: { fontWeight: '600', color: '#111827' },
//   statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
//   statusText: { fontSize: 11, fontWeight: 'bold' },
//   grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
//   card: { width: '30%', backgroundColor: 'white', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 15, elevation: 2 },
//   cardLabel: { fontSize: 10, fontWeight: 'bold', marginTop: 8, color: '#4B5563' },
//   emergencyBtn: { backgroundColor: '#B91C1C', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, marginTop: 10 },
//   emergencyText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  
//   // Form Styles
//   backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
//   formTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
//   label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151' },
//   input: { backgroundColor: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 15 },
//   priorityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
//   priorityBtn: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#E5E7EB', marginHorizontal: 2, borderRadius: 8 },
//   priorityBtnActive: { backgroundColor: '#4F46E5' },
//   priorityBtnText: { fontWeight: 'bold', color: '#4B5563' },
//   uploadBtn: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#9CA3AF', padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
//   infoBox: { backgroundColor: '#F9FAFB', padding: 10, borderRadius: 8, marginBottom: 20 },
//   infoText: { fontSize: 11, color: '#6B7280', textAlign: 'center' },
//   submitBtn: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 8, alignItems: 'center' },
//   submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
// });

// export default HelpSupportApp;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HelpSupportApp = () => {
  const [view, setView] = useState('dashboard');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [view]);

  const Dashboard = () => (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* --- CUSTOM HEADER --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>Good Morning,</Text>
            <Text style={styles.headerTitle}>How can we help?</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Feather name="search" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* --- LIVE SUPPORT HERO --- */}
        <TouchableOpacity activeOpacity={0.9} style={styles.heroCard}>
          <LinearGradient
            colors={['#0F172A', '#334155']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.liveIndicator}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveText}>Support is Online</Text>
              </View>
              <Text style={styles.heroMainText}>Start a Live Chat</Text>
              <Text style={styles.heroSubText}>Average wait time: <Text style={{color: '#22C55E', fontWeight: '700'}}>2 mins</Text></Text>
            </View>
            <View style={styles.heroAction}>
              <Feather name="message-circle" size={28} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* --- QUICK CATEGORIES --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <View style={styles.categoryGrid}>
            <CategoryItem icon="credit-card" label="Payments" color="#6366F1" />
            <CategoryItem icon="package" label="Bookings" color="#F59E0B" />
            <CategoryItem icon="user" label="Account" color="#10B981" />
            <CategoryItem icon="shield" label="Security" color="#EF4444" />
          </View>
        </View>

        {/* --- RECENT TICKETS / CONVERSATIONS --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Conversations</Text>
            <TouchableOpacity onPress={() => setView('raiseTicket')}>
              <Text style={styles.seeAllText}>New Ticket</Text>
            </TouchableOpacity>
          </View>

          <TicketItem 
            id="TK-882" 
            title="Dermatology Booking Issue" 
            status="Ongoing" 
            time="12m ago"
            doctor="Dr. Adam Hendroin"
          />
          <TicketItem 
            id="TK-701" 
            title="Refund Request #220" 
            status="Resolved" 
            time="2 days ago"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const RaiseTicketForm = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={() => setView('dashboard')} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.formHeaderTitle}>Create Ticket</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.formBody}>
        <Text style={styles.label}>What's the issue?</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Payment failed but money deducted"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Detailed Description</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Tell us more..."
          multiline
          numberOfLines={4}
          placeholderTextColor="#94A3B8"
        />

        <TouchableOpacity style={styles.attachmentBtn}>
          <Feather name="paperclip" size={18} color="#6366F1" />
          <Text style={styles.attachmentText}>Attach Screenshot</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>Submit Inquiry</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {view === 'dashboard' ? <Dashboard /> : <RaiseTicketForm />}
    </Animated.View>
  );
};

// --- SUB COMPONENTS ---

const CategoryItem = ({ icon, label, color }) => (
  <TouchableOpacity style={styles.catItem}>
    <View style={[styles.catIconContainer, { backgroundColor: `${color}15` }]}>
      <Feather name={icon} size={22} color={color} />
    </View>
    <Text style={styles.catLabel}>{label}</Text>
  </TouchableOpacity>
);

const TicketItem = ({ id, title, status, time, doctor }) => (
  <TouchableOpacity style={styles.ticketCard}>
    <View style={styles.ticketInfo}>
      <View style={styles.ticketHeaderRow}>
        <Text style={styles.ticketId}>{id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: status === 'Ongoing' ? '#DCFCE7' : '#F1F5F9' }]}>
          <Text style={[styles.statusText, { color: status === 'Ongoing' ? '#166534' : '#475569' }]}>{status}</Text>
        </View>
      </View>
      <Text style={styles.ticketTitleText}>{title}</Text>
      {doctor && <Text style={styles.doctorText}>Assigned: {doctor}</Text>}
      <Text style={styles.ticketTimeText}>{time}</Text>
    </View>
    <Feather name="chevron-right" size={18} color="#CBD5E1" />
  </TouchableOpacity>
);

// --- STYLES ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 25,
  },
  headerSubtitle: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  profileBtn: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  heroCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
  },
  heroGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  liveText: { color: '#22C55E', fontSize: 11, fontWeight: '700', uppercase: true },
  heroMainText: { color: 'white', fontSize: 20, fontWeight: '700' },
  heroSubText: { color: '#94A3B8', fontSize: 13, marginTop: 4 },
  heroAction: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: { marginTop: 32, paddingHorizontal: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  seeAllText: { color: '#6366F1', fontWeight: '600' },
  categoryGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  catItem: { alignItems: 'center', width: width / 4 - 24 },
  catIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  catLabel: { fontSize: 12, fontWeight: '600', color: '#475569' },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  ticketInfo: { flex: 1 },
  ticketHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  ticketId: { fontSize: 12, fontWeight: '700', color: '#94A3B8', marginRight: 10 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700' },
  ticketTitleText: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  doctorText: { fontSize: 13, color: '#6366F1', marginTop: 2, fontWeight: '500' },
  ticketTimeText: { fontSize: 12, color: '#94A3B8', marginTop: 8 },

  // Form Styles
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  formHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  formBody: { padding: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: { 
    backgroundColor: '#F8FAFC', 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 15, 
    color: '#1E293B', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  attachmentBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  attachmentText: { marginLeft: 8, color: '#6366F1', fontWeight: '600' },
  submitBtn: { backgroundColor: '#0F172A', padding: 18, borderRadius: 16, alignItems: 'center' },
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
});

export default HelpSupportApp;