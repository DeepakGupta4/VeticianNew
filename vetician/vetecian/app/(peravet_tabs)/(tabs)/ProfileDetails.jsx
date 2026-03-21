import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ParavetProfileRN = () => {
  const [editingSection, setEditingSection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    professional: true,
    experience: true,
    bank: true,
  });

  const auth = useSelector(state => state.auth) || { user: {} };
  const user = auth.user;
  const userId = user?._id || user?.id;

  const [profileData, setProfileData] = useState({
    personal: { name: '', phone: '', email: '', gender: '', dateOfBirth: '', address: '', pinCode: '', serviceArea: '', emergencyContact: { name: '', relation: '', phone: '' } },
    professional: { licenseNumber: '', licenseExpiry: '', qualification: '', institution: '', yearsOfExperience: 0, specialization: [], verificationStatus: 'Pending' },
    experience: { clinics: [], skills: [], languagesSpoken: [], availabilityDays: [], availabilityStartTime: '', availabilityEndTime: '' },
    bank: { accountHolder: '', accountNumber: '', ifscCode: '', bankName: '', accountType: '', upiId: '', pan: '' },
  });

  // Load paravet data from database
  useEffect(() => {
    const loadParavetData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const response = await api.get(`/paravet/profile/${userId}`);
        const paravet = response.data;
        
        setProfileData({
          personal: {
            name: paravet.personalInfo?.fullName?.value || '',
            phone: paravet.personalInfo?.mobileNumber?.value || '',
            email: paravet.personalInfo?.email?.value || '',
            address: paravet.personalInfo?.city?.value || '',
            serviceArea: paravet.personalInfo?.serviceArea?.value || '',
            emergencyContact: {
              name: paravet.personalInfo?.emergencyContact?.name || '',
              phone: paravet.personalInfo?.emergencyContact?.number || '',
            },
          },
          professional: {
            yearsOfExperience: paravet.experience?.yearsOfExperience?.value || 0,
            specialization: paravet.experience?.areasOfExpertise?.value || [],
            verificationStatus: paravet.applicationStatus?.approvalStatus === 'approved' ? 'Verified' : 'Pending',
          },
          experience: {
            skills: paravet.experience?.areasOfExpertise?.value || [],
            languagesSpoken: paravet.experience?.languagesSpoken?.value || [],
            availabilityDays: paravet.experience?.availability?.days || [],
            availabilityStartTime: paravet.experience?.availability?.startTime || '',
            availabilityEndTime: paravet.experience?.availability?.endTime || '',
          },
          bank: {
            accountHolder: paravet.paymentInfo?.accountHolderName?.value || '',
            upiId: paravet.paymentInfo?.paymentMethod?.type === 'upi' ? paravet.paymentInfo?.paymentMethod?.value : '',
            accountNumber: paravet.paymentInfo?.paymentMethod?.type === 'bank_account' ? paravet.paymentInfo?.paymentMethod?.value : '',
            pan: paravet.paymentInfo?.pan?.value || '',
          },
        });
      } catch (error) {
        console.error('Error loading paravet data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadParavetData();
  }, [userId]);

  const [formData, setFormData] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleEditClick = (section) => {
    setFormData(JSON.parse(JSON.stringify(profileData[section])));
    setEditingSection(section);
  };

  const handleSave = async (section) => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please login again.');
      return;
    }

    setIsSaving(true);
    try {
      let payload = {};
      
      if (section === 'personal') {
        payload = {
          fullName: formData.name,
          email: formData.email,
          mobileNumber: formData.phone,
          city: formData.address,
          serviceArea: formData.serviceArea,
          emergencyContact: {
            name: formData.emergencyContact?.name,
            number: formData.emergencyContact?.phone
          }
        };
        await api.updateParavetProfile(userId, payload);
      } else if (section === 'professional') {
        payload = {
          yearsOfExperience: formData.yearsOfExperience,
          areasOfExpertise: formData.specialization,
          languagesSpoken: formData.languagesSpoken
        };
        await api.patch(`/paravet/experience-skills/${userId}`, payload);
      } else if (section === 'bank') {
        payload = {
          paymentMethod: { type: formData.upiId ? 'upi' : 'bank_account', value: formData.upiId || formData.accountNumber },
          accountHolderName: formData.accountHolder,
          pan: formData.pan
        };
        await api.patch(`/paravet/payment-info/${userId}`, payload);
      }

      setProfileData((prev) => ({ ...prev, [section]: formData }));
      setEditingSection(null);
      Alert.alert('Success', 'Profile updated successfully in database');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- REFINED SUB-COMPONENTS ---

  const InfoRow = ({ icon, label, value, family = 'Ionicons' }) => {
    const IconComponent = family === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
    return (
      <View style={styles.infoRow}>
        <View style={styles.infoIconWrapper}>
          <IconComponent name={icon} size={20} color="#64748B" />
        </View>
        <View style={styles.infoTextWrapper}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
        </View>
      </View>
    );
  };

  const StatusBadge = ({ status }) => {
    const isVerified = status === 'Verified';
    return (
      <View style={[styles.statusBadge, { backgroundColor: isVerified ? '#DCFCE7' : '#FEF3C7' }]}>
        <MaterialCommunityIcons 
          name={isVerified ? "check-decagram" : "clock-outline"} 
          size={16} 
          color={isVerified ? "#166534" : "#92400E"} 
        />
        <Text style={[styles.statusBadgeText, { color: isVerified ? "#166534" : "#92400E" }]}>
          {status.toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- PROFESSIONAL HEADER --- */}
        <View style={styles.heroSection}>
          <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.heroGradient}>
            <View style={styles.profileImageContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{profileData.personal.name?.charAt(0) || 'P'}</Text>
              </View>
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Ionicons name="camera" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.heroName}>{profileData.personal.name || 'Professional User'}</Text>
            <View style={styles.heroBadgeRow}>
                <StatusBadge status={profileData.professional.verificationStatus} />
            </View>
          </LinearGradient>
        </View>

        {/* --- SECTIONS --- */}
        <View style={styles.sectionsContainer}>
          
          {/* PERSONAL SECTION */}
          <CollapsibleSection
            title="Personal Details"
            icon="person"
            isOpen={expandedSections.personal}
            onToggle={() => toggleSection('personal')}
            isEditing={editingSection === 'personal'}
            onEdit={() => handleEditClick('personal')}
            onSave={() => handleSave('personal')}
            onCancel={handleCancel}
            isSaving={isSaving}
          >
            {editingSection === 'personal' ? (
              <View style={styles.editForm}>
                <CustomInput label="Full Name" value={formData.name} onChangeText={(t) => handleInputChange('name', t)} icon="person-outline" />
                <CustomInput label="Email Address" value={formData.email} onChangeText={(t) => handleInputChange('email', t)} icon="mail-outline" />
                <CustomInput label="Phone Number" value={formData.phone} onChangeText={(t) => handleInputChange('phone', t)} icon="call-outline" />
              </View>
            ) : (
              <View style={styles.infoContent}>
                <InfoRow icon="person-circle-outline" label="Full Name" value={profileData.personal.name} />
                <InfoRow icon="mail-outline" label="Email" value={profileData.personal.email} />
                <InfoRow icon="call-outline" label="Phone" value={profileData.personal.phone} />
              </View>
            )}
          </CollapsibleSection>

          {/* PROFESSIONAL SECTION */}
          <CollapsibleSection
            title="Professional Info"
            icon="briefcase"
            isOpen={expandedSections.professional}
            onToggle={() => toggleSection('professional')}
            isEditing={editingSection === 'professional'}
            onEdit={() => handleEditClick('professional')}
            onSave={() => handleSave('professional')}
            onCancel={handleCancel}
            isSaving={isSaving}
          >
            <View style={styles.infoContent}>
                <InfoRow icon="card-outline" label="License No." value={profileData.professional.licenseNumber} />
                <InfoRow icon="school-outline" label="Qualification" value={profileData.professional.qualification} />
                <InfoRow icon="time-outline" label="Experience" value={`${profileData.professional.yearsOfExperience} Years`} />
            </View>
          </CollapsibleSection>

          {/* BANK DETAILS SECTION */}
          <CollapsibleSection
            title="Payment Details"
            icon="card"
            isOpen={expandedSections.bank}
            onToggle={() => toggleSection('bank')}
            isEditing={editingSection === 'bank'}
            onEdit={() => handleEditClick('bank')}
            onSave={() => handleSave('bank')}
            onCancel={handleCancel}
            isSaving={isSaving}
          >
            <View style={styles.bankPreviewCard}>
                <View style={styles.bankCardHeader}>
                    <Text style={styles.bankNameLabel}>{profileData.bank.bankName || 'BANK NAME'}</Text>
                    <MaterialCommunityIcons name="contactless-payment" size={24} color="#FFF" />
                </View>
                <Text style={styles.accountNumberText}>
                    •••• •••• {profileData.bank.accountNumber ? profileData.bank.accountNumber.slice(-4) : '0000'}
                </Text>
                <View style={styles.bankCardFooter}>
                    <View>
                        <Text style={styles.cardLabel}>ACCOUNT HOLDER</Text>
                        <Text style={styles.cardHolderName}>{profileData.bank.accountHolder || 'NOT SET'}</Text>
                    </View>
                    <MaterialCommunityIcons name="integrated-circuit-chip" size={32} color="#CBD5E1" />
                </View>
            </View>
          </CollapsibleSection>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      )}
    </SafeAreaView>
  );
};

