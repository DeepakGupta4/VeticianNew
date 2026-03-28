import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, SafeAreaView, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import Header from '../../components/petparent/VetFav/Header';
import SearchBar from '../../components/petparent/VetFav/SearchBar';
import VetsList from '../../components/petparent/VetFav/VetsList';
import EmptyState from '../../components/petparent/VetFav/EmptyState';
import RecommendedVets from '../../components/petparent/VetFav/RecommendedVets';
import { FAVORITE_VETS } from '../../components/petparent/VetFav/vets';
import { COLORS2 as C } from '../../components/petparent/VetFav/colors';

export default function FavoriteVetsScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(FAVORITE_VETS);
  const [query, setQuery] = useState('');

  const filteredVets = useMemo(() => {
    if (!query.trim()) return favorites;
    const q = query.toLowerCase();
    return favorites.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.clinic.toLowerCase().includes(q) ||
        v.specialization.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q)
    );
  }, [favorites, query]);

  const handlePressVet = useCallback(
    (vet) => {
      router.push({
        pathname: '/(vetician_tabs)/vet-details/[id]',
        params: { id: vet.id },
      });
    },
    [router]
  );

  const handleRemove = useCallback((id) => {
    setFavorites((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const handleCall = useCallback((vet) => {
    const url = `tel:${vet.phone.replace(/\s/g, '')}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to make a call on this device.')
    );
  }, []);

  const handleBook = useCallback(
    (vet) => {
      router.push({
        pathname: '/(vetician_tabs)/pages/BookScreen',
        params: { vetId: vet.id },
      });
    },
    [router]
  );

  const handleAddRecommended = useCallback((vet) => {
    setFavorites((prev) => {
      if (prev.some((v) => v.id === vet.id)) return prev;
      return [...prev, vet];
    });
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <Header count={favorites.length} />
      <SearchBar value={query} onChangeText={setQuery} />
      <VetsList
        vets={filteredVets}
        onPressVet={handlePressVet}
        onRemove={handleRemove}
        onCall={handleCall}
        onBook={handleBook}
        ListEmptyComponent={favorites.length === 0 ? <EmptyState /> : null}
        ListFooterComponent={
          favorites.length > 0 ? (
            <RecommendedVets
              onAddFavorite={handleAddRecommended}
              onViewAll={() => router.push('/(vetician_tabs)/pages/ClinicListScreen')}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
});
