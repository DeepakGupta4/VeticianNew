// components/needhelp/IssueDetails.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

export default function IssueDetails({ issue, onContactSupport, onClose }) {
  if (!issue) return null;

  return (
    <View style={styles.container}>
      {/* Handle */}
      <View style={styles.handle} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title Row */}
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <MaterialIcons name={issue.icon} size={22} color={COLORS2.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.title}>{issue.title}</Text>
            <Text style={styles.desc}>{issue.description}</Text>
          </View>
        </View>

        {/* Steps */}
        <View style={styles.stepsCard}>
          <View style={styles.stepsHeader}>
            <MaterialIcons name="build-circle" size={18} color={COLORS2.primary} />
            <Text style={styles.stepsTitle}>Steps to Fix</Text>
          </View>
          {issue.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Still facing issue */}
        <View style={styles.stillCard}>
          <MaterialIcons name="help-outline" size={20} color={COLORS2.subtext} />
          <Text style={styles.stillText}>Still facing this issue?</Text>
        </View>

        <TouchableOpacity
          style={styles.contactBtn}
          onPress={onContactSupport}
          activeOpacity={0.85}
        >
          <MaterialIcons name="support-agent" size={18} color="#fff" />
          <Text style={styles.contactBtnText}>Contact Support</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS2.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS2.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS2.text,
    letterSpacing: -0.3,
  },
  desc: {
    fontSize: 13,
    color: COLORS2.subtext,
    marginTop: 4,
    lineHeight: 18,
  },
  stepsCard: {
    backgroundColor: COLORS2.accent,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS2.border,
    marginBottom: 16,
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS2.text,
    marginLeft: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS2.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    fontSize: 13.5,
    color: COLORS2.text,
    flex: 1,
    lineHeight: 20,
  },
  stillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS2.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS2.border,
    marginBottom: 14,
  },
  stillText: {
    fontSize: 13,
    color: COLORS2.subtext,
    marginLeft: 8,
    fontWeight: '500',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS2.primary,
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
    shadowColor: COLORS2.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  contactBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
