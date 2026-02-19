import { useState, useEffect } from 'react';
import { Users, MapPin, Building, Clock, CheckCircle, X, Phone, FileText, Image as ImageIcon, Home, PawPrint, Mail } from 'lucide-react';
import apiService from '../../../services/api';

const VerifiedPetResorts = () => {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    resortType: '',
    locality: '',
  });
  const [selectedResort, setSelectedResort] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchResorts();
  }, [filters]);

  const fetchResorts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getVerifiedPetResorts(filters);
      setResorts(response.petResorts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openResortModal = (resort) => {
    setSelectedResort(resort);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResort(null);
  };

  const ResortCard = ({ resort }) => (
    <div 
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/70 transition-all duration-200 hover:border-gray-600/50 group cursor-pointer"
      onClick={() => openResortModal(resort)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {resort.logo ? (
            <img 
              src={resort.logo} 
              alt={resort.resortName} 
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-semibold">
              {resort.resortName?.charAt(0)?.toUpperCase() || 'R'}
            </div>
          )}
          <div>
            <h3 className="text-white font-medium group-hover:text-amber-400 transition-colors">
              {resort.resortName}
            </h3>
            {resort.brandName && (
              <div className="flex items-center space-x-1 text-gray-400 text-xs">
                <span>{resort.brandName}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 text-emerald-400">
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs font-medium">Verified</span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-start space-x-2 text-gray-300 text-sm">
          <MapPin className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
          <span>{resort.address}</span>
        </div>
        {resort.services && resort.services.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resort.services.slice(0, 3).map((service, index) => (
              <span key={index} className="text-xs bg-gray-700/50 px-2 py-0.5 rounded capitalize">
                {service.replace(/_/g, ' ')}
              </span>
            ))}
            {resort.services.length > 3 && (
              <span className="text-xs text-gray-400">+{resort.services.length - 3} more</span>
            )}
          </div>
        )}
      </div>

      {resort.openingHours && (
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          {resort.openingHours.find(h => !h.closed)?.open || '--'} - {resort.openingHours.find(h => !h.closed)?.close || '--'}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-800/30 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by City
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
              placeholder="Enter city name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Services
            </label>
            <select
              value={filters.resortType}
              onChange={(e) => setFilters(prev => ({ ...prev, resortType: e.target.value }))}
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">All Services</option>
              <option value="boarding">Boarding</option>
              <option value="grooming">Grooming</option>
              <option value="veterinary">Veterinary</option>
              <option value="swimming">Swimming</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Name
            </label>
            <input
              type="text"
              value={filters.locality}
              onChange={(e) => setFilters(prev => ({ ...prev, locality: e.target.value }))}
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
              placeholder="Enter resort name"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-amber-400" />
          <div>
            <p className="text-amber-400 font-semibold">
              {resorts.length} Verified Pet Resorts
            </p>
            <p className="text-gray-400 text-sm">
              All pet resorts have been verified and approved
            </p>
          </div>
        </div>
      </div>

      {/* Resorts Grid */}
      {resorts.length === 0 ? (
        <div className="text-center py-12">
          <PawPrint className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No verified pet resorts found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resorts.map((resort) => (
            <ResortCard key={resort._id} resort={resort} />
          ))}
        </div>
      )}

      {/* Resort Details Modal */}
      {isModalOpen && selectedResort && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Pet Resort Details
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0">
                  {selectedResort.logo ? (
                    <img 
                      src={selectedResort.logo} 
                      alt={selectedResort.resortName} 
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-semibold text-2xl">
                      {selectedResort.resortName?.charAt(0)?.toUpperCase() || 'R'}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedResort.resortName}
                  </h3>
                  {selectedResort.brandName && (
                    <p className="text-gray-400 text-sm">{selectedResort.brandName}</p>
                  )}
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 mr-1 text-emerald-400" />
                    <span>Verified Pet Resort</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Resort Phone</p>
                      <div className="flex items-center text-sm text-white">
                        <Phone className="w-4 h-4 mr-1" />
                        {selectedResort.resortPhone}
                      </div>
                    </div>
                    {selectedResort.ownerPhone && (
                      <div>
                        <p className="text-xs text-gray-400">Owner Phone</p>
                        <div className="flex items-center text-sm text-white">
                          <Phone className="w-4 h-4 mr-1" />
                          {selectedResort.ownerPhone}
                        </div>
                      </div>
                    )}
                    {selectedResort.user?.email && (
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <div className="flex items-center text-sm text-white">
                          <Mail className="w-4 h-4 mr-1" />
                          {selectedResort.user.email}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-400">Address</p>
                      <p className="text-sm text-white">{selectedResort.address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Services</h4>
                  {selectedResort.services && selectedResort.services.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedResort.services.map((service, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded capitalize"
                        >
                          {service.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No services listed</p>
                  )}
                </div>
              </div>

              {/* Opening Hours */}
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Opening Hours</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {selectedResort.openingHours && selectedResort.openingHours.map((day) => (
                    <div key={day._id} className="flex justify-between items-center">
                      <span className="text-gray-400">{day.day}:</span>
                      {day.closed ? (
                        <span className="text-red-400">Closed</span>
                      ) : (
                        <span className="text-white">
                          {day.open} - {day.close}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Additional Information</h4>
                <div className="space-y-3">
                  {selectedResort.notice && (
                    <div>
                      <p className="text-xs text-gray-400">Notice</p>
                      <p className="text-sm text-white">{selectedResort.notice}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400">Verified On</p>
                    <p className="text-sm text-white">
                      {new Date(selectedResort.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Owner</p>
                    <p className="text-sm text-white">
                      {selectedResort.user?.name || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifiedPetResorts;