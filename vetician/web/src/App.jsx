import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthContainer from './components/auth/AuthContainer';
import AdminDashboard from './components/dashboard/AdminDashboard';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AuthContainer />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;