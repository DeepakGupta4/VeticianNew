import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Linking, Platform, SafeAreaView, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function HelpSupportApp() {
  const { user } = useSelector(state => state.auth);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(true);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [myEnquiries, setMyEnquiries] = useState([]);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [contactMethod, setContactMethod] = useState('email');
  const [supportContact, setSupportContact] = useState({
    phone: '+91 84484 61071',
    email: 'help@doggosheaven.org',
    address: 'Block J, VATIKA INDIA NEXT, Plot 11, near Vatika V\'lante, Sector 83, Gurugram, Haryana 122004'
  });

  // Fetch contact details and user enquiries on component mount
  useEffect(() => {
    fetchContactDetails();
    fetchMyEnquiries();
  }, []);

  // Refresh enquiries when returning to dashboard
  useEffect(() => {
    if (view === 'dashboard') {
      fetchMyEnquiries();
    }
  }, [view]);

  const fetchContactDetails = async () => {
    try {
      setContactLoading(true);
      const response = await fetch(`${API_URL}/support/contact`);
      const data = await response.json();
      
      if (data.success && data.contact) {
        setSupportContact(data.contact);
        console.log('✅ Contact details loaded:', data.contact);
      }
    } catch (error) {
      console.error('❌ Error fetching contact details:', error);
    } finally {
      setContactLoading(false);
    }
  };

  const fetchMyEnquiries = async () => {
    try {
      setEnquiriesLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      
      const response = await fetch(`${API_URL}/support/enquiries/user/${userId || user?._id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.enquiries) {
        setMyEnquiries(data.enquiries);
        console.log('✅ Enquiries loaded:', data.enquiries.length);
      }
    } catch (error) {
      console.error('❌ Error fetching enquiries:', error);
    } finally {
      setEnquiriesLoading(false);
    }
  };

  const handleCall = () => {
    const phoneNumber = supportContact.phone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${supportContact.email}?subject=Support Request`);
  };

  const handleWhatsApp = () => {
    const phoneNumber = (supportContact.whatsappNumber || supportContact.phone).replace(/\s/g, '').replace('+', '');
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=Hi, I need help with`);
  };

  const handleOpenMaps = () => {
    const address = encodeURIComponent(supportContact.address);
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      android: `geo:0,0?q=${address}`,
    });
    Linking.openURL(url);
  };

  const handleSubmitEnquiry = async () => {
    if (!issueType || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      const enquiryData = {
        userId: userId || user?._id,
        userName: user?.name || 'Anonymous',
        userEmail: user?.email || '',
        userPhone: user?.phone || '',
        userRole: user?.role || 'paravet',
        issueType,
        description,
        priority,
        contactMethod,
        status: 'open',
        deviceInfo: {
          platform: Platform.OS,
          version: Platform.Version
        }
      };

      const response = await fetch(`${API_URL}/support/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(enquiryData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert(
          'Success',
          `Your enquiry has been submitted successfully!\n\nTicket ID: ${data.enquiry.ticketId}\n\nOur support team will contact you within 24 hours.`,
          [{ text: 'OK', onPress: () => {
            setView('dashboard');
            setIssueType('');
            setDescription('');
            setPriority('Medium');
            fetchMyEnquiries(); // Refresh enquiries list
          }}]
        );
      } else {
        throw new Error(data.message || 'Failed to submit enquiry');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Dashboard = () => (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>Need Help?</Text>
            <Text style={styles.headerTitle}>We're Here for You</Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>Online</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          
          {contactLoading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#6366F1" />
              <Text style={{ marginTop: 12, color: '#6B7280' }}>Loading contact details...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.contactCard} onPress={handleCall}>
                <View style={[styles.contactIcon, { backgroundColor: '#DCFCE7' }]}>
                  <Feather name="phone" size={24} color="#16A34A" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Call Us</Text>
                  <Text style={styles.contactValue}>{supportContact.phone}</Text>
                  <Text style={styles.contactHint}>Available 24/7</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
                <View style={[styles.contactIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Feather name="mail" size={24} color="#2563EB" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Email Us</Text>
                  <Text style={styles.contactValue}>{supportContact.email}</Text>
                  <Text style={styles.contactHint}>Response within 24 hours</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp}>
                <View style={[styles.contactIcon, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="whatsapp" size={24} color="#059669" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>WhatsApp</Text>
                  <Text style={styles.contactValue}>Chat with us</Text>
                  <Text style={styles.contactHint}>Quick responses</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactCard} onPress={handleOpenMaps}>
                <View style={[styles.contactIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Feather name="map-pin" size={24} color="#D97706" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Visit Us</Text>
                  <Text style={styles.contactValue} numberOfLines={2}>{supportContact.address}</Text>
                  <Text style={styles.contactHint}>Tap to open in maps</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <ActionCard icon="file-text" label="Submit Enquiry" color="#6366F1" onPress={() => setView('raiseTicket')} />
            <ActionCard icon="list" label="My Enquiries" color="#10B981" onPress={() => setView('myEnquiries')} />
            <ActionCard icon="book-open" label="Guides" color="#F59E0B" />
            <ActionCard icon="message-circle" label="Feedback" color="#8B5CF6" />
          </View>
        </View>

        <TouchableOpacity style={styles.emergencyCard} onPress={handleCall}>
          <LinearGradient colors={['#DC2626', '#B91C1C']} style={styles.emergencyGradient}>
            <MaterialCommunityIcons name="alert-octagon" size={28} color="white" />
            <View style={styles.emergencyContent}>
              <Text style={styles.emergencyTitle}>Emergency Support</Text>
              <Text style={styles.emergencySubtitle}>Urgent issues? Call us now</Text>
            </View>
            <Feather name="phone-call" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  const RaiseTicketForm = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={() => setView('dashboard')} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.formTitle}>Submit Support Enquiry</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Issue Type *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Technical Issue, Account Problem"
            value={issueType}
            onChangeText={setIssueType}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your issue in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Priority</Text>
          <View style={styles.priorityContainer}>
            {['Low', 'Medium', 'High'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.priorityButton, priority === p && styles.priorityButtonActive]}
                onPress={() => setPriority(p)}
              >
                <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Preferred Contact Method</Text>
          <View style={styles.contactMethodContainer}>
            {[
              { value: 'email', icon: 'mail', label: 'Email' },
              { value: 'phone', icon: 'phone', label: 'Phone' },
              { value: 'whatsapp', icon: 'message-circle', label: 'WhatsApp' }
            ].map((method) => (
              <TouchableOpacity
                key={method.value}
                style={[styles.methodButton, contactMethod === method.value && styles.methodButtonActive]}
                onPress={() => setContactMethod(method.value)}
              >
                <Feather name={method.icon} size={20} color={contactMethod === method.value ? '#6366F1' : '#6B7280'} />
                <Text style={[styles.methodText, contactMethod === method.value && styles.methodTextActive]}>
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmitEnquiry}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit Enquiry</Text>
                <Feather name="send" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return view === 'dashboard' ? <Dashboard /> : view === 'myEnquiries' ? <MyEnquiriesView myEnquiries={myEnquiries} enquiriesLoading={enquiriesLoading} setView={setView} /> : <RaiseTicketForm />;
}

const MyEnquiriesView = ({ myEnquiries, enquiriesLoading, setView }) => {
  const getStatusColor = (status) => {
    const colors = {
      open: '#3B82F6',
      'in-progress': '#F59E0B',
      resolved: '#10B981',
      closed: '#6B7280'
    };
    return colors[status] || '#6B7280';
  };

  const getStatusBgColor = (status) => {
    const colors = {
      open: '#DBEAFE',
      'in-progress': '#FEF3C7',
      resolved: '#D1FAE5',
      closed: '#F3F4F6'
    };
    return colors[status] || '#F3F4F6';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: '#10B981',
      Medium: '#F59E0B',
      High: '#EF4444'
    };
    return colors[priority] || '#6B7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={() => setView('dashboard')} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.formTitle}>My Enquiries</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {enquiriesLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={{ marginTop: 12, color: '#6B7280' }}>Loading your enquiries...</Text>
          </View>
        ) : myEnquiries.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={64} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>No Enquiries Yet</Text>
            <Text style={styles.emptyStateText}>You haven't submitted any support enquiries.</Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={() => setView('raiseTicket')}>
              <Text style={styles.emptyStateButtonText}>Submit Your First Enquiry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          myEnquiries.map((enquiry) => (
            <View key={enquiry._id} style={styles.enquiryCard}>
              <View style={styles.enquiryHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ticketId}>{enquiry.ticketId}</Text>
                  <Text style={styles.issueType}>{enquiry.issueType}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(enquiry.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(enquiry.status) }]}>
                    {enquiry.status.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.enquiryDescription} numberOfLines={2}>{enquiry.description}</Text>

              <View style={styles.enquiryFooter}>
                <View style={styles.enquiryMeta}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(enquiry.priority) }]} />
                  <Text style={styles.metaText}>{enquiry.priority}</Text>
                </View>
                <Text style={styles.metaText}>{formatDate(enquiry.createdAt)}</Text>
              </View>

              {enquiry.adminNotes && (
                <View style={styles.adminNotesContainer}>
                  <Feather name="message-square" size={14} color="#6366F1" />
                  <Text style={styles.adminNotesText}>{enquiry.adminNotes}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const ActionCard = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress}>
    <View style={[styles.actionIcon, { backgroundColor: `${color}15` }]}>
      <Feather name={icon} size={24} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 10 },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#16A34A', marginRight: 6 },
  liveText: { fontSize: 12, fontWeight: '600', color: '#16A34A' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  contactIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  contactValue: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  contactHint: { fontSize: 11, color: '#9CA3AF' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '48%', backgroundColor: 'white', padding: 20, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  actionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: '#1F2937', textAlign: 'center' },
  emergencyCard: { marginHorizontal: 20, marginBottom: 20, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  emergencyGradient: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  emergencyContent: { flex: 1, marginLeft: 16 },
  emergencyTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  emergencySubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  formHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { padding: 8 },
  formTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  formContainer: { flex: 1, padding: 20 },
  formCard: { backgroundColor: 'white', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, fontSize: 15, color: '#1F2937' },
  textArea: { height: 120, textAlignVertical: 'top' },
  priorityContainer: { flexDirection: 'row', gap: 12 },
  priorityButton: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', alignItems: 'center' },
  priorityButtonActive: { backgroundColor: '#EEF2FF', borderColor: '#6366F1' },
  priorityText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  priorityTextActive: { color: '#6366F1' },
  contactMethodContainer: { flexDirection: 'row', gap: 12 },
  methodButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', gap: 6 },
  methodButtonActive: { backgroundColor: '#EEF2FF', borderColor: '#6366F1' },
  methodText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  methodTextActive: { color: '#6366F1' },
  submitButton: { marginTop: 24, backgroundColor: '#6366F1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8 },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: 'white' },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 60 },
  emptyStateTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginTop: 16 },
  emptyStateText: { fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center' },
  emptyStateButton: { marginTop: 24, backgroundColor: '#6366F1', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyStateButtonText: { fontSize: 14, fontWeight: '600', color: 'white' },
  enquiryCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  enquiryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  ticketId: { fontSize: 12, fontWeight: '700', color: '#6366F1', marginBottom: 4 },
  issueType: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '700' },
  enquiryDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 12 },
  enquiryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  enquiryMeta: { flexDirection: 'row', alignItems: 'center' },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  metaText: { fontSize: 12, color: '#9CA3AF' },
  adminNotesContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, padding: 12, backgroundColor: '#EEF2FF', borderRadius: 8, gap: 8 },
  adminNotesText: { flex: 1, fontSize: 13, color: '#4F46E5', lineHeight: 18 }
});
