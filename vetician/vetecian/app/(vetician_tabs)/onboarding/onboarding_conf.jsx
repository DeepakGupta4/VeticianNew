import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Star, TrendingUp, Eye, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function VeticianProfileSetup() {
    const router = useRouter();

    const benefits = [
        {
            icon: 'visibility',
            title: 'Increased Visibility',
            description: 'Vetician Profile makes you visible to pet owners searching for veterinarians in your area'
        },
        {
            icon: 'consult',
            title: 'Online Consultations',
            description: 'Virtual pet consultations are convenient and help expand your practice reach'
        },
        {
            icon: 'feedback',
            title: 'Client Feedback',
            description: 'Manage and respond to pet owners\' reviews about your services'
        }
    ];

    const ICONS = {
        visibility: Eye,
        consult: TrendingUp,
        feedback: Star
    };

    const ICON_COLORS = {
        visibility: '#00B0FF',
        consult: '#34C759',
        feedback: '#FF9500'
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome to Vetician</Text>
                    <Text style={styles.subtitle}>Complete Your Veterinarian Profile</Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.introText}>
                    Let's get you started with Vetician Profile. This will give you access to key features — Online Consultations and Client Feedback.
                </Text>

                <View style={styles.benefitsContainer}>
                    {benefits.map((benefit, index) => {
                        const IconComponent = ICONS[benefit.icon];
                        return (
                            <View key={index} style={styles.benefitCard}>
                                <View style={styles.benefitIcon}>
                                    {IconComponent && <IconComponent size={24} color={ICON_COLORS[benefit.icon]} />}
                                </View>
                                <View style={styles.benefitText}>
                                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                                    <Text style={styles.benefitDescription}>{benefit.description}</Text>
                                </View>
                                <ChevronRight size={20} color="#666" />
                            </View>
                        );
                    })}
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/onboarding/parent_detail')}>
                    <Text style={styles.primaryButtonText}>CREATE MY VET PROFILE</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/(tabs)')}>
                    <Text style={styles.secondaryButtonText}>SETUP LATER</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e1e5e9' },
    greeting: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
    subtitle: { fontSize: 16, color: '#666' },
    contentContainer: { padding: 24 },
    introText: { fontSize: 16, color: '#333', lineHeight: 24, marginBottom: 32 },
    benefitsContainer: { marginBottom: 32 },
    benefitCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e1e5e9' },
    benefitIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#00B0FF20', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    benefitText: { flex: 1 },
    benefitTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
    benefitDescription: { fontSize: 14, color: '#666', lineHeight: 20 },
    primaryButton: { backgroundColor: '#4CAF50', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 16 },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    secondaryButton: { backgroundColor: 'transparent', borderRadius: 8, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#4CAF50' },
    secondaryButtonText: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold' }
});
