# Fix: 413 Request Entity Too Large

## Problem
Base64 encoded images are too large for the backend to accept.

## Backend Solution (Choose One)

### Option 1: Increase Body Parser Limit (Quick Fix)

```javascript
// In your Express app setup
const express = require('express');
const app = express();

// Increase limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
```

### Option 2: Use File Upload Service (Recommended)

Instead of base64, upload files to cloud storage:

```javascript
// Frontend: Upload to cloud first, then send URL
const uploadImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'document.jpg'
  });
  
  const response = await fetch('YOUR_UPLOAD_API', {
    method: 'POST',
    body: formData
  });
  
  const { url } = await response.json();
  return url; // Return cloud URL instead of base64
};
```

### Option 3: Separate Document Upload Endpoint

```javascript
// Backend: Create separate endpoint for documents
router.post('/paravet/upload-document/:userId', upload.single('file'), async (req, res) => {
  // Upload to S3/Cloudinary
  const url = await uploadToCloud(req.file);
  
  // Save URL to database
  await Paravet.findByIdAndUpdate(req.params.userId, {
    $set: { [`${req.body.documentType}.value`]: url }
  });
  
  res.json({ success: true, url });
});
```

## Current Frontend Workaround

The frontend now sends:
```json
{
  "governmentIdUrl": { "value": "uploaded", "uploaded": true },
  "certificationProofUrl": { "value": "uploaded", "uploaded": true }
}
```

Instead of full base64 strings.

## Recommended Flow

1. User selects image
2. Frontend uploads to cloud storage (S3/Cloudinary)
3. Get back URL
4. Send URL in onboarding data
5. Backend saves URL (not base64)

## Quick Backend Fix (Add to server.js)

```javascript
const express = require('express');
const app = express();

// BEFORE other middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rest of your code...
```

This will allow the current base64 approach to work temporarily.
