import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Image, Modal, TouchableWithoutFeedback,
  StatusBar, SafeAreaView, Platform, TextInput
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { veterinarianProfileData } from '../../../store/slices/authSlice';
import {
  User, X, Stethoscope, Award, Briefcase,
  Camera, Users, FileText, Settings, Calendar,
  MapPin, Bell, ChevronRight, Phone, Mail, Edit
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function VeterinarianProfile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchProfile();
  }, [dispatch, user]);

  const fetchProfile = async () => {
    try {
      if (!user?._id) { setLoading(false); return; }
      const result = await dispatch(veterinarianProfileData()).unwrap();
      if (result.success) {
        setProfileData(result.data);
        const nameParts = result.data?.profile?.name?.split(' ') || [];
        setEditedName(nameParts.slice(1).join(' ') || '');
        setEditedPhone(user?.phone || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) { Alert.alert('Permission Required', 'Please allow access to photos'); return; }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, aspect: [1, 1], quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setSaving(true);
        const token = await AsyncStorage.getItem('token');
        const API_URL = process.env.EXPO_PUBLIC_API_URL;
        const photoFormData = new FormData();
        photoFormData.append('file', { uri: result.assets[0].uri, name: 'photo.jpg', type: 'image/jpeg' });

        const photoRes = await fetch(`${API_URL}/upload/image`, {
          method: 'POST', body: photoFormData,
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const photoData = await photoRes.json();

        if (photoRes.ok) {
          await fetch(`${API_URL}/auth/veterinarian-update`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, profilePhotoUrl: photoData.secure_url })
          });
          await fetchProfile();
          Alert.alert('Success', 'Profile photo updated');
        }
        setSaving(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update photo');
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim()) { Alert.alert('Error', 'Name cannot be empty'); return; }
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/auth/veterinarian-update`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, name: editedName.trim() })
      });
      if (res.ok) {
        Alert.alert('Success', 'Profile updated successfully');
        setEditModalVisible(false);
        await fetchProfile();
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const menuItems = [
    { icon: Calendar,    label: 'Appointments',   color: '#7CB342', route: '/(doc_tabs)/(tabs)/appointment' },
    { icon: Users,       label: 'Patients',        color: '#558B2F', route: '/(doc_tabs)/(tabs)/patients' },
    { icon: Stethoscope, label: 'Surgeries',       color: '#7CB342', route: '/(doc_tabs)/(tabs)/surgeries' },
    { icon: FileText,    label: 'Medical Records', color: '#558B2F', route: '/(doc_tabs)/medical-records' },
    { icon: Bell,        label: 'Notifications',   color: '#7CB342', route: '/(doc_tabs)/notifications' },
    { icon: MapPin,      label: 'My Clinics',      color: '#558B2F', route: 'onboarding/clinic' },
    { icon: Settings,    label: 'Settings',        color: '#7CB342', route: '/(doc_tabs)/settings' },
  ];

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#7CB342" />
        <Text style={styles.loaderText}>Loading profile...</Text>
      </View>
    );
  }

  const name = profileData?.profile?.name || user?.name || 'Veterinarian';
  const specialization = profileData?.profile?.specialization;
  const photoUrl = profileData?.profile?.profilePhotoUrl;
  const isVerified = profileData?.profile?.isVerified;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Green Gradient Header */}
        <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </LinearGradient>

        {/* Profile Card - click to open edit modal */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.profileHeader}
            onPress={() => setEditModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.profileLeft}>
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.profileAvatar} />
              ) : (
                <View style={styles.profileAvatarPlaceholder}>
                  <User size={32} color="#7CB342" />
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.profileSub}>{user?.phone || user?.email || 'Not provided'}</Text>
                {specialization && <Text style={styles.profileSpec}>{specialization}</Text>}
              </View>
            </View>
            <ChevronRight size={22} color="#ccc" />
          </TouchableOpacity>

          {/* Verified badge */}
          <View style={styles.badgeRow}>
            <View style={isVerified ? styles.verifiedBadge : styles.pendingBadge}>
              <Text style={isVerified ? styles.verifiedText : styles.pendingText}>
                {isVerified ? '✓ Verified Veterinarian' : '⏳ Pending Verification'}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <View style={styles.card}>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.menuRow, i < menuItems.length - 1 && styles.rowBorder]}
                onPress={() => router.push(item.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: `${item.color}15` }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <ChevronRight size={18} color="#ccc" />
              </TouchableOpacity>
            ))}


          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalDivider} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}>

              {/* Photo */}
              <View style={styles.modalAvatarSection}>
                <TouchableOpacity onPress={handlePhotoChange} activeOpacity={0.8} disabled={saving}>
                  {photoUrl ? (
                    <Image source={{ uri: photoUrl }} style={styles.modalAvatar} />
                  ) : (
                    <View style={styles.modalAvatarPlaceholder}>
                      <User size={40} color="#7CB342" />
                    </View>
                  )}
                  <View style={styles.modalCameraBtn}>
                    {saving ? <ActivityIndicator size="small" color="#fff" /> : <Camera size={14} color="#fff" />}
                  </View>
                </TouchableOpacity>
                <Text style={styles.changePhotoText}>Tap to change photo</Text>
              </View>

              {/* Info rows - read only */}
              <Text style={styles.modalSectionTitle}>Professional Details</Text>
              {[
                { icon: Mail,        label: 'Email',          value: user?.email || 'Not provided' },
                { icon: Phone,       label: 'Phone',          value: user?.phone || 'Not provided' },
                { icon: Stethoscope, label: 'Specialization', value: profileData?.profile?.specialization || 'Not provided' },
                { icon: Award,       label: 'Qualification',  value: profileData?.profile?.qualification || 'Not provided' },
                { icon: Briefcase,   label: 'Experience',     value: profileData?.profile?.experience ? `${profileData.profile.experience} years` : 'Not provided' },
                { icon: FileText,    label: 'Registration No',value: profileData?.profile?.registration || 'Not provided' },
              ].map((item, i, arr) => (
                <View key={i} style={[styles.detailRow, i < arr.length - 1 && styles.rowBorder]}>
                  <View style={styles.detailIconWrap}>
                    <item.icon size={17} color="#7CB342" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>{item.label}</Text>
                    <Text style={styles.detailValue}>{item.value}</Text>
                  </View>
                </View>
              ))}

              {/* Editable Name */}
              <Text style={[styles.modalSectionTitle, { marginTop: 20 }]}>Edit Name</Text>
              <View style={styles.inputWrap}>
                <User size={18} color="#7CB342" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Enter your name"
                  placeholderTextColor="#bbb"
                />
              </View>

              {/* Clinics */}
              {profileData?.clinics?.length > 0 && (
                <>
                  <Text style={[styles.modalSectionTitle, { marginTop: 20 }]}>My Clinics</Text>
                  {profileData.clinics.map((clinic, i) => (
                    <View key={i} style={[styles.clinicRow, i < profileData.clinics.length - 1 && styles.rowBorder]}>
                      <MapPin size={16} color="#7CB342" style={{ marginRight: 10 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.clinicName}>{clinic.clinicName}</Text>
                        <Text style={styles.clinicAddr}>{clinic.address}</Text>
                      </View>
                      <View style={clinic.verified ? styles.verifiedBadge : styles.pendingBadge}>
                        <Text style={clinic.verified ? styles.verifiedText : styles.pendingText}>
                          {clinic.verified ? '✓' : '⏳'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleSaveProfile}
                disabled={saving}
                activeOpacity={0.8}
              >
                {saving
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.saveBtnText}>Save Changes</Text>
                }
              </TouchableOpacity>

              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Full Image Modal */}
      <Modal visible={imageModalVisible} transparent onRequestClose={() => setImageModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setImageModalVisible(false)}>
          <View style={styles.imgModalOverlay}>
            <Image source={{ uri: photoUrl }} style={styles.fullImg} resizeMode="contain" />
            <TouchableOpacity style={styles.imgCloseBtn} onPress={() => setImageModalVisible(false)}>
              <X size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#7CB342' },
  scroll: { flex: 1, backgroundColor: '#F5F5F5' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loaderText: { marginTop: 12, color: '#7CB342', fontSize: 15 },

  header: {
    paddingTop: Platform.OS === 'android' ? 12 : 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },

  // Profile Card
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  profileHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 16,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  profileLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  profileAvatar: { width: 58, height: 58, borderRadius: 29 },
  profileAvatarPlaceholder: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: '#7CB34215', justifyContent: 'center', alignItems: 'center',
  },
  profileInfo: { marginLeft: 14, flex: 1 },
  profileName: { fontSize: 17, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  profileSub: { fontSize: 13, color: '#888', marginBottom: 2 },
  profileSpec: { fontSize: 12, color: '#7CB342', fontWeight: '600' },
  badgeRow: { paddingHorizontal: 16, paddingVertical: 10 },
  verifiedBadge: { alignSelf: 'flex-start', backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  verifiedText: { fontSize: 12, color: '#7CB342', fontWeight: '700' },
  pendingBadge: { alignSelf: 'flex-start', backgroundColor: '#FFF3E0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  pendingText: { fontSize: 12, color: '#E67C00', fontWeight: '700' },

  section: { paddingHorizontal: 16, marginTop: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  menuIconWrap: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1A1A1A' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '92%', paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  modalCloseBtn: { padding: 4 },
  modalDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 4 },
  modalContent: { paddingHorizontal: 20, paddingTop: 16 },

  modalAvatarSection: { alignItems: 'center', marginBottom: 24 },
  modalAvatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#7CB342' },
  modalAvatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#7CB34215', justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#7CB342',
  },
  modalCameraBtn: {
    position: 'absolute', bottom: 2, right: 2,
    backgroundColor: '#7CB342', borderRadius: 14,
    width: 28, height: 28, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  changePhotoText: { marginTop: 10, fontSize: 13, color: '#7CB342', fontWeight: '600' },

  modalSectionTitle: { fontSize: 14, fontWeight: '700', color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  detailIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#7CB34215', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  detailLabel: { fontSize: 11, color: '#999', marginBottom: 2 },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F5F5', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A' },

  clinicRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  clinicName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  clinicAddr: { fontSize: 12, color: '#888' },

  saveBtn: {
    backgroundColor: '#7CB342', borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 24,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  imgModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
  fullImg: { width: '100%', height: '80%' },
  imgCloseBtn: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 },
});
