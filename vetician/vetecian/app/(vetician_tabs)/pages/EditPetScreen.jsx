import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { updatePet, getPetsByUserId } from '../../../store/slices/authSlice';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Calendar, Camera } from 'lucide-react-native';

const PET_TYPES = {
  Dog: 'dog',
  Cat: 'cat',
  default: 'paw'
};

const speciesOptions = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'];
const genderOptions = ['Male', 'Female', 'Neutered', 'Spayed', 'Unknown'];
const bloodGroupOptions = ['A', 'B', 'AB', 'O', 'Unknown'];

const EditPetScreen = () => {
  const dispatch = useDispatch();
  const { petId } = useLocalSearchParams();
  const pets = useSelector(state => state.auth?.userPets?.data || []);
  const [isUploading, setIsUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    location: '',
    dob: new Date(),
    petPhoto: null,
    bloodGroup: '',
    height: '',
    weight: '',
    color: '',
    distinctiveFeatures: '',
    allergies: '',
    currentMedications: '',
    chronicDiseases: '',
    injuries: '',
    surgeries: '',
    vaccinations: '',
    notes: ''
  });

  // Find the pet by ID
  const pet = pets.find(p => p._id === petId);

  useEffect(() => {
    if (pet) {
      // Ensure we have a valid date - either from pet data or fallback to today
      const dobDate = pet.dob ? new Date(pet.dob) : new Date();

      setFormData({
        name: pet.name || '',
        species: pet.species || 'Dog',
        breed: pet.breed || '',
        gender: pet.gender || 'Male',
        location: pet.location || '',
        dob: dobDate,
        petPhoto: pet.petPhoto || null,
        bloodGroup: pet.bloodGroup || '',
        height: pet.height ? String(pet.height) : '',
        weight: pet.weight ? String(pet.weight) : '',
        color: pet.color || '',
        distinctiveFeatures: pet.distinctiveFeatures || '',
        allergies: pet.allergies || '',
        currentMedications: pet.currentMedications || '',
        chronicDiseases: pet.chronicDiseases || '',
        injuries: pet.injuries || '',
        surgeries: pet.surgeries || '',
        vaccinations: pet.vaccinations || '',
        notes: pet.notes || ''
      });
    }
  }, [pet]);

  const uploadToCloudinary = async (file) => {
    // If it's already a URL string, return it
    if (typeof file === 'string') {
      return { secure_url: file };
    }

    if (!file || !file.uri) {
      throw new Error('Invalid file object - missing URI');
    }

    // Rest of your existing upload logic...
    try {
      // Check if file exists and get info
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      if (!fileInfo.exists) {
        throw new Error(`File not found: ${file.uri}`);
      }
      if (fileInfo.size === 0) {
        throw new Error('File is empty (0 bytes)');
      }

      // Extract file extension safely
      const uriParts = file.uri.split('.');
      const fileExtension = uriParts.length > 1
        ? uriParts.pop().toLowerCase()
        : 'jpg'; // default extension if none found

      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
      const type = isImage ? 'image' : 'raw';

      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name || `pet_upload_${Date.now()}.${fileExtension}`,
        type: isImage
          ? `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`
          : file.type || 'application/octet-stream'
      });
      formData.append('upload_preset', 'vetician');
      formData.append('cloud_name', 'dqwzfs4ox');

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dqwzfs4ox/${type}/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[Cloudinary Upload Error]', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.dob || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setFormData(prev => ({
      ...prev,
      dob: currentDate,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

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

    if (formData.height && isNaN(formData.height)) {
      newErrors.height = 'Height must be a number';
    }

    if (formData.weight && isNaN(formData.weight)) {
      newErrors.weight = 'Weight must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsUploading(true);
      let imageUrl = pet?.petPhoto || null;

      // Only upload if petPhoto is a new image object
      if (formData.petPhoto && typeof formData.petPhoto !== 'string') {
        const cloudinaryResponse = await uploadToCloudinary(formData.petPhoto);
        imageUrl = cloudinaryResponse.secure_url;
      }

      // Format the date as ISO string (YYYY-MM-DD)
      const formattedDate = formData.dob.toISOString().split('T')[0];

      const updatedPetData = {
        ...formData,
        petPhoto: imageUrl,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        dob: formattedDate  // Send the formatted date string instead of Date object
      };

      const result = await dispatch(updatePet({
        petId: petId,
        petData: updatedPetData
      })).unwrap();

      if (result.success) {
        // Refresh the pets list to get updated data
        await dispatch(getPetsByUserId());
        
        Alert.alert(
          'Success',
          'Pet updated successfully!',
          [{
            text: 'OK', onPress: () => {
              router.back();
            }
          }]
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message || 'An error occurred while updating pet');
    } finally {
      setIsUploading(false);
    }
  };


  if (!pet) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E8D7C" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
              <MaterialIcons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Edit Pet Information</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            {/* Pet Photo Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pet Photo</Text>
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
                      source={{
                        uri: typeof formData.petPhoto === 'string'
                          ? formData.petPhoto
                          : formData.petPhoto?.uri
                      }}
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

          <TouchableOpacity
            style={[styles.submitButton, isUploading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  menuButton: {
    marginRight: 20,
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: 35
  },
  header: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
  submitButton: {
    backgroundColor: '#4E8D7C',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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

export default EditPetScreen;