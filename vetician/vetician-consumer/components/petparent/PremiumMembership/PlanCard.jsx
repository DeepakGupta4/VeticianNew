import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS2 } from './colors';

const PLAN_META = {
  Basic: {
    icon: 'paw',
    gradient: ['#AED581', '#7CB342'],
    glowColor: '#7CB342',
    textColor: '#1B2A10',
    subTextColor: 'rgba(27,42,16,0.7)',
    tag: null,
    tagColor: null,
  },
  Standard: {
    icon: 'crown',
    gradient: ['#558B2F', '#33691E'],
    glowColor: '#558B2F',
    textColor: '#FFFFFF',
    subTextColor: 'rgba(255,255,255,0.75)',
    tag: '⭐ MOST POPULAR',
    tagColor: '#33691E',
  },
  Premium: {
    icon: 'crown-circle',
    gradient: ['#2D3A1F', '#1B2A10'],
    glowColor: '#2D3A1F',
    textColor: '#FFFFFF',
    subTextColor: 'rgba(255,255,255,0.75)',
    tag: '🔥 BEST VALUE',
    tagColor: '#33691E',
  },
};

export default function PlanCard({ plan, price, period, features, onSelect, selected, yearlyPrice, isYearly }) {
  const meta = PLAN_META[plan] || PLAN_META.Basic;
  const displayPrice = isYearly && yearlyPrice ? yearlyPrice : price;
  const displayPeriod = isYearly ? 'year' : period;
  const perMonth = isYearly
    ? Math.round(Number(displayPrice.replace(',', '')) / 12).toLocaleString('en-IN')
    : null;

  return (
    <TouchableOpacity
      activeOpacity={0.93}
      onPress={onSelect}
      style={[
        styles.card,
        selected && { borderColor: meta.glowColor, shadowColor: meta.glowColor, elevation: 10 },
      ]}
    >
      {/* Top-right Save badge — always visible on yearly, tag badge on monthly */}
      {isYearly ? (
        <View style={styles.topRightBadge}>
          <MaterialCommunityIcons name="tag" size={11} color="#fff" />
          <Text style={styles.topRightBadgeText}>SAVE 17%</Text>
        </View>
      ) : meta.tag ? (
        <View style={[styles.topRightBadge, { backgroundColor: meta.tagColor }]}>
          <Text style={styles.topRightBadgeText}>{meta.tag}</Text>
        </View>
      ) : null}

      {/* Gradient header with decorative circles */}
      <LinearGradient colors={meta.gradient} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {/* Decorative background circles */}
        <View style={[styles.decCircle, { width: 100, height: 100, top: -30, right: -20, opacity: 0.12 }]} />
        <View style={[styles.decCircle, { width: 60, height: 60, bottom: -10, left: 10, opacity: 0.1 }]} />

        {/* Top row: icon left, check right */}
        <View style={styles.headerTop}>
          <View style={[styles.iconWrap, { backgroundColor: `${meta.textColor}22` }]}>
            <MaterialCommunityIcons name={meta.icon} size={28} color={meta.textColor} />
          </View>
          {selected && (
            <View style={[styles.selectedCheck, { backgroundColor: `${meta.textColor}22` }]}>
              <MaterialCommunityIcons name="check-circle" size={22} color={meta.textColor} />
            </View>
          )}
        </View>

        {/* Plan name */}
        <Text style={[styles.planName, { color: meta.textColor }]}>{plan}</Text>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={[styles.currency, { color: meta.subTextColor }]}>₹</Text>
          <Text style={[styles.price, { color: meta.textColor }]}>{displayPrice}</Text>
          <Text style={[styles.period, { color: meta.subTextColor }]}>/{displayPeriod}</Text>
        </View>

        {/* Per month hint for yearly */}
        {isYearly && (
          <View style={styles.perMonthPill}>
            <Text style={[styles.perMonthText, { color: meta.textColor }]}>≈ ₹{perMonth}/mo</Text>
          </View>
        )}
      </LinearGradient>

      {/* Divider with plan label */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>What's included</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Features */}
      <View style={styles.body}>
        {features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <LinearGradient colors={meta.gradient} style={styles.checkCircle}>
              <MaterialCommunityIcons name="check" size={11} color="#fff" />
            </LinearGradient>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}

        {/* CTA button */}
        {selected ? (
          <LinearGradient colors={meta.gradient} style={styles.btnSelected} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <MaterialCommunityIcons name="check-circle-outline" size={18} color="#fff" />
            <Text style={styles.btnTextSelected}>Plan Selected</Text>
          </LinearGradient>
        ) : (
          <TouchableOpacity style={styles.btnOutline} onPress={onSelect} activeOpacity={0.8}>
            <Text style={[styles.btnTextOutline, { color: meta.glowColor }]}>Select This Plan</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color={meta.glowColor} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS2.border,
    backgroundColor: COLORS2.card,
    elevation: 4,
    shadowColor: COLORS2.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  topRightBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9A825',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 4,
    shadowColor: '#F9A825',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  topRightBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.6,
  },
  header: {
    paddingTop: 22,
    paddingBottom: 26,
    paddingHorizontal: 20,
    overflow: 'hidden',
    minHeight: 160,
  },
  decCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheck: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    padding: 2,
  },
  planName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  currency: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 5,
  },
  price: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  period: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 7,
  },
  yearlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  perMonthPill: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  perMonthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS2.border,
  },
  dividerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS2.subtext,
    letterSpacing: 0.5,
  },
  body: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 11,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 13,
    color: COLORS2.text,
    flex: 1,
    lineHeight: 19,
  },
  btnSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
  },
  btnTextSelected: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 13,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
    backgroundColor: COLORS2.accent,
  },
  btnTextOutline: {
    fontSize: 14,
    fontWeight: '700',
  },
});
