# Deploy Instructions for Render

## The Issue
Your frontend is calling: `POST https://vetician-backend-kovk.onrender.com/api/paravet/onboarding/699c055a6ff85247aa10b9cc`

But the production server on Render doesn't have the updated route yet.

## Solution: Deploy Updated Code to Render

### Option 1: Git Push (Recommended)
```bash
cd c:\Users\Asus\Desktop\vet\VeticianNew\vetician\backend
git add .
git commit -m "Add paravet onboarding endpoint"
git push origin main
```

Render will automatically detect the push and redeploy.

### Option 2: Manual Deploy via Render Dashboard
1. Go to https://dashboard.render.com
2. Find your service: `vetician-backend`
3. Click "Manual Deploy" → "Deploy latest commit"

## Verify Deployment

After deployment, test these endpoints:

1. **Test basic route:**
   ```
   GET https://vetician-backend-kovk.onrender.com/api/paravet/test
   ```
   Should return: `{"message": "Paravet routes working!"}`

2. **Test onboarding endpoint:**
   ```
   GET https://vetician-backend-kovk.onrender.com/api/paravet/onboarding/test
   ```
   Should return: `{"message": "Onboarding endpoint is accessible", "timestamp": "..."}`

3. **Test actual submission:**
   ```
   POST https://vetician-backend-kovk.onrender.com/api/paravet/onboarding/699c055a6ff85247aa10b9cc
   ```
   With your form data in the body.

## What Was Added

The new route in `routes/paravetRoutes.js`:
- **Endpoint:** `POST /api/paravet/onboarding/:id`
- **Method:** Uses `findByIdAndUpdate` with MongoDB document ID
- **Features:** 
  - Validates ObjectId format
  - Updates nested fields with `$set`
  - Returns updated document
  - Handles 404 and 500 errors
  - Includes debug logging

## Local Testing

Before deploying, test locally:
```bash
cd c:\Users\Asus\Desktop\vet\VeticianNew\vetician\backend
npm start
```

Then test: `POST http://localhost:3000/api/paravet/onboarding/699c055a6ff85247aa10b9cc`
