import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Radio, Info } from 'lucide-react-native';
import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';

export default function Step6Payment() {
  const router = useRouter();
  const { formData, updateFormData, errors, nextStep } = useParavetOnboarding();

  const handlePaymentMethodChange = (method) => {
    updateFormData('paymentMethod', method);
    updateFormData('paymentValue', '');
  };

  const handleNext = () => {
    if (nextStep()) {
      router.push('./step7_code_of_conduct');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isFormValid = formData.accountHolderName &&
                      formData.paymentValue &&
                      formData.pan;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Step 6 of 9</Text>
        <Text style={styles.heading}>Bank Details for Payouts</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '67%' }]} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>Add your payment details to receive earnings</Text>

        {/* Payment Method Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Payment Method *</Text>

          {/* UPI Option */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              formData.paymentMethod === 'upi' && styles.paymentOptionSelected,
            ]}
            onPress={() => handlePaymentMethodChange('upi')}
          >
            <View style={styles.radioContainer}>
              <Radio
                size={20}
                color={formData.paymentMethod === 'upi' ? '#00B0FF' : '#ccc'}
                fill={formData.paymentMethod === 'upi' ? '#00B0FF' : 'transparent'}
              />
            </View>
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>UPI</Text>
              <Text style={styles.paymentOptionSubtitle}>Immediate payments via UPI ID</Text>
            </View>
          </TouchableOpacity>

          {/* Bank Account Option */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              formData.paymentMethod === 'bank_account' && styles.paymentOptionSelected,
            ]}
            onPress={() => handlePaymentMethodChange('bank_account')}
          >
            <View style={styles.radioContainer}>
              <Radio
                size={20}
                color={formData.paymentMethod === 'bank_account' ? '#00B0FF' : '#ccc'}
                fill={formData.paymentMethod === 'bank_account' ? '#00B0FF' : 'transparent'}
              />
            </View>
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>Bank Account</Text>
              <Text style={styles.paymentOptionSubtitle}>Direct bank transfer (2-3 days)</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Conditional Fields */}
        {formData.paymentMethod && (
          <View style={styles.formGroup}>
            {formData.paymentMethod === 'upi' ? (
              <>
                <Text style={styles.label}>UPI ID *</Text>
                <TextInput
                  style={[styles.input, errors.paymentValue && styles.inputError]}
                  placeholder="yourname@bankname"
                  value={formData.paymentValue}
                  onChangeText={(value) => updateFormData('paymentValue', value)}
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                />
                {errors.paymentValue && <Text style={styles.errorText}>{errors.paymentValue}</Text>}
              </>
            ) : (
              <>
                <Text style={styles.label}>Account Number *</Text>
                <TextInput
                  style={[styles.input, errors.paymentValue && styles.inputError]}
                  placeholder="16-digit account number"
                  value={formData.paymentValue}
                  onChangeText={(value) => updateFormData('paymentValue', value)}
                  keyboardType="numeric"
                  maxLength={18}
                  placeholderTextColor="#999"
                />
                {errors.paymentValue && <Text style={styles.errorText}>{errors.paymentValue}</Text>}
              </>
            )}
          </View>
        )}

        {/* Account Holder Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Account Holder Name *</Text>
          <TextInput
            style={[styles.input, errors.accountHolderName && styles.inputError]}
            placeholder="Name as per account"
            value={formData.accountHolderName}
            onChangeText={(value) => updateFormData('accountHolderName', value)}
            placeholderTextColor="#999"
          />
          {errors.accountHolderName && <Text style={styles.errorText}>{errors.accountHolderName}</Text>}
          <Text style={styles.helperText}>Must match your account name exactly</Text>
        </View>

        {/* PAN */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>PAN (Permanent Account Number) *</Text>
          <TextInput
            style={[styles.input, errors.pan && styles.inputError]}
            placeholder="AAABP5055K"
            value={formData.pan}
            onChangeText={(value) => updateFormData('pan', value.toUpperCase())}
            maxLength={10}
            placeholderTextColor="#999"
          />
          {errors.pan && <Text style={styles.errorText}>{errors.pan}</Text>}
          <Text style={styles.helperText}>Required for tax compliance</Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Info size={16} color="#00B0FF" />
          <Text style={styles.infoText}>
            Your payment information is encrypted and secure. We never share your details with third parties.
          </Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!isFormValid}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e1e5e9',
    width: '100%',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#00B0FF',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d0d5dc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  paymentOptionSelected: {
    borderColor: '#00B0FF',
    backgroundColor: '#E8F4FD',
  },
  radioContainer: {
    marginRight: 12,
  },
  paymentOptionContent: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  paymentOptionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d0d5dc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 12,
    marginTop: 24,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 12,
    color: '#0099CC',
    lineHeight: 18,
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#00B0FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
