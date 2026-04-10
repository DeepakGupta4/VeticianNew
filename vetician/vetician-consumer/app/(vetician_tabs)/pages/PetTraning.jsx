// screens/PetTrainingScreen.js
// Vatecian App — Pet Training Main Screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { getPetsByUserId } from '../../../store/slices/authSlice';

import { COLORS, SPACING, RADIUS, SHADOWS } from '../../../constant/theme';
import {
  TRAINING_CATEGORIES,
  FEATURED_TRAINER,
  TRAINING_PROGRAMS,
} from '../../../constant/trainingData';

import TrainingCategoryCard from '../../../components/petparent/PetTraining/TrainingCategoryCard';
import TrainerHighlightCard from '../../../components/petparent/PetTraining/TrainerHighlightCard';
import TrainingProgramCard from '../../../components/petparent/PetTraining/TrainingProgramCard';
import PetSelectorCard from '../../../components/petparent/PetTraining/PetSelectorCard';
import TrainingProgressCard from '../../../components/petparent/PetTraining/TrainingProgressCard';
import TrainingBookingSection from '../../../components/petparent/PetTraining/TrainingBookingSection';

const SectionHeader = ({ title, subtitle }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
  </View>
);

const PetTrainingScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { userPets } = useSelector(state => state.auth);
  
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [selectedPet, setSelectedPet] = useState('pet1');
  const [selectedProgram, setSelectedProgram] = useState(null);
  
  // API Integration
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pets state
  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);

  useEffect(() => {
    fetchTrainingServices();
    fetchPets();
  }, []);
  
  const fetchPets = async () => {
    try {
      console.log('🐾 Fetching pets from database for training...');
      setPetsLoading(true);
      
      await dispatch(getPetsByUserId()).unwrap();
      
      const fetchedPets = userPets.data || [];
      console.log('✅ Pets fetched for training:', fetchedPets.length);
      
      const transformedPets = fetchedPets.map(pet => ({
        id: pet._id,
        name: pet.name,
        breed: pet.breed || pet.species,
        age: pet.age ? `${pet.age} years` : 'Age unknown',
        avatar: pet.profilePic || 'https://via.placeholder.com/60',
        species: pet.species,
        weight: pet.weight
      }));
      
      setPets(transformedPets);
      
      if (transformedPets.length > 0 && !selectedPet) {
        setSelectedPet(transformedPets[0].id);
      }
    } catch (error) {
      console.error('❌ Error fetching pets:', error);
    } finally {
      setPetsLoading(false);
    }
  };

  const fetchTrainingServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3000/api/training');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      } else {
        setError('Failed to load training services');
      }
    } catch (err) {
      console.error('Error fetching training services:', err);
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLORS.primaryGreen} barStyle="light-content" translucent />

      {/* ── Header (respects status bar inset) ── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pet Training</Text>

        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8}>
          <MaterialCommunityIcons name="account-circle-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* ── Subtitle Banner ── */}
      <View style={styles.subtitleBanner}>
        <MaterialCommunityIcons name="information-outline" size={15} color={COLORS.white} />
        <Text style={styles.subtitleText}>
          Professional training to build better behavior and a stronger bond with your pet.
        </Text>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* 1. Training Categories */}
        <SectionHeader title="Training Categories" subtitle="Choose what your pet needs" />
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={24} color={COLORS.red} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchTrainingServices} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={services.length > 0 ? services : TRAINING_CATEGORIES}
            horizontal
            keyExtractor={(item) => item._id || item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: SPACING.md, paddingRight: SPACING.sm }}
            renderItem={({ item, index }) => (
              <TrainingCategoryCard
                item={{
                  id: item._id || item.id,
                  name: item.name,
                  description: item.description,
                  icon: item.icon || 'paw',
                  color: item.color || COLORS.primaryGreen
                }}
                index={index}
                isSelected={selectedCategory === (item._id || item.id)}
                onPress={() => setSelectedCategory(item._id || item.id)}
              />
            )}
            style={styles.horizontalList}
          />
        )}

        {/* 2. Featured Trainer */}
        <View style={styles.section}>
          <SectionHeader title="Featured Trainer" subtitle="Recommended by Vatecian" />
          <TrainerHighlightCard trainer={FEATURED_TRAINER} />
        </View>

        {/* 3. Training Programs */}
        <View style={styles.section}>
          <SectionHeader title="Training Programs" subtitle="Choose the right plan" />
          {(services.length > 0 ? services : TRAINING_PROGRAMS).map((program, index) => (
            <TrainingProgramCard
              key={program._id || program.id}
              program={{
                id: program._id || program.id,
                name: program.name,
                level: program.level || 'Beginner',
                duration: program.duration || '4 Weeks',
                sessions: program.sessions || 12,
                price: program.price,
                focus: program.focus || program.description
              }}
              index={index}
              isSelected={selectedProgram === (program._id || program.id)}
              onSelect={setSelectedProgram}
              onEnroll={(p) => console.log('Enrolling in:', p.name)}
            />
          ))}
        </View>

        {/* 4. Select Your Pet */}
        <View style={styles.section}>
          <SectionHeader title="Select Your Pet" subtitle="Who is getting trained?" />
          {petsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primaryGreen} />
              <Text style={styles.loadingText}>Loading your pets...</Text>
            </View>
          ) : pets.length === 0 ? (
            <View style={styles.emptyPetsContainer}>
              <MaterialCommunityIcons name="paw-off" size={32} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No pets registered yet</Text>
              <TouchableOpacity 
                style={styles.addPetButton} 
                onPress={() => router.push('/(vetician_tabs)/(tabs)/pet')}
              >
                <Text style={styles.addPetButtonText}>Add Your First Pet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={pets}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <PetSelectorCard
                  pet={item}
                  isSelected={selectedPet === item.id}
                  onSelect={setSelectedPet}
                />
              )}
              ListFooterComponent={
                <TouchableOpacity
                  style={styles.addPetCard}
                  onPress={() => router.push('/(vetician_tabs)/(tabs)/pet')}
                  activeOpacity={0.85}
                >
                  <View style={styles.addPetIconWrapper}>
                    <MaterialCommunityIcons name="plus-circle-outline" size={40} color={COLORS.primaryGreen} />
                  </View>
                  <Text style={styles.addPetText}>Add Pet</Text>
                </TouchableOpacity>
              }
            />
          )}
        </View>

        {/* 5. Training Progress */}
        <View style={styles.section}>
          <SectionHeader title="How We Track Progress" subtitle="Stay informed every week" />
          <TrainingProgressCard />
        </View>

        {/* 6. Booking Section */}
        <View style={styles.section}>
          <SectionHeader title="Book a Session" subtitle="Schedule at your convenience" />
          <TrainingBookingSection />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.primaryGreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  subtitleBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: SPACING.md,
    paddingTop: 4,
    paddingBottom: 28,
  },
  subtitleText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 19,
  },
  body: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  bodyContent: {
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  horizontalList: {
    marginLeft: -SPACING.md,
    marginRight: -SPACING.md,
    marginBottom: SPACING.xs,
  },
  section: {
    marginTop: SPACING.lg,
  },
  loadingContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  errorContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.red,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  emptyPetsContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  addPetButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryGreen,
    borderRadius: RADIUS.md,
  },
  addPetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  addPetCard: {
    width: 120,
    marginRight: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    minHeight: 140,
  },
  addPetIconWrapper: {
    marginBottom: SPACING.sm,
  },
  addPetText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryGreen,
  },
});

export default PetTrainingScreen;
