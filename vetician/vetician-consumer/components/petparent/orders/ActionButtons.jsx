import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

const ActionButtons = ({ order, onRebook, onSupport, onInvoice }) => (
  <View style={styles.container}>
    <View style={styles.body}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => onRebook(order)} activeOpacity={0.8}>
          <MaterialCommunityIcons name="refresh" size={18} color="#fff" />
          <Text style={styles.btnPrimaryText}>Rebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnOutline} onPress={() => onSupport(order)} activeOpacity={0.8}>
          <MaterialCommunityIcons name="headset" size={18} color={COLORS2.primary} />
          <Text style={styles.btnOutlineText}>Support</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnInvoice} onPress={() => onInvoice(order)} activeOpacity={0.8}>
        <MaterialCommunityIcons name="file-download-outline" size={18} color={COLORS2.primary} />
        <Text style={styles.btnInvoiceText}>Download Invoice</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS2.border,
    backgroundColor: '#fff',
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.11, shadowRadius: 16 },
      android: { elevation: 5 },
    }),
  },
  body: {
    padding: 14,
    gap: 10,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: COLORS2.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  btnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: COLORS2.accent,
    borderWidth: 1.5,
    borderColor: COLORS2.shadow,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnOutlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS2.primary,
  },
  btnInvoice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: COLORS2.accent,
    borderWidth: 1.5,
    borderColor: COLORS2.shadow,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnInvoiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS2.primary,
  },
});

export default ActionButtons;
