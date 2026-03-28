import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { COLORS2 } from './colors.jsx';
import { CATEGORIES } from './tipsData.jsx';
import CategoryItem from './CategoryItem';

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>Browse by Topic</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => (
          <CategoryItem
            key={cat.id}
            item={cat}
            isSelected={selectedCategory === cat.id}
            onPress={onSelectCategory}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS2.subtext,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});

export default CategoryFilter;