// --- MODERN UI COMPONENTS ---

const CustomInput = ({ label, value, onChangeText, icon }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.floatingLabel}>{label}</Text>
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#64748B" style={styles.inputIcon} />
      <TextInput 
        style={styles.textInput} 
        value={String(value)} 
        onChangeText={onChangeText} 
        placeholderTextColor="#94A3B8" 
      />
    </View>
  </View>
);

const CollapsibleSection = ({ title, icon, isOpen, onToggle, isEditing, onEdit, onSave, onCancel, children, isSaving }) => (
  <View style={[styles.sectionCard, isOpen && styles.sectionCardExpanded]}>
    <TouchableOpacity style={styles.sectionHeader} onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.headerTitleRow}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={20} color="#2563EB" />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#64748B" />
    </TouchableOpacity>

    {isOpen && (
      <View style={styles.sectionBody}>
        <View style={styles.divider} />
        {children}
        <View style={styles.sectionActions}>
          {isEditing ? (
            <View style={styles.editActions}>
              <TouchableOpacity onPress={onCancel} style={styles.cancelBtn} disabled={isSaving}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSave} style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} disabled={isSaving}>
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={16} color="#2563EB" />
              <Text style={styles.editBtnText}>Edit Section</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748B' },
  scrollContent: { flexGrow: 1 },
  heroSection: { marginBottom: -20, zIndex: 1 },
  heroGradient: { paddingTop: 40, paddingBottom: 60, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  profileImageContainer: { position: 'relative' },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFF' },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#10B981', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },
  heroName: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginTop: 12 },
  heroBadgeRow: { marginTop: 8 },
  
  sectionsContainer: { paddingHorizontal: 16, paddingTop: 0 },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 16, marginBottom: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 3 } }) },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  
  sectionBody: { paddingHorizontal: 16, paddingBottom: 16 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoIconWrapper: { width: 24, alignItems: 'center', justifyContent: 'center' },
  infoTextWrapper: { marginLeft: 16 },
  infoLabel: { fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '600' },
  infoValue: { fontSize: 15, color: '#1E293B', fontWeight: '500', marginTop: 1 },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
  
  inputWrapper: { marginBottom: 16 },
  floatingLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6, marginLeft: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12 },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, height: 48, color: '#1E293B', fontSize: 15 },
  
  sectionActions: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  editBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' },
  editBtnText: { color: '#2563EB', fontWeight: '600', marginLeft: 4 },
  editActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  saveBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveBtnDisabled: { backgroundColor: '#94A3B8', opacity: 0.7 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold' },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 8 },
  cancelBtnText: { color: '#64748B', fontWeight: '600' },

  // Bank Card Styling
  bankPreviewCard: { backgroundColor: '#1E293B', borderRadius: 15, padding: 20, marginTop: 10 },
  bankCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bankNameLabel: { color: '#94A3B8', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  accountNumberText: { color: '#FFF', fontSize: 20, letterSpacing: 3, marginVertical: 20 },
  bankCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { color: '#64748B', fontSize: 9, fontWeight: 'bold', marginBottom: 2 },
  cardHolderName: { color: '#FFF', fontSize: 14, fontWeight: '500', textTransform: 'uppercase' }
});

export default ParavetProfileRN;