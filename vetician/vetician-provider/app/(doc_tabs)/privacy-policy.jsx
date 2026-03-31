import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, StatusBar, Platform, TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Shield } from 'lucide-react-native';

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Para = ({ text }) => <Text style={styles.para}>{text}</Text>;

const Bullet = ({ text }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />

      <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Shield size={20} color="#7CB342" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Privacy Policy</Text>
              <Text style={styles.headerSub}>Last updated: January 2025</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <X size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        <Para text="Vetician ('we', 'our', or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the Vetician Provider application." />

        <Section title="1. Information We Collect">
          <Para text="We collect the following types of information:" />
          <Bullet text="Personal Information: Name, email address, phone number, and profile photo." />
          <Bullet text="Professional Information: Veterinary license number, qualifications, specialization, years of experience, and identity proof documents." />
          <Bullet text="Clinic Information: Clinic name, address, location coordinates, operating hours, and fees." />
          <Bullet text="Usage Data: App activity, login timestamps, device information, and IP address." />
          <Bullet text="Communication Data: Messages, appointment notes, and support requests." />
        </Section>

        <Section title="2. How We Use Your Information">
          <Para text="We use the collected information for the following purposes:" />
          <Bullet text="To verify your professional credentials and activate your provider account." />
          <Bullet text="To display your profile and clinic to pet owners seeking veterinary services." />
          <Bullet text="To manage appointments, notifications, and communications." />
          <Bullet text="To process payments and maintain transaction records." />
          <Bullet text="To improve our platform, features, and user experience." />
          <Bullet text="To send important updates, policy changes, and service announcements." />
          <Bullet text="To comply with legal obligations and resolve disputes." />
        </Section>

        <Section title="3. Information Sharing">
          <Para text="We do not sell your personal information. We may share your information with:" />
          <Bullet text="Pet Owners: Your name, specialization, clinic details, and profile photo are visible to pet owners on the platform." />
          <Bullet text="Service Providers: Third-party vendors who assist in operating our platform (cloud storage, payment processing, SMS services)." />
          <Bullet text="Legal Authorities: When required by law, court order, or government regulation." />
          <Bullet text="Business Transfers: In case of merger, acquisition, or sale of assets, your data may be transferred." />
        </Section>

        <Section title="4. Data Security">
          <Para text="We implement industry-standard security measures to protect your information:" />
          <Bullet text="All data is encrypted in transit using SSL/TLS protocols." />
          <Bullet text="Passwords are hashed using bcrypt with salt rounds." />
          <Bullet text="JWT tokens are used for secure authentication with expiry." />
          <Bullet text="Access to personal data is restricted to authorized personnel only." />
          <Bullet text="Regular security audits and vulnerability assessments are conducted." />
        </Section>

        <Section title="5. Data Retention">
          <Para text="We retain your personal data for as long as your account is active or as needed to provide services. Upon account deletion:" />
          <Bullet text="Your profile, clinic, and appointment data will be permanently deleted." />
          <Bullet text="Some data may be retained for up to 90 days for legal and compliance purposes." />
          <Bullet text="Anonymized, aggregated data may be retained indefinitely for analytics." />
        </Section>

        <Section title="6. Your Rights">
          <Para text="You have the following rights regarding your personal data:" />
          <Bullet text="Access: Request a copy of the personal data we hold about you." />
          <Bullet text="Correction: Update or correct inaccurate information through your profile settings." />
          <Bullet text="Deletion: Delete your account and associated data through Settings > Delete Account." />
          <Bullet text="Portability: Request your data in a portable format." />
          <Bullet text="Objection: Object to processing of your data for marketing purposes." />
        </Section>

        <Section title="7. Cookies & Tracking">
          <Para text="Our mobile application does not use browser cookies. However, we may use device identifiers and analytics tools to understand app usage patterns and improve performance." />
        </Section>

        <Section title="8. Third-Party Services">
          <Para text="Our app integrates with the following third-party services, each with their own privacy policies:" />
          <Bullet text="Twilio: For SMS OTP verification and communication." />
          <Bullet text="Cloudinary: For secure image and document storage." />
          <Bullet text="MongoDB Atlas: For secure database hosting." />
          <Bullet text="VideoSDK: For video consultation features." />
        </Section>

        <Section title="9. Children's Privacy">
          <Para text="The Vetician Provider app is intended for professional veterinarians and service providers only. We do not knowingly collect information from individuals under 18 years of age." />
        </Section>

        <Section title="10. Changes to This Policy">
          <Para text="We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification. Continued use of the app after changes constitutes acceptance of the updated policy." />
        </Section>

        <Section title="11. Contact Us">
          <Para text="If you have questions or concerns about this Privacy Policy or our data practices, please contact us:" />
          <Bullet text="Email: care@vetician.com" />
          <Bullet text="Support: care@vetician.com" />
          <Bullet text="Website: www.vetician.com" />
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    paddingTop: Platform.OS === 'android' ? 12 : 12,
    paddingBottom: 20, paddingHorizontal: 16,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },

  scroll: { flex: 1 },
  content: { padding: 16 },

  section: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#2E7D32', marginBottom: 10 },
  para: { fontSize: 14, color: '#444', lineHeight: 22, marginBottom: 8 },
  bulletRow: { flexDirection: 'row', marginBottom: 6, paddingRight: 8 },
  bullet: { fontSize: 14, color: '#7CB342', marginRight: 8, marginTop: 1 },
  bulletText: { fontSize: 14, color: '#444', lineHeight: 22, flex: 1 },
});
