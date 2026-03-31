import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  Card,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7CB342',
    secondary: '#558B2F',
    tertiary: '#558B2F',
    error: '#f13c20',
  },
};

const PRIMARY_GREEN = '#7CB342';
const DARK_GREEN = '#558B2F';

const medicalRecordTypes = [
  {
    id: 1,
    title: 'Prescription',
    subtitle: 'View all prescriptions',
    icon: 'file-document',
    color: '#4CAF50',
  },
  {
    id: 2,
    title: 'Lab Reports',
    subtitle: 'View test results',
    icon: 'flask',
    color: '#2196F3',
  },
  {
    id: 3,
    title: 'Vaccination',
    subtitle: 'Vaccination records',
    icon: 'needle',
    color: '#FF9800',
  },
  {
    id: 4,
    title: 'Health Certificate',
    subtitle: 'Health certificates',
    icon: 'certificate',
    color: '#9C27B0',
  },
  {
    id: 5,
    title: 'Vaccine Declaration',
    subtitle: 'Vaccine declarations',
    icon: 'file-check',
    color: '#F44336',
  },
  {
    id: 6,
    title: 'Upload Documents',
    subtitle: 'Upload new documents',
    icon: 'cloud-upload',
    color: '#00BCD4',
  },
];

export default function MedicalRecordsDetail() {
  const router = useRouter();

  const handleCardPress = (item) => {
    // Handle navigation based on card type
    console.log('Pressed:', item.title);
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[DARK_GREEN, '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerSection}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons name="chevron-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Medical Records</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardsContainer}>
            {medicalRecordTypes.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => handleCardPress(item)}
                style={styles.cardWrapper}
              >
                <Card style={styles.card}>
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.cardLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={32}
                          color={item.color}
                        />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="#DDDDDD"
                    />
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#558B2F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  cardsContainer: {
    gap: 12,
  },
  cardWrapper: {
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#999999',
    fontWeight: '400',
  },
});
