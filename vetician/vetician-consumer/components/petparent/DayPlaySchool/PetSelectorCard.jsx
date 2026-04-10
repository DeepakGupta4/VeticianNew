import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { getPetsByUserId } from '../../../store/slices/authSlice';
import FadeInCard from './FadeInCard';
import { COLORS2 } from '../../../constant/theme';

export default function PetSelectorCard({ selected, onSelect, delay = 260 }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userPets } = useSelector(state => state.auth);
  
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      console.log('🐾 Fetching pets from database for school...');
      setLoading(true);
      
      await dispatch(getPetsByUserId()).unwrap();
      
      const fetchedPets = userPets.data || [];
      console.log('✅ Pets fetched for school:', fetchedPets.length);
      
      const transformedPets = fetchedPets.map(pet => ({
        id: pet._id,
        name: pet.name,
        breed: pet.breed || pet.species,
        icon: pet.species?.toLowerCase() === 'cat' ? 'cat' : 'dog',
        species: pet.species,
        age: pet.age,
        weight: pet.weight,
        profilePic: pet.profilePic
      }));
      
      setPets(transformedPets);
      
      if (transformedPets.length > 0 && !selected) {
        onSelect(transformedPets[0].name);
      }
    } catch (error) {
      console.error('❌ Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <FadeInCard delay={delay} style={styles.card}>
        <Text style={styles.title}>Select Your Pet</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS2.primary} />
          <Text style={styles.loadingText}>Loading your pets...</Text>
        </View>
      </FadeInCard>
    );
  }

  if (pets.length === 0) {
    return (
      <FadeInCard delay={delay} style={styles.card}>
        <Text style={styles.title}>Select Your Pet</Text>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="paw-off" size={32} color={COLORS2.subtext} />
          <Text style={styles.emptyText}>No pets registered yet</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => router.push('/(vetician_tabs)/(tabs)/pet')}
          >
            <Text style={styles.addButtonText}>Add Your First Pet</Text>
          </TouchableOpacity>
        </View>
      </FadeInCard>
    );
  }

  return (
    <FadeInCard delay={delay} style={styles.card}>
      <Text style={styles.title}>Select Your Pet</Text>
      <View style={styles.row}>
        {pets.map((pet, i) => {
          const active = selected === pet.name;
          return (
            <TouchableOpacity
              key={pet.id}
              onPress={() => onSelect(pet.name)}
              activeOpacity={0.85}
              style={[styles.petCard, active && styles.petCardActive, i < pets.length - 1 && { marginRight: 12 }]}
            >
              <MaterialCommunityIcons
                name={pet.icon}
                size={34}
                color={COLORS2.primary}
                style={styles.icon}
              />
              <Text style={[styles.name, active && styles.nameActive]}>{pet.name}</Text>
              <Text style={styles.breed}>{pet.breed}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          onPress={() => router.push('/(vetician_tabs)/(tabs)/pet')}
          activeOpacity={0.85}
          style={[styles.petCard, { marginLeft: pets.length > 0 ? 12 : 0 }]}
        >
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={34}
            color={COLORS2.primary}
            style={styles.icon}
          />
          <Text style={[styles.name, { color: COLORS2.primary }]}>Add Pet</Text>
        </TouchableOpacity>
      </View>
    </FadeInCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS2.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 14,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS2.subtext,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS2.subtext,
  },
  addButton: {
    marginTop: 12,
    backgroundColor: COLORS2.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
  },
  petCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS2.card,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
  },
  petCardActive: {
    borderColor: COLORS2.primary,
    backgroundColor: COLORS2.card,
  },
  icon: {
    marginBottom: 8,
  },
  name: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 2,
  },
  nameActive: {
    color: COLORS2.primary,
  },
  breed: {
    fontSize: 11.5,
    color: COLORS2.subtext,
    textAlign: 'center',
  },
});
