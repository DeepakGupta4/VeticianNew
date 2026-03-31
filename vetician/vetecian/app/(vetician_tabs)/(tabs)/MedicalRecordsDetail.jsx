import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ApiService from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recordCounts, setRecordCounts] = useState({});
  const [petId, setPetId] = useState(null);

  useEffect(() => {
    fetchPetIdAndRecords();
  }, []);

  const fetchPetIdAndRecords = async () => {
    try {
      setLoading(true);
      // Get the current pet ID from AsyncStorage or params
      const storedPetId = params.petId || await AsyncStorage.getItem('selectedPetId');
      setPetId(storedPetId);

      if (storedPetId) {
        await fetchRecordCounts(storedPetId);
      }
    } catch (error) {
      console.error('Error fetching pet records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecordCounts = async (petId) => {
    try {
      const records = await ApiService.getMedicalRecords(petId);
      
      // Count records by type
      const counts = {
        prescription: 0,
        labReport: 0,
        vaccination: 0,
        healthCertificate: 0,
        vaccineDeclaration: 0,
        other: 0,
      };

      if (records && Array.isArray(records)) {
        records.forEach(record => {
          if (counts.hasOwnProperty(record.type)) {
            counts[record.type]++;
          }
        });
      }

      setRecordCounts(counts);
    } catch (error) {
      console.error('Error fetching record counts:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (petId) {
      await fetchRecordCounts(petId);
    }
    setRefreshing(false);
  };

  const handleCardPress = (item) => {
    if (!petId) {
      alert('Please select a pet first');
      return;
    }

    // Navigate to specific record type screen
    const typeMap = {
      1: 'prescription',
      2: 'labReport',
      3: 'vaccination',
      4: 'healthCertificate',
      5: 'vaccineDeclaration',
      6: 'upload',
    };

    const recordType = typeMap[item.id];
    
    if (recordType === 'upload') {
      // Navigate to upload screen
      router.push({
        pathname: '/pages/UploadMedicalDocument',
        params: { petId }
      });
    } else {
      // Navigate to record list screen
      router.push({
        pathname: '/pages/MedicalRecordsList',
        params: { petId, type: recordType, title: item.title }
      });
    }
  };

  const getRecordCount = (itemId) => {
    const typeMap = {
      1: 'prescription',
      2: 'labReport',
      3: 'vaccination',
      4: 'healthCertificate',
      5: 'vaccineDeclaration',
    };
    const type = typeMap[itemId];
    return recordCounts[type] || 0;
  };

  if (loading) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY_GREEN} />
            <Text style={styles.loadingText}>Loading medical records...</Text>
          </View>
        </SafeAreaView>
      </PaperProvider>
    );
  }

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[PRIMARY_GREEN]}
            />
          }
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
                        <View style={styles.titleRow}>
                          <Text style={styles.cardTitle}>{item.title}</Text>
                          {item.id !== 6 && (
                            <View style={styles.badge}>
                              <Text style={styles.badgeText}>{getRecordCount(item.id)}</Text>
                            </View>
                          )}
                        </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#999999',
    fontWeight: '400',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});
