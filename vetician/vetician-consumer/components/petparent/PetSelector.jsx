import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { getPetsByUserId } from '../../store/slices/authSlice';

const PetSelector = ({ onPetSelect, selectedPetId, colors }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userPets } = useSelector(state => state.auth);
  
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePetId, setActivePetId] = useState(selectedPetId);

  const COLORS = colors || {
    primary: '#7CB342',
    white: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textMuted: '#888888',
    bg: '#F5F5F5',
    border: '#E0E0E0'
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPetId) {
      setActivePetId(selectedPetId);
    }
  }, [selectedPetId]);

  const fetchPets = async () => {
    try {
      console.log('🐾 Fetching pets from database...');
      setLoading(true);
      
      await dispatch(getPetsByUserId()).unwrap();
      
      const fetchedPets = userPets.data || [];
      console.log('✅ Pets fetched:', fetchedPets.length);
      
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
      if (transformedPets.length > 0 && !activePetId) {
        const firstPetId = transformedPets[0].id;
        setActivePetId(firstPetId);
        if (onPetSelect) {
          onPetSelect(transformedPets[0]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePetSelect = (pet) => {
    setActivePetId(pet.id);
    if (onPetSelect) {
      onPetSelect(pet);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={[styles.loadingText, { color: COLORS.textMuted }]}>Loading your pets...</Text>
      </View>
    );
  }

  if (pets.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: COLORS.white }]}>
        <Icon name="paw-off" size={32} color={COLORS.textMuted} />
        <Text style={[styles.emptyText, { color: COLORS.textMuted }]}>No pets registered yet</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: COLORS.primary }]} 
          onPress={() => router.push('/(vetician_tabs)/(tabs)/pet')}
        >
          <Text style={[styles.addButtonText, { color: COLORS.white }]}>Add Your First Pet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      {pets.map(p => (
        <TouchableOpacity
          key={p.id}
          style={[
            styles.petPill,
            { backgroundColor: COLORS.white, borderColor: COLORS.border },
            activePetId === p.id && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
          ]}
          onPress={() => handlePetSelect(p)}
        >
          <Icon 
            name={p.icon} 
            size={18} 
            color={activePetId === p.id ? COLORS.white : COLORS.primary} 
            style={{ marginRight: 6 }} 
          />
          <Text style={[
            styles.petName,
            { color: COLORS.textPrimary },
            activePetId === p.id && { color: COLORS.white }
          ]}>
            {p.name}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity 
        style={[styles.petPill, { backgroundColor: COLORS.white, borderColor: COLORS.border }]} 
        onPress={() => router.push('/(vetician_tabs)/(tabs)/pet')}
      >
        <Icon name="plus-circle-outline" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
        <Text style={[styles.petName, { color: COLORS.textPrimary }]}>Add Pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 22
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13
  },
  addButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  addButtonText: {
    fontWeight: '600',
    fontSize: 13
  },
  scrollView: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginBottom: 22
  },
  petPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 50,
    borderWidth: 1.5,
    marginRight: 10,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  petName: {
    fontSize: 13,
    fontWeight: '700'
  }
});

export default PetSelector;
