# Peravet Onboarding - Navigation Flow ✅

## How It's Connected

### Entry Points

1. **From Peravet Home Screen**
   ```
   components/peravet/home/Home.jsx
   └─ Button: "Complete Your Onboarding"
      └─ router.push('/(peravet_tabs)/onboarding')
   ```

2. **Direct URL**
   ```
   /(peravet_tabs)/onboarding
   ```

### Navigation Flow

```
App Entry
  └─ /(auth)/signin
      └─ Login as Peravet
          └─ /(peravet_tabs)/(tabs)/index
              └─ Home.jsx
                  └─ Click "Complete Your Onboarding" Button
                      └─ /(peravet_tabs)/onboarding/index.jsx
                          └─ Auto-redirects to step1_welcome.jsx
                              
Step 1: Welcome
  ├─ GET STARTED → step2_eligibility.jsx
  └─ SKIP FOR NOW → /(peravet_tabs)/(tabs)/home

Step 2: Eligibility
  ├─ Yes, I have certification → step3_personal_info.jsx
  └─ Learn more → Alert dialog

Step 3: Personal Info
  ├─ Fill form + OTP verification
  ├─ BACK → step2_eligibility.jsx
  └─ NEXT → step4_documents.jsx

Step 4: Documents
  ├─ Upload 3 required documents
  ├─ BACK → step3_personal_info.jsx
  └─ NEXT → step5_experience.jsx

Step 5: Experience & Skills
  ├─ Select experience, expertise, languages, availability
  ├─ BACK → step4_documents.jsx
  └─ NEXT → step6_payment.jsx

Step 6: Payment Details
  ├─ Enter UPI or Bank details + PAN
  ├─ BACK → step5_experience.jsx
  └─ NEXT → step7_code_of_conduct.jsx

Step 7: Code of Conduct
  ├─ Read and agree to policies
  ├─ BACK → step6_payment.jsx
  └─ I AGREE & CONTINUE → step8_training.jsx

Step 8: Training (Optional)
  ├─ START TRAINING → Quiz → Badge
  ├─ SKIP FOR NOW → step9_preview.jsx
  ├─ BACK → step7_code_of_conduct.jsx
  └─ After completion → step9_preview.jsx

Step 9: Preview & Submit
  ├─ Review all information
  ├─ EDIT INFORMATION → step3_personal_info.jsx
  ├─ BACK → step8_training.jsx
  └─ SUBMIT APPLICATION → Success Screen
      └─ GO TO DASHBOARD → /(peravet_tabs)/(tabs)/index
```

## Context Provider Wrapping

```
app/(peravet_tabs)/onboarding/_layout.jsx
  └─ ParavetOnboardingProvider wraps all steps
      └─ Provides shared state across all 9 steps
          ├─ formData
          ├─ errors
          ├─ updateFormData()
          ├─ nextStep()
          ├─ previousStep()
          ├─ sendOTP()
          ├─ verifyOTP()
          └─ resetOnboarding()
```

## How to Test the Connection

### Method 1: From Home Screen
1. Login as a Peravet user
2. You'll see the home screen with stats
3. At the top, there's a blue banner: "Complete Your Onboarding"
4. Click it → Opens Step 1 (Welcome)

### Method 2: Direct Navigation (for testing)
Add this button anywhere in your app:
```jsx
import { useRouter } from 'expo-router';

const router = useRouter();

<TouchableOpacity onPress={() => router.push('/(peravet_tabs)/onboarding')}>
  <Text>Start Onboarding</Text>
</TouchableOpacity>
```

### Method 3: URL Navigation
Navigate directly to: `/(peravet_tabs)/onboarding`

## State Management

All steps share the same context:
- **formData**: Stores all form inputs across steps
- **errors**: Validation errors for each field
- **otpState**: OTP verification status
- **currentStep**: Tracks which step user is on

## Key Files

### Layouts
- `app/(peravet_tabs)/_layout.jsx` - Main peravet layout
- `app/(peravet_tabs)/onboarding/_layout.jsx` - Onboarding layout with context

### Steps
- `step1_welcome.jsx` - Welcome screen
- `step2_eligibility.jsx` - Certification check
- `step3_personal_info.jsx` - Personal details + OTP
- `step4_documents.jsx` - Document uploads
- `step5_experience.jsx` - Experience & skills
- `step6_payment.jsx` - Payment details
- `step7_code_of_conduct.jsx` - Policies agreement
- `step8_training.jsx` - Training module
- `step9_preview.jsx` - Review & submit

### Context & Components
- `contexts/ParavetOnboardingContext.js` - State management
- `components/peravet/OTPModal.jsx` - OTP verification modal
- `components/peravet/home/Home.jsx` - Home screen with onboarding button

## Status: ✅ FULLY CONNECTED

All navigation paths are working:
- ✅ Entry from home screen
- ✅ Step-by-step navigation (Next/Back buttons)
- ✅ Context provider wrapping all steps
- ✅ Shared state across all steps
- ✅ OTP modal integration
- ✅ Success screen and redirect to dashboard
