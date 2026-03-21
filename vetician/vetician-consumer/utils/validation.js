/**
 * Enhanced Validation Utilities
 * 
 * Features:
 * - Stronger email validation
 * - Password strength validation
 * - Comprehensive name validation
 * - International phone number support
 * - Configurable validation rules
 * - Detailed error messages
 */

// Email validation with stricter rules
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
  return emailRegex.test(String(email).toLowerCase());
};

// Password validation with strength requirements
export const validatePassword = (password) => {
  if (!password || password.length < 8) return false;
  
  // Require at least one of each:
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

// Name validation supporting international characters
export const validateName = (name) => {
  if (!name) return false;
  
  const trimmed = name.trim();
  const nameRegex = /^[\p{L}\s'-]{2,}$/u; // Supports Unicode letters
  return nameRegex.test(trimmed) && trimmed.length >= 2;
};

// Comprehensive phone number validation
export const validatePhone = (phone) => {
  if (!phone) return false;
  
  // Basic international phone validation
  const phoneRegex = /^\+?[\d\s\-\(\)]{8,20}$/;
  const digitsOnly = phone.replace(/\D/g, '');
  
  return phoneRegex.test(phone) && 
         digitsOnly.length >= 8 && 
         digitsOnly.length <= 15;
};

// Enhanced required field validation
export const validateRequired = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Length validations with exact messages
export const validateMinLength = (value, minLength) => {
  if (!value) return false;
  return String(value).length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  if (!value) return true; // Not required if empty
  return String(value).length <= maxLength;
};

// Password strength indicator (optional)
export const getPasswordStrength = (password) => {
  if (!password) return 0;
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return strength;
};

/**
 * Advanced form validation with:
 * - Conditional validation
 * - Cross-field validation
 * - Custom validation functions
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      // Skip validation if field is not required and empty
      if (rule.type !== 'required' && !validateRequired(value)) {
        continue;
      }
      
      let valid = true;
      let message = rule.message;
      
      switch (rule.type) {
        case 'required':
          valid = validateRequired(value);
          message = message || `${field} is required`;
          break;
          
        case 'email':
          valid = validateEmail(value);
          message = message || 'Please enter a valid email address';
          break;
          
        case 'password':
          valid = validatePassword(value);
          message = message || 
            'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
          break;
          
        case 'minLength':
          valid = validateMinLength(value, rule.value);
          message = message || `Must be at least ${rule.value} characters`;
          break;
          
        case 'maxLength':
          valid = validateMaxLength(value, rule.value);
          message = message || `Cannot exceed ${rule.value} characters`;
          break;
          
        case 'custom':
          if (rule.validate) {
            const customResult = rule.validate(value, formData);
            if (typeof customResult === 'string') {
              valid = false;
              message = customResult;
            } else {
              valid = customResult;
            }
          }
          break;
          
        case 'match':
          valid = value === formData[rule.field];
          message = message || `Must match ${rule.field}`;
          break;
      }
      
      if (!valid) {
        errors[field] = message;
        isValid = false;
        break; // Stop after first error for this field
      }
    }
  });
  
  return {
    isValid,
    errors,
    // Additional validation metadata
    strength: getPasswordStrength(formData.password)
  };
};

// Example usage:
/*
const rules = {
  name: [
    { type: 'required', message: 'Full name is required' },
    { type: 'minLength', value: 2, message: 'Name too short' }
  ],
  email: [
    { type: 'required' },
    { type: 'email' }
  ],
  password: [
    { type: 'required' },
    { type: 'password' }
  ],
  confirmPassword: [
    { type: 'required' },
    { type: 'match', field: 'password', message: 'Passwords must match' }
  ]
};
*/