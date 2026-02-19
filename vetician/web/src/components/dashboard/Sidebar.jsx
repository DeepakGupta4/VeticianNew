import { UserCheck, UserX, Users, Crown, Home, Shield, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ activeCategory, setActiveCategory, getCategoryStats }) => {
  const { user, logout } = useAuth();

  const categories = [
    {
      id: "verified-veterinary",
      name: "Verified Veterinary",
      icon: UserCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "unverified-veterinary",
      name: "Unverified Veterinary",
      icon: UserX,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "verified-clinic",
      name: "Verified Clinic",
      icon: Users,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "unverified-clinic",
      name: "Unverified Clinic",
      icon: Users,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "verified-pet-resort",
      name: "Verified Pet Resort",
      icon: Home,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "unverified-pet-resort",
      name: "Unverified Pet Resort",
      icon: Home,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <div className="w-80 bg-gray-800/50 border-r border-gray-700/50 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Admin Panel</h1>
            <p className="text-gray-400 text-sm">Call App Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          const count = getCategoryStats(category.id);

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? `${category.bgColor} ${category.borderColor} border`
                  : "hover:bg-gray-700/30"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? category.color : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isActive ? "text-white" : "text-gray-300"
                  }`}
                >
                  {category.name}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  isActive ? category.color : "text-gray-500"
                } ${isActive ? category.bgColor : "bg-gray-700/50"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">{user?.username || 'Admin'}</p>
            <p className="text-gray-400 text-sm">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-2 p-2 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Settings</span>
          </button>
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center space-x-2 p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;