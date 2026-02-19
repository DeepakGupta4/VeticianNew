// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ScrollView, Modal, Platform, ActivityIndicator, Alert } from 'react-native';
// import * as DocumentPicker from 'expo-document-picker';
// import * as FileSystem from 'expo-file-system';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useDispatch } from 'react-redux';
// import { registerClinic } from '../../../store/slices/authSlice';
// // import Home from '../../../components/veterinarian/home/Home'
// import { useRouter } from 'expo-router';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ScrollView, Modal, Platform, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

// IS LINE KO CHANGE KAREIN:
import * as FileSystem from 'expo-file-system'; 

import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { registerClinic } from '../../../store/slices/authSlice';
import { useRouter } from 'expo-router';

// Cloudinary upload function
const uploadToCloudinary = async (file) => {
  const fileExtension = file.uri.split('.').pop().toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
  const type = isImage ? 'image' : 'raw';

  try {
    // File validation
    const fileInfo = await FileSystem.getInfoAsync(file.uri, { size: true });
    if (!fileInfo.exists) throw new Error(`File not found: ${file.uri}`);
    if (fileInfo.size === 0) throw new Error('Empty file');

    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name || `upload_${Date.now()}.${fileExtension}`,
          type: isImage ? `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`
            : file.type || 'application/pdf'
        });
        formData.append('upload_preset', 'vetician');
        formData.append('cloud_name', 'dqwzfs4ox');

        const response = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `https://api.cloudinary.com/v1_1/dqwzfs4ox/${type}/upload`);

          xhr.timeout = 30000;
          xhr.ontimeout = () => reject(new Error('Timeout'));

          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.response));
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText || 'No response'}`));
            }
          };

          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(formData);
        });

        return response;
      } catch (error) {
        lastError = error;
        if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw lastError;
  } catch (error) {
    console.error('[Cloudinary] UPLOAD FAILED:', error);
    throw error;
  }
};

const ClinicCreationFlow = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    establishmentType: '',
    clinicName: '',
    city: '',
    locality: '',
    streetAddress: '',
    clinicNumber: '',
    fees: '',
    timings: {
      mon: { start: '', end: '', type: '' },
      tue: { start: '', end: '', type: '' },
      wed: { start: '', end: '', type: '' },
      thu: { start: '', end: '', type: '' },
      fri: { start: '', end: '', type: '' },
      sat: { start: '', end: '', type: '' },
      sun: { start: '', end: '', type: '' },
    },
    sameTimingsForWeekdays: true,
    ownerProof: null
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSetTiming = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      timings: {
        ...prev.timings,
        [day]: {
          ...prev.timings[day],
          [field]: value
        }
      }
    }));
  };

  const handleSetAllWeekdays = (timing) => {
    setFormData(prev => {
      const newTimings = { ...prev.timings };
      ['mon', 'tue', 'wed', 'thu', 'fri'].forEach(day => {
        newTimings[day] = timing;
      });
      return { ...prev, timings: newTimings };
    });
  };

  // Step 1: Establishment Type
  if (step === 1) {
    return (
      <EstablishmentTypeStep
        onContinue={(type) => {
          setFormData({ ...formData, establishmentType: type });
          setStep(2);
        }}
      />
    );
  }

  // Step 2: Clinic Details
  if (step === 2) {
    return (
      <ClinicDetailsStep
        formData={formData}
        setFormData={setFormData}
        onContinue={() => setStep(3)}
        onBack={() => setStep(1)}
      />
    );
  }

  // Step 3: Clinic Address
  if (step === 3) {
    return (
      <ClinicAddressStep
        formData={formData}
        setFormData={setFormData}
        onContinue={() => setStep(4)}
        onBack={() => setStep(2)}
      />
    );
  }

  // Step 4: Clinic Contact & Fees
  if (step === 4) {
    return (
      <ClinicContactStep
        formData={formData}
        setFormData={setFormData}
        onContinue={() => setStep(5)}
        onBack={() => setStep(3)}
      />
    );
  }

  // Step 5: Session Timings
  if (step === 5) {
    return (
      <SessionTimingsStep
        formData={formData}
        setFormData={setFormData}
        handleSetTiming={handleSetTiming}
        handleSetAllWeekdays={handleSetAllWeekdays}
        onContinue={() => setStep(6)}
        onBack={() => setStep(4)}
      />
    );
  }

  // Step 6: Final Details & Document Upload
  return (
    <DocumentUploadStep
      formData={formData}
      setFormData={setFormData}
      onSubmit={async (finalFormData) => {
        try {
          const result = await dispatch(registerClinic(finalFormData)).unwrap();

          if (result.success) {
            Alert.alert(
              'Success',
              'Clinic registered successfully!',
              [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
            );
          }
        } catch (error) {
          console.log("Error =>", error)
          const errorMessage = error.payload?.error?.message || 'Registration failed';

          if (errorMessage.includes('already exists in this city')) {
            Alert.alert(
              'Clinic Exists',
              errorMessage,
              [{ text: 'OK' }]
            );
          } else {
            Alert.alert('Error', errorMessage);
          }
        } finally {
          setIsSubmitting(false);
        }
      }}
      onBack={() => setStep(5)}
    />
  );
};

// Step 1 Component: Establishment Type
const EstablishmentTypeStep = ({ onContinue }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    'Owner of establishment',
    'Consultant doctor',
    'Rented at other establishment',
    'Practicing at home'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>CREATE CLINIC PROFILE</Text>
        <Text style={styles.subtitle}>Choose the type of establishment</Text>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOption
              ]}
              onPress={() => setSelectedOption(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          styles.continueButtonFirst,
          !selectedOption && styles.disabledButton
        ]}
        onPress={() => selectedOption && onContinue(selectedOption)}
        disabled={!selectedOption}
      >
        <Text style={styles.continueText}>CONTINUE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Step 2 Component: Clinic Details
const ClinicDetailsStep = ({ formData, setFormData, onContinue, onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>ADD CLINIC</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Clinic Name</Text>
          <TextInput
            style={styles.input}
            value={formData.clinicName}
            onChangeText={(text) => setFormData({ ...formData, clinicName: text })}
            placeholder="Enter clinic name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            placeholder="Enter city"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Locality</Text>
          <TextInput
            style={styles.input}
            value={formData.locality}
            onChangeText={(text) => setFormData({ ...formData, locality: text })}
            placeholder="Enter locality"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!formData.clinicName || !formData.city || !formData.locality) && styles.disabledButton
          ]}
          onPress={onContinue}
          disabled={!formData.clinicName || !formData.city || !formData.locality}
        >
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Step 3 Component: Clinic Address
const ClinicAddressStep = ({ formData, setFormData, onContinue, onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>CLINIC ADDRESS</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>City*</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            placeholder="Enter city"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Locality</Text>
          <TextInput
            style={styles.input}
            value={formData.locality}
            onChangeText={(text) => setFormData({ ...formData, locality: text })}
            placeholder="Enter locality"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={styles.input}
            value={formData.streetAddress}
            onChangeText={(text) => setFormData({ ...formData, streetAddress: text })}
            placeholder="Enter street address"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !formData.city && styles.disabledButton
          ]}
          onPress={onContinue}
          disabled={!formData.city}
        >
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Step 4 Component: Clinic Contact & Fees
const ClinicContactStep = ({ formData, setFormData, onContinue, onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>CREATING CLINIC...</Text>

        <View style={styles.clinicSummary}>
          <Text style={styles.clinicName}>{formData.clinicName}</Text>
          <Text style={styles.clinicDetail}>Location: {formData.streetAddress}, {formData.locality}, {formData.city}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Clinic Number</Text>
          <TextInput
            style={styles.input}
            value={formData.clinicNumber}
            onChangeText={(text) => setFormData({ ...formData, clinicNumber: text })}
            placeholder="Enter clinic number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fees (₹)</Text>
          <TextInput
            style={styles.input}
            value={formData.fees}
            onChangeText={(text) => setFormData({ ...formData, fees: text })}
            placeholder="Enter consultation fees"
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onContinue}
        >
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Step 5 Component: Session Timings
const SessionTimingsStep = ({
  formData,
  setFormData,
  handleSetTiming,
  handleSetAllWeekdays,
  onContinue,
  onBack
}) => {
  const [selectedDay, setSelectedDay] = useState('mon');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const days = [
    { key: 'mon', label: 'MON' },
    { key: 'tue', label: 'TUE' },
    { key: 'wed', label: 'WED' },
    { key: 'thu', label: 'THU' },
    { key: 'fri', label: 'FRI' },
    { key: 'sat', label: 'SAT' },
    { key: 'sun', label: 'SUN' },
  ];

  const toggleSameTimings = () => {
    setFormData(prev => ({
      ...prev,
      sameTimingsForWeekdays: !prev.sameTimingsForWeekdays
    }));
  };

  const openTimePicker = (field) => {
    setEditingField(field);
    setShowTimePicker(true);
  };

  const handleTimeSelect = (time) => {
    handleSetTiming(selectedDay, editingField, time);
    setShowTimePicker(false);
  };

  const handleSetForAll = () => {
    handleSetAllWeekdays(formData.timings[selectedDay]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>SESSION TIMINGS</Text>

        <View style={styles.toggleContainer}>
          <Text>Same timings for weekdays</Text>
          <TouchableOpacity onPress={toggleSameTimings}>
            <View style={styles.toggleButton}>
              <View style={[
                styles.toggleCircle,
                formData.sameTimingsForWeekdays ? styles.toggleOn : styles.toggleOff
              ]} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.daysContainer}>
          {days.map((day) => (
            <TouchableOpacity
              key={day.key}
              style={[
                styles.dayButton,
                selectedDay === day.key && styles.selectedDay
              ]}
              onPress={() => setSelectedDay(day.key)}
            >
              <Text style={[
                styles.dayText,
                selectedDay === day.key && styles.selectedDayText
              ]}>
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.timingContainer}>
          <Text style={styles.timingLabel}>Start Time</Text>
          <TouchableOpacity
            style={styles.timeInput}
            onPress={() => openTimePicker('start')}
          >
            <Text>{formData.timings[selectedDay].start || 'Select start time'}</Text>
          </TouchableOpacity>

          <Text style={styles.timingLabel}>End Time</Text>
          <TouchableOpacity
            style={styles.timeInput}
            onPress={() => openTimePicker('end')}
          >
            <Text>{formData.timings[selectedDay].end || 'Select end time'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timingTypeContainer}>
          <Text style={styles.timingLabel}>Appointment Type</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.timings[selectedDay].type === 'Video' && styles.selectedType
              ]}
              onPress={() => handleSetTiming(selectedDay, 'type', 'Video')}
            >
              <Text>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.timings[selectedDay].type === 'In-Clinic' && styles.selectedType
              ]}
              onPress={() => handleSetTiming(selectedDay, 'type', 'In-Clinic')}
            >
              <Text>In-Clinic</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.timings[selectedDay].type === 'Both' && styles.selectedType
              ]}
              onPress={() => handleSetTiming(selectedDay, 'type', 'Both')}
            >
              <Text>Both</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.setAllButton}
          onPress={handleSetForAll}
        >
          <Text style={styles.setAllText}>SET SAME FOR ALL WEEKDAYS</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onContinue}
        >
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.timePicker}>
            <Text style={styles.timePickerTitle}>Select Time</Text>

            <View style={styles.timeSelector}>
              <ScrollView style={styles.timeColumn}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                  <TouchableOpacity
                    key={`hour-${hour}`}
                    style={styles.timeOption}
                    onPress={() => handleTimeSelect(`${hour < 10 ? '0' + hour : hour}:00 am`)}
                  >
                    <Text>{hour}:00 am</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView style={styles.timeColumn}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                  <TouchableOpacity
                    key={`hour-${hour}`}
                    style={styles.timeOption}
                    onPress={() => handleTimeSelect(`${hour < 10 ? '0' + hour : hour}:00 pm`)}
                  >
                    <Text>{hour}:00 pm</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowTimePicker(false)}
            >
              <Text>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Step 6 Component: Document Upload
const DocumentUploadStep = ({ formData, setFormData, onSubmit, onBack }) => {
  const [ownerProofFile, setOwnerProofFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDocumentUpload = async () => {
    try {
      setUploadError(null);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        const fileInfo = await FileSystem.getInfoAsync(selectedFile.uri);

        if (!fileInfo.exists) {
          throw new Error('Selected file could not be accessed');
        }

        setOwnerProofFile({
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || 'application/pdf',
          size: fileInfo.size
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to select document. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!ownerProofFile) {
      setUploadError('Please upload a document');
      return;
    }

    setIsUploading(true);
    try {
      const cloudinaryResponse = await uploadToCloudinary(ownerProofFile);
      const updatedFormData = {
        ...formData,
        ownerProof: cloudinaryResponse.secure_url
      };

      setFormData(updatedFormData);
      onSubmit(updatedFormData);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>CREATING CLINIC...</Text>

        <View style={styles.clinicSummary}>
          <Text style={styles.clinicName}>{formData.clinicName}</Text>
          <Text style={styles.clinicDetail}>Location: {formData.streetAddress}, {formData.locality}, {formData.city}</Text>
          <Text style={styles.clinicDetail}>Clinic Number: {formData.clinicNumber || 'Not provided'}</Text>
          <Text style={styles.clinicDetail}>Fees: ₹{formData.fees || 'Not provided'}</Text>

          <Text style={styles.sectionTitle}>Timings:</Text>
          {Object.entries(formData.timings).map(([day, timing]) => (
            timing.start && (
              <Text key={day} style={styles.clinicDetail}>
                {day.toUpperCase()}: {timing.start} - {timing.end} ({timing.type || 'Not specified'})
              </Text>
            )
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Upload Owner Proof*</Text>
          <Text style={styles.helperText}>
            Acceptable documents: Clinic Registration Proof, Waste Disposal Proof, or Tax receipt
          </Text>

          <TouchableOpacity
            style={[
              styles.uploadButton,
              uploadError && styles.uploadError
            ]}
            onPress={handleDocumentUpload}
            disabled={isUploading}
          >
            {ownerProofFile ? (
              <View style={styles.fileInfoContainer}>
                <MaterialIcons name="description" size={24} color="#3B82F6" />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {ownerProofFile.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {Math.round(ownerProofFile.size / 1024)} KB
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <MaterialIcons name="cloud-upload" size={24} color="#3B82F6" />
                <Text style={styles.uploadButtonText}>Select PDF File</Text>
              </>
            )}
          </TouchableOpacity>

          {uploadError && (
            <Text style={styles.errorText}>{uploadError}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          disabled={isUploading}
        >
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            isUploading && styles.uploadingButton
          ]}
          onPress={handleSubmit}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueText}>SUBMIT</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // Add extra padding for footer
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#7F8C8D',
    lineHeight: 22,
  },
  optionsContainer: {
    marginHorizontal: 10,
  },
  optionButton: {
    padding: 18,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#3498DB',
    backgroundColor: '#EBF5FB',
    shadowColor: '#3498DB',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  optionText: {
    fontSize: 16,
    color: '#34495E',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: '#2C3E50',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  helperText: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 10,
    lineHeight: 18,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#34495E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clinicSummary: {
    backgroundColor: '#F8F9F9',
    padding: 18,
    borderRadius: 12,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#2C3E50',
  },
  clinicDetail: {
    fontSize: 14,
    marginBottom: 6,
    color: '#566573',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    color: '#2C3E50',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#3498DB',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#F5FBFF',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  uploadError: {
    borderColor: '#E74C3C',
    backgroundColor: '#FDEDEC',
  },
  uploadButtonText: {
    color: '#3498DB',
    fontWeight: '600',
    fontSize: 15,
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  errorText: {
    color: '#E74C3C',
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 15,
    paddingBottom: 25,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 16,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#BDC3C7',
    borderRadius: 10,
    backgroundColor: '#F8F9F9',
  },
  backText: {
    color: '#7F8C8D',
    fontWeight: '600',
    fontSize: 15,
  },
  continueButton: {
    backgroundColor: '#3498DB',
    padding: 16,
    width: '65%',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonFirst: {
    marginHorizontal: "auto",
    marginBottom: 25,
    width: '90%',
    alignSelf: 'center',
  },
  continueText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  disabledButton: {
    backgroundColor: '#BDC3C7',
    shadowColor: '#BDC3C7',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    padding: 14,
    backgroundColor: '#F8F9F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },
  toggleButton: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleOn: {
    backgroundColor: '#3498DB',
    transform: [{ translateX: 20 }],
  },
  toggleOff: {
    backgroundColor: '#fff',
    transform: [{ translateX: 0 }],
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  dayButton: {
    width: '14%',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDay: {
    borderColor: '#3498DB',
    backgroundColor: '#EBF5FB',
    shadowColor: '#3498DB',
    shadowOpacity: 0.2,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  selectedDayText: {
    color: '#3498DB',
  },
  timingContainer: {
    marginBottom: 25,
  },
  timingLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2C3E50',
  },
  timeInput: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  timingTypeContainer: {
    marginBottom: 25,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedType: {
    borderColor: '#3498DB',
    backgroundColor: '#EBF5FB',
    shadowColor: '#3498DB',
    shadowOpacity: 0.2,
  },
  setAllButton: {
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#3498DB',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#F5FBFF',
  },
  setAllText: {
    color: '#3498DB',
    fontWeight: '600',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  timePicker: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50',
  },
  timeSelector: {
    flexDirection: 'row',
    height: 300,
    marginBottom: 10,
  },
  timeColumn: {
    flex: 1,
  },
  timeOption: {
    padding: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  cancelButton: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  uploadingButton: {
    backgroundColor: '#7FB3D5',
  },
});

export default ClinicCreationFlow;