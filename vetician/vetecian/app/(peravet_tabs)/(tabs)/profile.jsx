import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { signOutUser } from '../../../store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';

export default function Profile() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchProfile();
    
    // Listen for verification approval
    const setupNotifications = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const SocketService = (await import('../../../services/socket')).default;
      SocketService.connect(userId, 'paravet');
      
      SocketService.onVerificationApproved((data) => {
        Alert.alert('🎉 Congratulations!', data.message);
        fetchProfile(); // Refresh profile to show approved status
      });
    };
    
    setupNotifications();
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await api.get(`/paravet/profile/${userId}`);
      console.log('📊 Profile data:', JSON.stringify(response.data, null, 2));
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setEditData(profileData);
  };

  const handleSave = async (section) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (section === 'personal') {
        await api.patch(`/paravet/personal-info/${userId}`, {
          fullName: editData.personalInfo?.fullName?.value,
          mobileNumber: editData.personalInfo?.mobileNumber?.value,
          email: editData.personalInfo?.email?.value,
          city: editData.personalInfo?.city?.value,
          serviceArea: editData.personalInfo?.serviceArea?.value,
        });
      } else if (section === 'experience') {
        await api.patch(`/paravet/experience-skills/${userId}`, {
          yearsOfExperience: editData.experience?.yearsOfExperience?.value,
          areasOfExpertise: editData.experience?.areasOfExpertise?.value || [],
          languagesSpoken: editData.experience?.languagesSpoken?.value || [],
        });
      } else if (section === 'payment') {
        await api.patch(`/paravet/payment-info/${userId}`, {
          paymentMethod: editData.paymentInfo?.paymentMethod,
          accountHolderName: editData.paymentInfo?.accountHolderName?.value,
          pan: editData.paymentInfo?.pan?.value,
        });
      }
      
      setEditingSection(null);
      fetchProfile();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          await AsyncStorage.multiRemove(['token', 'userId']);
          dispatch(signOutUser());
          router.replace('/(auth)/signin');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5856D6" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#666', fontSize: 16 }}>No profile data found</Text>
        <TouchableOpacity 
          style={{ marginTop: 20, backgroundColor: '#5856D6', padding: 12, borderRadius: 8 }}
          onPress={fetchProfile}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const Section = ({ title, icon, data, section, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name={icon} size={24} color="#9B59B6" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {editingSection === section ? (
          <View style={styles.editActions}>
            <TouchableOpacity onPress={() => setEditingSection(null)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSave(section)} style={styles.saveBtn}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => handleEdit(section)}>
            <Ionicons name="create-outline" size={20} color="#9B59B6" />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );

  const Field = ({ label, value, field, section, editable = true }) => {
    const isEditing = editingSection === section;
    const displayValue = value || 'Not set';
    
    return (
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing && editable ? (
          <TextInput
            style={styles.fieldInput}
            value={editData[section]?.[field]?.value || editData[section]?.[field] || ''}
            onChangeText={(text) => {
              setEditData(prev => ({
                ...prev,
                [section]: {
                  ...prev[section],
                  [field]: { ...prev[section]?.[field], value: text }
                }
              }));
            }}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <Text style={styles.fieldValue}>{displayValue}</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProfile(); }} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Profile Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Ionicons 
            name={profileData?.applicationStatus?.approvalStatus === 'approved' ? 'checkmark-circle' : 'time-outline'} 
            size={32} 
            color={profileData?.applicationStatus?.approvalStatus === 'approved' ? '#4CAF50' : '#FF9800'} 
          />
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>
              {profileData?.applicationStatus?.approvalStatus === 'approved' ? 'Verified' : 'Pending Verification'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {profileData?.applicationStatus?.approvalStatus === 'approved' 
                ? 'Your profile is active' 
                : 'Complete your profile for verification'}
            </Text>
          </View>
        </View>
        {!profileData?.personalInfo?.fullName?.value && (
          <TouchableOpacity 
            style={{ marginTop: 15, backgroundColor: '#5856D6', padding: 12, borderRadius: 8 }}
            onPress={() => router.push('/(peravet_tabs)/onboarding/step1_welcome')}
          >
            <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}>Complete Onboarding</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Personal Information */}
      <Section title="Personal Information" icon="person" section="personalInfo">
        <Field 
          label="Full Name" 
          value={profileData?.personalInfo?.fullName?.value || user?.name} 
          field="fullName" 
          section="personalInfo" 
        />
        <Field 
          label="Email" 
          value={profileData?.personalInfo?.email?.value || user?.email} 
          field="email" 
          section="personalInfo" 
        />
        <Field 
          label="Mobile Number" 
          value={profileData?.personalInfo?.mobileNumber?.value || user?.phone} 
          field="mobileNumber" 
          section="personalInfo" 
        />
        <Field 
          label="City" 
          value={profileData?.personalInfo?.city?.value} 
          field="city" 
          section="personalInfo" 
        />
        <Field 
          label="Service Area" 
          value={profileData?.personalInfo?.serviceArea?.value} 
          field="serviceArea" 
          section="personalInfo" 
        />
      </Section>

      {/* Documents */}
      <Section title="Documents" icon="document-text" section="documents">
        <View style={styles.documentRow}>
          <Text style={styles.fieldLabel}>Government ID</Text>
          <View style={styles.documentStatus}>
            <Ionicons 
              name={profileData?.documents?.governmentId?.type ? 'checkmark-circle' : 'close-circle'} 
              size={20} 
              color={profileData?.documents?.governmentId?.type ? '#4CAF50' : '#F44336'} 
            />
            <Text style={styles.documentStatusText}>
              {profileData?.documents?.governmentId?.type ? 'Uploaded' : 'Not uploaded'}
            </Text>
          </View>
        </View>
        <View style={styles.documentRow}>
          <Text style={styles.fieldLabel}>Certification Proof</Text>
          <View style={styles.documentStatus}>
            <Ionicons 
              name={profileData?.documents?.certificationProof?.type ? 'checkmark-circle' : 'close-circle'} 
              size={20} 
              color={profileData?.documents?.certificationProof?.type ? '#4CAF50' : '#F44336'} 
            />
            <Text style={styles.documentStatusText}>
              {profileData?.documents?.certificationProof?.type ? 'Uploaded' : 'Not uploaded'}
            </Text>
          </View>
        </View>
        <View style={styles.documentRow}>
          <Text style={styles.fieldLabel}>Profile Photo</Text>
          <View style={styles.documentStatus}>
            <Ionicons 
              name={profileData?.documents?.profilePhoto?.type ? 'checkmark-circle' : 'close-circle'} 
              size={20} 
              color={profileData?.documents?.profilePhoto?.type ? '#4CAF50' : '#F44336'} 
            />
            <Text style={styles.documentStatusText}>
              {profileData?.documents?.profilePhoto?.type ? 'Uploaded' : 'Not uploaded'}
            </Text>
          </View>
        </View>
      </Section>

      {/* Experience & Skills */}
      <Section title="Experience & Skills" icon="briefcase" section="experience">
        <Field 
          label="Years of Experience" 
          value={profileData?.experience?.yearsOfExperience?.value} 
          field="yearsOfExperience" 
          section="experience" 
        />
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Areas of Expertise</Text>
          <Text style={styles.fieldValue}>
            {profileData?.experience?.areasOfExpertise?.value?.join(', ') || 'Not set'}
          </Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Languages Spoken</Text>
          <Text style={styles.fieldValue}>
            {profileData?.experience?.languagesSpoken?.value?.join(', ') || 'Not set'}
          </Text>
        </View>
      </Section>

      {/* Payment Information */}
      <Section title="Payment Information" icon="card" section="payment">
        <Field 
          label="Account Holder Name" 
          value={profileData?.paymentInfo?.accountHolderName?.value} 
          field="accountHolderName" 
          section="paymentInfo" 
        />
        <Field 
          label="PAN Number" 
          value={profileData?.paymentInfo?.pan?.value} 
          field="pan" 
          section="paymentInfo" 
        />
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Payment Method</Text>
          <Text style={styles.fieldValue}>
            {profileData?.paymentInfo?.paymentMethod?.type || 'Not set'}
          </Text>
        </View>
      </Section>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7FC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F7FC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5856D6',
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  statusCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#5856D6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusText: { marginLeft: 15, flex: 1 },
  statusTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  statusSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F5',
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  editActions: { flexDirection: 'row', gap: 10 },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  cancelText: { color: '#666', fontSize: 14, fontWeight: '600' },
  saveBtn: { backgroundColor: '#5856D6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, color: '#666', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldValue: { fontSize: 16, color: '#1a1a1a', fontWeight: '500' },
  fieldInput: {
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#5856D6',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F7F7FC',
    fontWeight: '500',
  },
  documentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 8,
  },
  documentStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  documentStatusText: { fontSize: 14, color: '#666', fontWeight: '600' },
});
