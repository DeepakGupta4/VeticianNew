import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, SafeAreaView, FlatList
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CommonHeader from '../../../components/CommonHeader';

export default function PetGroomingScreen() {
  const [selectedType, setSelectedType] = useState('Salon');

  const PACKAGES = [
    {
      id: '1',
      name: 'Full Grooming Kit',
      price: '₹1,299',
      oldPrice: '₹1,599',
      duration: '90 mins',
      services: ['Bath + Dry', 'Full Haircut', 'Nail Clipping', 'Ear Cleaning'],
      isPopular: true
    },
    {
      id: '2',
      name: 'Bath & Brush',
      price: '₹699',
      oldPrice: '₹899',
      duration: '45 mins',
      services: ['Organic Shampoo', 'Brushing', 'Perfuming'],
      isPopular: false
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Pet Grooming" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- Hero Banner --- */}
        <View style={styles.heroBanner}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Spa & Grooming</Text>
            <Text style={styles.heroSub}>Give your pet a stylish & clean makeover.</Text>
            <View style={styles.offerBadge}>
              <Text style={styles.offerText}>GET 20% OFF ON FIRST VISIT</Text>
            </View>
          </View>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2865/2865766.png' }} 
            style={styles.heroIcon} 
          />
        </View>

        {/* --- Service Type Selection --- */}
        <View style={styles.typeContainer}>
          <TouchableOpacity 
            style={[styles.typeCard, selectedType === 'Home' && styles.activeType]}
            onPress={() => setSelectedType('Home')}
          >
            <MaterialCommunityIcons name="home-heart" size={24} color={selectedType === 'Home' ? '#fff' : '#24A1DE'} />
            <Text style={[styles.typeLabel, selectedType === 'Home' && {color: '#fff'}]}>Grooming at Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.typeCard, selectedType === 'Salon' && styles.activeType]}
            onPress={() => setSelectedType('Salon')}
          >
            <MaterialCommunityIcons name="storefront" size={24} color={selectedType === 'Salon' ? '#fff' : '#24A1DE'} />
            <Text style={[styles.typeLabel, selectedType === 'Salon' && {color: '#fff'}]}>Visit Salon</Text>
          </TouchableOpacity>
        </View>

        {/* --- Packages Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Grooming Package</Text>
          {PACKAGES.map((pkg) => (
            <View key={pkg.id} style={styles.packageCard}>
              {pkg.isPopular && <View style={styles.popularTag}><Text style={styles.popularText}>BEST SELLER</Text></View>}
              
              <View style={styles.packageHeader}>
                <View>
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <Text style={styles.duration}><Ionicons name="time-outline" size={14} /> {pkg.duration}</Text>
                </View>
                <View style={styles.priceContainer}>
                   <Text style={styles.oldPrice}>{pkg.oldPrice}</Text>
                   <Text style={styles.price}>{pkg.price}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.servicesGrid}>
                {pkg.services.map((s, index) => (
                  <View key={index} style={styles.serviceItem}>
                    <MaterialIcons name="check-circle" size={16} color="#10B981" />
                    <Text style={styles.serviceText}>{s}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* --- Safety Standards --- */}
        <View style={styles.safetyBox}>
          <Text style={styles.safetyTitle}>Our Safety Standards</Text>
          <View style={styles.safetyRow}>
            <View style={styles.safetyItem}>
               <FontAwesome5 name="pump-soap" size={20} color="#24A1DE" />
               <Text style={styles.safetyText}>Branded Products</Text>
            </View>
            <View style={styles.safetyItem}>
               <FontAwesome5 name="user-md" size={20} color="#24A1DE" />
               <Text style={styles.safetyText}>Certified Groomers</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  heroBanner: { backgroundColor: '#E0F2F1', padding: 25, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  heroText: { flex: 1 },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#004D40' },
  heroSub: { fontSize: 13, color: '#00695C', marginTop: 5 },
  offerBadge: { backgroundColor: '#FFD54F', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5, alignSelf: 'flex-start', marginTop: 10 },
  offerText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  heroIcon: { width: 90, height: 90 },

  typeContainer: { flexDirection: 'row', padding: 20, gap: 15 },
  typeCard: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#eee', elevation: 2 },
  activeType: { backgroundColor: '#24A1DE', borderColor: '#24A1DE' },
  typeLabel: { fontSize: 12, fontWeight: 'bold', marginTop: 8, color: '#444' },

  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  
  packageCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#eee', elevation: 3, position: 'relative' },
  popularTag: { position: 'absolute', top: -10, left: 20, backgroundColor: '#FF5252', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 },
  popularText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  
  packageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  packageName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  duration: { fontSize: 12, color: '#777', marginTop: 4 },
  priceContainer: { alignItems: 'flex-end' },
  oldPrice: { fontSize: 12, color: '#999', textDecorationLine: 'line-through' },
  price: { fontSize: 20, fontWeight: 'bold', color: '#24A1DE' },
  
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15 },
  
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  serviceItem: { flexDirection: 'row', alignItems: 'center', width: '47%' },
  serviceText: { fontSize: 12, color: '#555', marginLeft: 5 },
  
  bookBtn: { backgroundColor: '#24A1DE', padding: 12, borderRadius: 10, alignItems: 'center' },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  safetyBox: { padding: 20, backgroundColor: '#fff', margin: 20, borderRadius: 15 },
  safetyTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  safetyRow: { flexDirection: 'row', justifyContent: 'space-around' },
  safetyItem: { alignItems: 'center' },
  safetyText: { fontSize: 11, color: '#666', marginTop: 8 }
});