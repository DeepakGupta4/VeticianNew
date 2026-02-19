// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
//   Dimensions,
//   Image
// } from 'react-native';
// import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
// import { useDispatch, useSelector } from 'react-redux';
// import { getPetsByUserId, clearUserPets } from '../../../store/slices/authSlice';
// import { router } from 'expo-router';
// import { ChevronLeft } from 'lucide-react-native';
// import PetDetailsModal from '../../../components/petparent/home/PetDetailModal';

// const { width } = Dimensions.get('window');
// const PET_TYPES = {
//   Dog: 'dog',
//   Cat: 'cat',
//   default: 'paw'
// };

// const PetCard = ({ pet, onPress, onEdit }) => {
//   if (!pet) return null;

//   const getPetIcon = () => {
//     return PET_TYPES[pet.species] || PET_TYPES.default;
//   };

//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress}>
//       <View style={styles.cardImageContainer}>
//         {pet?.petPhoto ? (
//           <Image source={{ uri: pet.petPhoto }} style={styles.profileImage} />
//         ) : (
//           <View style={styles.profilePlaceholder}>
//             <FontAwesome5
//               name={getPetIcon()}
//               size={32}
//               color="#4E8D7C"
//             />
//           </View>
//         )}
//       </View>

//       <View style={styles.cardContent}>
//         <View style={styles.cardHeader}>
//           <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
//           <View style={styles.typeBadge}>
//             <Text style={styles.typeText}>{pet.species}</Text>
//           </View>
//           <TouchableOpacity onPress={(e) => {
//             e.stopPropagation();
//             onEdit();
//           }}>
//             <MaterialIcons name="edit" size={20} color="#4E8D7C" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.detailsRow}>
//           <View style={styles.detailItem}>
//             <MaterialCommunityIcons name="gender-male-female" size={16} color="#7D7D7D" />
//             <Text style={styles.detailText}>{pet.gender}</Text>
//           </View>
//           {pet.breed && (
//             <View style={styles.detailItem}>
//               <FontAwesome5 name="dna" size={14} color="#7D7D7D" />
//               <Text style={styles.detailText}>{pet.breed}</Text>
//             </View>
//           )}
//         </View>

//         {pet.dob && (
//           <View style={styles.detailsRow}>
//             <View style={styles.detailItem}>
//               <MaterialIcons name="cake" size={16} color="#7D7D7D" />
//               <Text style={styles.detailText}>
//                 {new Date(pet.dob).toLocaleDateString()}
//               </Text>
//             </View>
//           </View>
//         )}

//         <View style={styles.statsContainer}>
//           {pet.weight && <StatItem value={`${pet.weight} kg`} label="Weight" />}
//           {pet.height && <StatItem value={`${pet.height} cm`} label="Height" />}
//           {pet.age && <StatItem value={pet.age} label="Age" />}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const StatItem = ({ value, label }) => (
//   <View style={styles.statItem}>
//     <Text style={styles.statValue}>{value}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </View>
// );

// const PetListScreen = () => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedPet, setSelectedPet] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const pets = useSelector(state => state.auth?.userPets?.data || []);

//   useEffect(() => {
//     fetchPets();
//     return () => dispatch(clearUserPets());
//   }, [dispatch]);

