import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { signOut, veterinarianProfileData } from '../../../store/slices/authSlice';
import { User, Mail, Calendar, MapPin, Phone, LogOut, X, Stethoscope, Award, Briefcase, Edit } from 'lucide-react-native';
import { useEffect, useState } from 'react';

export default function VeterinarianProfile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const result = await dispatch(veterinarianProfileData()).unwrap();
        if (result.success) {
          setProfileData(result.data);
        } else {
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error fetching veterinarian profile:', error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [dispatch, user]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(signOut());
            router.replace('/(auth)/signin');
          },
        },
      ]
    );
  };

  const profileInfo = [
    { icon: Mail, label: 'Email', value: profileData?.profile?.email || user?.email || 'Not provided' },
    { icon: Phone, label: 'Phone', value: profileData?.profile?.phone || 'Not provided' },
    { icon: Stethoscope, label: 'Specialization', value: profileData?.profile?.specialization || 'Not provided' },
    { icon: Award, label: 'Qualification', value: profileData?.profile?.qualification || 'Not provided' },
    { icon: Briefcase, label: 'Experience', value: profileData?.profile?.experience || 'Not provided' },
    { icon: Calendar, label: 'Registration', value: profileData?.profile?.registration || 'Not registered yet' },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4E8D7C" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Status Banner - Only show if profile exists but isn't verified */}
        {profileData?.profile && !profileData.profile.isVerified && (
          <View style={styles.reviewBanner}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.reviewBannerText}>{profileData.status || 'Profile under review'}</Text>
              <Text style={styles.reviewBannerSubtext}>
                {profileData.message || 'Your profile is being reviewed by our team'}
              </Text>
            </View>
          </View>
        )}

        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {profileData?.profile?.profilePhotoUrl ? (
              <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                <Image
                  source={{ uri: profileData.profile.profilePhotoUrl }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.avatar}>
                <User size={40} color="#4E8D7C" />
              </View>
            )}
          </View>
          <Text style={styles.name}>
            {profileData?.profile?.name || user?.name || 'Veterinarian'}
          </Text>
          {profileData?.profile?.specialization && (
            <Text style={styles.specialization}>{profileData.profile.specialization}</Text>
          )}
        </View>

        {/* Profile Information */}
        <View style={styles.content}>
          {/* Complete Profile Button if no profile data exists */}
          {!profileData?.profile && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.completeProfileButton}
                onPress={() => router.push('onboarding/veterinarian_detail')}
              >
                <Edit size={20} color="#4E8D7C" />
                <Text style={styles.completeProfileButtonText}>Complete Your Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
            <View style={styles.infoContainer}>
              {profileInfo.map((info, index) => (
                <View key={index} style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <info.icon size={20} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{info.label}</Text>
                    <Text style={styles.infoValue}>{info.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Clinics Section */}
          <View style={styles.section}>
            {/* <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Associated Clinics</Text>
              {profileData?.clinics?.length > 0 && (
                <TouchableOpacity onPress={() => router.push('/vet/add-clinic')}>
                  <Text style={styles.addButtonText}>Add Clinic</Text>
                </TouchableOpacity>
              )}
            </View> */}

            {profileData?.clinics && profileData.clinics.length > 0 ? (
              <View style={styles.clinicsContainer}>
                {profileData.clinics.map((clinic, index) => (
                  <View key={index} style={styles.clinicCard}>
                    <Text style={styles.clinicName}>{clinic.clinicName}</Text>
                    <View style={styles.clinicAddressContainer}>
                      <MapPin size={16} color="#666" />
                      <Text style={styles.clinicAddress}>{clinic.address}</Text>
                    </View>
                    {clinic.verified ? (
                      <Text style={styles.verifiedBadge}>Verified</Text>
                    ) : (
                      <Text style={styles.pendingBadge}>Verification Pending</Text>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyClinicsContainer}>
                <Text style={styles.emptyClinicsText}>No clinics registered yet</Text>
                <TouchableOpacity
                  style={styles.addClinicButton}
                  onPress={() => router.push('onboarding/clinic')}
                >
                  <Text style={styles.addClinicButtonText}>Register Your Clinic</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.signOutButton]}
                onPress={handleSignOut}
              >
                <LogOut size={20} color="#ff3b30" />
                <Text style={[styles.actionText, styles.signOutText]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Image View Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setImageModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <Image 
              source={{ uri: profileData?.profile?.profilePhotoUrl }} 
              style={styles.fullImage} 
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.closeImageButton}
              onPress={() => setImageModalVisible(false)}
            >
              <X size={30} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 35
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  loadingText: {
    marginTop: 20,
    color: '#4E8D7C',
    fontSize: 16
  },
  reviewBanner: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#E67C00',
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  reviewBannerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E67C00',
    marginBottom: 4,
  },
  reviewBannerSubtext: {
    fontSize: 14,
    color: '#E67C00',
    opacity: 0.8,
    lineHeight: 20
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4E8D7C20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4E8D7C',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4E8D7C',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 16,
    color: '#4E8D7C',
    fontWeight: '600',
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  addButtonText: {
    fontSize: 14,
    color: '#4E8D7C',
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  completeProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4E8D7C20',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4E8D7C',
    gap: 10
  },
  completeProfileButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4E8D7C',
  },
  clinicsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  clinicCard: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  clinicAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clinicAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  verifiedBadge: {
    fontSize: 12,
    color: '#4E8D7C',
    fontWeight: '600',
  },
  pendingBadge: {
    fontSize: 12,
    color: '#E67C00',
    fontStyle: 'italic',
  },
  emptyClinicsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  emptyClinicsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  addClinicButton: {
    backgroundColor: '#4E8D7C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addClinicButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  signOutButton: {
    borderColor: '#ff3b30',
    backgroundColor: '#ff3b3010',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4E8D7C',
    marginLeft: 12,
  },
  signOutText: {
    color: '#ff3b30',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  closeImageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
});