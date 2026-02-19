import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Animated,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Menu } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { veterinarianProfileData } from '../../../store/slices/authSlice';

const VeterinarianProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [scaleValue] = useState(new Animated.Value(1));

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.98,
            useNativeDriver: true
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true
        }).start();
    };

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await dispatch(veterinarianProfileData()).unwrap();
            if (response.success) {
                setProfileData(response.data);
            } else {
                setError(response.payload?.message || 'Failed to load profile');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchProfileData();
    };

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4E8D7C" />
                <Text style={styles.loadingText}>Loading your profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={50} color="#E74C3C" />
                <Text style={styles.errorText}>{error}</Text>
                <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={handleRefresh}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    if (!profileData) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Profile Not Found</Text>
                <Text style={styles.emptyText}>Unable to load veterinarian profile</Text>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={handleRefresh}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="refresh" size={20} color="#4E8D7C" />
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={openDrawer} 
                    style={styles.menuButton}
                    activeOpacity={0.7}
                >
                    <Menu size={28} color="#4E4E4E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Veterinarian Profile</Text>
                <TouchableOpacity 
                    onPress={handleRefresh} 
                    style={styles.refreshButton}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="refresh" size={24} color="#4E8D7C" />
                </TouchableOpacity>
            </View>

            {/* Profile Status Banner */}
            {!profileData.profile.isVerified && (
                <View style={styles.reviewBanner}>
                    <MaterialIcons name="pending-actions" size={24} color="#E67C00" />
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.reviewBannerText}>{profileData.status}</Text>
                        <Text style={styles.reviewBannerSubtext}>{profileData.message}</Text>
                    </View>
                </View>
            )}

            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                    {profileData.profile.profilePhotoUrl ? (
                        <Image 
                            source={{ uri: profileData.profile.profilePhotoUrl }} 
                            style={styles.profileImage}
                        />
                    ) : (
                        <View style={styles.profileImagePlaceholder}>
                            <MaterialIcons name="person" size={40} color="#FFFFFF" />
                        </View>
                    )}
                    <View style={styles.profileTitle}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.name}>{profileData.profile.name}</Text>
                            {profileData.profile.isVerified && (
                                <MaterialIcons name="verified" size={20} color="#4E8D7C" style={styles.verifiedIcon} />
                            )}
                        </View>
                        <Text style={styles.specialization}>{profileData.profile.specialization}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <MaterialIcons name="school" size={20} color="#7D7D7D" style={styles.detailIcon} />
                    <Text style={styles.detail}>{profileData.profile.qualification}</Text>
                </View>

                <View style={styles.detailItem}>
                    <MaterialIcons name="work" size={20} color="#7D7D7D" style={styles.detailIcon} />
                    <Text style={styles.detail}>{profileData.profile.experience}</Text>
                </View>

                <View style={styles.detailItem}>
                    <MaterialIcons name="assignment" size={20} color="#7D7D7D" style={styles.detailIcon} />
                    <Text style={styles.detail}>{profileData.profile.registration}</Text>
                </View>

                {/* {profileData.profile.additionalCertification && (
                    <View style={styles.detailItem}>
                        <MaterialIcons name="card-membership" size={20} color="#7D7D7D" style={styles.detailIcon} />
                        <Text style={styles.detail}>{profileData.profile.additionalCertification}</Text>
                    </View>
                )} */}
            </View>

            {/* Clinics Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Associated Clinics</Text>
                
                {profileData.clinics && profileData.clinics.length > 0 ? (
                    profileData.clinics.map((clinic, index) => (
                        <View key={index} style={styles.clinicCard}>
                            <View style={styles.clinicHeader}>
                                <Text style={styles.clinicName}>{clinic.clinicName}</Text>
                                {clinic.verified ? (
                                    <MaterialIcons name="verified" size={16} color="#4E8D7C" />
                                ) : (
                                    <Text style={styles.verificationText}>Verification pending</Text>
                                )}
                            </View>
                            <View style={styles.addressContainer}>
                                <MaterialIcons name="location-on" size={16} color="#7D7D7D" />
                                <Text style={styles.clinicAddress}>{clinic.address}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyClinicContainer}>
                        <MaterialIcons name="business" size={40} color="#7D7D7D" />
                        <Text style={styles.emptyClinicText}>No clinics associated</Text>
                    </View>
                )}
            </View>

            {/* Help Section */}
            <View style={styles.helpSection}>
                <MaterialIcons name="help-outline" size={24} color="#4E8D7C" />
                <Text style={styles.helpTitle}>Need Help With Your Profile?</Text>
                <Text style={styles.helpText}>Contact our support team for any profile-related questions</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingTop: 35
    },
    scrollContent: {
        paddingBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    loadingText: {
        marginTop: 20,
        color: '#4E8D7C',
        fontSize: 16
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF'
    },
    errorText: {
        fontSize: 16,
        color: '#E74C3C',
        marginVertical: 20,
        textAlign: 'center',
        lineHeight: 24
    },
    retryButton: {
        backgroundColor: '#4E8D7C',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 10,
        elevation: 2,
        shadowColor: '#4E8D7C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF'
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 10
    },
    emptyText: {
        fontSize: 16,
        color: '#7D7D7D',
        marginBottom: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10
    },
    menuButton: {
        padding: 8,
        borderRadius: 20,
    },
    refreshButton: {
        padding: 8,
        borderRadius: 20,
    },
    refreshButtonText: {
        color: '#4E8D7C',
        marginLeft: 5,
        fontWeight: '500'
    },
    reviewBanner: {
        backgroundColor: '#FFF3E0',
        padding: 16,
        marginHorizontal: 20,
        marginVertical: 10,
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
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        margin: 20,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15
    },
    profileImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
        backgroundColor: '#4E8D7C',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileTitle: {
        flex: 1
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2C3E50'
    },
    verifiedIcon: {
        marginLeft: 8
    },
    specialization: {
        fontSize: 16,
        color: '#4E8D7C',
        fontWeight: '600'
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5'
    },
    detailIcon: {
        marginRight: 12
    },
    detail: {
        fontSize: 15,
        color: '#555',
        flex: 1
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 15
    },
    clinicCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10
    },
    clinicHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    clinicName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50'
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    clinicAddress: {
        fontSize: 14,
        color: '#7D7D7D',
        marginLeft: 8,
        flex: 1
    },
    verificationText: {
        fontSize: 12,
        color: '#E67C00',
        fontStyle: 'italic'
    },
    emptyClinicContainer: {
        alignItems: 'center',
        padding: 20
    },
    emptyClinicText: {
        fontSize: 16,
        color: '#7D7D7D',
        marginTop: 10
    },
    helpSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
    },
    helpTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginTop: 10,
        marginBottom: 5
    },
    helpText: {
        fontSize: 14,
        color: '#7D7D7D',
        textAlign: 'center',
        marginBottom: 10
    }
});

export default VeterinarianProfileScreen;