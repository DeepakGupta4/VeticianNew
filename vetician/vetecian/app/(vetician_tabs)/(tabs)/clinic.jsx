import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import {
  Text,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
    headerSection: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      shadowColor: '#558B2F',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
      flex: 1,
      textAlign: 'center',
    },
    searchButton: {
      padding: 8,
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
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[DARK_GREEN, '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerSection}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Select City</Text>
            <TouchableOpacity style={styles.searchButton}>
              <MaterialCommunityIcons name="magnify" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
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
      </SafeAreaView>
    </PaperProvider>
  );
}
