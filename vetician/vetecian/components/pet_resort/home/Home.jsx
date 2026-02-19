import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { PawPrint, Dog, Cat, Calendar, HomeIcon, Menu } from 'lucide-react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
    const { user } = useSelector(state => state.auth);
    const navigation = useNavigation();

    const stats = [
        { icon: PawPrint, label: 'Current Guests', value: '24', color: '#FF9500' },
        { icon: Dog, label: 'Dogs', value: '18', color: '#5856D6' },
        { icon: Cat, label: 'Cats', value: '6', color: '#FF3B30' },
    ];

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                    <Menu size={24} color="#fff" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.greeting}>Welcome, {user?.name || 'Pet Caretaker'}!</Text>
                    <Text style={styles.subtitle}>Today at the pet resort</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                {stats.map((stat, index) => (
                    <View key={index} style={[styles.statCard, { borderTopColor: stat.color }]}>
                        <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                            <stat.icon size={20} color={stat.color} />
                        </View>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.quickActions}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#FF950010' }]}>
                        <View style={[styles.actionIcon, { backgroundColor: '#FF950020' }]}>
                            <PawPrint size={20} color="#FF9500" />
                        </View>
                        <Text style={styles.actionTitle}>New Check-in</Text>
                        <Text style={styles.actionDescription}>Register a new pet guest</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#5856D610' }]}>
                        <View style={[styles.actionIcon, { backgroundColor: '#5856D620' }]}>
                            <HomeIcon size={20} color="#5856D6" />
                        </View>
                        <Text style={styles.actionTitle}>Kennel Status</Text>
                        <Text style={styles.actionDescription}>View available spaces</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.recentActivity}>
                <Text style={styles.sectionTitle}>Recent Activities</Text>
                <View style={styles.activityList}>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityDot, { backgroundColor: '#FF9500' }]} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>New Arrival</Text>
                            <Text style={styles.activityTime}>Golden Retriever "Max" checked in</Text>
                        </View>
                    </View>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityDot, { backgroundColor: '#34C759' }]} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Grooming Completed</Text>
                            <Text style={styles.activityTime}>Persian Cat "Luna"</Text>
                        </View>
                    </View>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityDot, { backgroundColor: '#007AFF' }]} />
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Playtime Scheduled</Text>
                            <Text style={styles.activityTime}>Group play for 3 dogs</Text>
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
        backgroundColor: '#F9F9F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#FF9500',
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
        color: 'rgba(255,255,255,0.9)',
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        marginTop: -30,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderTopWidth: 4,
        elevation: 2,
        alignItems: 'center',
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
        borderRadius: 16,
        padding: 16,
        elevation: 1,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
        borderRadius: 16,
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