//   const fetchPets = async () => {
//     try {
//       setLoading(true);
//       const result = await dispatch(getPetsByUserId()).unwrap();
//       if (result.error) throw new Error(result.payload || 'Failed to load pets');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     try {
//       setRefreshing(true);
//       await dispatch(getPetsByUserId());
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handlePetPress = (pet) => {
//     setSelectedPet(pet);
//     setModalVisible(true);
//   };

//   const handleEditPress = (pet) => {
//     router.push({
//       pathname: 'pages/EditPetScreen',
//       params: { petId: pet._id }
//     });
//   };

//   const Header = () => (
//     <View style={styles.header}>
//       <TouchableOpacity onPress={() => router.push('/(vetician_tabs)/(tabs)')} style={styles.menuButton}>
//         <ChevronLeft size={24} color="#1a1a1a" />
//       </TouchableOpacity>
//       <View>
//         <Text style={styles.headerTitle}>My Pets</Text>
//         <Text style={styles.headerSubtitle}>Your registered companions</Text>
//       </View>
//     </View>
//   );

//   const LoadingView = () => (
//     <View style={styles.loadingContainer}>
//       <ActivityIndicator size="large" color="#4E8D7C" />
//       <Text style={styles.loadingText}>Loading your pets...</Text>
//     </View>
//   );

//   const ErrorView = ({ error, onRetry }) => (
//     <View style={styles.errorContainer}>
//       <MaterialIcons name="error-outline" size={50} color="#E74C3C" />
//       <Text style={styles.errorText}>{error}</Text>
//       <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
//         <Text style={styles.retryButtonText}>Try Again</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const EmptyState = ({ onAddPet }) => (
//     <View style={styles.emptyContainer}>
//       <FontAwesome5 name="paw" size={60} color="#E0E0E0" />
//       <Text style={styles.emptyTitle}>No Pets Found</Text>
//       <Text style={styles.emptyText}>You haven't registered any pets yet</Text>
//       <TouchableOpacity style={styles.addPetButton} onPress={onAddPet}>
//         <Text style={styles.addPetButtonText}>Register a Pet</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading && !refreshing) return <LoadingView />;
//   if (error) return <ErrorView error={error} onRetry={() => {
//     setError(null);
//     dispatch(getPetsByUserId());
//   }} />;

//   return (
//     <View style={styles.container}>
//       <Header />

//       <View style={styles.resultsContainer}>
//         <Text style={styles.resultsText}>
//           {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'} Registered
//         </Text>
//         <TouchableOpacity onPress={handleRefresh}>
//           <MaterialIcons name="refresh" size={24} color="#4E8D7C" />
//         </TouchableOpacity>
//       </View>

//       {pets.length === 0 ? (
//         <EmptyState onAddPet={() => router.navigate('/pages/PetDetail')} />
//       ) : (
//         <>
//           <FlatList
//             data={pets}
//             renderItem={({ item }) => (
//               <PetCard 
//                 pet={item} 
//                 onPress={() => handlePetPress(item)} 
//                 onEdit={() => handleEditPress(item)}
//               />
//             )}
//             keyExtractor={(item) => item._id || String(Math.random())}
//             contentContainerStyle={styles.listContainer}
//             showsVerticalScrollIndicator={false}
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//           />
//           <TouchableOpacity
//             style={styles.addButtonFloating}
//             onPress={() => router.navigate('/pages/PetDetail')}
//           >
//             <MaterialIcons name="add" size={28} color="white" />
//           </TouchableOpacity>
          
//           <PetDetailsModal
//             pet={selectedPet}
//             visible={modalVisible}
//             onClose={() => setModalVisible(false)}
//           />
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//     paddingHorizontal: 16,
//     paddingTop: 50
//   },
//   header: {
//     marginBottom: 20,
//     paddingHorizontal: 8,
//     display: "flex",
//     flexDirection: 'row'
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#2C3E50',
//     marginBottom: 4
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: '#7D7D7D'
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA'
//   },
//   loadingText: {
//     marginTop: 16,
//     color: '#4E8D7C',
//     fontSize: 16
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#F8F9FA'
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#E74C3C',
//     marginVertical: 20,
//     textAlign: 'center'
//   },
//   retryButton: {
//     backgroundColor: '#4E8D7C',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 10
//   },
//   retryButtonText: {
//     color: 'white',
//     fontWeight: '600'
//   },
//   resultsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingHorizontal: 8
//   },
//   resultsText: {
//     color: '#2C3E50',
//     fontSize: 16,
//     fontWeight: '600'
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#2C3E50',
//     marginTop: 16
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#7D7D7D',
//     textAlign: 'center',
//     marginTop: 8,
//     marginBottom: 24
//   },
//   addPetButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     backgroundColor: '#4E8D7C',
//     borderRadius: 8
//   },
//   addPetButtonText: {
//     color: 'white',
//     fontWeight: '600'
//   },
//   listContainer: {
//     paddingBottom: 30
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     flexDirection: 'row',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3
//   },
//   cardImageContainer: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2
//   },
//   profileImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 12,
//     marginRight: 16
//   },
//   profilePlaceholder: {
//     width: 90,
//     height: 90,
//     borderRadius: 12,
//     backgroundColor: '#F0F7F4',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16
//   },
//   cardContent: {
//     flex: 1
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8
//   },
//   petName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2C3E50',
//     flex: 1,
//     marginRight: 10
//   },
//   typeBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     backgroundColor: '#E8F5E9',
//     borderColor: '#4E8D7C',
//     borderWidth: 1,
//     marginRight: 10
//   },
//   typeText: {
//     fontSize: 12,
//     color: '#4E8D7C',
//     fontWeight: '600'
//   },
//   detailsRow: {
//     flexDirection: 'row',
//     marginBottom: 8
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16
//   },
//   detailText: {
//     fontSize: 14,
//     color: '#555',
//     marginLeft: 4
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#EEE'
//   },
//   statItem: {
//     alignItems: 'center'
//   },
//   statValue: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2C3E50'
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#7D7D7D',
//     marginTop: 2
//   },
//   menuButton: {
//     marginRight: 20,
//     justifyContent: 'center',
//     padding: 5
//   },
//   addButtonFloating: {
//     position: 'absolute',
//     bottom: 30,
//     right: 30,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#4E8D7C',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5
//   }
// });

// export default PetListScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
  Animated
} from 'react-native';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getPetsByUserId, clearUserPets } from '../../../store/slices/authSlice';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import PetDetailsModal from '../../../components/petparent/home/PetDetailModal';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const PET_TYPES = {
  Dog: 'dog',
  Cat: 'cat',
  default: 'paw'
};

