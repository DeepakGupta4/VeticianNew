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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ParavetProfileRN = () => {
  const [editingSection, setEditingSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    professional: true,
    experience: true,
    bank: true,
  });

  // Get user data from Redux (Mocked fallback if Redux is not set up)
  const auth = useSelector(state => state.auth) || { user: {} };
  const user = auth.user;

  const [profileData, setProfileData] = useState({
    personal: { name: '', phone: '', email: '', gender: '', dateOfBirth: '', address: '', pinCode: '', serviceArea: '', emergencyContact: { name: '', relation: '', phone: '' } },
    professional: { licenseNumber: '', licenseExpiry: '', qualification: '', institution: '', yearsOfExperience: 0, specialization: [], verificationStatus: 'Pending' },
    experience: { clinics: [], skills: [], languagesSpoken: [], availabilityDays: [], availabilityStartTime: '', availabilityEndTime: '' },
    bank: { accountHolder: '', accountNumber: '', ifscCode: '', bankName: '', accountType: '', upiId: '', pan: '' },
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        personal: {
          name: user.name || user.fullName || '',
          phone: user.phone || user.mobileNumber || '',
          email: user.email || '',
          gender: user.gender || '',
          dateOfBirth: user.dateOfBirth || '',
          address: user.address || user.city || '',
          pinCode: user.pinCode || '',
          serviceArea: user.serviceArea || '',
          emergencyContact: {
            name: user.emergencyContactName || '',
            relation: user.emergencyContactRelation || '',
            phone: user.emergencyContactNumber || '',
          },
        },
        professional: {
          licenseNumber: user.licenseNumber || '',
          licenseExpiry: user.licenseExpiry || '',
          qualification: user.qualification || '',
          institution: user.institution || '',
          yearsOfExperience: user.yearsOfExperience || 0,
          specialization: user.specialization || user.areasOfExpertise || [],
          verificationStatus: user.verificationStatus || 'Pending',
        },
        experience: {
          clinics: user.clinics || [],
          skills: user.skills || [],
          languagesSpoken: user.languagesSpoken || [],
          availabilityDays: user.availabilityDays || [],
          availabilityStartTime: user.availabilityStartTime || '',
          availabilityEndTime: user.availabilityEndTime || '',
        },
        bank: {
          accountHolder: user.accountHolderName || user.name || '',
          accountNumber: user.accountNumber || '',
          ifscCode: user.ifscCode || '',
          bankName: user.bankName || '',
          accountType: user.accountType || '',
          upiId: user.upiId || '',
          pan: user.pan || '',
        },
      });
    }
  }, [user]);

  const [formData, setFormData] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleEditClick = (section) => {
    setFormData(JSON.parse(JSON.stringify(profileData[section])));
    setEditingSection(section);
  };

  const handleSave = (section) => {
    setProfileData((prev) => ({ ...prev, [section]: formData }));
    setEditingSection(null);
    Alert.alert('Success', 'Profile updated successfully');
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

const CollapsibleSection = ({ title, icon, isOpen, onToggle, isEditing, onEdit, onSave, onCancel, children }) => (
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
              <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
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