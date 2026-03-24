// vaccination/components/VaccineDetailModal.jsx
import React from 'react';
import {
  View, Text, TouchableOpacity, Modal,
  ScrollView, StyleSheet, Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS2 as COLORS } from '../../../constant/theme';

/**
 * VaccineDetailModal
 * Props:
 *   visible   – boolean
 *   record    – HistoryRecord | null
 *   onClose   – () => void
 */
export default function VaccineDetailModal({ visible, record, onClose }) {
  if (!record) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.iconCircle}>
                  <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.sheetTitle}>{record.name}</Text>
                  <Text style={styles.sheetSub}>Vaccination Record</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeBtn}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <MaterialIcons name="close" size={18} color={COLORS.subtext} />
              </TouchableOpacity>
            </View>

            {/* Status badge */}
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={15} color={COLORS.primary} />
              <Text style={styles.statusText}>Completed</Text>
            </View>

            {/* Detail rows */}
            <DetailRow icon="event"          label="Date"    value={record.date} />
            <DetailRow icon="person"          label="Doctor"  value={record.doctor} />
            <DetailRow icon="local-hospital"  label="Clinic"  value={record.clinic} />

            {/* Notes box */}
            <View style={styles.notesBox}>
              <View style={styles.notesTitleRow}>
                <MaterialIcons name="description" size={15} color={COLORS.primary} />
                <Text style={styles.notesTitle}>Clinical Notes</Text>
              </View>
              <Text style={styles.notesText}>{record.notes}</Text>
            </View>

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeFullBtn}
              onPress={onClose}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Close detail view"
            >
              <Text style={styles.closeFullText}>Close</Text>
            </TouchableOpacity>

            <View style={{ height: Platform.OS === 'ios' ? 34 : 12 }} />
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <MaterialIcons name={icon} size={15} color={COLORS.subtext} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent:  'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    maxHeight:         '80%',
  },
  handle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: COLORS.border,
    alignSelf:       'center',
    marginTop:       12,
    marginBottom:    8,
  },
  sheetHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           12,
  },
  iconCircle: {
    width:           46,
    height:          46,
    borderRadius:    14,
    backgroundColor: COLORS.accent,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     COLORS.border,
  },
  sheetTitle: {
    fontSize:   16,
    fontWeight: '700',
    color:      COLORS.text,
  },
  sheetSub: {
    fontSize: 12,
    color:    COLORS.subtext,
  },
  closeBtn: {
    width:           32,
    height:          32,
    borderRadius:    8,
    backgroundColor: COLORS.accent,
    alignItems:      'center',
    justifyContent:  'center',
  },
  statusBadge: {
    flexDirection:   'row',
    alignItems:      'center',
    alignSelf:       'flex-start',
    gap:             6,
    backgroundColor: '#E8F5E9',
    borderRadius:    20,
    paddingVertical:  5,
    paddingHorizontal: 12,
    marginBottom:    16,
  },
  statusText: {
    fontSize:   12,
    fontWeight: '700',
    color:      COLORS.primary,
  },
  detailRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           7,
  },
  detailLabel: {
    fontSize: 13,
    color:    COLORS.subtext,
  },
  detailValue: {
    fontSize:   13,
    fontWeight: '600',
    color:      COLORS.text,
    maxWidth:   '60%',
    textAlign:  'right',
  },
  notesBox: {
    backgroundColor: COLORS.accent,
    borderRadius:    14,
    padding:         14,
    marginTop:       14,
    marginBottom:    16,
    gap:             8,
    borderWidth:     1,
    borderColor:     COLORS.border,
  },
  notesTitleRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
  notesTitle: {
    fontSize:   13,
    fontWeight: '700',
    color:      COLORS.text,
  },
  notesText: {
    fontSize:   13,
    color:      COLORS.subtext,
    lineHeight: 20,
  },
  closeFullBtn: {
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: COLORS.primary,
    borderRadius:    14,
    paddingVertical:  14,
  },
  closeFullText: {
    fontSize:   15,
    fontWeight: '700',
    color:      COLORS.white,
  },
});
