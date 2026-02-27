import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { PawPrint, ChevronLeft, MaterialIcons, FontAwesome5 } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getPetsByUserId } from '../../store/slices/authSlice';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const PET_TYPES = {
  Dog: 'dog',
  Cat: 'cat',
  default: 'paw'
};

const PetCard = ({ pet, onPress, onEdit }) => {
  if (!pet) return null;

  const getPetIcon = () => {
    return PET_TYPES[pet.species] || PET_TYPES.default;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardTop}>
        {pet?.petPhoto ? (
          <Image source={{ uri: pet.petPhoto }} style={styles.petImage} />
        ) : (
          <View style={[styles.petImage, { backgroundColor: '#4E8D7C', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 40, color: 'white' }}>🐾</Text>
          </View>
        )}
        <TouchableOpacity 
          onPress={(e) => { e.stopPropagation(); onEdit(); }}
          style={styles.editBtn}
        >
          <Text style={{ fontSize: 18, color: '#4E8D7C' }}>✏️</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardBottom}>
        <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pet.species}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>🐕 {pet.breed || 'Mixed'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>🎂 {pet.age || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MyPets() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const pets = useSelector(state => state.auth?.userPets?.data || []);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      await dispatch(getPetsByUserId()).unwrap();
    } catch (err) {
      console.error('Error loading pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await dispatch(getPetsByUserId());
    } finally {
      setRefreshing(false);
    }
  };

  const handleEditPress = (pet) => {
    router.push({
      pathname: '/pages/EditPetScreen',
      params: { petId: pet._id }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Pets</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E8D7C" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 80 }}>🐾</Text>
          <Text style={styles.emptyTitle}>No Pets Yet</Text>
          <Text style={styles.emptyText}>Add your first pet</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/pages/PetDetail')}>
            <Text style={styles.addBtnText}>Add Pet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.countHeader}>
            <Text style={styles.count}>{pets.length} {pets.length === 1 ? 'Pet' : 'Pets'}</Text>
            <TouchableOpacity onPress={handleRefresh}>
              <Text style={{ fontSize: 24 }}>🔄</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={pets}
            numColumns={2}
            renderItem={({ item }) => (
              <PetCard 
                pet={item}
                onPress={() => {}}
                onEdit={() => handleEditPress(item)}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push('/pages/PetDetail')}
          >
            <Text style={{ fontSize: 28, color: 'white' }}>+</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#4E8D7C', paddingBottom: 16, paddingHorizontal: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' },
  placeholder: { width: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: '#4E8D7C', fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 24, fontWeight: '700', color: '#2C3E50', marginTop: 20, marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#7D7D7D', marginBottom: 32 },
  addBtn: { paddingHorizontal: 32, paddingVertical: 14, backgroundColor: '#4E8D7C', borderRadius: 12, elevation: 4 },
  addBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },
  countHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  count: { fontSize: 18, fontWeight: '700', color: '#2C3E50' },
  list: { paddingHorizontal: 12, paddingBottom: 100 },
  row: { justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: 'white', borderRadius: 20, marginBottom: 16, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  cardTop: { position: 'relative' },
  petImage: { width: '100%', height: 160 },
  editBtn: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  cardBottom: { padding: 16 },
  petName: { fontSize: 18, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: '#E8F5E9', marginBottom: 12 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#4E8D7C' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontSize: 12, color: '#7D7D7D' },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#4E8D7C', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#4E8D7C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }
});
