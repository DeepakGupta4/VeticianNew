import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, SafeAreaView, Switch, Alert, Dimensions
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CommonHeader from '../../../components/CommonHeader';

const { width } = Dimensions.get('window');

export default function PetDaySchoolScreen() {
  const [isPickUpNeeded, setIsPickUpNeeded] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Basic');
  const [selectedSlot, setSelectedSlot] = useState('09 AM - 06 PM');

  const packages = [
    { name: 'Basic', price: '₹399', desc: 'Playtime + Meals' },
    { name: 'Active', price: '₹599', desc: 'Swimming + Agility' },
    { name: 'Pro', price: '₹899', desc: 'Training + Grooming' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Day/Play School" />
      
      {/* Coming Soon Overlay */}
      <View style={styles.comingSoonOverlay}>
        <MaterialIcons name="school" size={60} color="#24A1DE" />
        <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
        <Text style={styles.comingSoonText}>Pet Day School is launching soon. Fun activities & learning for your pets!</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={{opacity: 0.3}}>
        
        {/* --- Hero Banner --- */}
        <View style={styles.heroSection}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Pet Day School</Text>
            <Text style={styles.heroSub}>Drop them off for a day of fun & learning!</Text>
            <View style={styles.ratingBadge}>
              <MaterialIcons name="star" size={14} color="#FFB300" />
              <Text style={styles.ratingText}> 4.9 (200+ Happy Pets)</Text>
            </View>
          </View>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3048/3048374.png' }} 
            style={styles.heroIcon} 
          />
        </View>

        {/* --- Slot Selection --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time Slot</Text>
          <View style={styles.slotContainer}>
            {['08 AM - 05 PM', '09 AM - 06 PM', '10 AM - 07 PM'].map((slot) => (
              <TouchableOpacity 
                key={slot} 
                style={[styles.slotChip, selectedSlot === slot && styles.activeSlot]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[styles.slotText, selectedSlot === slot && {color: '#fff'}]}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* --- Package Selection --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Activity Package</Text>
          {packages.map((pkg) => (
            <TouchableOpacity 
              key={pkg.name} 
              style={[styles.packageCard, selectedPackage === pkg.name && styles.activePackage]}
              onPress={() => setSelectedPackage(pkg.name)}
            >
              <View style={styles.packageInfo}>
                <Text style={[styles.packageName, selectedPackage === pkg.name && {color: '#fff'}]}>{pkg.name} Play</Text>
                <Text style={[styles.packageDesc, selectedPackage === pkg.name && {color: '#e0e0e0'}]}>{pkg.desc}</Text>
              </View>
              <Text style={[styles.packagePrice, selectedPackage === pkg.name && {color: '#fff'}]}>{pkg.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- Pick & Drop Logic --- */}
        <View style={styles.serviceBox}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="car-side" size={20} color="#24A1DE" />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.serviceTitle}>Pick-up & Drop Facility</Text>
              <Text style={styles.serviceSub}>Extra ₹99 (Within 5km radius)</Text>
            </View>
            <Switch 
              value={isPickUpNeeded} 
              onValueChange={setIsPickUpNeeded}
              trackColor={{ false: "#ccc", true: "#24A1DE" }}
            />
          </View>
        </View>

        {/* --- Feature List --- */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What's included?</Text>
          <View style={styles.featureItem}>
            <Ionicons name="camera" size={20} color="#10B981" />
            <Text style={styles.featureText}>Live Photo/Video Updates every 2 hours</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="fast-food" size={20} color="#10B981" />
            <Text style={styles.featureText}>Customized Nutritious Meals</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.featureText}>Supervised by Professional Trainers</Text>
          </View>
        </View>

      </ScrollView>

      {/* --- Footer Price --- */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalPrice}>₹{selectedPackage === 'Basic' ? '399' : selectedPackage === 'Active' ? '599' : '899'}</Text>
          <Text style={styles.subText}>Day Pass</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={() => Alert.alert("Day School Booked!")}>
          <Text style={styles.bookBtnText}>Confirm Day Pass</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd' },
  
  comingSoonOverlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 40
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#24A1DE',
    marginTop: 20,
    marginBottom: 10
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24
  },
  heroSection: { backgroundColor: '#FFF4E5', padding: 25, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  heroText: { flex: 1 },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  heroSub: { fontSize: 14, color: '#666', marginTop: 5 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#444' },
  heroIcon: { width: 80, height: 80 },

  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  
  slotContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  activeSlot: { backgroundColor: '#24A1DE', borderColor: '#24A1DE' },
  slotText: { fontSize: 13, color: '#666' },

  packageCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee', elevation: 2 },
  activePackage: { backgroundColor: '#24A1DE', borderColor: '#24A1DE' },
  packageInfo: { flex: 1 },
  packageName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  packageDesc: { fontSize: 12, color: '#777', marginTop: 2 },
  packagePrice: { fontSize: 18, fontWeight: 'bold', color: '#24A1DE' },

  serviceBox: { marginHorizontal: 20, padding: 15, backgroundColor: '#F0F7FB', borderRadius: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  flex1: { flex: 1 },
  serviceTitle: { fontWeight: 'bold', color: '#333' },
  serviceSub: { fontSize: 12, color: '#666' },

  featuresSection: { padding: 20, backgroundColor: '#F9F9F9', marginTop: 10 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureText: { marginLeft: 10, fontSize: 13, color: '#555' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  totalPrice: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 12, color: '#777' },
  bookBtn: { backgroundColor: '#24A1DE', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});