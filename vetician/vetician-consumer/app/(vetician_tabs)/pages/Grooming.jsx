// import React, { useState } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   Image, SafeAreaView, FlatList
// } from 'react-native';
// import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import CommonHeader from '../../../components/CommonHeader';

// export default function PetGroomingScreen() {
//   const [selectedType, setSelectedType] = useState('Salon');

//   const PACKAGES = [
//     {
//       id: '1',
//       name: 'Full Grooming Kit',
//       price: '₹1,299',
//       oldPrice: '₹1,599',
//       duration: '90 mins',
//       services: ['Bath + Dry', 'Full Haircut', 'Nail Clipping', 'Ear Cleaning'],
//       isPopular: true
//     },
//     {
//       id: '2',
//       name: 'Bath & Brush',
//       price: '₹699',
//       oldPrice: '₹899',
//       duration: '45 mins',
//       services: ['Organic Shampoo', 'Brushing', 'Perfuming'],
//       isPopular: false
//     }
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <CommonHeader title="Pet Grooming" />
      
//       {/* Coming Soon Overlay */}
//       <View style={styles.comingSoonOverlay}>
//         <MaterialCommunityIcons name="content-cut" size={60} color="#24A1DE" />
//         <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
//         <Text style={styles.comingSoonText}>Professional grooming services are launching soon. Your pet will look amazing!</Text>
//       </View>
      
//       <ScrollView showsVerticalScrollIndicator={false} style={{opacity: 0.3}}>
        
//         {/* --- Hero Banner --- */}
//         <View style={styles.heroBanner}>
//           <View style={styles.heroText}>
//             <Text style={styles.heroTitle}>Spa & Grooming</Text>
//             <Text style={styles.heroSub}>Give your pet a stylish & clean makeover.</Text>
//             <View style={styles.offerBadge}>
//               <Text style={styles.offerText}>GET 20% OFF ON FIRST VISIT</Text>
//             </View>
//           </View>
//           <Image 
//             source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2865/2865766.png' }} 
//             style={styles.heroIcon} 
//           />
//         </View>

//         {/* --- Service Type Selection --- */}
//         <View style={styles.typeContainer}>
//           <TouchableOpacity 
//             style={[styles.typeCard, selectedType === 'Home' && styles.activeType]}
//             onPress={() => setSelectedType('Home')}
//           >
//             <MaterialCommunityIcons name="home-heart" size={24} color={selectedType === 'Home' ? '#fff' : '#24A1DE'} />
//             <Text style={[styles.typeLabel, selectedType === 'Home' && {color: '#fff'}]}>Grooming at Home</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.typeCard, selectedType === 'Salon' && styles.activeType]}
//             onPress={() => setSelectedType('Salon')}
//           >
//             <MaterialCommunityIcons name="storefront" size={24} color={selectedType === 'Salon' ? '#fff' : '#24A1DE'} />
//             <Text style={[styles.typeLabel, selectedType === 'Salon' && {color: '#fff'}]}>Visit Salon</Text>
//           </TouchableOpacity>
//         </View>

//         {/* --- Packages Section --- */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Select Grooming Package</Text>
//           {PACKAGES.map((pkg) => (
//             <View key={pkg.id} style={styles.packageCard}>
//               {pkg.isPopular && <View style={styles.popularTag}><Text style={styles.popularText}>BEST SELLER</Text></View>}
              
//               <View style={styles.packageHeader}>
//                 <View>
//                   <Text style={styles.packageName}>{pkg.name}</Text>
//                   <Text style={styles.duration}><Ionicons name="time-outline" size={14} /> {pkg.duration}</Text>
//                 </View>
//                 <View style={styles.priceContainer}>
//                    <Text style={styles.oldPrice}>{pkg.oldPrice}</Text>
//                    <Text style={styles.price}>{pkg.price}</Text>
//                 </View>
//               </View>

//               <View style={styles.divider} />

//               <View style={styles.servicesGrid}>
//                 {pkg.services.map((s, index) => (
//                   <View key={index} style={styles.serviceItem}>
//                     <MaterialIcons name="check-circle" size={16} color="#10B981" />
//                     <Text style={styles.serviceText}>{s}</Text>
//                   </View>
//                 ))}
//               </View>

//               <TouchableOpacity style={styles.bookBtn}>
//                 <Text style={styles.bookBtnText}>Book Appointment</Text>
//               </TouchableOpacity>
//             </View>
//           ))}
//         </View>

