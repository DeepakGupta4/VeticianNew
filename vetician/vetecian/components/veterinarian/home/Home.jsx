import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'; // 1. useDispatch import karein
import { HeartPulse, PawPrint, Stethoscope, Syringe, CalendarClock, Menu, Zap, FileText, LogOut } from 'lucide-react-native'; // 2. LogOut icon add karein
import { router } from 'expo-router';
import api from "../../../services/api";
// Import your logout action (adjust path based on your project)
import { logout } from '../../../store/slices/authSlice'; 

export default function Home() {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch(); // Redux dispatch instance
    const fadeAnim = useRef(new Animated.Value(0)).current;
    
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Logout Function
    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Logout", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // 1. Agar koi logout action hai toh dispatch karein
                            // dispatch(logout()); 

                            // 2. Redirect to Login/Index
                            router.replace('/(auth)/login'); // Apna login path check karein
                        } catch (error) {
                            console.log("Logout failed", error);
                        }
                    }
                }
            ]
        );
    };

    const fetchDashboardData = async () => {
        try {
            const data = await api.get('/users/dashboard-stats');
            if (data.success) {
                setDashboardData(data);
            }
        } catch (error) {
            console.error('Dashboard Fetch Error:', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    const stats = [
        { 
            icon: HeartPulse, 
            label: 'Patients', 
            value: dashboardData?.stats?.patients?.toString() || '0', 
            color: '#34C759',
            onPress: () => router.push('/patients')
        },
        { 
            icon: PawPrint, 
            label: 'Appointments', 
            value: dashboardData?.stats?.appointments?.toString() || '0', 
            color: '#FF9500',
            onPress: () => router.push('/(doc_tabs)/(tabs)/appointment')
        },
        { 
            icon: Stethoscope, 
            label: 'Surgeries', 
            value: dashboardData?.stats?.surgeries?.toString() || '0', 
            color: '#007AFF',
            onPress: () => router.push('/surgeries')
        },
    ];

    if (loading && !refreshing) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <Animated.ScrollView 
            style={[styles.container, { opacity: fadeAnim }]} 
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Header with Logout Button */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.menuButton}>
                        <Menu size={24} color="#1a1a1a" />
                    </TouchableOpacity>
                    
                    {/* Logout Button Added Here */}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <LogOut size={22} color="#FF3B30" />
                    </TouchableOpacity>
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.greeting}>Hello, Dr. {user?.name || 'Veterinarian'}!</Text>
                    <Text style={styles.subtitle}>Welcome to your veterinary dashboard</Text>
                </View>
            </View>

            {/* Baaki Cards aur Actions same rahenge... */}
            <View style={styles.statsContainer}>
                {stats.map((stat, index) => {
                    const StatCard = stat.onPress ? TouchableOpacity : View;
                    return (
                        <StatCard 
                            key={index} 
                            style={styles.statCard}
                            onPress={stat.onPress}
                            activeOpacity={stat.onPress ? 0.7 : 1}
                        >
                            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                                <stat.icon size={24} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </StatCard>
                    );
                })}
            </View>

            {/* Quick Actions and Recent Activity sections here... */}
            <View style={styles.quickActions}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity 
                        style={styles.actionCard} 
                        onPress={() => router.push('/(doc_tabs)/newtreatment')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#007AFF20' }]}>
                            <Syringe size={24} color="#007AFF" />
                        </View>
                        <Text style={styles.actionTitle}>New Treatment</Text>
                        <Text style={styles.actionDescription}>Record a new treatment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionCard} 
                        onPress={() => router.push('/(doc_tabs)/(tabs)/appointment')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#34C75920' }]}>
                            <CalendarClock size={24} color="#34C759" />
                        </View>
                        <Text style={styles.actionTitle}>Schedule</Text>
                        <Text style={styles.actionDescription}>View appointments</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.ScrollView>
    );
}

