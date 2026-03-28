import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { COLORS2 } from '../../components/petparent/orders/colors';
import { ORDERS_DATA } from '../../components/petparent/orders/ordersData';
import Header from '../../components/petparent/orders/Header';
import TabFilter from '../../components/petparent/orders/TabFilter';
import OrdersList from '../../components/petparent/orders/OrdersList';
import Loader from '../../components/petparent/orders/Loader';

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredOrders(ORDERS_DATA);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeTab === 'All') {
      setFilteredOrders(ORDERS_DATA);
    } else {
      setFilteredOrders(ORDERS_DATA.filter((o) => o.status === activeTab));
    }
  }, [activeTab]);

  const handleTabChange = useCallback((tab) => setActiveTab(tab), []);

  const handleCardPress = useCallback((order) => {
    router.push({
      pathname: '/(vetician_tabs)/order-details',
      params: { orderId: order.id },
    });
  }, []);

  const handleRebook = useCallback((order) => {
    Alert.alert(
      'Rebook Service',
      `Would you like to rebook ${order.service} for ${order.pet.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Rebook', onPress: () => Alert.alert('Booking Initiated', 'We will confirm your booking shortly.') },
      ]
    );
  }, []);

  const handleExplore = useCallback(() => router.push('/'), []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS2.card} />
      <View style={styles.container}>
        <Header />
        <TabFilter activeTab={activeTab} onTabChange={handleTabChange} />
        {loading ? (
          <Loader />
        ) : (
          <OrdersList
            orders={filteredOrders}
            onCardPress={handleCardPress}
            onRebook={handleRebook}
            onExplore={handleExplore}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS2.card },
  container: { flex: 1, backgroundColor: COLORS2.bg },
});

export default OrdersScreen;
