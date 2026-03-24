import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Text as RNText,
} from 'react-native';
import { Card, Text, MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constant/theme';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: '#7CB342' },
};

const PRIMARY_GREEN = '#7CB342';

const menuItems = [
  { id: 'details',      title: 'Profile Details',       subtitle: 'Name, Breed, Birthday, etc.',      icon: 'paw' },
  { id: 'medical',      title: 'Medical Records',        subtitle: 'View Prescriptions & Lab Reports', icon: 'medical-bag' },
  { id: 'appointments', title: 'Appointments & Orders',  subtitle: 'Check Invoices and Order details', icon: 'calendar-check' },
  { id: 'vaccination',  title: 'Vaccination',            subtitle: 'View Pet Vaccination Records',     icon: 'needle' },
  { id: 'help',         title: 'Need Help',              subtitle: 'Whisker Your Worries Away',        icon: 'help-circle' },
  { id: 'membership',   title: 'Premium Membership',     subtitle: 'Check your membership utilisation',icon: 'heart' },
];

export default function PetTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openForm = () => router.push('/(vetician_tabs)/pages/PetDetail');

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.primaryGreen} barStyle="light-content" translucent />

        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()} activeOpacity={0.8}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <RNText style={styles.headerTitle}>My Pet</RNText>
          <TouchableOpacity style={styles.headerIcon} onPress={openForm} activeOpacity={0.8}>
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.subtitleBanner}>
          <MaterialCommunityIcons name="paw" size={15} color="#fff" />
          <RNText style={styles.subtitleText}>Manage your pet's profile and health records.</RNText>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentWrapper}>
          <View style={styles.contentSection}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.95}
                onPress={() => { if (item.id === 'details') openForm(); }}
              >
                <Card style={{ marginVertical: 4 }}>
                  <Card.Content style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                        <View style={{ width: 44, height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                          <MaterialCommunityIcons name={item.icon} size={24} color={PRIMARY_GREEN} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 15, fontWeight: '600', color: '#1F1F1F', marginBottom: 2 }}>{item.title}</Text>
                          <Text style={{ fontSize: 12, color: '#999999', fontWeight: '400' }}>{item.subtitle}</Text>
                        </View>
                      </View>
                      <MaterialCommunityIcons name="chevron-right" size={24} color="#DDDDDD" />
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primaryGreen, paddingHorizontal: 16, paddingBottom: 16,
  },
  headerIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 19, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  subtitleBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 16, paddingTop: 4, paddingBottom: 20,
  },
  subtitleText: { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 19 },
  contentSection: { paddingHorizontal: 12, paddingVertical: 16, gap: 8 },
  contentWrapper: { flexGrow: 1, paddingBottom: 100 },
});
