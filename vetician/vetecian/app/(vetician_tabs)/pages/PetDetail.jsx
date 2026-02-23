import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Camera, X } from 'lucide-react-native';
import { registerPet, getPetsByUserId } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function PetDetail() {
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    location: '',
    dob: new Date(),
    petPhoto: null,

    // Physical Characteristics
    bloodGroup: '',
    height: '',
    weight: '',
    color: '',
    distinctiveFeatures: '',

    // Health Information
    allergies: '',
    currentMedications: '',
    chronicDiseases: '',
    injuries: '',
    surgeries: '',
    vaccinations: '',

    // Additional Information
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated, user } = useSelector(state => state.auth);
  const router = useRouter();

  const speciesOptions = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'];
  const genderOptions = ['Male', 'Female', 'Neutered', 'Spayed', 'Unknown'];
  const bloodGroupOptions = ['A', 'B', 'AB', 'O', 'Unknown'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.dob;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData({
      ...formData,
      dob: currentDate,
    });
  };

  const handlePetPhotoUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'We need access to your photos to upload a pet picture');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFormData(prev => ({ ...prev, petPhoto: result.assets[0] }));
        setErrors(prev => ({ ...prev, petPhoto: null }));
      }
    } catch (error) {
      console.error('Pet photo upload error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const removePetPhoto = () => {
    setFormData(prev => ({ ...prev, petPhoto: null }));
  };

  const uploadToCloudinary = async (file) => {
    try {
      const isDataUri = file.uri.startsWith('data:');
      
      const formData = new FormData();
      
      if (isDataUri) {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        formData.append('file', blob, file.name || `pet_upload_${Date.now()}.jpg`);
      } else {
        const fileExtension = file.uri.split('.').pop().toLowerCase();
        formData.append('file', {
          uri: file.uri,
          name: file.name || `pet_upload_${Date.now()}.${fileExtension}`,
          type: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`
        });
      }
      
      formData.append('upload_preset', 'vetician');
      formData.append('cloud_name', 'dqwzfs4ox');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dqwzfs4ox/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Pet name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (!formData.species) {
        newErrors.species = 'Species is required';
      }

      if (!formData.gender) {
        newErrors.gender = 'Gender is required';
      }

      if (!formData.petPhoto) {
        newErrors.petPhoto = 'Pet photo is required';
      }
    }

    if (currentStep === 2) {
      if (formData.height && isNaN(formData.height)) {
        newErrors.height = 'Height must be a number';
      }

      if (formData.weight && isNaN(formData.weight)) {
        newErrors.weight = 'Weight must be a number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    const storedUserId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      Alert.alert('Authentication Error', 'Please log in again to continue.');
      return;
    }

    setIsUploading(true);
    try {
      let petPhotoUrl = '';
      if (formData.petPhoto) {
        const uploadResult = await uploadToCloudinary(formData.petPhoto);
        petPhotoUrl = uploadResult.secure_url;
      }

      const submissionData = {
        ...formData,
        dob: formData.dob.toISOString().split('T')[0],
        petPhoto: petPhotoUrl,
        userId: storedUserId
      };
      
      const result = await dispatch(registerPet(submissionData)).unwrap();

      if (result.success) {
        await dispatch(getPetsByUserId()).unwrap();
        router.replace('pages/PetList');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to register pet');
    } finally {
      setIsUploading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            {/* Pet Photo Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pet Photo*</Text>
              <TouchableOpacity
                style={[
                  styles.photoUpload,
                  errors.petPhoto && styles.uploadError
                ]}
                onPress={handlePetPhotoUpload}
              >
                {formData.petPhoto ? (
                  <>
                    <Image
                      source={{ uri: formData.petPhoto.uri }}
                      style={styles.uploadedImage}
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={removePetPhoto}
                    >
                      <X size={16} color="#fff" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Camera size={24} color="#4E8D7C" />
                    <Text style={styles.photoUploadText}>Upload Photo</Text>
                  </>
                )}
              </TouchableOpacity>
              {errors.petPhoto && <Text style={styles.errorText}>{errors.petPhoto}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Pet name*"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Species*</Text>
              <View style={styles.optionsContainer}>
                {speciesOptions.map((species) => (
                  <TouchableOpacity
                    key={species}
                    style={[
                      styles.optionButton,
                      formData.species === species && styles.selectedOption
                    ]}
                    onPress={() => handleInputChange('species', species)}
                  >
                    <Text style={styles.optionText}>{species}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Breed"
                value={formData.breed}
                onChangeText={(value) => handleInputChange('breed', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender*</Text>
              <View style={styles.optionsContainer}>
                {genderOptions.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.optionButton,
                      formData.gender === gender && styles.selectedOption
                    ]}
                    onPress={() => handleInputChange('gender', gender)}
                  >
                    <Text style={styles.optionText}>{gender}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date of Birth</Text>
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{formData.dob.toLocaleDateString()}</Text>
                <Calendar size={20} color="#4E8D7C" />
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.dob}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Characteristics</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Blood Group</Text>
              <View style={styles.optionsContainer}>
                {bloodGroupOptions.map((group) => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.optionButton,
                      formData.bloodGroup === group && styles.selectedOption
                    ]}
                    onPress={() => handleInputChange('bloodGroup', group)}
                  >
                    <Text style={styles.optionText}>{group}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.height && styles.inputError]}
                placeholder="Height (cm)"
                value={formData.height}
                onChangeText={(value) => handleInputChange('height', value)}
                keyboardType="numeric"
              />
              {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.weight && styles.inputError]}
                placeholder="Weight (kg)"
                value={formData.weight}
                onChangeText={(value) => handleInputChange('weight', value)}
                keyboardType="numeric"
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Color"
                value={formData.color}
                onChangeText={(value) => handleInputChange('color', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Distinctive features"
                value={formData.distinctiveFeatures}
                onChangeText={(value) => handleInputChange('distinctiveFeatures', value)}
                multiline
              />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Information</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Allergies (comma separated)"
                value={formData.allergies}
                onChangeText={(value) => handleInputChange('allergies', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Current medications"
                value={formData.currentMedications}
                onChangeText={(value) => handleInputChange('currentMedications', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Chronic diseases"
                value={formData.chronicDiseases}
                onChangeText={(value) => handleInputChange('chronicDiseases', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Injuries"
                value={formData.injuries}
                onChangeText={(value) => handleInputChange('injuries', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Surgeries"
                value={formData.surgeries}
                onChangeText={(value) => handleInputChange('surgeries', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Vaccinations"
                value={formData.vaccinations}
                onChangeText={(value) => handleInputChange('vaccinations', value)}
                multiline
              />
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Notes"
                value={formData.notes}
                onChangeText={(value) => handleInputChange('notes', value)}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
              <ChevronLeft size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Pet Information</Text>
              <Text style={styles.subtitle}>Step {step} of 4</Text>
            </View>
          </View>

          <View style={styles.form}>
            {renderStep()}

            <View style={styles.buttonContainer}>
              {step > 1 && (
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton]}
                  onPress={prevStep}
                >
                  <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
              )}

              {step < 4 ? (
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={nextStep}
                >
                  <Text style={styles.navButtonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.navButton, styles.submitButton]}
                  onPress={handleSubmit}
                  disabled={isLoading || isUploading}
                >
                  <Text style={styles.navButtonText}>
                    {isLoading || isUploading ? 'Saving...' : 'Submit'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 50,
  },
  menuButton: {
    marginRight: 20,
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 20,
    paddingLeft: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  navButton: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  prevButton: {
    backgroundColor: '#007AFF',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  submitButton: {
    backgroundColor: '#34C759',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  prevButtonText: {
    color: '#333',
  },
  photoUpload: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  uploadError: {
    borderColor: '#EF4444',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoUploadText: {
    color: '#4E8D7C',
    marginTop: 8,
    fontSize: 14,
  },
});

// import { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Pressable, Image } from 'react-native';
// import { useRouter } from 'expo-router';
// import { ChevronLeft, Calendar, X } from 'lucide-react-native';
// import { registerPet } from '../../../store/slices/authSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as ImagePicker from 'expo-image-picker';

// export default function PetDetail() {
//   const [step, setStep] = useState(1);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [formData, setFormData] = useState({
//     // Basic Information
//     name: '',
//     species: 'Dog',
//     breed: '',
//     gender: 'Male',
//     location: '',
//     dob: new Date(),
//     petPhoto: null,

//     // Physical Characteristics
//     bloodGroup: '',
//     height: '',
//     weight: '',
//     color: '',
//     distinctiveFeatures: '',

//     // Medical Information
//     allergies: '',
//     currentMedications: '',
//     chronicDiseases: '',
//     injuries: '',
//     surgeries: '',
//     vaccinations: '',
//     lastVaccination: new Date(),
//     lastDeworming: new Date(),
//     neutered: 'No',
//     kciCertified: 'No',
//     temperament: '',
//     bookingReasons: '',

//     // Documents
//     kciCertifiedDoc: null,
//     dewormingCard: null,
//     vaccinationCard: null,

//     // Additional Information
//     notes: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [showVaccinationPicker, setShowVaccinationPicker] = useState(false);
//   const [showDewormingPicker, setShowDewormingPicker] = useState(false);
  
//   const dispatch = useDispatch();
//   const { isLoading, error, isAuthenticated, user } = useSelector(state => state.auth);
//   const router = useRouter();

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: null }));
//     }
//   };

//   const handleDateChange = (event, selectedDate, field = 'dob') => {
//     if (field === 'dob') {
//       const currentDate = selectedDate || formData.dob;
//       setShowDatePicker(Platform.OS === 'ios');
//       setFormData(prev => ({ ...prev, dob: currentDate }));
//     } else if (field === 'lastVaccination') {
//       const currentDate = selectedDate || formData.lastVaccination;
//       setShowVaccinationPicker(Platform.OS === 'ios');
//       setFormData(prev => ({ ...prev, lastVaccination: currentDate }));
//     } else if (field === 'lastDeworming') {
//       const currentDate = selectedDate || formData.lastDeworming;
//       setShowDewormingPicker(Platform.OS === 'ios');
//       setFormData(prev => ({ ...prev, lastDeworming: currentDate }));
//     }
//   };

//   const handlePetPhotoUpload = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (!permissionResult.granted) {
//         Alert.alert('Permission required', 'We need access to your photos to upload a pet picture');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets?.length > 0) {
//         setFormData(prev => ({ ...prev, petPhoto: result.assets[0] }));
//         setErrors(prev => ({ ...prev, petPhoto: null }));
//       }
//     } catch (error) {
//       console.error('Pet photo upload error:', error);
//       Alert.alert('Error', 'Failed to select image');
//     }
//   };

//   const handleDocumentUpload = async (docType) => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (!permissionResult.granted) {
//         Alert.alert('Permission required', 'We need access to your photos to upload documents');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets?.length > 0) {
//         setFormData(prev => ({ ...prev, [docType]: result.assets[0] }));
//       }
//     } catch (error) {
//       console.error('Document upload error:', error);
//       Alert.alert('Error', 'Failed to select document');
//     }
//   };

//   const removePetPhoto = () => {
//     setFormData(prev => ({ ...prev, petPhoto: null }));
//   };

//   const removeDocument = (docType) => {
//     setFormData(prev => ({ ...prev, [docType]: null }));
//   };

//   const uploadToCloudinary = async (file) => {
//     console.log('[Cloudinary] Starting upload:', {
//       name: file.name || 'unnamed',
//       uri: file.uri
//     });

//     try {
//       const isDataUri = file.uri.startsWith('data:');
      
//       const formData = new FormData();
      
//       if (isDataUri) {
//         const response = await fetch(file.uri);
//         const blob = await response.blob();
//         formData.append('file', blob, file.name || `upload_${Date.now()}.jpg`);
//       } else {
//         const fileExtension = file.uri.split('.').pop().toLowerCase();
//         formData.append('file', {
//           uri: file.uri,
//           name: file.name || `upload_${Date.now()}.${fileExtension}`,
//           type: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`
//         });
//       }
      
//       formData.append('upload_preset', 'vetician');
//       formData.append('cloud_name', 'dqwzfs4ox');

//       const response = await fetch(
//         'https://api.cloudinary.com/v1_1/dqwzfs4ox/image/upload',
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('[Cloudinary] Upload success!', {
//         public_id: data.public_id
//       });
//       return data;
//     } catch (error) {
//       console.error('[Cloudinary] UPLOAD FAILED:', {
//         error: error.message,
//         uri: file.uri
//       });
//       throw error;
//     }
//   };

//   const validateStep = (currentStep) => {
//     const newErrors = {};

//     if (currentStep === 1) {
//       if (!formData.name.trim()) {
//         newErrors.name = 'Pet name is required';
//       } else if (formData.name.trim().length < 2) {
//         newErrors.name = 'Name must be at least 2 characters';
//       }

//       if (!formData.species) {
//         newErrors.species = 'Species is required';
//       }

//       if (!formData.gender) {
//         newErrors.gender = 'Gender is required';
//       }

//       if (!formData.petPhoto) {
//         newErrors.petPhoto = 'Pet photo is required';
//       }
//     }

//     if (currentStep === 2) {
//       // Medical info validation can be added here if needed
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (validateStep(step)) {
//       setStep(step + 1);
//     }
//   };

//   const prevStep = () => {
//     setStep(step - 1);
//   };

//   const handleSubmit = async () => {
//     if (!validateStep(step)) return;

//     const storedUserId = await AsyncStorage.getItem('userId');
//     const token = await AsyncStorage.getItem('token');
//     console.log('🔍 PetDetail - Auth check:', {
//       userId: storedUserId || 'Not found',
//       token: token ? 'Found' : 'Not found',
//       isAuthenticated,
//       hasUser: !!user
//     });
    
//     if (!token) {
//       Alert.alert('Authentication Error', 'Please log in again to continue.');
//       return;
//     }

//     setIsUploading(true);
//     try {
//       // Upload all images
//       let petPhotoUrl = '';
//       let kciCertifiedDocUrl = '';
//       let dewormingCardUrl = '';
//       let vaccinationCardUrl = '';

//       if (formData.petPhoto) {
//         const uploadResult = await uploadToCloudinary(formData.petPhoto);
//         petPhotoUrl = uploadResult.secure_url;
//       }

//       if (formData.kciCertifiedDoc) {
//         const uploadResult = await uploadToCloudinary(formData.kciCertifiedDoc);
//         kciCertifiedDocUrl = uploadResult.secure_url;
//       }

//       if (formData.dewormingCard) {
//         const uploadResult = await uploadToCloudinary(formData.dewormingCard);
//         dewormingCardUrl = uploadResult.secure_url;
//       }

//       if (formData.vaccinationCard) {
//         const uploadResult = await uploadToCloudinary(formData.vaccinationCard);
//         vaccinationCardUrl = uploadResult.secure_url;
//       }

//       const submissionData = {
//         ...formData,
//         dob: formData.dob.toISOString().split('T')[0],
//         lastVaccination: formData.lastVaccination.toISOString().split('T')[0],
//         lastDeworming: formData.lastDeworming.toISOString().split('T')[0],
//         petPhoto: petPhotoUrl,
//         kciCertifiedDoc: kciCertifiedDocUrl,
//         dewormingCard: dewormingCardUrl,
//         vaccinationCard: vaccinationCardUrl,
//         userId: storedUserId
//       };

//       console.log("submissionData =>", submissionData);
      
//       const result = await dispatch(registerPet(submissionData)).unwrap();
//       console.log(result);

//       if (result.success) {
//         Alert.alert(
//           'Success',
//           'Pet information has been saved successfully!',
//           [{ text: 'OK', onPress: () => router.replace('/(vetician_tabs)/(tabs)') }]
//         );
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       Alert.alert(
//         'Error',
//         error.message || 'An error occurred while saving pet information'
//       );
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const renderProgressBar = () => {
//     const steps = [
//       { label: 'BASIC INFO', step: 1 },
//       { label: 'MEDICAL INFO', step: 2 },
//       { label: 'DOCUMENTS', step: 3 }
//     ];

//     return (
//       <View style={styles.progressContainer}>
//         {steps.map((s, index) => (
//           <View key={s.step} style={styles.progressStepContainer}>
//             <View style={styles.progressLineContainer}>
//               {index > 0 && (
//                 <View style={[
//                   styles.progressLine,
//                   step > s.step - 1 && styles.progressLineActive
//                 ]} />
//               )}
//               <View style={[
//                 styles.progressCircle,
//                 step >= s.step && styles.progressCircleActive
//               ]} />
//               {index < steps.length - 1 && (
//                 <View style={[
//                   styles.progressLine,
//                   step > s.step && styles.progressLineActive
//                 ]} />
//               )}
//             </View>
//             <Text style={[
//               styles.progressLabel,
//               step >= s.step && styles.progressLabelActive
//             ]}>{s.label}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <View style={styles.section}>
//             {/* Pet Type */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Pet Type*</Text>
//               <View style={styles.petTypeContainer}>
//                 <TouchableOpacity
//                   style={[
//                     styles.petTypeButton,
//                     formData.species === 'Dog' && styles.petTypeButtonActive
//                   ]}
//                   onPress={() => handleInputChange('species', 'Dog')}
//                 >
//                   <Text style={[
//                     styles.petTypeIcon,
//                     formData.species === 'Dog' && styles.petTypeIconActive
//                   ]}>🐕</Text>
//                   <Text style={[
//                     styles.petTypeText,
//                     formData.species === 'Dog' && styles.petTypeTextActive
//                   ]}>Dog</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.petTypeButton,
//                     formData.species === 'Cat' && styles.petTypeButtonActive
//                   ]}
//                   onPress={() => handleInputChange('species', 'Cat')}
//                 >
//                   <Text style={[
//                     styles.petTypeIcon,
//                     formData.species === 'Cat' && styles.petTypeIconActive
//                   ]}>🐈</Text>
//                   <Text style={[
//                     styles.petTypeText,
//                     formData.species === 'Cat' && styles.petTypeTextActive
//                   ]}>Cat</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Name, DOB, Pet Source in row */}
//             <View style={styles.rowContainer}>
//               <View style={[styles.inputContainer, styles.flexInput]}>
//                 <Text style={styles.label}>Name*</Text>
//                 <TextInput
//                   style={[styles.input, errors.name && styles.inputError]}
//                   placeholder="Tommy"
//                   value={formData.name}
//                   onChangeText={(value) => handleInputChange('name', value)}
//                   autoCapitalize="words"
//                 />
//                 {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
//               </View>

//               <View style={[styles.inputContainer, styles.flexInput]}>
//                 <Text style={styles.label}>Date of Birth*</Text>
//                 <Pressable
//                   style={styles.dateInputField}
//                   onPress={() => setShowDatePicker(true)}
//                 >
//                   <Text style={styles.dateText}>
//                     {formData.dob.toLocaleDateString('en-GB')}
//                   </Text>
//                   <Calendar size={18} color="#FF6B35" />
//                 </Pressable>
//                 {showDatePicker && (
//                   <DateTimePicker
//                     value={formData.dob}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={(e, date) => handleDateChange(e, date, 'dob')}
//                     maximumDate={new Date()}
//                   />
//                 )}
//               </View>

//               <View style={[styles.inputContainer, styles.flexInput]}>
//                 <Text style={styles.label}>Pet Source</Text>
//                 <View style={styles.dropdownContainer}>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Tap to Select"
//                     value={formData.location}
//                     onChangeText={(value) => handleInputChange('location', value)}
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* Color, Breed, Gender in row */}
//             <View style={styles.rowContainer}>
//               <View style={[styles.inputContainer, styles.flexInput]}>
//                 <Text style={styles.label}>Colour</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter here"
//                   value={formData.color}
//                   onChangeText={(value) => handleInputChange('color', value)}
//                 />
//               </View>

//               <View style={[styles.inputContainer, styles.flexInput]}>
//                 <Text style={styles.label}>Breed*</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Breed"
//                   value={formData.breed}
//                   onChangeText={(value) => handleInputChange('breed', value)}
//                 />
//               </View>

//               <View style={[styles.inputContainer, styles.flexInput]}>
//                 <Text style={styles.label}>Gender*</Text>
//                 <View style={styles.genderContainer}>
//                   <TouchableOpacity
//                     style={styles.radioButton}
//                     onPress={() => handleInputChange('gender', 'Male')}
//                   >
//                     <View style={[
//                       styles.radioCircle,
//                       formData.gender === 'Male' && styles.radioCircleSelected
//                     ]} />
//                     <Text style={styles.radioText}>Male</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.radioButton}
//                     onPress={() => handleInputChange('gender', 'Female')}
//                   >
//                     <View style={[
//                       styles.radioCircle,
//                       formData.gender === 'Female' && styles.radioCircleSelected
//                     ]} />
//                     <Text style={styles.radioText}>Female</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>

//             {/* Bio/Description */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Bio/Description</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="Type here"
//                 value={formData.distinctiveFeatures}
//                 onChangeText={(value) => handleInputChange('distinctiveFeatures', value)}
//                 multiline
//                 numberOfLines={3}
//                 textAlignVertical="top"
//               />
//             </View>

//             {/* Pet Images */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>🐾 Pet Images</Text>
//               <TouchableOpacity
//                 style={styles.imageUploadButton}
//                 onPress={handlePetPhotoUpload}
//               >
//                 {formData.petPhoto ? (
//                   <View style={styles.uploadedImageContainer}>
//                     <Image
//                       source={{ uri: formData.petPhoto.uri }}
//                       style={styles.uploadedImage}
//                     />
//                     <TouchableOpacity
//                       style={styles.removeImageButton}
//                       onPress={removePetPhoto}
//                     >
//                       <X size={16} color="#fff" />
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <View style={styles.uploadPlaceholder}>
//                     <View style={styles.uploadIcon}>
//                       <Text style={styles.uploadIconText}>🖼️</Text>
//                       <Text style={styles.uploadIconPlus}>+</Text>
//                     </View>
//                   </View>
//                 )}
//               </TouchableOpacity>
//               {errors.petPhoto && <Text style={styles.errorText}>{errors.petPhoto}</Text>}
//             </View>
//           </View>
//         );

//       case 2:
//         return (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>📋 Medical Info</Text>

//             {/* Last Vaccination and Deworming */}
//             <View style={styles.rowContainer}>
//               <View style={[styles.inputContainer, styles.flexInput]}>
//                 <Text style={styles.label}>Last Vaccination on</Text>
//                 <Pressable
//                   style={styles.dateInputField}
//                   onPress={() => setShowVaccinationPicker(true)}
//                 >
//                   <Text style={styles.dateText}>
//                     {formData.lastVaccination.toLocaleDateString('en-GB')}
//                   </Text>
//                   <Calendar size={18} color="#FF6B35" />
//                 </Pressable>
//                 {showVaccinationPicker && (
//                   <DateTimePicker
//                     value={formData.lastVaccination}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={(e, date) => handleDateChange(e, date, 'lastVaccination')}
//                     maximumDate={new Date()}
//                   />
//                 )}
//               </View>

//               <View style={[styles.inputContainer, styles.flexInput]}>
//                 <Text style={styles.label}>Last Deworming on</Text>
//                 <Pressable
//                   style={styles.dateInputField}
//                   onPress={() => setShowDewormingPicker(true)}
//                 >
//                   <Text style={styles.dateText}>
//                     {formData.lastDeworming.toLocaleDateString('en-GB')}
//                   </Text>
//                   <Calendar size={18} color="#FF6B35" />
//                 </Pressable>
//                 {showDewormingPicker && (
//                   <DateTimePicker
//                     value={formData.lastDeworming}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={(e, date) => handleDateChange(e, date, 'lastDeworming')}
//                     maximumDate={new Date()}
//                   />
//                 )}
//               </View>
//             </View>

//             {/* Neutered and KCI Certified */}
//             <View style={styles.rowContainer}>
//               <View style={[styles.inputContainer, styles.flexInput]}>
//                 <Text style={styles.label}>Neutered*</Text>
//                 <View style={styles.genderContainer}>
//                   <TouchableOpacity
//                     style={styles.radioButton}
//                     onPress={() => handleInputChange('neutered', 'Yes')}
//                   >
//                     <View style={[
//                       styles.radioCircle,
//                       formData.neutered === 'Yes' && styles.radioCircleSelected
//                     ]} />
//                     <Text style={styles.radioText}>Yes</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.radioButton}
//                     onPress={() => handleInputChange('neutered', 'No')}
//                   >
//                     <View style={[
//                       styles.radioCircle,
//                       formData.neutered === 'No' && styles.radioCircleSelected
//                     ]} />
//                     <Text style={styles.radioText}>No</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               <View style={[styles.inputContainer, styles.flexInput]}>
//                 <Text style={styles.label}>KCI Certified*</Text>
//                 <View style={styles.genderContainer}>
//                   <TouchableOpacity
//                     style={styles.radioButton}
//                     onPress={() => handleInputChange('kciCertified', 'Yes')}
//                   >
//                     <View style={[
//                       styles.radioCircle,
//                       formData.kciCertified === 'Yes' && styles.radioCircleSelected
//                     ]} />
//                     <Text style={styles.radioText}>Yes</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.radioButton}
//                     onPress={() => handleInputChange('kciCertified', 'No')}
//                   >
//                     <View style={[
//                       styles.radioCircle,
//                       formData.kciCertified === 'No' && styles.radioCircleSelected
//                     ]} />
//                     <Text style={styles.radioText}>No</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>

//             {/* Temperament */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Temperament</Text>
//               <View style={styles.dropdownContainer}>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Tap to Select"
//                   value={formData.temperament}
//                   onChangeText={(value) => handleInputChange('temperament', value)}
//                 />
//               </View>
//             </View>

//             {/* Booking Reasons */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Booking reasons</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Type to search and select reasons"
//                 value={formData.bookingReasons}
//                 onChangeText={(value) => handleInputChange('bookingReasons', value)}
//               />
//             </View>

//             {/* Health Information */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Allergies</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="List any allergies"
//                 value={formData.allergies}
//                 onChangeText={(value) => handleInputChange('allergies', value)}
//                 multiline
//                 numberOfLines={2}
//                 textAlignVertical="top"
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Current Medications</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="List current medications"
//                 value={formData.currentMedications}
//                 onChangeText={(value) => handleInputChange('currentMedications', value)}
//                 multiline
//                 numberOfLines={2}
//                 textAlignVertical="top"
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Chronic Diseases</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="List chronic diseases"
//                 value={formData.chronicDiseases}
//                 onChangeText={(value) => handleInputChange('chronicDiseases', value)}
//                 multiline
//                 numberOfLines={2}
//                 textAlignVertical="top"
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Vaccinations</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="List vaccinations"
//                 value={formData.vaccinations}
//                 onChangeText={(value) => handleInputChange('vaccinations', value)}
//                 multiline
//                 numberOfLines={2}
//                 textAlignVertical="top"
//               />
//             </View>
//           </View>
//         );

//       case 3:
//         return (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>📄 Documents</Text>

//             {/* KCI Certified */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>KCI Certified</Text>
//               <TouchableOpacity
//                 style={styles.documentUploadButton}
//                 onPress={() => handleDocumentUpload('kciCertifiedDoc')}
//               >
//                 <Text style={styles.documentUploadPlaceholder}>
//                   {formData.kciCertifiedDoc ? formData.kciCertifiedDoc.name || 'Document selected' : 'Tap to choose image'}
//                 </Text>
//                 <Text style={styles.documentUploadAction}>Choose</Text>
//               </TouchableOpacity>
//               {formData.kciCertifiedDoc && (
//                 <View style={styles.documentPreview}>
//                   <Image
//                     source={{ uri: formData.kciCertifiedDoc.uri }}
//                     style={styles.documentImage}
//                   />
//                   <TouchableOpacity
//                     style={styles.removeDocButton}
//                     onPress={() => removeDocument('kciCertifiedDoc')}
//                   >
//                     <X size={14} color="#fff" />
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>

//             {/* Deworming Card */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Deworming Card</Text>
//               <TouchableOpacity
//                 style={styles.documentUploadButton}
//                 onPress={() => handleDocumentUpload('dewormingCard')}
//               >
//                 <Text style={styles.documentUploadPlaceholder}>
//                   {formData.dewormingCard ? formData.dewormingCard.name || 'Document selected' : 'Tap to choose image'}
//                 </Text>
//                 <Text style={styles.documentUploadAction}>Choose</Text>
//               </TouchableOpacity>
//               {formData.dewormingCard && (
//                 <View style={styles.documentPreview}>
//                   <Image
//                     source={{ uri: formData.dewormingCard.uri }}
//                     style={styles.documentImage}
//                   />
//                   <TouchableOpacity
//                     style={styles.removeDocButton}
//                     onPress={() => removeDocument('dewormingCard')}
//                   >
//                     <X size={14} color="#fff" />
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>

//             {/* Vaccination Card */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Vaccination Card</Text>
//               <TouchableOpacity
//                 style={styles.documentUploadButton}
//                 onPress={() => handleDocumentUpload('vaccinationCard')}
//               >
//                 <Text style={styles.documentUploadPlaceholder}>
//                   {formData.vaccinationCard ? formData.vaccinationCard.name || 'Document selected' : 'Tap to choose image'}
//                 </Text>
//                 <Text style={styles.documentUploadAction}>Choose</Text>
//               </TouchableOpacity>
//               {formData.vaccinationCard && (
//                 <View style={styles.documentPreview}>
//                   <Image
//                     source={{ uri: formData.vaccinationCard.uri }}
//                     style={styles.documentImage}
//                   />
//                   <TouchableOpacity
//                     style={styles.removeDocButton}
//                     onPress={() => removeDocument('vaccinationCard')}
//                   >
//                     <X size={14} color="#fff" />
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           </View>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         <View style={styles.content}>
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//               <ChevronLeft size={24} color="#1a1a1a" />
//             </TouchableOpacity>
//             <Text style={styles.title}>Add new pet</Text>
//           </View>

//           {/* Progress Bar */}
//           {renderProgressBar()}

//           {/* Form */}
//           <View style={styles.form}>
//             {renderStep()}

//             {/* Navigation Buttons */}
//             <View style={styles.buttonContainer}>
//               {step > 1 && (
//                 <TouchableOpacity
//                   style={styles.backButtonNav}
//                   onPress={prevStep}
//                 >
//                   <Text style={styles.backButtonText}>Back</Text>
//                 </TouchableOpacity>
//               )}

//               {step < 3 ? (
//                 <TouchableOpacity
//                   style={styles.nextButton}
//                   onPress={nextStep}
//                 >
//                   <Text style={styles.nextButtonText}>Next</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity
//                   style={styles.submitButton}
//                   onPress={handleSubmit}
//                   disabled={isLoading || isUploading}
//                 >
//                   <Text style={styles.submitButtonText}>
//                     {isLoading || isUploading ? 'Saving...' : 'Save & Add Pet'}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 30,
//     paddingTop: 50,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   backButton: {
//     marginRight: 15,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#1a1a1a',
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 30,
//     paddingHorizontal: 10,
//   },
//   progressStepContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   progressLineContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: 8,
//   },
//   progressLine: {
//     flex: 1,
//     height: 2,
//     backgroundColor: '#E5E5E5',
//   },
//   progressLineActive: {
//     backgroundColor: '#FF6B35',
//   },
//   progressCircle: {
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: '#E5E5E5',
//     borderWidth: 2,
//     borderColor: '#E5E5E5',
//   },
//   progressCircleActive: {
//     backgroundColor: '#FF6B35',
//     borderColor: '#FF6B35',
//   },
//   progressLabel: {
//     fontSize: 11,
//     color: '#999999',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   progressLabelActive: {
//     color: '#FF6B35',
//     fontWeight: '600',
//   },
//   form: {
//     flex: 1,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#666666',
//     marginBottom: 20,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 8,
//     color: '#333333',
//     fontWeight: '500',
//   },
//   input: {
//     height: 48,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     backgroundColor: '#FFFFFF',
//     fontSize: 14,
//     color: '#333333',
//   },
//   textArea: {
//     height: 80,
//     paddingTop: 12,
//     textAlignVertical: 'top',
//   },
//   inputError: {
//     borderColor: '#EF4444',
//   },
//   errorText: {
//     color: '#EF4444',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   petTypeContainer: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   petTypeButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     backgroundColor: '#FFFFFF',
//   },
//   petTypeButtonActive: {
//     borderColor: '#FF6B35',
//     backgroundColor: '#FFF5F2',
//   },
//   petTypeIcon: {
//     fontSize: 20,
//     marginRight: 8,
//   },
//   petTypeIconActive: {
//     fontSize: 20,
//   },
//   petTypeText: {
//     fontSize: 14,
//     color: '#666666',
//     fontWeight: '500',
//   },
//   petTypeTextActive: {
//     color: '#FF6B35',
//     fontWeight: '600',
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//   },
//   flexInput: {
//     flex: 1,
//     marginBottom: 0,
//   },
//   dateInputField: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: 48,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     backgroundColor: '#FFFFFF',
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#333333',
//   },
//   dropdownContainer: {
//     position: 'relative',
//   },
//   genderContainer: {
//     flexDirection: 'row',
//     gap: 16,
//     marginTop: 8,
//   },
//   radioButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   radioCircle: {
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
//     marginRight: 8,
//     backgroundColor: '#FFFFFF',
//   },
//   radioCircleSelected: {
//     borderColor: '#FF6B35',
//     backgroundColor: '#FFFFFF',
//     borderWidth: 5,
//   },
//   radioText: {
//     fontSize: 14,
//     color: '#333333',
//   },
//   imageUploadButton: {
//     width: 100,
//     height: 100,
//     borderWidth: 2,
//     borderStyle: 'dashed',
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FAFAFA',
//   },
//   uploadedImageContainer: {
//     width: '100%',
//     height: '100%',
//     position: 'relative',
//   },
//   uploadedImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 8,
//   },
//   removeImageButton: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   uploadPlaceholder: {
//     alignItems: 'center',
//   },
//   uploadIcon: {
//     position: 'relative',
//     width: 40,
//     height: 40,
//   },
//   uploadIconText: {
//     fontSize: 32,
//   },
//   uploadIconPlus: {
//     position: 'absolute',
//     bottom: -2,
//     right: -2,
//     fontSize: 20,
//     color: '#FF6B35',
//     fontWeight: 'bold',
//   },
//   documentUploadButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: 48,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     backgroundColor: '#FFFFFF',
//   },
//   documentUploadPlaceholder: {
//     fontSize: 14,
//     color: '#999999',
//   },
//   documentUploadAction: {
//     fontSize: 14,
//     color: '#FF6B35',
//     fontWeight: '600',
//   },
//   documentPreview: {
//     marginTop: 12,
//     position: 'relative',
//     width: 120,
//     height: 120,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   documentImage: {
//     width: '100%',
//     height: '100%',
//   },
//   removeDocButton: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 30,
//     gap: 12,
//   },
//   backButtonNav: {
//     flex: 1,
//     height: 50,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: '#333333',
//     fontWeight: '600',
//   },
//   nextButton: {
//     flex: 1,
//     height: 50,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FF6B35',
//   },
//   nextButtonText: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   submitButton: {
//     flex: 1,
//     height: 50,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FF6B35',
//   },
//   submitButtonText: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
// });