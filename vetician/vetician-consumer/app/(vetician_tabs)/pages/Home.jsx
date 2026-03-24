import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  Animated,
  Easing,
  SafeAreaView,
  TextInput,
  Modal,
  StatusBar,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Search, X, ChevronDown } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import ApiService from '../../../services/api';
import PetDetailModal from '../../../components/petparent/home/PetDetailModal';
import Sidebar from '../../../components/Sidebar';
import socketService from '../../../services/socket';
import IncomingCallScreen from '../../../components/IncomingCallScreen';
import SimpleVideoCall from '../../../components/SimpleVideoCall';
import { useDispatch } from 'react-redux';
import { getPetsByUserId } from '../../../store/slices/authSlice';

const { width, height } = Dimensions.get('window');

// Service data
const SERVICES = [
  {
    id: 1,
    name: 'Doorstep',
    icon: 'home-repair-service',
    description: 'Vet at your door',
    image:
      'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Video Call',
    icon: 'videocam',
    description: 'Online consultation',
    image:
      'https://media.istockphoto.com/id/1262282672/photo/smiling-indian-female-doctor-holding-phone-talk-to-patient-make-telemedicine-online.jpg?s=2048x2048&w=is&k=20&c=X1pSAAZ_UGzkChij6navw_fP0EyFWktBT6VOL1Rn1-Y=',
  },
  {
    id: 3,
    name: 'Pet Watching',
    icon: 'visibility',
    description: 'Pet care service',
    image:
      'https://images.unsplash.com/photo-1770836037793-95bdbf190f71?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    name: 'Book Hostel',
    icon: 'home',
    description: 'Pet boarding',
    image:
      'https://media.istockphoto.com/id/1212567968/photo/cute-jack-russell-dog-covered-with-ethnic-blanket-sitting-on-the-couch-at-home-lifestyle.jpg?s=2048x2048&w=is&k=20&c=5n-XNKsvJhf_TVADHOn508xgpOldNlF-hvxDD5YvspM=',
  },
  {
    id: 5,
    name: 'Day Care',
    icon: 'wb-sunny',
    description: 'Day care service',
    image:
      'https://media.istockphoto.com/id/1355992960/photo/dog-boarding-concept-with-small-happy-pet-looking-out-of-carrier.jpg?s=2048x2048&w=is&k=20&c=PaZTqIX-_5XaUEFnhVY-bROUBBPs0wSKszOfQo0xlpo=',
  },
  {
    id: 6,
    name: 'Pet Training',
    icon: 'emoji-events',
    description: 'Training programs',
    image:
      'https://media.istockphoto.com/id/1281120262/photo/up.jpg?s=2048x2048&w=is&k=20&c=4wapfGDWlucGmKPgqOEFrZF-DFni1ykUawyG1QBRb-8=',
  },
  {
    id: 7,
    name: 'Pet Grooming',
    icon: 'content-cut',
    description: 'Grooming service',
    image:
      'https://media.istockphoto.com/id/1021301002/photo/pomeraninan-pet-groomer.jpg?s=2048x2048&w=is&k=20&c=g4AgX6GA1muepv-kxxAM4QJu9x-WyovPrY7m0VGgbts=',
  },
  {
    id: 8,
    name: 'Find Clinics',
    icon: 'add-circle',
    description: 'Nearby clinics',
    image:
      'https://media.istockphoto.com/id/1545617758/photo/veterinarian-examines-a-cute-little-cat-at-the-animal-hospital.jpg?s=2048x2048&w=is&k=20&c=veZVtbQULHhdNFDpxiQ6Z71q32sNw5_x8tOYsOz-5Pk=',
  },
];

// Promotion cards
const PROMOTIONS = [
  {
    id: 1,
    title: '10% OFF',
    subtitle: 'ON CONSULTATION & DOORSTEP SERVICE',
    badge: 'LIMITED TIME',
    buttonText: 'Book Now',
    image:
      'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&auto=format&fit=crop',
  },
];

