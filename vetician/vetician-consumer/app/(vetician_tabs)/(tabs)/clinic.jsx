import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
  Text as RNText,
} from 'react-native';
import {
  Text,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../../constant/theme';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7CB342',
    secondary: '#558B2F',
    tertiary: '#558B2F',
    error: '#f13c20',
  },
};

const PRIMARY_GREEN = '#7CB342';
const DARK_GREEN = '#558B2F';

const { width } = Dimensions.get('window');

const cities = [
  {
    id: 'near-you',
    name: 'Near You',
    image: '#E85D75',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1657981630164-769503f3a9a8?w=600&auto=format&fit=crop&q=60',
  },
  {
    id: 'pune',
    name: 'Pune',
    image: 'https://media.istockphoto.com/id/1136161968/photo/chatrapati-shivaji-maharaj-statue-katraj-pune-maharashtra.webp',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&auto=format&fit=crop&q=60',
  },
  {
    id: 'gurugram',
    name: 'Gurugram',
    image: 'https://media.istockphoto.com/id/1354251350/photo/dlf5-gurugram-haryana-india-city-lights-light-trails-and-colorful-sky-during-monsoons-delhi.webp',
  },
  {
    id: 'noida',
    name: 'Noida',
    image: 'https://images.unsplash.com/photo-1688978022482-00702c9eb83c?w=600&auto=format&fit=crop&q=60',
  },
  {
    id: 'delhi',
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=60',
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    image: 'https://images.unsplash.com/photo-1647102208648-5f3175091dda?w=600&auto=format&fit=crop&q=60',
  },
];

const PET_IMAGE = 'https://pngimg.com/uploads/dog/dog_PNG50302.png';

