import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Activity, HeartPulse, Stethoscope, ClipboardList, Syringe, Menu, CheckCircle } from 'lucide-react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function Home() {
    const { user } = useSelector(state => state.auth);
    const navigation = useNavigation();
    const router = useRouter();

    // Paravet-specific stats
    const stats = [
        { icon: HeartPulse, label: 'Patients', value: '24', color: '#FF3B30' },
        { icon: Stethoscope, label: 'Appointments', value: '8', color: '#5856D6' },
        { icon: Syringe, label: 'Vaccinations', value: '12', color: '#34C759' },
    ];

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header with medical-themed colors */}
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
            <TouchableOpacity 
                style={styles.onboardingBanner}
                onPress={() => router.push('/(peravet_tabs)/onboarding')}
            >
                <View style={styles.bannerContent}>
                    <CheckCircle size={24} color="#00B0FF" />
                    <View style={styles.bannerText}>
                        <Text style={styles.bannerTitle}>Complete Your Onboarding</Text>
                        <Text style={styles.bannerDescription}>Set up your profile to start accepting requests</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Medical stats cards */}
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

            {/* Quick actions for medical tasks */}
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

            {/* Recent medical activities */}
            <View style={styles.recentActivity}>
                <Text style={styles.sectionTitle}>Recent Cases</Text>
                <View style={styles.activityList}>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityDot, { backgroundColor: '#FF3B30' }]} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Emergency Case</Text>
                            <Text style={styles.activityTime}>Golden Retriever - 30 mins ago</Text>
                        </View>
                    </View>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityDot, { backgroundColor: '#34C759' }]} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Vaccination Completed</Text>
                            <Text style={styles.activityTime}>Siamese Cat - 2 hours ago</Text>
                        </View>
                    </View>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityDot, { backgroundColor: '#5856D6' }]} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Post-Op Checkup</Text>
                            <Text style={styles.activityTime}>German Shepherd - Yesterday</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
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
});