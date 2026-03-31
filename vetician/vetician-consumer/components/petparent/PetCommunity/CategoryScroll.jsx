import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import CategoryItem from './CategoryItem';
import { COLORS2 } from '../../../constant/theme';

export default function CategoryScroll({ categories, onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    const next = selected === id ? null : id;
    setSelected(next);
    onSelect && onSelect(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Browse Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {categories.map((item) => (
          <CategoryItem
            key={item.id}
            item={item}
            selected={selected === item.id}
            onPress={handleSelect}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS2.subtext,
    marginLeft: 16,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});
