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
  Image,
  SafeAreaView
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getPetsByUserId, clearUserPets } from '../../../store/slices/authSlice';
import { router } from 'expo-router';
import CommonHeader from '../../../components/CommonHeader';
import PetDetailsModal from '../../../components/petparent/home/PetDetailModal';
import { LinearGradient } from 'expo-linear-gradient';

const PET_TYPES = {
  Dog: 'dog',
  Cat: 'cat',
  default: 'paw'
};

const PetCard = ({ pet, onPress, onEdit }) => {
  if (!pet) return null;

  const getPetIcon = () => {
    return PET_TYPES[pet.species] || PET_TYPES.default;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardTop}>
        {pet?.petPhoto ? (
          <Image source={{ uri: pet.petPhoto }} style={styles.petImage} />
        ) : (
          <LinearGradient colors={['#4E8D7C', '#5FA893']} style={styles.petImage}>
            <FontAwesome5 name={getPetIcon()} size={40} color="white" />
          </LinearGradient>
        )}
        <TouchableOpacity 
          onPress={(e) => { e.stopPropagation(); onEdit(); }}
          style={styles.editBtn}
        >
          <MaterialIcons name="edit" size={18} color="#4E8D7C" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardBottom}>
        <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pet.species}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialIcons name="pets" size={14} color="#7D7D7D" />
            <Text style={styles.infoText}>{pet.breed || 'Mixed'}</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="cake" size={14} color="#7D7D7D" />
            <Text style={styles.infoText}>{pet.age || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};



const PetListScreen = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pets = useSelector(state => state.auth?.userPets?.data || []);

  useEffect(() => {
    fetchPets();
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



  const LoadingView = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#4E8D7C" />
      <Text style={styles.centerText}>Loading...</Text>
    </View>
  );

  const ErrorView = ({ error, onRetry }) => (
    <View style={styles.centerContainer}>
      <MaterialIcons name="error-outline" size={50} color="#E74C3C" />
      <Text style={styles.centerText}>{error}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const EmptyState = ({ onAddPet }) => (
    <View style={styles.centerContainer}>
      <FontAwesome5 name="paw" size={60} color="#E0E0E0" />
      <Text style={styles.emptyTitle}>No Pets Yet</Text>
      <Text style={styles.emptyText}>Add your first pet</Text>
      <TouchableOpacity style={styles.addBtn} onPress={onAddPet}>
        <Text style={styles.addBtnText}>Add Pet</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) return <LoadingView />;
  if (error) return <ErrorView error={error} onRetry={() => {
    setError(null);
    dispatch(getPetsByUserId());
  }} />;

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Pets" />
      
      {pets.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.count}>{pets.length} {pets.length === 1 ? 'Pet' : 'Pets'}</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <MaterialIcons name="refresh" size={24} color="#4E8D7C" />
          </TouchableOpacity>
        </View>
      )}

      {pets.length === 0 ? (
        <EmptyState onAddPet={() => router.navigate('/pages/PetDetail')} />
      ) : (
        <>
          <FlatList
            data={pets}
            numColumns={2}
            renderItem={({ item }) => (
              <PetCard 
                pet={item}
                onPress={() => handlePetPress(item)} 
                onEdit={() => handleEditPress(item)}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.navigate('/pages/PetDetail')}
          >
            <LinearGradient colors={['#5FA893', '#4E8D7C']} style={styles.fabGradient}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  count: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50'
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 100
  },
  row: {
    justifyContent: 'space-between'
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  cardTop: {
    position: 'relative'
  },
  petImage: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  cardBottom: {
    padding: 16
  },
  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    marginBottom: 12
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4E8D7C'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  infoText: {
    fontSize: 12,
    color: '#7D7D7D'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  centerText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7D7D7D',
    textAlign: 'center'
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#4E8D7C',
    borderRadius: 12
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 8
  },
  emptyText: {
    fontSize: 16,
    color: '#7D7D7D',
    marginBottom: 32
  },
  addBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#4E8D7C',
    borderRadius: 12,
    elevation: 4
  },
  addBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#4E8D7C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PetListScreen;