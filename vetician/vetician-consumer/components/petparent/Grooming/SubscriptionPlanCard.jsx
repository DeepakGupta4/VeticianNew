import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT, RADIUS } from '../../../constant/theme2';

const SubscriptionPlanCard = ({ plan, featured = false, onSubscribe }) => {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <View style={[styles.card, featured && styles.featured]}>
      {plan.badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{plan.badge}</Text>
        </View>
      ) : (
        <View style={styles.badgeSpacer} />
      )}

      <Text style={styles.planName}>{plan.name}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.priceBig}>{plan.price}</Text>
        <Text style={styles.priceMo}>{plan.perMonth}</Text>
      </View>

      <Text style={styles.saveText}>{plan.save}</Text>

      <View style={styles.featureList}>
        {plan.features.map((f, i) => (
          <Text key={i} style={styles.featureItem}>• {f}</Text>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.btn, subscribed && styles.btnDone]}
        onPress={() => { setSubscribed(v => !v); onSubscribe?.(plan); }}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>{subscribed ? 'Subscribed ✓' : 'Subscribe'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: 18,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  featured: { borderWidth: 2, borderColor: COLORS.secondary },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.badgeRed,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 12,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: COLORS.white, letterSpacing: 0.3 },
  badgeSpacer: { height: 20, marginBottom: 12 },
  planName: { fontSize: FONT.planName, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  priceBig: { fontSize: FONT.priceBig, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: -1, marginRight: 3 },
  priceMo: { fontSize: FONT.priceSub, color: COLORS.textMuted, fontWeight: '500', marginBottom: 6 },
  saveText: { fontSize: FONT.saveText, fontWeight: '700', color: COLORS.secondary, marginBottom: 14 },
  featureList: { marginBottom: 18 },
  featureItem: { fontSize: FONT.bulletItem, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 7 },
  btn: { backgroundColor: COLORS.secondary, borderRadius: RADIUS.btn, paddingVertical: 13, alignItems: 'center' },
  btnDone: { backgroundColor: COLORS.primary },
  btnText: { color: COLORS.white, fontSize: FONT.btnLabel, fontWeight: '700', letterSpacing: 0.2 },
});

export default SubscriptionPlanCard;
