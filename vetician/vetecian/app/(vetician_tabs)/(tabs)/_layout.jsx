import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

function CustomTabBar({ state, descriptors, navigation }) {
  const router = useRouter();

  const visibleTabs = ['index', 'doorstep', 'pet'];
  const visibleRoutes = state.routes.filter(r => visibleTabs.includes(r.name));

  const getTabConfig = (name, isFocused) => {
    switch (name) {
      case 'index':
        return { icon: isFocused ? 'home' : 'home-outline', label: 'Home' };
      case 'doorstep':
        return { icon: isFocused ? 'car' : 'car-outline', label: 'Doorstep' };
      case 'pet':
        return { icon: isFocused ? 'paw' : 'paw-outline', label: 'Pet Profile' };
      default:
        return { icon: 'ellipse-outline', label: name };
    }
  };

  const renderTab = (route) => {
    const isFocused = state.routes[state.index]?.name === route.name;
    const { icon, label } = getTabConfig(route.name, isFocused);
    return (
      <TouchableOpacity
        key={route.key}
        style={styles.tabItem}
        onPress={() => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        }}
      >
        <Ionicons name={icon} size={24} color={isFocused ? '#4E8D7C' : '#999'} />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.sosButton}
        onPress={() => router.push('/(vetician_tabs)/pages/DoorStep')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="alarm-light" size={34} color="#fff" />
        <Text style={styles.sosLabel}>SOS</Text>
      </TouchableOpacity>
      <View style={styles.tabBar}>
        {visibleRoutes.slice(0, 2).map(renderTab)}
        <View style={styles.sosPlaceholder} />
        {visibleRoutes.slice(2).map(renderTab)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 72,
    paddingHorizontal: 8,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 3,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#4E8D7C',
    fontWeight: '700',
  },
  sosPlaceholder: {
    flex: 1,
  },
  sosButton: {
    position: 'absolute',
    bottom: 44,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 16,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    borderWidth: 4,
    borderColor: '#fff',
    zIndex: 200,
  },
  sosLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 2,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        tabBarButton: () => null,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="doorstep" />
      <Tabs.Screen name="pet" />

      <Tabs.Screen name="../pages/ClinicListScreen" options={{ href: null }} />
      <Tabs.Screen name="../pages/ClinicDetailScreen" options={{ href: null }} />
      <Tabs.Screen name="../pages/PetList" options={{ href: null }} />
      <Tabs.Screen name="../pages/BookScreen" options={{ href: null }} />
      <Tabs.Screen name="../pages/VideoConsultation" options={{ href: null }} />
      <Tabs.Screen name="../pages/Hostel" options={{ href: null }} />
    </Tabs>
  );
}