//         {/* --- Safety Standards --- */}
//         <View style={styles.safetyBox}>
//           <Text style={styles.safetyTitle}>Our Safety Standards</Text>
//           <View style={styles.safetyRow}>
//             <View style={styles.safetyItem}>
//                <FontAwesome5 name="pump-soap" size={20} color="#24A1DE" />
//                <Text style={styles.safetyText}>Branded Products</Text>
//             </View>
//             <View style={styles.safetyItem}>
//                <FontAwesome5 name="user-md" size={20} color="#24A1DE" />
//                <Text style={styles.safetyText}>Certified Groomers</Text>
//             </View>
//           </View>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f7fa' },
  
//   comingSoonOverlay: {
//     position: 'absolute',
//     top: 100,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//     paddingHorizontal: 40
//   },
//   comingSoonTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#24A1DE',
//     marginTop: 20,
//     marginBottom: 10
//   },
//   comingSoonText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 24
//   },
//   heroBanner: { backgroundColor: '#E0F2F1', padding: 25, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
//   heroText: { flex: 1 },
//   heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#004D40' },
//   heroSub: { fontSize: 13, color: '#00695C', marginTop: 5 },
//   offerBadge: { backgroundColor: '#FFD54F', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5, alignSelf: 'flex-start', marginTop: 10 },
//   offerText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
//   heroIcon: { width: 90, height: 90 },

//   typeContainer: { flexDirection: 'row', padding: 20, gap: 15 },
//   typeCard: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#eee', elevation: 2 },
//   activeType: { backgroundColor: '#24A1DE', borderColor: '#24A1DE' },
//   typeLabel: { fontSize: 12, fontWeight: 'bold', marginTop: 8, color: '#444' },

//   section: { padding: 20 },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  
//   packageCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#eee', elevation: 3, position: 'relative' },
//   popularTag: { position: 'absolute', top: -10, left: 20, backgroundColor: '#FF5252', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 },
//   popularText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  
//   packageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
//   packageName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
//   duration: { fontSize: 12, color: '#777', marginTop: 4 },
//   priceContainer: { alignItems: 'flex-end' },
//   oldPrice: { fontSize: 12, color: '#999', textDecorationLine: 'line-through' },
//   price: { fontSize: 20, fontWeight: 'bold', color: '#24A1DE' },
  
//   divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15 },
  
//   servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
//   serviceItem: { flexDirection: 'row', alignItems: 'center', width: '47%' },
//   serviceText: { fontSize: 12, color: '#555', marginLeft: 5 },
  
//   bookBtn: { backgroundColor: '#24A1DE', padding: 12, borderRadius: 10, alignItems: 'center' },
//   bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

//   safetyBox: { padding: 20, backgroundColor: '#fff', margin: 20, borderRadius: 15 },
//   safetyTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
//   safetyRow: { flexDirection: 'row', justifyContent: 'space-around' },
//   safetyItem: { alignItems: 'center' },
//   safetyText: { fontSize: 11, color: '#666', marginTop: 8 }
// });


// GroomingScreen.jsx  –  Vatecian v4


// GroomingScreen.jsx  –  Vatecian v4
// ─────────────────────────────────────────────────────────────────
// Design matched to reference image:
//   • Background: #f0f4ee (light grey-green)
//   • Cards: white + soft shadow (0 2px 12px rgba(0,0,0,.08))
//   • Section titles: 20px bold #1a1a1a
//   • Subtitles: 13px #888
//   • Subscription cards: red pill badge, large price, green save text, bullet list, green CTA
//   • How It Works: numbered green circles, white cards
//   • Service grid: 2 columns, icon + name + desc
//   • All MDI icons — zero emojis
//   • Only #558B2F and #7CB342 as brand colours
// ─────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TextInput, TouchableOpacity, Animated,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, FONT, RADIUS } from '../../../constant/theme2';
import GroomingServiceCard  from '../../../components/petparent/Grooming/GroomingServiceCard';
import SubscriptionPlanCard from '../../../components/petparent/Grooming/SubscriptionPlanCard';
import HowItWorksCard       from '../../../components/petparent/Grooming/HowItWorksCard';
import { GroomerCard, GroomingAddonCard, GroomingTipCard, BookingSection } from '../../../components/petparent/Grooming/GroomerCard';

// ── DATA ─────────────────────────────────────────────────────────

