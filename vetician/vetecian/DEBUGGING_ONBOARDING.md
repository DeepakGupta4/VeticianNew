# Paravet Onboarding - Debugging Guide

## Issue: Data not saving to backend database

## Step-by-Step Debugging

### 1. Check Frontend Console Logs

When you submit the form, check the console for:
```
Submitting onboarding data: { fullName: "...", mobileNumber: "...", ... }
Submission result: { success: true, ... }
```

### 2. Check Network Request

Open browser DevTools → Network tab:
- Look for: `POST /api/paravet/onboarding/:userId`
- Check Request Payload (should show nested format)
- Check Response (should show success: true)

### 3. Verify API Endpoint

Make sure your backend has this route:
```javascript
POST /api/paravet/onboarding/:userId
```

### 4. Check Backend Logs

Your backend should log:
```javascript
console.log('Received onboarding data:', req.body);
console.log('User ID:', req.params.userId);
```

### 5. Common Issues & Solutions

#### Issue 1: 404 Not Found
**Problem**: Backend route doesn't exist
**Solution**: Add route in backend:
```javascript
router.post('/paravet/onboarding/:userId', authenticateToken, paravetController.submitOnboarding);
```

#### Issue 2: 401 Unauthorized
**Problem**: Token not being sent or invalid
**Solution**: Check AsyncStorage has valid token:
```javascript
const token = await AsyncStorage.getItem('token');
console.log('Token:', token);
```

#### Issue 3: Data not nested properly
**Problem**: Backend receives flat data instead of nested
**Solution**: Check transformation is working:
```javascript
// In paravetApi.js, add console.log
const nestedData = transformToNestedFormat(formData);
console.log('Transformed data:', nestedData);
```

#### Issue 4: CORS Error
**Problem**: Backend not allowing requests from frontend
**Solution**: Add CORS middleware in backend:
```javascript
const cors = require('cors');
app.use(cors());
```

#### Issue 5: MongoDB not saving
**Problem**: Schema doesn't match or validation fails
**Solution**: Check backend logs for validation errors

### 6. Test with Postman/Thunder Client

Test the endpoint directly:

**Request**:
```
POST http://your-backend.com/api/paravet/onboarding/USER_ID_HERE
Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json

Body:
{
  "fullName": { "value": "John Doe" },
  "mobileNumber": { 
    "value": "9876543210", 
    "verified": true, 
    "otpVerified": true 
  },
  "email": { "value": "john@example.com" },
  "city": { "value": "Mumbai" }
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Onboarding submitted successfully",
  "data": { ... }
}
```

### 7. Check MongoDB Directly

Connect to MongoDB and check:
```javascript
db.paravets.findOne({ _id: ObjectId("USER_ID") })
```

Should show:
```json
{
  "_id": "...",
  "fullName": {
    "value": "John Doe",
    "verified": false
  },
  "mobileNumber": {
    "value": "9876543210",
    "verified": true,
    "otpVerified": true
  }
}
```

### 8. Enable Detailed Logging

Add to your API service:
```javascript
export const submitParavetOnboarding = async (userId, formData) => {
  console.log('=== ONBOARDING SUBMISSION START ===');
  console.log('User ID:', userId);
  console.log('Form Data (flat):', formData);
  
  const nestedData = transformToNestedFormat(formData);
  console.log('Nested Data:', nestedData);
  
  const token = await AsyncStorage.getItem('token');
  console.log('Token exists:', !!token);
  
  console.log('API URL:', `${API_URL}/paravet/onboarding/${userId}`);
  
  const response = await fetch(`${API_URL}/paravet/onboarding/${userId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nestedData)
  });
  
  console.log('Response status:', response.status);
  const result = await response.json();
  console.log('Response data:', result);
  console.log('=== ONBOARDING SUBMISSION END ===');
  
  return result;
};
```

### 9. Quick Test Script

Add this button to test API connection:
```javascript
<TouchableOpacity onPress={async () => {
  const userId = await AsyncStorage.getItem('userId');
  const token = await AsyncStorage.getItem('token');
  console.log('User ID:', userId);
  console.log('Token:', token);
  console.log('Form Data:', formData);
}}>
  <Text>Debug Info</Text>
</TouchableOpacity>
```

### 10. Backend Must Have

Ensure your backend has:

1. **Route registered**:
```javascript
app.use('/api', paravetRoutes);
```

2. **Controller function**:
```javascript
exports.submitOnboarding = async (req, res) => { ... }
```

3. **Schema defined**:
```javascript
const Paravet = require('./models/Paravet');
```

4. **MongoDB connected**:
```javascript
mongoose.connect(process.env.MONGODB_URI);
```

## Quick Fix Checklist

- [ ] Backend route exists
- [ ] Backend is running
- [ ] MongoDB is connected
- [ ] Token is valid
- [ ] CORS is enabled
- [ ] Schema matches data structure
- [ ] Console shows no errors
- [ ] Network request succeeds (200/201)
- [ ] Data appears in MongoDB

## Still Not Working?

Share these logs:
1. Frontend console logs
2. Backend console logs
3. Network request/response
4. MongoDB query result
