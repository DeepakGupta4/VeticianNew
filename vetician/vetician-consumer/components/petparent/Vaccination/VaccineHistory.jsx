// vaccination/components/VaccineHistory.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS2 as COLORS } from '../../../constant/theme';

const PREVIEW_COUNT = 3;

/**
 * VaccineHistory
 * Props:
 *   records      – HistoryRecord[]
 *   onViewDetail – (record) => void   opens detail bottom sheet
 */
export default function VaccineHistory({ records = [], onViewDetail }) {
  const [expanded, setExpanded] = useState(false);

  // Collapse when records list changes (e.g. new booking added)
  useEffect(() => { setExpanded(false); }, [records.length]);

  const visible = expanded ? records : records.slice(0, PREVIEW_COUNT);
  const hasMore  = records.length > PREVIEW_COUNT;

  return (
    <View style={styles.section}>
      {/* Heading */}
      <View style={styles.headRow}>
        <View style={styles.labelRow}>
          <MaterialIcons name="history" size={15} color={COLORS.primary} />
          <Text style={styles.label}>Vaccination History</Text>
        </View>

        {hasMore && (
          <TouchableOpacity
            onPress={() => setExpanded((e) => !e)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={expanded ? 'Show fewer records' : 'View all records'}
          >
            <View style={styles.viewAllRow}>
              <Text style={styles.viewAllText}>
                {expanded ? 'Show Less' : 'View All Records'}
              </Text>
              <MaterialIcons
                name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={16}
                color={COLORS.primary}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Records */}
      {visible.map((record) => (
        <HistoryRow key={record.id} record={record} onViewDetail={onViewDetail} />
      ))}

      {records.length === 0 && (
        <Text style={styles.empty}>No history available yet.</Text>
      )}
    </View>
  );
}

function HistoryRow({ record, onViewDetail }) {
  return (
    <View style={styles.card}>
      {/* Icon */}
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{record.name}</Text>

        <View style={styles.metaRow}>
          <MaterialIcons name="event" size={11} color={COLORS.subtext} />
          <Text style={styles.metaText}>{record.date}</Text>
        </View>

        <View style={styles.metaRow}>
          <MaterialIcons name="local-hospital" size={11} color={COLORS.subtext} />
          <Text style={styles.metaText} numberOfLines={1}>
            {record.doctor} · {record.clinic}
          </Text>
        </View>
      </View>

      {/* Status + detail button */}
      <View style={styles.right}>
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>Done</Text>
        </View>
        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => onViewDetail(record)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${record.name}`}
        >
          <Text style={styles.detailBtnText}>Details</Text>
          <MaterialIcons name="chevron-right" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  headRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
  },
  label: {
    fontSize:   13,
    fontWeight: '700',
    color:      COLORS.text,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           2,
  },
  viewAllText: {
    fontSize:   12,
    fontWeight: '700',
    color:      COLORS.primary,
  },
  card: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.card,
    borderRadius:    16,
    borderWidth:     1,
    borderColor:     COLORS.border,
    padding:         12,
    gap:             10,
    shadowColor:     COLORS.shadow,
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.15,
    shadowRadius:    4,
    elevation:       1,
  },
  iconWrap: {
    width:           40,
    height:          40,
    borderRadius:    12,
    backgroundColor: COLORS.accent,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  info: {
    flex: 1,
    gap:  3,
  },
  name: {
    fontSize:   13,
    fontWeight: '700',
    color:      COLORS.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  metaText: {
    fontSize: 11,
    color:    COLORS.subtext,
    flex:     1,
  },
  right: {
    alignItems: 'flex-end',
    gap:        6,
    flexShrink: 0,
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius:    8,
    paddingVertical:  3,
    paddingHorizontal: 8,
  },
  completedText: {
    fontSize:   10,
    fontWeight: '700',
    color:      COLORS.primary,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           2,
  },
  detailBtnText: {
    fontSize:   11,
    fontWeight: '700',
    color:      COLORS.primary,
  },
  empty: {
    fontSize: 13,
    color:    COLORS.subtext,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
