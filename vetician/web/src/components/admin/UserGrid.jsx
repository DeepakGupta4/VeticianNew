// src/components/admin/UserGrid.jsx
import React from 'react';
import { Users } from 'lucide-react';
import UserCard from './UserCard';

const UserGrid = ({ users, toggleUserPermission, searchTerm, activeCategory, categoryCounts }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          No users found
        </h3>
        <p className="text-gray-500">
          {searchTerm
            ? "Try adjusting your search terms"
            : "No users in this category yet"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            Showing {users.length} of {categoryCounts[activeCategory]} users
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            toggleUserPermission={toggleUserPermission}
          />
        ))}
      </div>
    </div>
  );
};

export default UserGrid;