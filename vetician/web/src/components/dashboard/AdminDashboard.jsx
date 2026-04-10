import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import VerifiedVeterinarians from './pages/VerifiedVeterinarians';
import UnverifiedVeterinarians from './pages/UnverifiedVeterinarians';
import VerifiedClinics from './pages/VerifiedClinics';
import UnverifiedClinics from './pages/UnverifiedClinics';
import VerifiedPetResorts from './pages/VerifiedPetResorts';
import UnverifiedPetResorts from './pages/UnverifiedPetResorts';
import UnverifiedParavets from './pages/UnverifiedParavets';
import GroomingBookings from './pages/GroomingBookings';
import SupportEnquiries from './pages/SupportEnquiries';
import apiService from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("verified-veterinary");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    verifiedVets: 0,
    unverifiedVets: 0,
    verifiedClinics: 0,
    unverifiedClinics: 0,
    verifiedPetResorts: 0,
    unverifiedPetResorts: 0,
    unverifiedParavets: 0,
    groomingBookings: 0,
    supportEnquiries: 0,
  });

  // Categories configuration
  const categories = [
    {
      id: "verified-veterinary",
      name: "Verified Veterinary",
      icon: "UserCheck",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "unverified-veterinary",
      name: "Unverified Veterinary",
      icon: "UserX",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      id: "verified-clinic",
      name: "Verified Clinic",
      icon: "Users",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      id: "unverified-clinic",
      name: "Unverified Clinic",
      icon: "Crown",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      id: "verified-pet-resort",
      name: "Verified Pet Resort",
      icon: "Home",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      id: "unverified-pet-resort",
      name: "Unverified Pet Resort",
      icon: "Home",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
    },
    {
      id: "verify-paravet",
      name: "Verify Paravet",
      icon: "UserCog",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      id: "grooming-bookings",
      name: "Grooming Bookings",
      icon: "Calendar",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      id: "support-enquiries",
      name: "Support Enquiries",
      icon: "MessageSquare",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
  ];

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        verifiedVets, 
        unverifiedVets, 
        verifiedClinics, 
        unverifiedClinics,
        verifiedPetResorts,
        unverifiedPetResorts,
        unverifiedParavets,
        groomingBookings,
        supportEnquiries
      ] = await Promise.all([
        apiService.getVerifiedVeterinarians(),
        apiService.getUnverifiedVeterinarians(),
        apiService.getVerifiedClinics(),
        apiService.getUnverifiedClinics(),
        apiService.getVerifiedPetResorts(),
        apiService.getUnverifiedPetResorts(),
        apiService.getUnverifiedParavets(),
        apiService.getAllGroomingBookings(),
        apiService.getSupportEnquiries(),
      ]);

      setStats({
        verifiedVets: verifiedVets.count || 0,
        unverifiedVets: unverifiedVets.count || 0,
        verifiedClinics: verifiedClinics.count || 0,
        unverifiedClinics: unverifiedClinics.count || 0,
        verifiedPetResorts: verifiedPetResorts.count || 0,
        unverifiedPetResorts: unverifiedPetResorts.count || 0,
        unverifiedParavets: unverifiedParavets.count || 0,
        groomingBookings: groomingBookings.count || 0,
        supportEnquiries: supportEnquiries.stats?.total || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Get category stats
  const getCategoryStats = (category) => {
    switch (category) {
      case "verified-veterinary":
        return stats.verifiedVets;
      case "unverified-veterinary":
        return stats.unverifiedVets;
      case "verified-clinic":
        return stats.verifiedClinics;
      case "unverified-clinic":
        return stats.unverifiedClinics;
      case "verified-pet-resort":
        return stats.verifiedPetResorts;
      case "unverified-pet-resort":
        return stats.unverifiedPetResorts;
      case "verify-paravet":
        return stats.unverifiedParavets;
      case "grooming-bookings":
        return stats.groomingBookings;
      case "support-enquiries":
        return stats.supportEnquiries;
      default:
        return 0;
    }
  };

  // Render active component
  const renderActiveComponent = () => {
    switch (activeCategory) {
      case "verified-veterinary":
        return <VerifiedVeterinarians />;
      case "unverified-veterinary":
        return <UnverifiedVeterinarians />;
      case "verified-clinic":
        return <VerifiedClinics />;
      case "unverified-clinic":
        return <UnverifiedClinics />;
      case "verified-pet-resort":
        return <VerifiedPetResorts />;
      case "unverified-pet-resort":
        return <UnverifiedPetResorts />;
      case "verify-paravet":
        return <UnverifiedParavets />;
      case "grooming-bookings":
        return <GroomingBookings />;
      case "support-enquiries":
        return <SupportEnquiries />;
      default:
        return <VerifiedVeterinarians />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        getCategoryStats={getCategoryStats}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader 
          activeCategory={activeCategory}
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredCount={getCategoryStats(activeCategory)}
          totalCount={getCategoryStats(activeCategory)}
        />

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;