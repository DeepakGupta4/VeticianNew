// Quick test for upload endpoint
// Open browser console and paste this

fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
  }
}).then(r => r.json()).then(console.log).catch(console.error);

// Expected: {"success":false,"message":"No file uploaded"}
// This means endpoint exists and is working!
