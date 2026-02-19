import { Search, Filter } from 'lucide-react';

const DashboardHeader = ({ activeCategory, categories, searchTerm, setSearchTerm, filteredCount, totalCount }) => {
  const currentCategory = categories.find(cat => cat.id === activeCategory);

  return (
    <header className="bg-gray-800/30 border-b border-gray-700/50 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {currentCategory?.name}
            </h2>
            <p className="text-gray-400">
              Manage and monitor {currentCategory?.name.toLowerCase()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Results Count */}
        <div className="mt-4">
          <p className="text-gray-400">
            Showing {filteredCount} of {totalCount} items
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;