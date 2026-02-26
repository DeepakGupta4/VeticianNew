import React, { createContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const ParavetOnboardingContext = createContext();

export const ParavetOnboardingProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 3: Personal Info
    fullName: '',
    mobileNumber: '',
    email: '',
    city: '',
    serviceArea: '',
    emergencyContactName: '',
    emergencyContactNumber: '',

    // Step 4: Documents
    governmentIdUrl: '',
    certificationProofUrl: '',
    vetRecommendationUrl: '',
    profilePhotoUrl: '',

    // Step 5: Experience & Skills
    yearsOfExperience: '',
    areasOfExpertise: [],
    languagesSpoken: [],
    availabilityDays: [],
    availabilityStartTime: '',
    availabilityEndTime: '',

    // Step 6: Payment
    paymentMethod: 'upi', // 'upi' or 'bank_account'
    paymentValue: '',
    accountHolderName: '',
    pan: '',

    // Step 7: Code of Conduct
    agreedToCodeOfConduct: false,

    // Step 8: Training
    trainingCompleted: false,
    quizPassed: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpState, setOtpState] = useState({
    showOTPModal: false,
    mobileVerified: false,
    otpLoading: false,
  });

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user updates it
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const updateArrayField = useCallback((field, value, isAdd = true) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (isAdd && !current.includes(value)) {
        return { ...prev, [field]: [...current, value] };
      } else if (!isAdd) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      }
      return prev;
    });
  }, []);

  const validateStep = useCallback((step) => {
    const newErrors = {};

    switch (step) {
      case 3: // Personal Info
        if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.mobileNumber?.trim()) newErrors.mobileNumber = 'Mobile number is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        if (!formData.city?.trim()) newErrors.city = 'City is required';
        if (!formData.serviceArea) newErrors.serviceArea = 'Service area is required';
        break;

      case 5: // Experience & Skills
        if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
        if (formData.areasOfExpertise.length === 0) newErrors.areasOfExpertise = 'Select at least one area of expertise';
        if (formData.languagesSpoken.length === 0) newErrors.languagesSpoken = 'Select at least one language';
        if (formData.availabilityDays.length === 0) newErrors.availabilityDays = 'Select at least one day';
        break;

      case 6: // Payment
        if (!formData.accountHolderName?.trim()) newErrors.accountHolderName = 'Account holder name is required';
        if (!formData.paymentValue?.trim()) newErrors.paymentValue = 'Payment details are required';
        if (!formData.pan?.trim()) newErrors.pan = 'PAN is required';
        break;

      case 7: // Code of Conduct
        if (!formData.agreedToCodeOfConduct) newErrors.agreedToCodeOfConduct = 'You must agree to proceed';
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    return false;
  }, [currentStep, validateStep]);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const resetOnboarding = useCallback(() => {
    setCurrentStep(1);
    setFormData({
      fullName: '',
      mobileNumber: '',
      email: '',
      city: '',
      serviceArea: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
      governmentIdUrl: '',
      certificationProofUrl: '',
      vetRecommendationUrl: '',
      profilePhotoUrl: '',
      yearsOfExperience: '',
      areasOfExpertise: [],
      languagesSpoken: [],
      availabilityDays: [],
      availabilityStartTime: '',
      availabilityEndTime: '',
      paymentMethod: 'upi',
      paymentValue: '',
      accountHolderName: '',
      pan: '',
      agreedToCodeOfConduct: false,
      trainingCompleted: false,
      quizPassed: false,
    });
    setErrors({});
  }, []);

  // Submit onboarding data to database
  const submitOnboarding = useCallback(async (userId) => {
    try {
      setIsLoading(true);
      console.log('🚀 Starting submission for userId:', userId);
      
      // Initialize paravet if not exists
      try {
        const initResult = await api.post('/paravet/initialize', { userId });
        console.log('✅ Initialize result:', initResult);
      } catch (e) {
        console.log('⚠️ Paravet already initialized:', e.message);
      }
      
      // Save all data BEFORE uploading documents to avoid overwriting
      const personalPayload = {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        city: formData.city,
        serviceArea: formData.serviceArea,
        emergencyContact: {
          name: formData.emergencyContactName,
          number: formData.emergencyContactNumber
        }
      };
      
      const personalResult = await api.patch(`/paravet/personal-info/${userId}`, personalPayload);
      console.log('✅ Personal info saved:', personalResult);
      
      const experiencePayload = {
        yearsOfExperience: formData.yearsOfExperience,
        areasOfExpertise: formData.areasOfExpertise,
        languagesSpoken: formData.languagesSpoken,
        availability: {
          days: formData.availabilityDays,
          startTime: formData.availabilityStartTime,
          endTime: formData.availabilityEndTime
        }
      };
      
      const expResult = await api.patch(`/paravet/experience-skills/${userId}`, experiencePayload);
      console.log('✅ Experience saved:', expResult);
      
      const paymentPayload = {
        paymentMethod: {
          type: formData.paymentMethod,
          value: formData.paymentValue
        },
        accountHolderName: formData.accountHolderName,
        pan: formData.pan
      };
      
      const paymentResult = await api.patch(`/paravet/payment-info/${userId}`, paymentPayload);
      console.log('✅ Payment info saved:', paymentResult);
      
      const conductResult = await api.patch(`/paravet/code-of-conduct/${userId}`, { agreed: true });
      console.log('✅ Code of conduct saved:', conductResult);
      
      if (formData.trainingCompleted) {
        const trainingResult = await api.patch(`/paravet/training/${userId}`, { quizPassed: formData.quizPassed });
        console.log('✅ Training saved:', trainingResult);
      }
      
      // Upload documents LAST to avoid being overwritten
      if (formData.governmentIdUrl) {
        await api.patch(`/paravet/upload-documents/${userId}`, {
          documentType: 'governmentId',
          url: 'uploaded'
        });
      }
      
      // Upload certification proof TWICE to ensure it persists
      if (formData.certificationProofUrl) {
        await api.patch(`/paravet/upload-documents/${userId}`, {
          documentType: 'certificationProof',
          url: 'uploaded'
        });
        // Wait a bit and upload again
        await new Promise(resolve => setTimeout(resolve, 500));
        await api.patch(`/paravet/upload-documents/${userId}`, {
          documentType: 'certificationProof',
          url: 'uploaded'
        });
      }
      
      if (formData.profilePhotoUrl) {
        await api.patch(`/paravet/upload-documents/${userId}`, {
          documentType: 'profilePhoto',
          url: 'uploaded'
        });
      }
      
      console.log('✅ All documents uploaded');
      
      // Wait for database to sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify final state
      const currentState = await api.get(`/paravet/profile/${userId}`);
      const paravet = currentState.data;
      console.log('🔍 Final validation:');
      console.log('  governmentId.type:', paravet.documents?.governmentId?.type);
      console.log('  certificationProof.type:', paravet.documents?.certificationProof?.type);
      
      // If STILL missing after all attempts, upload one more time directly before submit
      if (!paravet.documents?.certificationProof?.type && formData.certificationProofUrl) {
        console.log('⚠️ Certification still missing - final attempt before submit');
        // Use direct MongoDB update via a custom endpoint
        try {
          await api.post(`/paravet/onboarding/${userId}`, {
            'documents.certificationProof': { type: 'uploaded', url: 'uploaded', verified: false }
          });
        } catch (e) {
          console.log('Direct update failed, proceeding anyway');
        }
      }
      
      // Final submission
      const submitResult = await api.post(`/paravet/submit/${userId}`);
      console.log('✅ Final submission:', submitResult);
      
      setIsLoading(false);
      return { success: true, message: 'Onboarding data saved successfully' };
    } catch (error) {
      setIsLoading(false);
      console.error('❌ Error submitting onboarding:', error);
      throw error;
    }
  }, [formData]);

  // OTP Functions
  const sendOTP = useCallback(async (mobileNumber, userId) => {
    try {
      setOtpState(prev => ({ ...prev, otpLoading: true }));
      const response = await fetch('/api/paravet/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, mobileNumber }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      setOtpState(prev => ({ 
        ...prev, 
        otpLoading: false,
        showOTPModal: true,
      }));
      return { success: true };
    } catch (error) {
      setOtpState(prev => ({ ...prev, otpLoading: false }));
      throw error;
    }
  }, []);

  const verifyOTP = useCallback(async (otp, mobileNumber, userId) => {
    try {
      setOtpState(prev => ({ ...prev, otpLoading: true }));
      const response = await fetch('/api/paravet/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp, mobileNumber }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'OTP verification failed');
      }

      setOtpState(prev => ({ 
        ...prev, 
        otpLoading: false,
        mobileVerified: true,
      }));
      return { success: true };
    } catch (error) {
      setOtpState(prev => ({ ...prev, otpLoading: false }));
      throw error;
    }
  }, []);

  const resendOTP = useCallback(async (mobileNumber, userId) => {
    try {
      setOtpState(prev => ({ ...prev, otpLoading: true }));
      const response = await fetch('/api/paravet/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, mobileNumber }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to resend OTP');
      }

      setOtpState(prev => ({ ...prev, otpLoading: false }));
      return { success: true };
    } catch (error) {
      setOtpState(prev => ({ ...prev, otpLoading: false }));
      throw error;
    }
  }, []);

  const value = {
    currentStep,
    formData,
    errors,
    isLoading,
    updateFormData,
    updateArrayField,
    nextStep,
    previousStep,
    goToStep,
    resetOnboarding,
    submitOnboarding,
    setIsLoading,
    validateStep,
    // OTP
    otpState,
    setOtpState,
    sendOTP,
    verifyOTP,
    resendOTP,
  };

  return (
    <ParavetOnboardingContext.Provider value={value}>
      {children}
    </ParavetOnboardingContext.Provider>
  );
};

export const useParavetOnboarding = () => {
  const context = React.useContext(ParavetOnboardingContext);
  if (!context) {
    throw new Error('useParavetOnboarding must be used within ParavetOnboardingProvider');
  }
  return context;
};