const styles = StyleSheet.create({
    // ... Existing Styles ...
    header: { 
        padding: 24, 
        paddingTop: 60, 
        backgroundColor: '#fff', 
        borderBottomWidth: 1, 
        borderBottomColor: '#f0f0f0' 
    },
    headerTop: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 20
    },
    logoutButton: {
        padding: 8,
        backgroundColor: '#FF3B3010',
        borderRadius: 8
    },
    // Baaki sab same
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    greeting: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#8E8E93' },
    container: { flex: 1, backgroundColor: '#fff' },
    statsContainer: { flexDirection: 'row', padding: 20, gap: 12 },
    statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0', elevation: 2 },
    statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    statValue: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
    statLabel: { fontSize: 12, color: '#8E8E93' },
    quickActions: { padding: 20, paddingTop: 0 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
    actionsGrid: { flexDirection: 'row', gap: 12 },
    actionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#f0f0f0', elevation: 2 },
    actionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    actionTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
    actionDescription: { fontSize: 13, color: '#8E8E93', lineHeight: 18 },
});

// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator, RefreshControl } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import { HeartPulse, PawPrint, Stethoscope, Syringe, CalendarClock, Menu, Zap, BarChart2, Bell, FileText, Cloud, Shield } from 'lucide-react-native';
// import { DrawerActions, useNavigation } from '@react-navigation/native';
// import api from "../../../services/api"

// export default function Home() {
//     const { user } = useSelector(state => state.auth);
//     const navigation = useNavigation();
//     const fadeAnim = useRef(new Animated.Value(0)).current;
    
//     // State for backend data
//     const [dashboardData, setDashboardData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);

//     const fetchDashboardData = async () => {
//         try {
//             const response = await api.get('/users/dashboard-stats');
//             if (response.data.success) {
//                 setDashboardData(response.data);
//             }
//         } catch (error) {
//             console.error("Dashboard Fetch Error:", error);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     useEffect(() => {
//         fetchDashboardData();
        
//         Animated.timing(fadeAnim, {
//             toValue: 1,
//             duration: 800,
//             useNativeDriver: true,
//         }).start();
//     }, []);

//     const onRefresh = () => {
//         setRefreshing(true);
//         fetchDashboardData();
//     };

//     // Dynamic Stats mapping
//     const stats = [
//         { 
//             icon: HeartPulse, 
//             label: 'Patients', 
//             value: dashboardData?.stats?.patients?.toString() || '0', 
//             color: '#34C759' 
//         },
//         { 
//             icon: PawPrint, 
//             label: 'Appointments', 
//             value: dashboardData?.stats?.appointments?.toString() || '0', 
//             color: '#FF9500' 
//         },
//         { 
//             icon: Stethoscope, 
//             label: 'Surgeries', 
//             value: dashboardData?.stats?.surgeries?.toString() || '0', 
//             color: '#007AFF' 
//         },
//     ];

//     const openDrawer = () => {
//         navigation.dispatch(DrawerActions.openDrawer());
//     };

//     if (loading && !refreshing) {
//         return (
//             <View style={styles.loaderContainer}>
//                 <ActivityIndicator size="large" color="#007AFF" />
//             </View>
//         );
//     }

//     return (
//         <Animated.ScrollView 
//             style={[styles.container, { opacity: fadeAnim }]} 
//             showsVerticalScrollIndicator={false}
//             refreshControl={
//                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//             }
//         >
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
//                     <Menu size={24} color="#1a1a1a" />
//                 </TouchableOpacity>
//                 <View>
//                     <Text style={styles.greeting}>Hello, Dr. {user?.name || 'Veterinarian'}!</Text>
//                     <Text style={styles.subtitle}>Welcome to your veterinary dashboard</Text>
//                 </View>
//             </View>

//             {/* Stats Grid */}
//             <View style={styles.statsContainer}>
//                 {stats.map((stat, index) => (
//                     <View key={index} style={styles.statCard}>
//                         <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
//                             <stat.icon size={24} color={stat.color} />
//                         </View>
//                         <Text style={styles.statValue}>{stat.value}</Text>
//                         <Text style={styles.statLabel}>{stat.label}</Text>
//                     </View>
//                 ))}
//             </View>

