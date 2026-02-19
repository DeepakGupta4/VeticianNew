// src/components/admin/UserCard.jsx
import React from 'react';
import { Mail, MoreVertical, UserX, UserCheck } from 'lucide-react';

const UserCard = ({ user, toggleUserPermission }) => {
  const statusColor = user.permitted
    ? "text-emerald-400 bg-emerald-500/10"
    : "text-red-400 bg-red-500/10";
  const typeColor =
    user.userType === "premium"
      ? "text-purple-400 bg-purple-500/10"
      : "text-blue-400 bg-blue-500/10";

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200 hover:border-gray-600/50 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
              {user.username}
            </h3>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Mail className="w-3 h-3" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Status</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
            >
              {user.permitted ? "Permitted" : "Blocked"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Type</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor} capitalize`}
            >
              {user.userType}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Calls</span>
            <span className="text-white font-medium">{user.callsCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Joined</span>
            <span className="text-gray-300 text-sm">
              {new Date(user.joinDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => toggleUserPermission(user.id)}
          className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2 ${
            user.permitted
              ? "bg-red-600/20 hover:bg-red-600/30 text-red-400"
              : "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400"
          }`}
        >
          {user.permitted ? (
            <UserX className="w-4 h-4" />
          ) : (
            <UserCheck className="w-4 h-4" />
          )}
          <span>{user.permitted ? "Block User" : "Permit User"}</span>
        </button>
      </div>
    </div>
  );
};

export default UserCard;