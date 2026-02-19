// import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Stethoscope, Clock, CalendarDays, Menu, Plus } from 'lucide-react-native';
// import { DrawerActions, useNavigation } from '@react-navigation/native';
// import { useDispatch } from 'react-redux';
// import { checkVeterinarianVerification } from '../../../store/slices/authSlice';

// export default function AddClinic() {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const openDrawer = () => {
//     navigation.dispatch(DrawerActions.openDrawer());
//   };

//   const handleClinic = async () => {
//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         Alert.alert('Error', 'User not authenticated');
//         return;
//       }

//       const resultAction = await dispatch(checkVeterinarianVerification()).unwrap();
//       const { isVerified, message } = resultAction;

//       if (isVerified) {
//         Alert.alert(
//           'Verified',
//           message || 'Your account is verified',
//           [
//             {
//               text: 'Cancel',
//               style: 'cancel',
//             },
//             {
//               text: 'Continue',
//               onPress: () => navigation.navigate('onboarding/addclinicform'),
//             }
//           ]
//         );
//       } else {
//         Alert.alert(
//           'Verification Required',
//           message || 'Your account is not yet verified. Please complete verification first.',
//           [
//             {
//               text: 'OK',
//               // onPress: () => navigation.navigate('VerificationStatus'),
//             }
//           ]
//         );
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to check verification status');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
//           <Menu size={28} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Add Your Clinic</Text>
//         <View style={styles.headerSpacer} />
//       </View>

//       {/* Main Content */}
//       <View style={styles.content}>
//         <View style={styles.card}>
//           <View style={styles.iconCircle}>
//             <Plus size={32} color="#fff" />
//           </View>
          
//           <Text style={styles.title}>Register Your Veterinary Clinic</Text>
//           <Text style={styles.subtitle}>
//             Join our network of professional veterinarians
//           </Text>
          
//           <View style={styles.divider} />
          
//           <Text style={styles.description}>
//             Add your clinic to start managing appointments, staff, and services with our comprehensive tools.
//           </Text>
          
//           <View style={styles.featuresContainer}>
//             <View style={styles.featureItem}>
//               <View style={[styles.featureIcon, { backgroundColor: '#E3F2FD' }]}>
//                 <Clock size={20} color="#1976D2" />
//               </View>
//               <Text style={styles.featureText}>Manage clinic hours and availability</Text>
//             </View>
            
//             <View style={styles.featureItem}>
//               <View style={[styles.featureIcon, { backgroundColor: '#E8F5E9' }]}>
//                 <CalendarDays size={20} color="#388E3C" />
//               </View>
//               <Text style={styles.featureText}>Set up services and pricing</Text>
//             </View>
            
//             <View style={styles.featureItem}>
//               <View style={[styles.featureIcon, { backgroundColor: '#F3E5F5' }]}>
//                 <Stethoscope size={20} color="#8E24AA" />
//               </View>
//               <Text style={styles.featureText}>Manage staff and permissions</Text>
//             </View>
//           </View>
//         </View>
        
//         <TouchableOpacity
//           style={styles.primaryButton}
//           onPress={handleClinic}
//           activeOpacity={0.9}
//         >
//           <Text style={styles.buttonText}>Add New Clinic</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 20,
//     paddingTop: 50,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   menuButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#333',
//   },
//   headerSpacer: {
//     width: 28,
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 24,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//     alignItems: 'center',
//   },
//   iconCircle: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: '#4285F4',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   divider: {
//     height: 1,
//     width: '100%',
//     backgroundColor: '#f0f0f0',
//     marginVertical: 16,
//   },
//   description: {
//     fontSize: 16,
//     color: '#555',
//     textAlign: 'center',
//     marginBottom: 24,
//     lineHeight: 24,
//   },
//   featuresContainer: {
//     width: '100%',
//     gap: 16,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     padding: 12,
//     borderRadius: 12,
//     backgroundColor: '#fafafa',
//   },
//   featureIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   featureText: {
//     fontSize: 15,
//     color: '#444',
//     flex: 1,
//     fontWeight: '500',
//   },
//   primaryButton: {
//     backgroundColor: '#4285F4',
//     padding: 18,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#4285F4',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });








import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stethoscope, Clock, CalendarDays, ArrowLeft, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { checkVeterinarianVerification } from '../../../store/slices/authSlice';

export default function AddClinic() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleClinic = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const resultAction = await dispatch(checkVeterinarianVerification()).unwrap();
      const { isVerified, message } = resultAction;

      if (isVerified) {
        Alert.alert(
          'Verified',
          message || 'Your account is verified',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Continue',
              onPress: () => navigation.navigate('onboarding/addclinicform'),
            }
          ]
        );
      } else {
        Alert.alert(
          'Verification Required',
          message || 'Your account is not yet verified. Please complete verification first.',
          [
            {
              text: 'OK',
              // onPress: () => navigation.navigate('VerificationStatus'),
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to check verification status');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Your Clinic</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Plus size={32} color="#fff" />
          </View>
          
          <Text style={styles.title}>Register Your Veterinary Clinic</Text>
          <Text style={styles.subtitle}>
            Join our network of professional veterinarians
          </Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.description}>
            Add your clinic to start managing appointments, staff, and services with our comprehensive tools.
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#E3F2FD' }]}>
                <Clock size={20} color="#1976D2" />
              </View>
              <Text style={styles.featureText}>Manage clinic hours and availability</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#E8F5E9' }]}>
                <CalendarDays size={20} color="#388E3C" />
              </View>
              <Text style={styles.featureText}>Set up services and pricing</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#F3E5F5' }]}>
                <Stethoscope size={20} color="#8E24AA" />
              </View>
              <Text style={styles.featureText}>Manage staff and permissions</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleClinic}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Add New Clinic</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fafafa',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#4285F4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});