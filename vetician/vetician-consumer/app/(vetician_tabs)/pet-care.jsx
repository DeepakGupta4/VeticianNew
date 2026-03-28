import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

import { COLORS2 } from '../../components/petparent/PetCareTips/colors.jsx';
import { TIPS_DATA } from '../../components/petparent/PetCareTips/tipsData.jsx';
import Header from '../../components/petparent/PetCareTips/Header.jsx';
import SearchBar from '../../components/petparent/PetCareTips/SearchBar.jsx';
import CategoryFilter from '../../components/petparent/PetCareTips/CategoryFilter.jsx';
import FeaturedTip from '../../components/petparent/PetCareTips/FeaturedTip.jsx';
import TipCard from '../../components/petparent/PetCareTips/TipCard.jsx';
import EmptyState from '../../components/petparent/PetCareTips/EmptyState.jsx';

export default function PetCareTipsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedTips, setSavedTips]               = useState([]);

  const featuredTip = useMemo(() => TIPS_DATA.find((t) => t.isFeatured), []);

  const filteredTips = useMemo(() => {
    let result = TIPS_DATA;
    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.category === selectedCategory);
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, searchQuery]);

  const showFeatured = featuredTip && selectedCategory === 'all' && searchQuery.length === 0;

  const listTips = useMemo(
    () => (showFeatured ? filteredTips.filter((t) => !t.isFeatured) : filteredTips),
    [filteredTips, showFeatured]
  );

  const handlePressTip = useCallback((tip) => {
    router.push({
      pathname: '/(vetician_tabs)/pet-care-tip-details',
      params: { tipId: tip.id },
    });
  }, [router]);

  const handleSaveTip = useCallback((tipId) => {
    setSavedTips((prev) =>
      prev.includes(tipId) ? prev.filter((id) => id !== tipId) : [...prev, tipId]
    );
  }, []);

  const handleCategorySelect = useCallback((cat) => {
    setSelectedCategory(cat);
    setSearchQuery('');
  }, []);

  const renderItem = useCallback(({ item, index }) => (
    <TipCard
      tip={item}
      index={index}
      onPress={handlePressTip}
      onSave={handleSaveTip}
      isSaved={savedTips.includes(item.id)}
    />
  ), [handlePressTip, handleSaveTip, savedTips]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS2.primary} />
      <Header onBack={() => router.back()} />

      <FlatList
        data={listTips}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
            <View style={styles.filterWrap}>
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />
            </View>
            {showFeatured && (
              <FeaturedTip tip={featuredTip} onPress={handlePressTip} />
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            message="No tips found"
            subtitle="Try a different search term or browse another category."
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({ length: 134, offset: 134 * index, index })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  listHeader: {
    backgroundColor: '#fff',
  },
  filterWrap: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS2.border,
  },
  listContent: {
    backgroundColor: '#fff',
    paddingBottom: 32,
    flexGrow: 1,
  },
});
