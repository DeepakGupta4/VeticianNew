import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import VetCard from './VetCard';

/**
 * VetsList Component
 * Renders the vertical list of VetCards using FlatList for performance.
 *
 * Props:
 *  - vets                {array}     Array of vet objects to display
 *  - onPressVet          {function}  Called with vet object when card is tapped
 *  - onRemove            {function}  Called with vet.id to remove from favorites
 *  - onCall              {function}  Called with vet object
 *  - onBook              {function}  Called with vet object
 *  - ListHeaderComponent {component} Optional component above the list (e.g. filter chips)
 *  - ListFooterComponent {component} Optional component below the list (e.g. recommended vets)
 *  - ListEmptyComponent  {component} Shown when vets array is empty
 */
export default function VetsList({
  vets,
  onPressVet,
  onRemove,
  onCall,
  onBook,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
}) {
  return (
    <FlatList
      data={vets}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <VetCard
          vet={item}
          onPress={() => onPressVet(item)}
          onRemove={onRemove}
          onCall={onCall}
          onBook={onBook}
        />
      )}
      contentContainerStyle={s.contentContainer}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews
      initialNumToRender={6}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
}

const s = StyleSheet.create({
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 120,
    flexGrow: 1,
  },
});
