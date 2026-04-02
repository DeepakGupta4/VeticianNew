import { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔵 Login attempt:', { email: credentials.email });
      
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();
      console.log('📡 Login response:', data);

      if (response.ok && data.success) {
        const userData = data.data.user || data.user;
        const authToken = data.data.token || data.token;
        
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('✅ Login successful');
        return { success: true, data: { user: userData, token: authToken } };
      } else {
        console.log('❌ Login failed:', data.message);
        return { success: false, error: data.message || 'Invalid credentials. Please check your email and password.' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };

  const register = async (userData) => {
    try {
      console.log('🔵 Registration attempt:', { email: userData.email, username: userData.username });
      
      const response = await fetch(`${API_BASE_URL}/auth/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await response.json();
      console.log('📡 Registration response:', data);

      if (response.ok && data.success) {
        console.log('✅ Registration successful');
        return { success: true, data: data.data || data };
      } else {
        console.log('❌ Registration failed:', data.message);
        return { success: false, error: data.message || 'Registration failed. Please try again.' };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};