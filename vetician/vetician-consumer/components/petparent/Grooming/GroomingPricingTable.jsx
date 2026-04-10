import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS, FONT } from '../../../constant/theme2';

const GroomingPricingTable = ({ pricingData }) => {
  if (!pricingData || pricingData.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Weight</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Short Hair</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Long Hair</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>With Trim</Text>
        </View>
      </View>

      {pricingData.map((item, index) => (
        <View key={item._id || index} style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.weightText}>{item.weightCategory}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.priceText}>₹{item.shortHair}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.priceText}>₹{item.longHair}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.priceText}>
              ₹{item.withHairTrim.min}–{item.withHairTrim.max}
            </Text>
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <View style={styles.includesRow}>
          <Icon name="check-circle" size={16} color={COLORS.primary} />
          <Text style={styles.includesText}>Includes Nail Trimming</Text>
        </View>
        <View style={styles.includesRow}>
          <Icon name="check-circle" size={16} color={COLORS.primary} />
          <Text style={styles.includesText}>Includes Ear Cleaning</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 14,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  weightText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  priceText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#F0F7E6',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  includesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  includesText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default GroomingPricingTable;
