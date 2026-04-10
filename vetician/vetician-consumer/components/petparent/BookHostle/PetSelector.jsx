import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { getPetsByUserId } from '../../../store/slices/authSlice';
import { COLORS } from '../../../constant/theme';

export default function PetSelector({ selected, onSelect }) {
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
      console.log('🐾 Fetching pets from database...');
      setLoading(true);
      
      await dispatch(getPetsByUserId()).unwrap();
      
      const fetchedPets = userPets.data || [];
      console.log('✅ Pets fetched for hostel:', fetchedPets.length);
      
      // Transform pets to match UI format
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
      
      // Auto-select first pet if none selected
      if (transformedPets.length > 0 && !selected) {
        onSelect(transformedPets[0]);
      }
    } catch (error) {
      console.error('❌ Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your pets...</Text>
      </View>
    );
  }

  if (pets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="paw-off" size={32} color="#888" />
        <Text style={styles.emptyText}>No pets registered yet</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => router.push('/(vetician_tabs)/(tabs)/pet')}
        >
          <Text style={styles.addButtonText}>Add Your First Pet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hs}>
      {pets.map(p => {
        const active = selected?.id === p.id;
        return (
          <TouchableOpacity
            key={p.id}
            style={[styles.pill, active && styles.pillOn]}
            onPress={() => onSelect(p)}
            activeOpacity={0.8}
          >
            <Icon name={p.icon} size={18} color={active ? '#fff' : '#1a1a1a'} style={{ marginRight: 6 }} />
            <View>
              <Text style={[styles.name, active && styles.nameOn]}>{p.name}</Text>
              <Text style={[styles.breed, active && { color: 'rgba(255,255,255,0.75)' }]}>{p.breed}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={styles.pill}
        onPress={() => router.push('/(vetician_tabs)/(tabs)/pet')}
        activeOpacity={0.8}
      >
        <Icon name="plus-circle-outline" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
        <Text style={[styles.name, { color: COLORS.primary }]}>Add Pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 22
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#888'
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#E2EDD5'
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#888'
  },
  addButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13
  },
  hs: { marginHorizontal: -16, paddingHorizontal: 16, marginBottom: 22 },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 50, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#E2EDD5',
    marginRight: 10,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  pillOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  name:   { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  nameOn: { color: '#fff' },
  breed:  { fontSize: 11, color: '#888', marginTop: 1 },
});
