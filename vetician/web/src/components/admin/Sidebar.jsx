// src/components/admin/Sidebar.jsx
import React from 'react';
import { Shield, Settings, LogOut } from 'lucide-react';
import { categories } from '../../constants/adminCategories';
import SidebarCategory from './SidebarCategory';

const Sidebar = ({ activeCategory, setActiveCategory, setSearchTerm, user, logout, getCategoryStats }) => {
  return (
    <div className="w-80 bg-gray-800/50 border-r border-gray-700/50 backdrop-blur-sm flex flex-col h-screen">
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

      <nav className="p-4 space-y-2 flex-1">
        {categories.map((category) => (
          <SidebarCategory
            key={category.id}
            category={category}
            isActive={activeCategory === category.id}
            count={getCategoryStats(category.id)}
            onClick={() => {
              setActiveCategory(category.id);
              setSearchTerm("");
            }}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">{user?.username}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
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