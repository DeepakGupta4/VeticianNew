// ─────────────────────────────────────────
//  components/EmergencyAlert.jsx
//
//  WHAT IT SHOWS:
//    • Red dismissible alert banner
//    • Warning icon + alert message
//    • "Contact Vet" CTA button
//    • Disappears when dismissed (×)
//
//  HOW TO USE:
//    <EmergencyAlert />
// ─────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../../constant/theme';

export default function EmergencyAlert({ petName = 'Your Pet' }) {

  const [visible, setVisible] = useState(true);

  // Hide the alert when dismissed
  if (!visible) return null;

  return (
    <View style={styles.container}>

      {/* ── Top row: icon + message + dismiss ── */}
      <View style={styles.topRow}>

        {/* Warning icon */}
        <View style={styles.badge}>
           <Image style={{height:'100%', width:'100%', borderRadius:22,}} source={{uri:"https://images.unsplash.com/photo-1768878071978-8ace0a79958a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGRvZyUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"}}/>
        </View>

        {/* Alert text */}
        <View style={styles.textBlock}>
          <Text style={styles.alertTitle}>⚠ {petName} seems slightly stressed</Text>
          <Text style={styles.alertDesc}>
            possible reasons: 
            </Text>
            <Text style={{color:'666', fontSize:12}}>• Loud noise detected</Text>
          <Text style={{color:'666', fontSize:12}}>• Increased activity</Text>
         
        </View>

        {/* Dismiss × */}
        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.dismissText}>×</Text>
        </TouchableOpacity>

      </View>

      {/* ── Contact Vet button ── */}

      <Text style={{color:'black'}}>Suggested action :</Text>
      <View style={styles.BtnContainer}>
      <TouchableOpacity style={styles.ctaBtn}>
        <MaterialCommunityIcons name="message" size={15} color="#fff" />
        <Text style={styles.ctaText}>Talk to {petName}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.ctaBtn}>
        <MaterialCommunityIcons name="phone" size={15} color="#fff" />
        <Text style={styles.ctaText}>Contact Vet</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: '#F1F8E9',
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '558B2F',
    padding: 14,
  },

  // top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom:10,
    gap: 10,
  },
  badge:{
    width: 80, height: 75,
    backgroundColor: 'rgba(229,57,53,0.12)',
    borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },


  iconBox: {
    width: 38, height: 38,
    backgroundColor: 'rgba(229,57,53,0.12)',
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  textBlock: { flex: 1 },
  alertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: 'black',
  },
  alertDesc: {
    fontSize: 12,
    color: '999',
    marginTop: 3,
    lineHeight: 16,
  },

  dismissBtn: {
    padding: 2,
  },
  dismissText: {
    fontSize: 22,
    color: COLORS.textMuted,
    lineHeight: 22,
  },

  // CTA
  ctaBtn: {
    marginTop: 6,
    backgroundColor: '#7CB342',
    borderRadius: RADIUS.lg,
    paddingVertical: 6,
    paddingHorizontal:35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  BtnContainer:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    gap:15,
    borderRadius:COLORS.lg,
  }
});
