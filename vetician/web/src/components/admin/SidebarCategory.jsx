// src/components/admin/SidebarCategory.jsx
import React from 'react';

const SidebarCategory = ({ category, isActive, count, onClick }) => {
  const Icon = category.icon;
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
        isActive
          ? `${category.bgColor} ${category.borderColor} border`
          : 'hover:bg-gray-700/30'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon
          className={`w-5 h-5 ${
            isActive ? category.color : 'text-gray-400'
          }`}
        />
        <span
          className={`font-medium ${
            isActive ? 'text-white' : 'text-gray-300'
          }`}
        >
          {category.name}
        </span>
      </div>
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          isActive ? category.color : 'text-gray-500'
        } ${isActive ? category.bgColor : 'bg-gray-700/50'}`}
      >
        {count}
      </span>
    </button>
  );
};

export default SidebarCategory;