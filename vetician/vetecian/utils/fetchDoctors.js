// Simple test to check if we can get veterinarians from existing routes
// Let's try using existing user routes to get veterinarian users

const fetchRealDoctors = async () => {
  try {
    // Try to get users with role veterinarian
    const response = await fetch('https://vetician-backend-kovk.onrender.com/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Users API Response:', data);
      
      // Filter for veterinarians
      const vets = data.users?.filter(user => 
        user.role === 'veterinarian' || 
        user.userType === 'veterinarian' ||
        user.accountType === 'veterinarian'
      );
      
      return vets || [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
  
  return [];
};

// Export for use in VideoCall component
export { fetchRealDoctors };