import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';
import { ORDERS_DATA } from './ordersData';

import OrderDetails from './OrderDetails';
import ActionButtons from './ActionButtons';

const OrderDetailsScreen = () => {
  const { orderId } = useLocalSearchParams();
  const order = ORDERS_DATA.find((o) => o.id === orderId);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleRebook = useCallback((o) => {
    Alert.alert(
      'Rebook Service',
      `Rebook ${o.service} for ${o.pet.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () =>
            Alert.alert('Booked!', 'Your service has been rebooked.'),
        },
      ]
    );
  }, []);

  const handleSupport = useCallback(() => {
    router.push('/(vetician_tabs)/help');
  }, []);

  const handleInvoice = useCallback((o) => {
    Alert.alert(
      'Download Invoice',
      `Invoice for ${o.id} will be downloaded shortly.`,
      [{ text: 'OK' }]
    );
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS2.primary} />

      {/* Floating back button over the green hero */}
      <View style={styles.backBtnWrap} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <OrderDetails order={order} />
        <ActionButtons
          order={order}
          onRebook={handleRebook}
          onSupport={handleSupport}
          onInvoice={handleInvoice}
        />
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS2.primary,
  },
  backBtnWrap: {
    position: 'absolute',
    top: 52,
    left: 16,
    zIndex: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS2.bg,
  },
  content: {
    flexGrow: 1,
  },
  bottomPad: {
    height: 32,
  },
});

export default OrderDetailsScreen;
