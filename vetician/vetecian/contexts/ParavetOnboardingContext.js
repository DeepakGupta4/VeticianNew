import React, { createContext, useState, useCallback } from 'react';

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
