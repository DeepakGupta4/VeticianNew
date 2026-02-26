import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { Activity, HeartPulse, Stethoscope, ClipboardList, Syringe, Menu, CheckCircle, Calendar, DollarSign, X } from 'lucide-react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
    const { user } = useSelector(state => state.auth);
    const navigation = useNavigation();
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalPatients: 0,
            upcomingAppointments: 0,
            completedVaccinations: 0,
            totalEarnings: 0
        },
        recentActivities: [],
        onboardingStatus: 'pending' // pending, approved, rejected
    });

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

    useEffect(() => {
        // Check if just completed onboarding
        const checkOnboardingComplete = async () => {
            const completed = await AsyncStorage.getItem('onboarding_completed');
            if (completed === 'true') {
                setShowSuccessModal(true);
                await AsyncStorage.removeItem('onboarding_completed');
            }
        };
        checkOnboardingComplete();
        fetchDashboardData();
    }, []);
    const fetchDashboardData = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const token = await AsyncStorage.getItem('token');
            
            if (!userId || !token) return;

            const response = await fetch(`${API_URL}/paravet/dashboard/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDashboardData({
                    stats: {
                        totalPatients: data.totalPatients || 0,
                        upcomingAppointments: data.upcomingAppointments || 0,
                        completedVaccinations: data.completedVaccinations || 0,
                        totalEarnings: data.totalEarnings || 0
                    },
                    recentActivities: data.recentActivities || [],
                    onboardingStatus: data.onboardingStatus || 'pending'
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    const stats = [
        { icon: HeartPulse, label: 'Patients', value: dashboardData.stats.totalPatients.toString(), color: '#FF3B30' },
        { icon: Calendar, label: 'Appointments', value: dashboardData.stats.upcomingAppointments.toString(), color: '#5856D6' },
        { icon: Syringe, label: 'Vaccinations', value: dashboardData.stats.completedVaccinations.toString(), color: '#34C759' },
    ];

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#5856D6" />
            </View>
        );
    }

    return (
        <>
        <Modal
            visible={showSuccessModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowSuccessModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={() => setShowSuccessModal(false)}
                    >
                        <X size={24} color="#666" />
                    </TouchableOpacity>
                    <View style={styles.successIcon}>
                        <CheckCircle size={64} color="#34C759" />
                    </View>
                    <Text style={styles.modalTitle}>Onboarding Complete! 🎉</Text>
                    <Text style={styles.modalMessage}>
                        Your application has been submitted successfully.
                        {"\n\n"}
                        Our team will review your profile within 24-48 hours.
                        {"\n\n"}
                        You'll receive updates via email and SMS.
                    </Text>
                    <TouchableOpacity 
                        style={styles.modalButton}
                        onPress={() => setShowSuccessModal(false)}
                    >
                        <Text style={styles.modalButtonText}>Got it!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        <ScrollView 
            style={styles.container} 
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5856D6']} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                    <Menu size={24} color="#fff" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.name || 'Paravet'}!</Text>
                    <Text style={styles.subtitle}>Today's veterinary overview</Text>
                </View>
            </View>

            {/* Onboarding Banner */}
            {dashboardData.onboardingStatus === 'pending' && (
                <TouchableOpacity 
                    style={styles.onboardingBanner}
                    onPress={() => router.push('/(peravet_tabs)/onboarding/step1_welcome')}
                >
                    <View style={styles.bannerContent}>
                        <CheckCircle size={24} color="#00B0FF" />
                        <View style={styles.bannerText}>
                            <Text style={styles.bannerTitle}>Complete Your Onboarding</Text>
                            <Text style={styles.bannerDescription}>Set up your profile to start accepting requests</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}

            {/* Stats cards */}
            <View style={styles.statsContainer}>
                {stats.map((stat, index) => (
                    <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
                        <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                            <stat.icon size={20} color={stat.color} />
                        </View>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            {/* Earnings Card */}
            <View style={styles.earningsCard}>
                <View style={styles.earningsHeader}>
                    <DollarSign size={24} color="#34C759" />
                    <Text style={styles.earningsTitle}>Total Earnings</Text>
                </View>
                <Text style={styles.earningsAmount}>₹{dashboardData.stats.totalEarnings.toLocaleString()}</Text>
                <Text style={styles.earningsSubtext}>This month</Text>
            </View>

            {/* Quick actions */}
            <View style={styles.quickActions}>
                <Text style={styles.sectionTitle}>Quick Tasks</Text>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity style={[styles.actionCard, { borderLeftColor: '#5856D6' }]}>
                        <View style={[styles.actionIcon, { backgroundColor: '#5856D620' }]}>
                            <ClipboardList size={20} color="#5856D6" />
                        </View>
                        <Text style={styles.actionTitle}>New Patient</Text>
                        <Text style={styles.actionDescription}>Register a new animal patient</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionCard, { borderLeftColor: '#FF9500' }]}>
                        <View style={[styles.actionIcon, { backgroundColor: '#FF950020' }]}>
                            <Activity size={20} color="#FF9500" />
                        </View>
                        <Text style={styles.actionTitle}>Vital Check</Text>
                        <Text style={styles.actionDescription}>Record patient vitals</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Recent activities */}
            <View style={styles.recentActivity}>
                <Text style={styles.sectionTitle}>Recent Cases</Text>
                <View style={styles.activityList}>
                    {dashboardData.recentActivities.length > 0 ? (
                        dashboardData.recentActivities.map((activity, index) => (
                            <View key={index} style={styles.activityItem}>
                                <View style={[styles.activityDot, { backgroundColor: activity.color || '#5856D6' }]} />
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityTitle}>{activity.title}</Text>
                                    <Text style={styles.activityTime}>{activity.description} - {activity.time}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No recent activities</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#5856D6',
        borderBottomRightRadius: 24,
        borderBottomLeftRadius: 24,
    },
    menuButton: {
        marginRight: 20,
    },
    greeting: {
        fontSize: 22,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    onboardingBanner: {
        marginHorizontal: 20,
        marginTop: -20,
        marginBottom: 12,
        backgroundColor: '#E8F4FD',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#00B0FF',
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bannerText: {
        marginLeft: 12,
        flex: 1,
    },
    bannerTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    bannerDescription: {
        fontSize: 12,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        marginTop: -40,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        elevation: 2,
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    earningsCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        padding: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#34C759',
        elevation: 2,
    },
    earningsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    earningsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginLeft: 8,
    },
    earningsAmount: {
        fontSize: 32,
        fontWeight: '700',
        color: '#34C759',
        marginBottom: 4,
    },
    earningsSubtext: {
        fontSize: 13,
        color: '#666',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
    },
    quickActions: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        elevation: 1,
    },
    actionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    actionDescription: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    recentActivity: {
        padding: 20,
        paddingTop: 0,
    },
    activityList: {
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 1,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f5',
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    activityTime: {
        fontSize: 12,
        color: '#8E8E93',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1,
    },
    successIcon: {
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    modalButton: {
        backgroundColor: '#34C759',
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 12,
        width: '100%',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});