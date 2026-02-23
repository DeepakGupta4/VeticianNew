# Paravet Dashboard API Documentation

## Overview
The Paravet home page is now fully dynamic and ready to connect to the backend API.

## API Endpoint

### GET /api/paravet/dashboard/:userId

**Description**: Fetches dashboard data for a paravet user

**Headers**:
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**URL Parameters**:
- `userId` (string, required): The paravet user's ID

**Response Format**:
```json
{
  "success": true,
  "data": {
    "totalPatients": 24,
    "upcomingAppointments": 8,
    "completedVaccinations": 12,
    "totalEarnings": 15000,
    "onboardingStatus": "approved",
    "recentActivities": [
      {
        "title": "Emergency Case",
        "description": "Golden Retriever",
        "time": "30 mins ago",
        "color": "#FF3B30"
      },
      {
        "title": "Vaccination Completed",
        "description": "Siamese Cat",
        "time": "2 hours ago",
        "color": "#34C759"
      },
      {
        "title": "Post-Op Checkup",
        "description": "German Shepherd",
        "time": "Yesterday",
        "color": "#5856D6"
      }
    ]
  }
}
```

## Backend Implementation Example (Node.js/Express)

```javascript
// Route: GET /api/paravet/dashboard/:userId
router.get('/paravet/dashboard/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch paravet data from database
    const paravet = await Paravet.findById(userId);
    
    if (!paravet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Paravet not found' 
      });
    }
    
    // Get stats
    const totalPatients = await Patient.countDocuments({ paravetId: userId });
    const upcomingAppointments = await Appointment.countDocuments({ 
      paravetId: userId, 
      status: 'scheduled',
      date: { $gte: new Date() }
    });
    const completedVaccinations = await Vaccination.countDocuments({ 
      paravetId: userId,
      status: 'completed'
    });
    
    // Calculate earnings
    const earnings = await Payment.aggregate([
      { $match: { paravetId: userId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalEarnings = earnings[0]?.total || 0;
    
    // Get recent activities
    const recentActivities = await Activity.find({ paravetId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title description time color');
    
    res.json({
      success: true,
      data: {
        totalPatients,
        upcomingAppointments,
        completedVaccinations,
        totalEarnings,
        onboardingStatus: paravet.onboardingStatus,
        recentActivities
      }
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard data' 
    });
  }
});
```

## Frontend Features

### 1. Dynamic Stats Cards
- **Total Patients**: Shows count of patients assigned to paravet
- **Upcoming Appointments**: Shows scheduled appointments
- **Completed Vaccinations**: Shows vaccination count
- **Total Earnings**: Shows earnings in rupees

### 2. Onboarding Banner
- Only shows when `onboardingStatus === 'pending'`
- Hides after onboarding is approved
- Navigates to onboarding flow

### 3. Recent Activities
- Displays last 5 activities
- Shows empty state if no activities
- Dynamic colors based on activity type

### 4. Pull to Refresh
- Swipe down to refresh dashboard data
- Shows loading indicator
- Fetches latest data from backend

### 5. Loading State
- Shows spinner while fetching initial data
- Prevents UI flicker

## Data Flow

```
Component Mount
  └─ useEffect()
      └─ fetchDashboardData()
          ├─ Get userId & token from AsyncStorage
          ├─ Call API: GET /api/paravet/dashboard/:userId
          ├─ Update dashboardData state
          └─ Hide loading

User Pull to Refresh
  └─ onRefresh()
      └─ fetchDashboardData()
          └─ Update data
```

## Environment Variables

Add to `.env` file:
```
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
```

## Testing Without Backend

The component gracefully handles API failures:
- Shows 0 for all stats if API fails
- Shows empty state for activities
- Logs errors to console
- Doesn't crash the app

## Next Steps for Backend Team

1. Create the `/api/paravet/dashboard/:userId` endpoint
2. Implement authentication middleware
3. Set up database queries for stats
4. Return data in the specified format
5. Enable CORS for the frontend domain
6. Test with Postman/Thunder Client

## Status: ✅ READY FOR BACKEND CONNECTION

The frontend is fully implemented and ready to connect to the backend API!
