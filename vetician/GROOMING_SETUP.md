# Grooming Pricing Setup Instructions

## Step 1: Seed the Database

Run the following command from the backend directory to populate the grooming pricing data:

```bash
cd backend
node seedGroomingPricing.js
```

This will add the following pricing data to your database:

### Grooming Pricing Table

| Weight Category | Short Hair | Long Hair | With Hair Trim |
|----------------|------------|-----------|----------------|
| 0–10 kg        | ₹700       | ₹900      | ₹1700–1900     |
| 10–30 kg       | ₹800       | ₹1000     | ₹1800–2000     |
| 30+ kg         | ₹900       | ₹1100     | ₹1900–2100     |

**Includes:**
- ✓ Nail Trimming
- ✓ Ear Cleaning

## Step 2: Restart the Backend Server

After seeding the data, restart your backend server:

```bash
npm start
```

## Step 3: Test the Frontend

The grooming pricing will now be displayed in real-time on the Grooming page at:
`http://localhost:8081/pages/Grooming`

## API Endpoints

- `GET /api/grooming` - Get all active grooming pricing
- `POST /api/grooming` - Create new pricing (admin only)
- `PATCH /api/grooming/:id` - Update pricing (admin only)
- `DELETE /api/grooming/:id` - Soft delete pricing (admin only)

## Files Created/Modified

### Backend:
1. `models/GroomingPricing.js` - Database model
2. `controllers/groomingController.js` - API logic
3. `routes/groomingRoutes.js` - API routes
4. `server.js` - Added grooming routes
5. `seedGroomingPricing.js` - Seed script

### Frontend:
1. `components/petparent/Grooming/GroomingPricingTable.jsx` - Pricing table component
2. `app/(vetician_tabs)/pages/Grooming.jsx` - Updated to fetch and display real-time data