const PetCard = ({ pet, onPress, onEdit, index }) => {
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      useNativeDriver: true,
      friction: 8,
      tension: 40
    }).start();
  }, []);

  if (!pet) return null;

  const getPetIcon = () => {
    return PET_TYPES[pet.species] || PET_TYPES.default;
  };

  const getGradientColors = () => {
    const gradients = {
      Dog: ['#FF6B6B', '#FF8E53'],
      Cat: ['#4ECDC4', '#44A08D'],
      default: ['#A8E6CF', '#7EC8A3']
    };
    return gradients[pet.species] || gradients.default;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['rgba(78, 141, 124, 0.03)', 'rgba(78, 141, 124, 0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardImageContainer}>
            {pet?.petPhoto ? (
              <Image source={{ uri: pet.petPhoto }} style={styles.profileImage} />
            ) : (
              <LinearGradient
                colors={getGradientColors()}
                style={styles.profilePlaceholder}
              >
                <FontAwesome5
                  name={getPetIcon()}
                  size={36}
                  color="white"
                />
              </LinearGradient>
            )}
            <View style={styles.onlineIndicator} />
          </View>

          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.petNameContainer}>
                <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
                <View style={styles.typeBadge}>
                  <FontAwesome5 
                    name={getPetIcon()} 
                    size={10} 
                    color="#4E8D7C" 
                    style={styles.badgeIcon}
                  />
                  <Text style={styles.typeText}>{pet.species}</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                style={styles.editButton}
              >
                <MaterialIcons name="edit" size={18} color="#4E8D7C" />
              </TouchableOpacity>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons name="gender-male-female" size={14} color="#4E8D7C" />
                </View>
                <Text style={styles.detailText}>{pet.gender}</Text>
              </View>
              {pet.breed && (
                <View style={styles.detailItem}>
                  <View style={styles.iconWrapper}>
                    <FontAwesome5 name="dna" size={12} color="#4E8D7C" />
                  </View>
                  <Text style={styles.detailText} numberOfLines={1}>{pet.breed}</Text>
                </View>
              )}
            </View>

            {pet.dob && (
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <View style={styles.iconWrapper}>
                    <MaterialIcons name="cake" size={14} color="#4E8D7C" />
                  </View>
                  <Text style={styles.detailText}>
                    {new Date(pet.dob).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.statsContainer}>
              {pet.weight && <StatItem value={`${pet.weight}`} unit="kg" label="Weight" />}
              {pet.height && <StatItem value={`${pet.height}`} unit="cm" label="Height" />}
              {pet.age && <StatItem value={pet.age} unit="" label="Age" />}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const StatItem = ({ value, unit, label }) => (
  <View style={styles.statItem}>
    <View style={styles.statValueContainer}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const PetListScreen = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const pets = useSelector(state => state.auth?.userPets?.data || []);

  useEffect(() => {
    fetchPets();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
    return () => dispatch(clearUserPets());
  }, [dispatch]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const result = await dispatch(getPetsByUserId()).unwrap();
      if (result.error) throw new Error(result.payload || 'Failed to load pets');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await dispatch(getPetsByUserId());
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePetPress = (pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const handleEditPress = (pet) => {
    router.push({
      pathname: 'pages/EditPetScreen',
      params: { petId: pet._id }
    });
  };

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.push('/(vetician_tabs)/(tabs)')} 
        style={styles.menuButton}
      >
        <View style={styles.backButtonCircle}>
          <ChevronLeft size={22} color="#2C3E50" />
        </View>
      </TouchableOpacity>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>My Pets</Text>
        <Text style={styles.headerSubtitle}>Your registered companions</Text>
      </View>
    </View>
  );

  const LoadingView = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4E8D7C" />
      <Text style={styles.loadingText}>Loading your pets...</Text>
    </View>
  );

  const ErrorView = ({ error, onRetry }) => (
    <View style={styles.errorContainer}>
      <View style={styles.errorIconCircle}>
        <MaterialIcons name="error-outline" size={40} color="#E74C3C" />
      </View>
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const EmptyState = ({ onAddPet }) => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={['#F0F7F4', '#E8F5E9']}
        style={styles.emptyIconCircle}
      >
        <FontAwesome5 name="paw" size={50} color="#4E8D7C" />
      </LinearGradient>
      <Text style={styles.emptyTitle}>No Pets Found</Text>
      <Text style={styles.emptyText}>Start building your pet family by{'\n'}registering your first companion</Text>
      <TouchableOpacity style={styles.addPetButton} onPress={onAddPet}>
        <MaterialIcons name="add" size={20} color="white" style={styles.addIcon} />
        <Text style={styles.addPetButtonText}>Register a Pet</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) return <LoadingView />;
  if (error) return <ErrorView error={error} onRetry={() => {
    setError(null);
    dispatch(getPetsByUserId());
  }} />;

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <Header />

        <View style={styles.resultsContainer}>
          <View style={styles.resultsInfo}>
            <View style={styles.countBadge}>
              <Text style={styles.countNumber}>{pets.length}</Text>
            </View>
            <Text style={styles.resultsText}>
              {pets.length === 1 ? 'Pet' : 'Pets'} Registered
            </Text>
          </View>
          <TouchableOpacity 
            onPress={handleRefresh}
            style={styles.refreshButton}
          >
            <MaterialIcons name="refresh" size={22} color="#4E8D7C" />
          </TouchableOpacity>
        </View>

        {pets.length === 0 ? (
          <EmptyState onAddPet={() => router.navigate('/pages/PetDetail')} />
        ) : (
          <>
            <FlatList
              data={pets}
              renderItem={({ item, index }) => (
                <PetCard 
                  pet={item} 
                  index={index}
                  onPress={() => handlePetPress(item)} 
                  onEdit={() => handleEditPress(item)}
                />
              )}
              keyExtractor={(item) => item._id || String(Math.random())}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
            <TouchableOpacity
              style={styles.addButtonFloating}
              onPress={() => router.navigate('/pages/PetDetail')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#5FA893', '#4E8D7C']}
                style={styles.fabGradient}
              >
                <MaterialIcons name="add" size={28} color="white" />
              </LinearGradient>
            </TouchableOpacity>
            
            <PetDetailsModal
              pet={selectedPet}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
            />
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingTop: 50
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuButton: {
    marginRight: 12,
    justifyContent: 'center'
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  headerTextContainer: {
    flex: 1
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 2
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#95A5A6',
    fontWeight: '500'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA'
  },
  loadingText: {
    marginTop: 16,
    color: '#4E8D7C',
    fontSize: 16,
    fontWeight: '500'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA'
  },
  errorIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FADBD8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8
  },
  errorText: {
    fontSize: 15,
    color: '#7D7D7D',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22
  },
  retryButton: {
    backgroundColor: '#4E8D7C',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#4E8D7C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4
  },
  resultsInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  countBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4E8D7C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  countNumber: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  resultsText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600'
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 15,
    color: '#95A5A6',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: '#4E8D7C',
    borderRadius: 12,
    shadowColor: '#4E8D7C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  addIcon: {
    marginRight: 6
  },
  addPetButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  listContainer: {
    paddingBottom: 100
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5
  },
  cardGradient: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20
  },
  cardImageContainer: {
    position: 'relative'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 3,
    borderColor: 'white'
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 3,
    borderColor: 'white'
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 18,
    right: 20,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2ECC71',
    borderWidth: 3,
    borderColor: 'white'
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  petNameContainer: {
    flex: 1,
    marginRight: 8
  },
  petName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 6
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    borderColor: '#4E8D7C',
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  badgeIcon: {
    marginRight: 4
  },
  typeText: {
    fontSize: 11,
    color: '#4E8D7C',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F7F4',
    justifyContent: 'center',
    alignItems: 'center'
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 6,
    flexWrap: 'wrap'
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6
  },
  detailText: {
    fontSize: 13,
    color: '#5D6D7E',
    fontWeight: '500',
    maxWidth: 100
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1'
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4E8D7C'
  },
  statUnit: {
    fontSize: 11,
    color: '#95A5A6',
    fontWeight: '600',
    marginLeft: 2
  },
  statLabel: {
    fontSize: 11,
    color: '#95A5A6',
    marginTop: 2,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  addButtonFloating: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#4E8D7C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PetListScreen;