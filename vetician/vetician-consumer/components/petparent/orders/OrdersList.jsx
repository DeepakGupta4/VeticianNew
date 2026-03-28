import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import OrderCard from './OrderCard';
import EmptyState from './EmptyState';

const OrdersList = ({ orders, onCardPress, onRebook }) => {
  if (!orders || orders.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <OrderCard
          order={item}
          index={index}
          onPress={onCardPress}
          onRebook={onRebook}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
});

export default OrdersList;