// Health Tips data
const HEALTH_TIPS = [
  {
    id: '1',
    title: 'Summer Pet Care',
    description:
      'Keep your pets hydrated and avoid walking them on hot pavement during peak temperatures. Provide plenty of shade and fresh water.',
    extendedInfo:
      'Signs of heatstroke include excessive panting, drooling, lethargy, and vomiting. If you suspect heatstroke, move your pet to a cool area immediately and contact your vet.',
    image:
      'https://images.unsplash.com/photo-1551290464-66719418ca54?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'seasonal',
  },
  {
    id: '2',
    title: 'Vaccination Reminder',
    description:
      'Annual vaccines are due next month. Schedule an appointment with your veterinarian to keep your pet protected.',
    extendedInfo:
      'Core vaccines for dogs include rabies, distemper, parvovirus, and adenovirus. For cats: rabies, feline distemper, calicivirus, and herpesvirus.',
    image:
      'https://images.unsplash.com/photo-1583511655826-05700442b31f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'preventive',
  },
];

export default function VeticionHome() {
  const user = useSelector((state) => state.auth.user);
  const pets = useSelector((state) => state.auth?.userPets?.data || []);
  const router = useRouter();
  const dispatch = useDispatch();

  const [parentData, setParentData] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [inVideoCall, setInVideoCall] = useState(false);
  const [callToken, setCallToken] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState({ services: [], clinics: [] });

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getUserLocation = async (forceRequest = false) => {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

      if (status !== 'granted') {
        if (canAskAgain || forceRequest) {
          const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
          if (newStatus !== 'granted') {
            setLocationPermissionDenied(true);
            Alert.alert(
              'Location Permission Required',
              'Please enable location access in Settings to see nearby clinics.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
              ]
            );
            return null;
          }
        } else {
          setLocationPermissionDenied(true);
          Alert.alert(
            'Location Permission Required',
            'Please enable location access in Settings to see nearby clinics.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          return null;
        }
      }

      try {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const coords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
        setUserLocation(coords);
        setLocationPermissionDenied(false);
        return coords;
      } catch {
        // GPS unavailable (emulator/device GPS off) - permission granted but no signal
        // Still show prompt so user knows location is needed
        setLocationPermissionDenied(true);
        return null;
      }
    } catch (error) {
      setLocationPermissionDenied(true);
      return null;
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const fetchParentData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const data = await ApiService.getParentById(userId);
        if (data?.parent?.[0]) {
          setParentData(data.parent[0]);
        }
      }
    } catch (err) {
      console.error('Parent data fetch failed:', err.message);
    }
  };

  const fetchClinics = async (coords) => {
    try {
      const loc = coords || userLocation;
      const locationParams = loc
        ? { userLat: loc.latitude, userLon: loc.longitude }
        : {};

      const data = await ApiService.getAllVerifiedClinics(locationParams);
      const clinicsList = Array.isArray(data) ? data : data?.data || [];
      
      console.log('🏥 First clinic raw:', JSON.stringify(clinicsList[0], null, 2));

      const clinicsWithDistance = clinicsList
        .map((clinic) => ({
          ...clinic,
          distance: clinic.clinicDetails?.distance || 'N/A',
          clinicName: clinic.clinicDetails?.clinicName || clinic.clinicName,
          establishmentType: clinic.clinicDetails?.establishmentType || clinic.establishmentType,
          profilePhotoUrl: clinic.veterinarianDetails?.profilePhotoUrl,
          _id: clinic.clinicDetails?._id || clinic._id,
          // keep full nested objects for handleClinicPress
          clinicDetails: clinic.clinicDetails,
          veterinarianDetails: clinic.veterinarianDetails,
        }))
        .sort((a, b) => {
          const distA =
            a.distance === 'N/A' ? Infinity : parseFloat(a.distance);
          const distB =
            b.distance === 'N/A' ? Infinity : parseFloat(b.distance);
          return distA - distB;
        });

      setClinics(clinicsWithDistance);
    } catch (err) {
      console.error('Clinics fetch failed:', err.message);
      setClinics([]);
    }
  };

  // Search function
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults({ services: [], clinics: [] });
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Search services
    const matchedServices = SERVICES.filter(
      (service) =>
        service.name.toLowerCase().includes(lowerQuery) ||
        service.description.toLowerCase().includes(lowerQuery)
    );

    // Search clinics
    const matchedClinics = clinics.filter(
      (clinic) =>
        clinic.clinicName.toLowerCase().includes(lowerQuery) ||
        clinic.establishmentType.toLowerCase().includes(lowerQuery)
    );

    setSearchResults({
      services: matchedServices,
      clinics: matchedClinics,
    });
  };

  useEffect(() => {
    const init = async () => {
      const coords = await getUserLocation();
      if (!coords) setLocationPermissionDenied(true);
      await fetchParentData();
      await fetchClinics(coords);

      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        socketService.connect(userId, 'petparent');
        socketService.onIncomingCall((callData) => {
          setIncomingCall(callData);
          setShowIncomingCall(true);
        });
      }

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    };

    init();

    return () => {
      if (socketService.socket) {
        socketService.socket.off('incoming-call');
      }
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getPetsByUserId());
    }, []),
  );

  useEffect(() => {
    if (userLocation) {
      fetchClinics(userLocation);
    }
  }, [userLocation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClinics(userLocation);
    setRefreshing(false);
  };

  const handlePetPress = (pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const handleClinicPress = (clinic) => {
    const cd = clinic.clinicDetails || {};
    const vd = clinic.veterinarianDetails || {};
    router.push({
      pathname: 'pages/ClinicDetailScreen',
      params: {
        clinicId: cd._id || clinic._id,
        clinicName: cd.clinicName || '',
        establishmentType: cd.establishmentType || '',
        distance: cd.distance || 'N/A',
        profilePhotoUrl: vd.profilePhotoUrl || '',
        city: cd.city || '',
        locality: cd.locality || '',
        streetAddress: cd.streetAddress || '',
        fees: cd.fees || '',
        vetId: vd.vetId || '',
        vetName: vd.name || '',
        specialization: vd.specialization || '',
        experience: vd.experience || '',
      },
    });
  };

  const handleServicePress = (service) => {
    switch (service.id) {
      case 1:
        router.push('pages/DoorStep');
        break;
      case 2:
        router.push('pages/VideoConsultation');
        break;
      case 3:
        router.push('pages/PetWatching');
        break;
      case 4:
        router.push('pages/Hostel');
        break;
      case 5:
        router.push('pages/School');
        break;
      case 6:
        router.push('pages/PetTraning');
        break;
      case 7:
        router.push('pages/Grooming');
        break;
      case 8:
        router.push('/(vetician_tabs)/(tabs)/clinic');
        break;
      default:
        break;
    }
    setShowSearchModal(false);
    setSearchQuery('');
  };

  const handleAcceptCall = () => {
    setShowIncomingCall(false);
    setCallToken(incomingCall?.token);
    setRoomName(incomingCall?.roomName);
    setInVideoCall(true);
  };

  const handleRejectCall = () => {
    setShowIncomingCall(false);
    setIncomingCall(null);
  };

  const handleCallEnd = () => {
    setInVideoCall(false);
    setCallToken(null);
    setRoomName(null);
  };

  if (inVideoCall && callToken && roomName) {
    return (
      <SimpleVideoCall
        token={callToken}
        roomName={roomName}
        onCallEnd={handleCallEnd}
        isInitiator={false}
      />
    );
  }

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      activeOpacity={0.85}
      onPress={() => handleServicePress(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.serviceImage}
        resizeMode="cover"
      />
      <View style={styles.serviceNameContainer}>
        <Text style={styles.serviceNameImage} numberOfLines={1}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPromotionCard = ({ item }) => (
    <TouchableOpacity activeOpacity={0.85} style={styles.promotionCard}>
      <LinearGradient
        colors={['#7CB342', '#558B2F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.promotionGradient}
      >
        {/* Left side - Text Content */}
        <View style={styles.promotionContent}>
          <Text style={styles.promotionBadge}>{item.badge}</Text>
          <Text style={styles.promotionTitle}>{item.title}</Text>
          <Text style={styles.promotionSubtitle}>{item.subtitle}</Text>
          <TouchableOpacity style={styles.bookNowButton}>
            <Text style={styles.bookNowText}>{item.buttonText}</Text>
          </TouchableOpacity>
        </View>

        {/* Right side - Image */}
        {item.image && (
          <View style={styles.promotionImageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.promotionImage}
              resizeMode="cover"
            />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderSearchResultService = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleServicePress(item)}
    >
      <View style={styles.searchResultIconContainer}>
        <MaterialIcons name={item.icon} size={24} color="#7CB342" />
      </View>
      <View style={styles.searchResultContent}>
        <Text style={styles.searchResultTitle}>{item.name}</Text>
        <Text style={styles.searchResultSubtitle}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchResultClinic = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => {
        handleClinicPress(item);
        setShowSearchModal(false);
        setSearchQuery('');
      }}
    >
      <View style={styles.searchResultImageContainer}>
        {item.profilePhotoUrl ? (
          <Image
            source={{ uri: item.profilePhotoUrl }}
            style={styles.searchResultImage}
          />
        ) : (
          <LinearGradient
            colors={['#E8F5E9', '#C8E6C9']}
            style={styles.searchResultImage}
          >
            <MaterialIcons name="local-hospital" size={20} color="#7CB342" />
          </LinearGradient>
        )}
      </View>
      <View style={styles.searchResultContent}>
        <Text style={styles.searchResultTitle}>{item.clinicName}</Text>
        <Text style={styles.searchResultSubtitle}>{item.establishmentType}</Text>
      </View>
    </TouchableOpacity>
  );

  const headerSlideStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
    opacity: fadeAnim,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7CB342']}
          />
        }
      >
        {/* Header */}
        <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.appName}>Vetician</Text>
              <TouchableOpacity 
                style={styles.locationInline}
                onPress={async () => {
                  const coords = await getUserLocation(true);
                  if (coords) fetchClinics(coords);
                  else fetchClinics({});
                }}
                activeOpacity={0.7}
              >
                <MapPin size={13} color={userLocation ? '#fff' : 'rgba(255,255,255,0.6)'} />
                <Text style={[styles.locationInlineText, !userLocation && { opacity: 0.7 }]}>
                  {userLocation ? 'Near You ✓' : 'Near You'}
                </Text>
                <ChevronDown size={13} color="rgba(255,255,255,0.85)" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.push('/(vetician_tabs)/(tabs)/profile')}>
              <MaterialIcons name="person" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => setShowSearchModal(true)}
          >
            <Search size={16} color="#999" />
            <Text style={styles.searchPlaceholder}>Search for Clinics</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Best Services */}
        <Animated.View style={[styles.servicesSection, headerSlideStyle]}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Pet Care Services</Text>
            <Text style={styles.sectionSubtitle}>Know your pet better</Text>
          </View>

          <View style={styles.servicesGrid}>
            {SERVICES.map((service) => (
              <View key={service.id} style={styles.gridItem}>
                {renderServiceCard({ item: service })}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Promotion */}
        <View style={styles.promotionSection}>
          <FlatList
            data={PROMOTIONS}
            renderItem={renderPromotionCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* My Pets */}
        {pets.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Pets</Text>
              <TouchableOpacity onPress={() => router.push('pages/PetList')}>
                <Text style={styles.seeAll}>See All →</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={pets.slice(0, 3)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.petCard}
                  onPress={() => handlePetPress(item)}
                >
                  <View style={styles.petImageContainer}>
                    {item.petPhoto || item.image || item.photoUrl ? (
                      <Image
                        source={{
                          uri: item.petPhoto || item.image || item.photoUrl,
                        }}
                        style={styles.petImage}
                      />
                    ) : (
                      <LinearGradient
                        colors={['#7CB342', '#558B2F']}
                        style={styles.petImagePlaceholder}
                      >
                        <FontAwesome5 name="paw" size={24} color="#fff" />
                      </LinearGradient>
                    )}
                  </View>
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{item.name}</Text>
                    <Text style={styles.petBreed}>
                      {item.breed || 'Unknown'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id || item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Nearby Clinics */}
        <View style={styles.section}>
          {clinics.length === 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Nearby Clinics</Text>
              </View>
              <TouchableOpacity
                style={styles.locationPromptCard}
                activeOpacity={0.85}
                onPress={async () => {
                  const coords = await getUserLocation(true);
                  if (coords) fetchClinics(coords);
                  else fetchClinics({});
                }}
              >
                <View style={styles.locationPromptIconWrap}>
                  <MaterialIcons name="location-off" size={32} color="#7CB342" />
                </View>
                <Text style={styles.locationPromptTitle}>Enable Location to See Nearby Clinics</Text>
                <Text style={styles.locationPromptSubtitle}>
                  We need your location to show the best vet clinics near you.
                </Text>
                <View style={styles.locationPromptButton}>
                  <MaterialIcons name="my-location" size={16} color="#fff" />
                  <Text style={styles.locationPromptButtonText}>Allow Location Access</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Nearby Clinics</Text>
                <TouchableOpacity onPress={() => router.push('pages/ClinicListScreen')}>
                  <Text style={styles.seeAll}>See All →</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                data={clinics.slice(0, 5)}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 4 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.clinicCardMain}
                    onPress={() => handleClinicPress(item)}
                    activeOpacity={0.9}
                  >
                    {/* Image */}
                    <View style={styles.clinicCardImageContainer}>
                      <Image
                        source={{ uri: item.profilePhotoUrl || 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&auto=format&fit=crop' }}
                        style={styles.clinicCardImage}
                        resizeMode="cover"
                      />
                      {/* Verified badge */}
                      <View style={styles.clinicVerifiedBadge}>
                        <MaterialIcons name="verified" size={11} color="#10B981" />
                        <Text style={styles.clinicVerifiedText}>Verified</Text>
                      </View>
                      {/* Distance badge */}
                      <View style={styles.clinicDistanceBadge}>
                        <MaterialIcons name="near-me" size={11} color="#7CB342" />
                        <Text style={styles.clinicDistanceBadgeText}>
                          {item.distance !== 'N/A' ? `${item.distance} km` : 'Nearby'}
                        </Text>
                      </View>
                    </View>

                    {/* Info */}
                    <View style={styles.clinicCardInfo}>
                      <View style={styles.clinicCardNameRow}>
                        <Text style={styles.clinicCardName} numberOfLines={1} ellipsizeMode="tail">{item.clinicName}</Text>
                        {item.clinicDetails?.fees ? (
                          <Text style={styles.clinicCardFees}>₹{item.clinicDetails.fees}</Text>
                        ) : null}
                      </View>
                      <View style={styles.clinicCardRow}>
                        <MaterialIcons name="local-hospital" size={11} color="#999" />
                        <Text style={styles.clinicCardTypeText} numberOfLines={1}>{item.establishmentType}</Text>
                      </View>
                      {item.clinicDetails?.timings?.mon?.start ? (
                        <View style={styles.clinicCardRow}>
                          <MaterialIcons name="access-time" size={11} color="#7CB342" />
                          <Text style={styles.clinicCardTimeText}>
                            {item.clinicDetails.timings.mon.start} - {item.clinicDetails.timings.mon.end}
                          </Text>
                        </View>
                      ) : null}
                      <TouchableOpacity style={styles.bookNowBadge} onPress={() => handleClinicPress(item)}>
                        <Text style={styles.bookNowBadgeText}>Book Now</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
        </View>

        {/* Health Tips Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Tips</Text>
            <Text style={styles.sectionSubtitleSmall}>Stay informed</Text>
          </View>
          <FlatList
            horizontal
            data={HEALTH_TIPS}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.healthTipCard}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.healthTipImage}
                  resizeMode="cover"
                />
                <View style={styles.healthTipContent}>
                  <Text style={styles.healthTipTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.healthTipDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.healthTipsListH}
            scrollEventThrottle={16}
          />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowSearchModal(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.searchModalOverlay}>
          <View style={styles.searchModalContent}>
            {/* Search Input */}
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#7CB342" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search services or clinics..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
              />
              <TouchableOpacity
                onPress={() => {
                  setShowSearchModal(false);
                  setSearchQuery('');
                }}
              >
                <X size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Search Results */}
            {searchQuery.trim() !== '' ? (
              <ScrollView style={styles.searchResultsContainer}>
                {/* Services Results */}
                {searchResults.services.length > 0 && (
                  <View style={styles.searchResultsSection}>
                    <Text style={styles.searchResultsTitle}>Services</Text>
                    {searchResults.services.map((service) => (
                      <View key={service.id}>
                        {renderSearchResultService({ item: service })}
                      </View>
                    ))}
                  </View>
                )}

                {/* Clinics Results */}
                {searchResults.clinics.length > 0 && (
                  <View style={styles.searchResultsSection}>
                    <Text style={styles.searchResultsTitle}>Clinics</Text>
                    {searchResults.clinics.map((clinic) => (
                      <View key={clinic._id}>
                        {renderSearchResultClinic({ item: clinic })}
                      </View>
                    ))}
                  </View>
                )}

                {/* No Results */}
                {searchResults.services.length === 0 &&
                  searchResults.clinics.length === 0 && (
                    <View style={styles.noResultsContainer}>
                      <MaterialIcons
                        name="search"
                        size={48}
                        color="#DDD"
                      />
                      <Text style={styles.noResultsText}>No results found</Text>
                      <Text style={styles.noResultsSubtext}>
                        Try searching with different keywords
                      </Text>
                    </View>
                  )}
              </ScrollView>
            ) : (
              <View style={styles.searchEmptyContainer}>
                <Search size={48} color="#DDD" />
                <Text style={styles.searchEmptyText}>
                  Search for services or clinics
                </Text>
                <Text style={styles.searchEmptySubtext}>
                  Type to find what you're looking for
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modals */}
      <PetDetailModal
        pet={selectedPet}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      <IncomingCallScreen
        visible={showIncomingCall}
        callerData={incomingCall?.doctorData}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7CB342',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 12 : 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  locationInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationInlineText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#999',
    flex: 1,
  },
  servicesSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#F5F5F5',
  },
  sectionTitleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '23.5%',
    marginBottom: 12,
  },
  serviceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  serviceCardWithImage: {
    flex: 1,
  },
  serviceImage: {
    width: '100%',
    aspectRatio: 1,
  },
  serviceNameContainer: {
    backgroundColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  serviceNameImage: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  serviceGradient: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    aspectRatio: 1,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
  },
  serviceDescription: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  promotionSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
  },
  promotionCard: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  promotionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 0,
    height: 160,
    justifyContent: 'space-between',
  },
  promotionContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 16,
  },
  promotionBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  promotionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    lineHeight: 36,
  },
  promotionSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 12,
    lineHeight: 15,
  },
  bookNowButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  bookNowText: {
    color: '#7CB342',
    fontSize: 12,
    fontWeight: '700',
  },
  promotionImageContainer: {
    width: 150,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  promotionImage: {
    width: '100%',
    height: '100%',
  },
  healthTipsListH: {
    paddingHorizontal: 16,
    paddingRight: 20,
  },
  healthTipCard: {
    width: width * 0.42,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  healthTipImage: {
    width: '100%',
    height: 100,
  },
  healthTipContent: {
    padding: 12,
  },
  healthTipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  healthTipDescription: {
    fontSize: 11,
    color: '#666',
    lineHeight: 15,
  },
  sectionSubtitleSmall: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 13,
    color: '#7CB342',
    fontWeight: '600',
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  petImageContainer: {
    marginRight: 12,
  },
  petImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  petImagePlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 12,
    color: '#999',
  },
  clinicsRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  clinicCardMain: {
    width: width * 0.58,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  clinicCardImageContainer: {
    width: '100%',
    height: 140,
    overflow: 'hidden',
  },
  clinicCardImage: {
    width: '100%',
    height: 140,
  },
  clinicVerifiedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 3,
  },
  clinicVerifiedText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 10,
  },
  clinicDistanceBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 3,
  },
  clinicDistanceBadgeText: {
    color: '#7CB342',
    fontWeight: '700',
    fontSize: 10,
  },
  clinicCardInfo: {
    padding: 10,
  },
  clinicCardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  clinicCardName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 6,
  },
  clinicCardFees: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7CB342',
  },
  clinicCardType: {
    fontSize: 11,
    color: '#999',
    marginBottom: 5,
  },
  clinicCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  clinicCardDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
  },
  clinicCardDistanceText: {
    fontSize: 11,
    color: '#7CB342',
    fontWeight: '600',
  },
  clinicCardTimeText: {
    fontSize: 11,
    color: '#7CB342',
    fontWeight: '600',
  },
  clinicCardTypeText: {
    fontSize: 11,
    color: '#999',
    flex: 1,
  },
  bookNowBadge: {
    marginTop: 10,
    backgroundColor: '#7CB342',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookNowBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  locationPromptCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1.5,
    borderColor: '#E8F5E9',
    borderStyle: 'dashed',
  },
  locationPromptIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  locationPromptTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  locationPromptSubtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  locationPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7CB342',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 25,
    gap: 8,
  },
  locationPromptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Search Modal Styles
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  searchModalContent: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    maxHeight: height * 0.85,
    paddingTop: 0,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#F5F5F5',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: 8,
  },
  searchResultsContainer: {
    flex: 1,
    paddingTop: 12,
  },
  searchResultsSection: {
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchResultsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7CB342',
    paddingHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  searchResultIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchResultImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  searchResultImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  searchResultSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  noResultsSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  searchEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  searchEmptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  searchEmptySubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
});