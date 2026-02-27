import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';

export default function Home() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/signin" />;
  }
  
  const role = user?.role || 'vetician';
  
  switch(role) {
    case 'veterinarian':
      return <Redirect href="/(doc_tabs)/(tabs)" />;
    case 'pet_resort':
      return <Redirect href="/(pet_resort_tabs)" />;
    case 'paravet':
      return <Redirect href="/(peravet_tabs)/(tabs)" />;
    default:
      return <Redirect href="/(vetician_tabs)" />;
  }
}
