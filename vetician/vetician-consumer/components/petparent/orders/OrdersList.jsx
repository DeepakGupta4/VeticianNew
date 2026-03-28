import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import OrderCard from './OrderCard';
import EmptyState from './EmptyState';
import { COLORS2 } from './colors';

const OrdersList = ({ orders, onCardPress, onExplore }) => {
  if (!orders || orders.length === 0) {
    return <EmptyState onExplore={onExplore} />;
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <OrderCard order={item} onPress={onCardPress} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: { paddingTop: 16, paddingBottom: 32 },
});

export default OrdersList;