export default function ClinicTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCity, setSelectedCity] = useState(null);
  const flatListRef = useRef(null);

  const handleCitySelect = (cityId) => {
    setSelectedCity(cityId);
    router.push({
      pathname: '/(vetician_tabs)/pages/ClinicListScreen',
      params: { city: cityId }
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    heroHeader: {
      paddingHorizontal: 20,
      paddingBottom: 22,
      overflow: 'hidden',
    },
    circle1: {
      position: 'absolute', width: 180, height: 180, borderRadius: 90,
      backgroundColor: 'rgba(255,255,255,0.07)', top: -55, right: -40,
    },
    circle2: {
      position: 'absolute', width: 110, height: 110, borderRadius: 55,
      backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: -20,
    },
    navRow: {
      flexDirection: 'row', alignItems: 'center', marginBottom: 20,
    },
    navBtn: {
      width: 38, height: 38, borderRadius: 12,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
      alignItems: 'center', justifyContent: 'center',
    },
    navSpacer: { flex: 1 },
    navTitle: {
      position: 'absolute', left: 0, right: 0,
      textAlign: 'center', fontSize: 17,
      fontWeight: '800', color: '#fff', letterSpacing: 0.2,
    },
    heroRow: {
      flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16,
    },
    heroIconBox: {
      width: 54, height: 54, borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
      alignItems: 'center', justifyContent: 'center',
    },
    heroTextWrap: { flex: 1 },
    heroTitle: {
      fontSize: 20, fontWeight: '900', color: '#fff',
      letterSpacing: -0.3, marginBottom: 3,
    },
    heroSub: {
      fontSize: 12.5, color: 'rgba(255,255,255,0.75)',
    },
    statsRow: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.13)',
      borderRadius: 20, paddingHorizontal: 14,
      paddingVertical: 8, gap: 6, marginBottom: 16,
    },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
    statText: { fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
    statDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.35)' },
    searchBar: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: '#fff', borderRadius: 14,
      paddingHorizontal: 14, paddingVertical: 13,
    },
    searchBarText: {
      flex: 1, fontSize: 13.5, color: '#aaa', fontWeight: '500',
    },
    cityScrollContainer: {
      paddingVertical: 16,
      paddingHorizontal: 8,
      backgroundColor: '#FFFFFF',
    },
    cityItem: {
      alignItems: 'center',
      marginHorizontal: 8,
      paddingVertical: 4,
    },
    cityCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      overflow: 'hidden',
      borderWidth: 2,
    },
    cityCircleSelected: {
      borderColor: PRIMARY_GREEN,
    },
    cityCircleUnselected: {
      borderColor: '#D0D0D0',
    },
    cityCircleImage: {
      width: '100%',
      height: '100%',
      borderRadius: 40,
    },
    cityCircleLocationIcon: {
      width: '100%',
      height: '100%',
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cityName: {
      fontSize: 12,
      fontWeight: '500',
      color: '#1F1F1F',
      textAlign: 'center',
      maxWidth: 100,
    },
    contentSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    petImage: {
      width: 300,
      height: 300,
      marginBottom: 30,
    },
    comingSoonTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1F1F1F',
      marginBottom: 8,
      textAlign: 'center',
    },
    comingSoonSubtitle: {
      fontSize: 14,
      color: '#999999',
      textAlign: 'center',
      fontWeight: '400',
    },
  });

  const renderCityItem = ({ item }) => {
    const isNearYou = item.id === 'near-you';
    const isSelected = selectedCity === item.id;

    return (
      <TouchableOpacity
        style={styles.cityItem}
        onPress={() => handleCitySelect(item.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.cityCircle,
            isSelected ? styles.cityCircleSelected : styles.cityCircleUnselected,
          ]}
        >
          {isNearYou ? (
            <View
              style={[
                styles.cityCircleLocationIcon,
                { backgroundColor: '#E85D75' },
              ]}
            >
              <MaterialCommunityIcons
                name="send"
                size={32}
                color="#FFFFFF"
              />
            </View>
          ) : (
            <Image
              source={{ uri: item.image }}
              style={styles.cityCircleImage}
            />
          )}
        </View>
        <Text
          style={[
            styles.cityName,
            { color: isSelected ? PRIMARY_GREEN : '#999999' },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <StatusBar backgroundColor={DARK_GREEN} barStyle="light-content" translucent={false} />

        <LinearGradient
          colors={['#2E5E10', '#3D7A18', '#558B2F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroHeader, { paddingTop: insets.top + 12 }]}
        >
          {/* Decorative circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          {/* Nav row */}
          <View style={styles.navRow}>
            <RNText style={styles.navTitle}>Find Clinics</RNText>
            <TouchableOpacity style={styles.navBtn} onPress={() => router.back()} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.navSpacer} />
            <TouchableOpacity style={styles.navBtn} activeOpacity={0.8}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Hero identity */}
          <View style={styles.heroRow}>
            <View style={styles.heroIconBox}>
              <MaterialCommunityIcons name="hospital-building" size={26} color="#fff" />
            </View>
            <View style={styles.heroTextWrap}>
              <RNText style={styles.heroTitle}>Verified Vet Clinics</RNText>
              <RNText style={styles.heroSub}>Trusted care for your pets, nearby</RNText>
            </View>
          </View>

          {/* Stats strip */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="hospital-marker" size={13} color="rgba(255,255,255,0.9)" />
              <RNText style={styles.statText}>500+ Clinics</RNText>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="shield-check-outline" size={13} color="rgba(255,255,255,0.9)" />
              <RNText style={styles.statText}>All Verified</RNText>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="map-marker-radius-outline" size={13} color="rgba(255,255,255,0.9)" />
              <RNText style={styles.statText}>8 Cities</RNText>
            </View>
          </View>

          {/* Search bar */}
          <TouchableOpacity style={styles.searchBar} activeOpacity={0.85}>
            <MaterialCommunityIcons name="magnify" size={18} color="#558B2F" />
            <RNText style={styles.searchBarText}>Search clinics or select a city...</RNText>
            <MaterialCommunityIcons name="tune-variant" size={18} color="#aaa" />
          </TouchableOpacity>
        </LinearGradient>

        <FlatList
          ref={flatListRef}
          data={cities}
          renderItem={renderCityItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToAlignment="start"
          style={styles.cityScrollContainer}
          contentContainerStyle={{
            paddingHorizontal: 12,
          }}
        />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={styles.contentSection}>
            <Image
              source={{ uri: PET_IMAGE }}
              style={styles.petImage}
              resizeMode="contain"
            />
            <Text style={styles.comingSoonTitle}>Looking for us?</Text>
            <Text style={styles.comingSoonSubtitle}>
              Select a city to find clinics near you
            </Text>
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}
