# 🔧 Troubleshooting: Pricing Plans Not Showing

## ✅ Quick Fix Applied

I've added:
1. **Detailed logging** - Check console for errors
2. **Fallback plans** - Plans will show even if API fails

## 🚀 Steps to Fix

### Step 1: Reload the App
```bash
cd vetician-consumer
# Press 'r' in terminal or:
npx expo start -c
```

### Step 2: Check Console Logs
Open the app and look for these logs in the terminal:

**Good logs (API working):**
```
📡 Fetching pricing plans from: http://192.168.x.x:3000/api/daycare/plans
📡 Response status: 200
📡 Response data: { success: true, plans: [...] }
✅ Pricing plans loaded: 5 plans
```

**Bad logs (API failing):**
```
📡 Fetching pricing plans from: http://localhost:3000/api/daycare/plans
❌ Error fetching pricing plans: TypeError: Network request failed
🔄 Using fallback plans
```

### Step 3: Fix API URL

If you see "Network request failed", the issue is the API URL.

**Check your `.env` file in `vetician-consumer`:**
```
EXPO_PUBLIC_API_URL=http://192.168.29.237:3000/api
```

Replace `192.168.29.237` with your computer's IP address.

**To find your IP:**
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` (look for inet)

### Step 4: Verify Backend is Running
```bash
cd backend
npm start
```

Should show:
```
🚀 Server live at http://localhost:3000
```

### Step 5: Test API Directly
Open browser and go to:
```
http://192.168.29.237:3000/api/daycare/plans
```

You should see JSON with 5 plans.

## ✅ What You Should See Now

Even if API fails, you'll see the 5 pricing plans:

```
┌─────────────────────────────┐
│ Available Plans             │
│                             │
│ ┌─────────────────────────┐ │
│ │ Boarding          ₹900  │ │
│ │ 24 hours                │ │
│ │ Full day and night...   │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Day Boarding      ₹600  │ │
│ │ 8 to 10 hours           │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Day Park          ₹400  │ │
│ │ 1.5 to 2 hours          │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Day School     ₹13,650  │ │
│ │ 26 days, 8 hours/day    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Play School    ₹8,650   │ │
│ │ 26 days, 3 hours/day    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

## 🔍 Debug Checklist

- [ ] Backend is running (`npm start` in backend folder)
- [ ] Database has plans (run `node initializeDaycarePricing.js`)
- [ ] API URL is correct in `.env` file
- [ ] App is reloaded (`r` or `npx expo start -c`)
- [ ] Check console logs for errors
- [ ] Test API in browser

## 📱 If Plans Still Don't Show

1. **Check the console** - Look for the logs I added
2. **Take a screenshot** of the console output
3. **Check if fallback plans are showing** - They should appear even if API fails

## ✅ Expected Behavior

**With API working:**
- Plans load from database
- Can be updated without app rebuild
- Real-time pricing

**With API failing:**
- Fallback plans show immediately
- All 5 plans visible
- Booking still works

---

**Status:** ✅ Fallback Added
**Plans Will Show:** ✅ Yes (API or Fallback)
**Next Step:** Reload app and check console