const PETS = [
  { id:1, name:'Rocky', breed:'Golden Retriever', icon:'dog' },
  { id:2, name:'Bella', breed:'Persian Cat',      icon:'cat' },
  { id:3, name:'Milo',  breed:'Pomeranian',       icon:'dog-side' },
];

const SERVICES = [
  { id:1, name:'Full Grooming',    desc:'Complete spa care',    icon:'scissors-cutting' },
  { id:2, name:'Bath & Blow Dry',  desc:'Fresh & fluffy coat',  icon:'shower-head' },
  { id:3, name:'Hair Trimming',    desc:'Neat & shaped cut',    icon:'content-cut' },
  { id:4, name:'Nail Clipping',    desc:'Safe & painless',      icon:'hand-clap' },
  { id:5, name:'Ear Cleaning',     desc:'Hygienic & gentle',    icon:'ear-hearing' },
  { id:6, name:'Teeth Cleaning',   desc:'Fresh breath care',    icon:'tooth-outline' },
];

const PLANS = [
  {
    id:1, name:'Weekly Grooming', price:'₹2,499', perMonth:'/month',
    save:'Save ₹700', badge:'POPULAR',
    features:['4 Grooming Sessions','Free Nail Trimming','Priority Booking'],
  },
  {
    id:2, name:'Daily Walking', price:'₹3,999', perMonth:'/month',
    save:'Save ₹1,200', badge:'BEST VALUE',
    features:['30 Walking Sessions','30 min per session','Activity Report'],
  },
  {
    id:3, name:'Monthly Care', price:'₹1,299', perMonth:'/month',
    save:'Save ₹300', badge:null,
    features:['2 Grooming Sessions','Basic Nail Trim','Email Support'],
  },
];

const HOW_STEPS = [
  { id:1, number:'1', title:'Choose Service & Book',         description:'Select the service you need and pick a convenient time slot' },
  { id:2, number:'2', title:'Partner Assigned & Arrives',    description:'Verified professional reaches your home at scheduled time' },
  { id:3, number:'3', title:'Service Completed & Pay',       description:'Pay online or cash after service completion' },
  { id:4, number:'4', title:'Get Care Tips & Reminders',     description:'Receive follow-up care instructions and next session reminder' },
];

const GROOMERS = [
  { id:1, name:'Rahul Sharma', rating:'4.8', exp:'5 yrs exp', distance:'1.2 km', icon:'account' },
  { id:2, name:'Priya Mehta',  rating:'4.9', exp:'7 yrs exp', distance:'2.0 km', icon:'account-outline' },
  { id:3, name:'Arjun Nair',   rating:'4.7', exp:'3 yrs exp', distance:'3.1 km', icon:'account-circle-outline' },
];

const ADDONS = [
  { id:1, name:'Pet Perfume',      price:'+ ₹99',  icon:'spray' },
  { id:2, name:'Anti-Tick Spray',  price:'+ ₹149', icon:'shield-bug-outline' },
  { id:3, name:'Coat Conditioner', price:'+ ₹199', icon:'bottle-tonic-outline' },
  { id:4, name:'De-Shedding',      price:'+ ₹249', icon:'brush' },
];

const TIPS = [
  { id:1, icon:'brush',         title:'Brush regularly',  body:"Regular brushing prevents matting and keeps your pet's coat shiny." },
  { id:2, icon:'water',         title:'Keep ears dry',    body:"Always dry your pet's ears after bathing to prevent infections." },
  { id:3, icon:'tooth-outline', title:'Dental hygiene',   body:'Brushing 2–3 times a week prevents bad breath and gum disease.' },
];

// ── REUSABLE SECTION HEADER (matches reference exactly) ──────────
const SectionTitle = ({ title, subtitle }) => (
  <View style={sh.wrap}>
    <Text style={sh.title}>{title}</Text>
    {subtitle && <Text style={sh.sub}>{subtitle}</Text>}
  </View>
);

const sh = StyleSheet.create({
  wrap:  { marginBottom: 16, marginTop: 4 },
  title: { fontSize: FONT.sectionTitle, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.2, marginBottom: 3 },
  sub:   { fontSize: FONT.body, color: COLORS.textMuted, fontWeight: '400' },
});

