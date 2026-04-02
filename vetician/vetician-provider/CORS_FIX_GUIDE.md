# CORS Issue Fix Guide

## Problem
Your frontend (http://localhost:8081) cannot access the backend API (https://vetician-backend-kovk.onrender.com) due to CORS policy restrictions.

## Solutions

### Solution 1: Use Local Backend (Recommended for Development)

1. **Find your local IP address:**
   - Open Command Prompt
   - Run: `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.1.100)

2. **Update .env file:**
   ```
   EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000/api
   ```
   Replace YOUR_LOCAL_IP with your actual IP address (e.g., 192.168.1.100)

3. **Restart Expo:**
   - Stop the current Expo server (Ctrl+C)
   - Clear cache: `npx expo start -c`
   - Or just: `npm start`

4. **Make sure your backend is running locally on port 3000**

### Solution 2: Fix Backend CORS Configuration

If you need to use the production backend, update your backend's CORS configuration:

**In your backend server file (e.g., server.js or app.js):**

```javascript
const cors = require('cors');

// Allow requests from your local development environment
app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://localhost:3000',
    'http://192.168.1.100:8081', // Your local IP
    'exp://192.168.1.100:8081',  // Expo Go
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Solution 3: Use Production Backend with Proxy (Not Recommended)

You can use a proxy service like ngrok to tunnel requests, but this is not recommended for regular development.

## After Making Changes

1. **Clear Expo cache:**
   ```bash
   npx expo start -c
   ```

2. **Restart your backend server** (if you made CORS changes)

3. **Test the connection** by checking the console logs

## Verification

After applying the fix, you should see:
- ✅ Socket connected successfully
- ✅ API requests working without CORS errors
- ✅ Veterinarian data loading properly

## Current Configuration

Your app.json has:
```json
"extra": {
  "EXPO_PUBLIC_API_URL": "http://localhost:3000/api"
}
```

This will be overridden by the .env file if it exists.
