import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, SafeAreaView, StatusBar, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getPetsByUserId } from '../../store/slices/authSlice';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constant/theme';

const SPECIES_EMOJI = { Dog: '🐕', Cat: '🐱', Bird: '🐦' };

const PetCard = ({ pet, onEdit }) => {
  if (!pet) return null;
  return (
    <View style={s.card}>
      {/* Image */}
      {pet.petPhoto ? (
        <Image source={{ uri: pet.petPhoto }} style={s.petImage} />
      ) : (
        <View style={s.petImagePlaceholder}>
          <Text style={s.petEmoji}>{SPECIES_EMOJI[pet.species] || '🐾'}</Text>
        </View>
      )}

      {/* Edit button */}
      <TouchableOpacity style={s.editBtn} onPress={onEdit} activeOpacity={0.8}>
        <MaterialCommunityIcons name="pencil" size={16} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Info */}
      <View style={s.cardBody}>
        <Text style={s.petName} numberOfLines={1}>{pet.name}</Text>
        <View style={s.badge}>
          <Text style={s.badgeText}>{pet.species}</Text>
        </View>
        <View style={s.infoRow}>
          <View style={s.infoChip}>
            <MaterialCommunityIcons name="dog" size={12} color={COLORS.textSecondary} />
            <Text style={s.infoChipText} numberOfLines={1}>{pet.breed || 'Mixed'}</Text>
          </View>
          {pet.gender && (
            <View style={s.infoChip}>
              <MaterialCommunityIcons name="gender-male-female" size={12} color={COLORS.textSecondary} />
              <Text style={s.infoChipText}>{pet.gender}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default function MyPets() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const pets = useSelector(state => state.auth?.userPets?.data || []);

  useEffect(() => { fetchPets(); }, []);

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
    setRefreshing(true);
    await dispatch(getPetsByUserId());
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar backgroundColor={COLORS.primaryGreen} barStyle="light-content" translucent />

      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={s.headerIcon} onPress={() => router.back()} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Pets</Text>
        <TouchableOpacity style={s.headerIcon} onPress={() => router.push('/pages/PetDetail')} activeOpacity={0.8}>
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={s.subtitleBanner}>
        <MaterialCommunityIcons name="paw" size={15} color="#fff" />
        <Text style={s.subtitleText}>Manage your pet's profile and health records.</Text>
      </View>

      {/* Body */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={s.loadingText}>Loading pets...</Text>
        </View>
      ) : pets.length === 0 ? (
        <View style={s.center}>
          <Text style={s.emptyEmoji}>🐾</Text>
          <Text style={s.emptyTitle}>No Pets Yet</Text>
          <Text style={s.emptySubtitle}>Add your first furry friend</Text>
          <TouchableOpacity style={s.addBtn} onPress={() => router.push('/pages/PetDetail')} activeOpacity={0.85}>
            <MaterialCommunityIcons name="plus" size={20} color="#fff" />
            <Text style={s.addBtnText}>Add Pet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Count bar */}
          <View style={s.countBar}>
            <Text style={s.countText}>{pets.length} {pets.length === 1 ? 'Pet' : 'Pets'}</Text>
            <TouchableOpacity style={s.refreshBtn} onPress={handleRefresh}>
              <MaterialCommunityIcons name="refresh" size={20} color={COLORS.primary} />
              <Text style={s.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={pets}
            numColumns={2}
            keyExtractor={item => item._id}
            contentContainerStyle={s.list}
            columnWrapperStyle={s.row}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />}
            renderItem={({ item }) => (
              <PetCard
                pet={item}
                onEdit={() => router.push({ pathname: '/pages/EditPetScreen', params: { petId: item._id } })}
              />
            )}
          />

          {/* FAB */}
          <TouchableOpacity style={s.fab} onPress={() => router.push('/pages/PetDetail')} activeOpacity={0.85}>
            <MaterialCommunityIcons name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primaryGreen, paddingHorizontal: 16, paddingBottom: 16 },
  headerIcon:    { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle:   { fontSize: 19, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  subtitleBanner:{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: COLORS.primaryGreen, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 20 },
  subtitleText:  { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 19 },

  // States
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText:  { marginTop: 12, color: COLORS.textMuted, fontSize: 15 },
  emptyEmoji:   { fontSize: 72, marginBottom: 16 },
  emptyTitle:   { fontSize: 22, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
  emptySubtitle:{ fontSize: 14, color: COLORS.textMuted, marginBottom: 28 },
  addBtn:       { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: RADIUS.md, ...SHADOWS.card },
  addBtnText:   { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Count bar
  countBar:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  countText:   { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  refreshBtn:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  refreshText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  // List
  list: { paddingHorizontal: 12, paddingBottom: 100 },
  row:  { justifyContent: 'space-between' },

  // Card
  card:              { width: '48%', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, marginBottom: 16, overflow: 'hidden', ...SHADOWS.card },
  petImage:          { width: '100%', height: 150 },
  petImagePlaceholder:{ width: '100%', height: 150, backgroundColor: COLORS.primaryPale, justifyContent: 'center', alignItems: 'center' },
  petEmoji:          { fontSize: 52 },
  editBtn:           { position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', ...SHADOWS.card },
  cardBody:          { padding: 12 },
  petName:           { fontSize: 16, fontWeight: '700', color: COLORS.textDark, marginBottom: 6 },
  badge:             { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, backgroundColor: COLORS.primaryPale, marginBottom: 10 },
  badgeText:         { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  infoRow:           { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  infoChip:          { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  infoChipText:      { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },

  // FAB
  fab: { position: 'absolute', bottom: 30, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
});