// ── SCREEN ───────────────────────────────────────────────────────
const GroomingScreen = ({ navigation }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activePetId, setActivePetId] = useState(PETS[0].id);
  const [search, setSearch] = useState('');

  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue:1, duration:380, useNativeDriver:true }).start();
  }, []);

  const activePet = PETS.find(p => p.id === activePetId);

  return (
    <Animated.View style={[styles.root, { opacity }]}>

      {/* ── HEADER ── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.hRow}>
          <TouchableOpacity style={styles.hBtn} onPress={() => router.back()}>
            <Icon name="arrow-left" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.hTitle}>Pet Grooming</Text>
            <Text style={styles.hSub}>Vatecian</Text>
          </View>
          <TouchableOpacity style={styles.hBtn}>
            <Icon name="account-circle-outline" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBox}>
          <Icon name="magnify" size={18} color={COLORS.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search grooming services..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="close-circle" size={16} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {/* Location row */}
        <View style={styles.locRow}>
          <Icon name="map-marker-outline" size={13} color="rgba(255,255,255,0.75)" />
          <Text style={styles.locText}>Services available near you · Lucknow</Text>
        </View>
      </View>

      {/* ── SCROLLABLE CONTENT ── */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Pet selector — horizontal pill row */}
        <SectionTitle title="Select Your Pet" subtitle="Choose who's getting pampered today" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hs}>
          {PETS.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.petPill, activePetId === p.id && styles.petPillOn]}
              onPress={() => setActivePetId(p.id)}
            >
              <Icon name={p.icon} size={18} color={activePetId === p.id ? COLORS.white : COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.petName, activePetId === p.id && styles.petNameOn]}>{p.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.petPill}>
            <Icon name="plus-circle-outline" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.petName}>Add Pet</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Services — 2 column grid */}
        <SectionTitle title="Grooming Services" subtitle="Pick the care your pet deserves" />
        <View style={styles.svcGrid}>
          {SERVICES.map(s => (
            <GroomingServiceCard key={s.id} service={s} onPress={() => {}} />
          ))}
        </View>

        {/* Subscription plans — horizontal scroll */}
        <SectionTitle title="Subscription Plans" subtitle="Save more with regular care" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hs}>
          {PLANS.map((p, i) => (
            <SubscriptionPlanCard key={p.id} plan={p} featured={i === 0} onSubscribe={() => {}} />
          ))}
        </ScrollView>

        {/* How It Works */}
        <SectionTitle title="How It Works" subtitle="Simple steps to a happy pet" />
        <View style={styles.section}>
          {HOW_STEPS.map(s => (
            <HowItWorksCard key={s.id} step={s} />
          ))}
        </View>

        {/* Groomers */}
        <SectionTitle title="Groomers Near You" subtitle="Verified professionals in your area" />
        <View style={styles.section}>
          {GROOMERS.map(g => (
            <GroomerCard key={g.id} groomer={g} onBook={() => {}} />
          ))}
        </View>

        {/* Add-ons */}
        <SectionTitle title="Grooming Add-ons" subtitle="Optional extras for your pet" />
        <View style={styles.section}>
          {ADDONS.map(a => (
            <GroomingAddonCard key={a.id} addon={a} />
          ))}
        </View>

        {/* Booking */}
        <SectionTitle title="Book Appointment" subtitle="Choose your date, time and groomer" />
        <View style={styles.section}>
          <BookingSection selectedPet={activePet} />
        </View>

        {/* Tips */}
        <SectionTitle title="Grooming Tips" subtitle="Keep your pet healthy between sessions" />
        <View style={styles.section}>
          {TIPS.map(t => (
            <GroomingTipCard key={t.id} tip={t} />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    backgroundColor: COLORS.primary,
    paddingBottom: 16,
    paddingHorizontal: 18,
  },
  hRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  hBtn: {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  hTitle: { fontSize: 17, fontWeight: '800', color: COLORS.white, textAlign: 'center' },
  hSub:   { fontSize: 10, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: 1 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginLeft: 8,
    marginRight: 4,
  },
  locRow: { flexDirection: 'row', alignItems: 'center' },
  locText: { fontSize: 11.5, color: 'rgba(255,255,255,0.88)', fontWeight: '500', marginLeft: 5 },

  scroll:  { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  hs:      { marginHorizontal: -16, paddingHorizontal: 16, marginBottom: 22 },
  section: { marginBottom: 8 },

  svcGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  // Pet pills
  petPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 10,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  petPillOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  petName:   { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  petNameOn: { color: COLORS.white },
});

export default GroomingScreen;