//             {/* Quick Actions */}
//             {/* Quick Actions */}
// <View style={styles.quickActions}>
//     <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Quick Actions</Text>
//     </View>
//     <View style={styles.actionsGrid}>
//         {/* New Treatment Action */}
//         <TouchableOpacity 
//             style={styles.actionCard} 
//             onPress={() => navigation.navigate('NewTreatment')} // <-- Screen name check karein
//         >
//             <View style={[styles.actionIcon, { backgroundColor: '#007AFF20' }]}>
//                 <Syringe size={24} color="#007AFF" />
//             </View>
//             <Text style={styles.actionTitle}>New Treatment</Text>
//             <Text style={styles.actionDescription}>Record a new treatment</Text>
//         </TouchableOpacity>

//         {/* Schedule Action */}
//         <TouchableOpacity 
//             style={styles.actionCard} 
//             onPress={() => navigation.navigate('Schedule')} // <-- Screen name check karein
//         >
//             <View style={[styles.actionIcon, { backgroundColor: '#34C75920' }]}>
//                 <CalendarClock size={24} color="#34C759" />
//             </View>
//             <Text style={styles.actionTitle}>Schedule</Text>
//             <Text style={styles.actionDescription}>View appointments</Text>
//         </TouchableOpacity>
//     </View>
// </View>

//             {/* Recent Patients - DYNAMIC LIST */}
//             <View style={styles.recentActivity}>
//                 <View style={styles.sectionHeader}>
//                     <Text style={styles.sectionTitle}>Recent Patients</Text>
//                 </View>
//                 <View style={styles.activityList}>
//                     {dashboardData?.recentPatients?.map((patient, index) => (
//                         <View key={patient.id || index} style={styles.activityItem}>
//                             <View style={[styles.activityDot, { backgroundColor: index === 0 ? '#007AFF' : index === 1 ? '#34C759' : '#FF9500' }]} />
//                             <View style={styles.activityContent}>
//                                 <Text style={styles.activityTitle}>{patient.name} ({patient.breed})</Text>
//                                 <Text style={styles.activityTime}>{patient.status} - {patient.time}</Text>
//                             </View>
//                             <FileText size={18} color="#8E8E93" />
//                         </View>
//                     ))}
//                     {(!dashboardData?.recentPatients || dashboardData.recentPatients.length === 0) && (
//                         <Text style={styles.emptyText}>No recent patients found.</Text>
//                     )}
//                 </View>
//             </View>

//             {/* Promo Banner */}
//             <View style={styles.promoBanner}>
//                 <Zap size={24} color="#FF9500" />
//                 <View style={styles.promoText}>
//                     <Text style={styles.promoTitle}>New Features Coming Soon!</Text>
//                     <Text style={styles.promoDescription}>AI-assisted diagnosis is on its way.</Text>
//                 </View>
//             </View>
//         </Animated.ScrollView>
//     );
// }

// const styles = StyleSheet.create({
    
//     loaderContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff'
//     },
//     emptyText: {
//         padding: 20,
//         textAlign: 'center',
//         color: '#8E8E93',
//         fontSize: 14
//     },
    
//     container: { flex: 1, backgroundColor: '#fff' },
//     header: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
//     menuButton: { marginRight: 20 },
//     greeting: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
//     subtitle: { fontSize: 14, color: '#8E8E93' },
//     statsContainer: { flexDirection: 'row', padding: 20, gap: 12 },
//     statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0', elevation: 2 },
//     statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
//     statValue: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
//     statLabel: { fontSize: 12, color: '#8E8E93' },
//     quickActions: { padding: 20, paddingTop: 0 },
//     sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
//     sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
//     actionsGrid: { flexDirection: 'row', gap: 12 },
//     actionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#f0f0f0', elevation: 2 },
//     actionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
//     actionTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
//     actionDescription: { fontSize: 13, color: '#8E8E93', lineHeight: 18 },
//     recentActivity: { padding: 20, paddingTop: 0 },
//     activityList: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#f0f0f0', elevation: 2 },
//     activityItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
//     activityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
//     activityContent: { flex: 1, marginRight: 12 },
//     activityTitle: { fontSize: 15, fontWeight: '500', color: '#1a1a1a', marginBottom: 2 },
//     activityTime: { fontSize: 13, color: '#8E8E93' },
//     promoBanner: { margin: 20, marginTop: 0, backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0', elevation: 2 },
//     promoText: { flex: 1, marginLeft: 12 },
//     promoTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
//     promoDescription: { fontSize: 13, color: '#8E8E93' },
// });