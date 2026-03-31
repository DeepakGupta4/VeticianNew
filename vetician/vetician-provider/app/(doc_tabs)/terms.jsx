import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, StatusBar, Platform, TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, FileText } from 'lucide-react-native';

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

export default function TermsAndConditions() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />

      <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <FileText size={20} color="#7CB342" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Terms & Conditions</Text>
              <Text style={styles.headerSub}>Last updated: January 2025</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <X size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        <Para text="Welcome to Vetician Provider. By accessing or using our application, you agree to be bound by these Terms and Conditions. Please read them carefully before using the platform." />

        <Section title="1. Acceptance of Terms">
          <Para text="By creating an account and using the Vetician Provider app, you confirm that:" />
          <Bullet text="You are at least 18 years of age." />
          <Bullet text="You are a licensed veterinary professional or authorized service provider." />
          <Bullet text="You have read, understood, and agree to these Terms and Conditions." />
          <Bullet text="You have the legal authority to enter into this agreement." />
        </Section>

        <Section title="2. Service Description">
          <Para text="Vetician Provider is a platform that enables veterinary professionals to:" />
          <Bullet text="Create and manage their professional profile and clinic listings." />
          <Bullet text="Receive and manage appointment bookings from pet owners." />
          <Bullet text="Conduct video consultations with pet owners." />
          <Bullet text="Maintain patient records and medical histories." />
          <Bullet text="Manage surgical records and treatment plans." />
          <Para text="Vetician acts as a technology platform only and is not responsible for the quality of veterinary services provided." />
        </Section>

        <Section title="3. Provider Responsibilities">
          <Para text="As a service provider on Vetician, you agree to:" />
          <Bullet text="Provide accurate, complete, and up-to-date professional information." />
          <Bullet text="Hold a valid veterinary license issued by the appropriate regulatory authority." />
          <Bullet text="Maintain all required professional certifications and registrations." />
          <Bullet text="Provide services with professional competence and ethical standards." />
          <Bullet text="Respond to appointment requests in a timely manner." />
          <Bullet text="Maintain patient confidentiality and data privacy." />
          <Bullet text="Notify Vetician immediately if your license is suspended or revoked." />
        </Section>

        <Section title="4. Account Registration & Verification">
          <Para text="Account creation and verification process:" />
          <Bullet text="You must submit valid professional documents for verification." />
          <Bullet text="Vetician reserves the right to verify your credentials with relevant authorities." />
          <Bullet text="Providing false or misleading information will result in immediate account termination." />
          <Bullet text="Verification may take up to 7 business days." />
          <Bullet text="You are responsible for maintaining the security of your account credentials." />
          <Bullet text="You must notify us immediately of any unauthorized account access." />
        </Section>

        <Section title="5. Appointment & Consultation Policy">
          <Para text="Regarding appointments and consultations:" />
          <Bullet text="You must honor confirmed appointments unless there is a genuine emergency." />
          <Bullet text="Cancellations must be made at least 2 hours before the scheduled appointment." />
          <Bullet text="Repeated no-shows or last-minute cancellations may result in account suspension." />
          <Bullet text="Video consultations must be conducted in a professional environment." />
          <Bullet text="You must not share consultation recordings without explicit patient consent." />
        </Section>

        <Section title="6. Fees & Payments">
          <Para text="Regarding platform fees and payments:" />
          <Bullet text="Vetician charges a platform service fee on each completed appointment." />
          <Bullet text="Fee structures are communicated separately and may change with 30 days notice." />
          <Bullet text="Payments are processed through secure third-party payment gateways." />
          <Bullet text="Disputes regarding payments must be raised within 7 days of the transaction." />
          <Bullet text="Vetician is not responsible for payment disputes between providers and pet owners." />
        </Section>

        <Section title="7. Prohibited Activities">
          <Para text="The following activities are strictly prohibited:" />
          <Bullet text="Providing false professional credentials or impersonating another professional." />
          <Bullet text="Soliciting clients to transact outside the Vetician platform." />
          <Bullet text="Sharing patient data with unauthorized third parties." />
          <Bullet text="Using the platform for any illegal or unethical veterinary practices." />
          <Bullet text="Harassing, threatening, or discriminating against pet owners." />
          <Bullet text="Attempting to manipulate reviews or ratings." />
          <Bullet text="Using automated bots or scripts to interact with the platform." />
        </Section>

        <Section title="8. Intellectual Property">
          <Para text="Regarding intellectual property rights:" />
          <Bullet text="The Vetician platform, logo, and all content are owned by Vetician." />
          <Bullet text="You retain ownership of content you create (medical records, notes)." />
          <Bullet text="By uploading content, you grant Vetician a license to display it on the platform." />
          <Bullet text="You may not copy, reproduce, or distribute Vetician's proprietary content." />
        </Section>

        <Section title="9. Limitation of Liability">
          <Para text="Vetician's liability is limited as follows:" />
          <Bullet text="Vetician is not liable for the quality or outcome of veterinary services provided." />
          <Bullet text="We are not responsible for technical issues beyond our reasonable control." />
          <Bullet text="Our maximum liability is limited to the fees paid to us in the last 3 months." />
          <Bullet text="We are not liable for indirect, incidental, or consequential damages." />
        </Section>

        <Section title="10. Account Termination">
          <Para text="Accounts may be terminated under the following circumstances:" />
          <Bullet text="Violation of these Terms and Conditions." />
          <Bullet text="Providing false professional credentials." />
          <Bullet text="License suspension or revocation by regulatory authorities." />
          <Bullet text="Repeated complaints from pet owners." />
          <Bullet text="Voluntary account deletion by the provider." />
          <Para text="Upon termination, your profile will be removed from the platform. Existing appointment data may be retained for legal compliance purposes." />
        </Section>

        <Section title="11. Dispute Resolution">
          <Para text="In case of disputes:" />
          <Bullet text="Disputes should first be raised with our support team at care@vetician.com." />
          <Bullet text="We will attempt to resolve disputes within 14 business days." />
          <Bullet text="Unresolved disputes will be subject to arbitration under applicable laws." />
          <Bullet text="These terms are governed by the laws of India." />
        </Section>

        <Section title="12. Changes to Terms">
          <Para text="Vetician reserves the right to modify these Terms and Conditions at any time. We will provide at least 30 days notice for significant changes via email or in-app notification. Continued use of the platform after changes constitutes acceptance." />
        </Section>

        <Section title="13. Contact Us">
          <Para text="For questions about these Terms and Conditions:" />
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
