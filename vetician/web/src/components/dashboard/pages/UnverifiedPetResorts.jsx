import { useState, useEffect } from 'react';
import { Home, MapPin, Clock, CheckCircle, AlertCircle, X, FileText, Image as ImageIcon, Phone, User, Mail } from 'lucide-react';
import apiService from '../../../services/api';

const UnverifiedPetResorts = () => {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(null);
  const [selectedResort, setSelectedResort] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchResorts();
  }, []);

  const fetchResorts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUnverifiedPetResorts();
      setResorts(response.petResorts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResort = async (resortId) => {
    try {
      setVerifying(resortId);
      await apiService.verifyPetResort(resortId);
      setResorts(prevResorts => prevResorts.filter(resort => resort._id !== resortId));
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(null);
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

  const ResortCard = ({ resort }) => {
    const verifiedFields = [
      'resortName',
      'brandName',
      'address',
      'resortPhone',
      'ownerPhone',
      'services',
      'openingHours',
      'logo'
    ].filter(field => resort[field] && (field === 'logo' ? true : resort[field]));

    const progressPercentage = (verifiedFields.length / 8) * 100;

    return (
      <div 
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/70 transition-all duration-200 hover:border-gray-600/50 cursor-pointer"
        onClick={() => openResortModal(resort)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {resort.resortName?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div>
              <h3 className="text-white font-medium">
                {resort.resortName}
              </h3>
              <div className="flex items-center space-x-1 text-gray-400 text-xs">
                <Home className="w-3 h-3" />
                <span>{resort.brandName}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-orange-400">
            <AlertCircle className="w-3 h-3" />
            <span className="text-xs font-medium">Pending</span>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Verification Progress</span>
            <span className="text-xs text-gray-300">{verifiedFields.length}/8</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-start space-x-2 text-gray-300 text-sm">
            <MapPin className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
            <span>{resort.address}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {resort.services?.map((service, index) => (
              <span key={index} className="text-xs bg-gray-700/50 px-2 py-0.5 rounded capitalize">
                {service.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {resort.openingHours?.find(day => day?.open)?.open || '--'} - {resort.openingHours?.find(day => day?.close)?.close || '--'}
          </div>
          <div className="text-xs">
            Applied: {new Date(resort.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
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
      {/* Stats */}
      <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Home className="w-6 h-6 text-pink-400" />
          <div>
            <p className="text-pink-400 font-semibold">
              {resorts.length} Unverified Pet Resorts
            </p>
            <p className="text-gray-400 text-sm">
              Pet resorts pending verification and approval
            </p>
          </div>
        </div>
      </div>

      {/* Resorts Grid */}
      {resorts.length === 0 ? (
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No unverified pet resorts found
          </h3>
          <p className="text-gray-500">
            All pet resorts have been verified
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resorts.map((resort) => (
            <ResortCard key={resort._id} resort={resort} />
          ))}
        </div>
      )}

      {/* Pet Resort Verification Modal */}
      {isModalOpen && selectedResort && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Verify Pet Resort Details
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
                      className="w-16 h-16 rounded-xl object-cover border border-gray-600"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl">
                      {selectedResort.resortName?.charAt(0)?.toUpperCase() || 'P'}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedResort.resortName}
                  </h3>
                  <p className="text-gray-400 text-sm">{selectedResort.brandName}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <AlertCircle className="w-4 h-4 mr-1 text-orange-400" />
                    <span>Pending Verification</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Basic Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Address</p>
                      <p className="text-sm text-white">{selectedResort.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Resort Phone</p>
                      <div className="flex items-center text-sm text-white">
                        <Phone className="w-4 h-4 mr-1" />
                        {selectedResort.resortPhone}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Owner Phone</p>
                      <div className="flex items-center text-sm text-white">
                        <Phone className="w-4 h-4 mr-1" />
                        {selectedResort.ownerPhone}
                      </div>
                    </div>
                    {selectedResort.notice && (
                      <div>
                        <p className="text-xs text-gray-400">Notice</p>
                        <p className="text-sm text-white">{selectedResort.notice}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Services & Documents</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Services Offered</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedResort.services?.map((service, index) => (
                          <span key={index} className="text-xs bg-gray-700 px-2 py-0.5 rounded capitalize">
                            {service.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedResort.logo && (
                      <div>
                        <p className="text-xs text-gray-400">Logo</p>
                        <a
                          href={selectedResort.logo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                        >
                          <ImageIcon className="w-4 h-4 mr-1" />
                          View Logo
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              {selectedResort.openingHours && (
                <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Operating Hours</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {selectedResort.openingHours.map((day, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-400 capitalize">{day.day}:</span>
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
              )}

              {/* Owner Info */}
              {selectedResort.user && (
                <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Owner Information</h4>
                  <div className="flex items-center space-x-3">
                    {selectedResort.user.profilePhoto ? (
                      <div className="group relative">
                        <img
                          src={selectedResort.user.profilePhoto}
                          alt={selectedResort.user.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-600"
                        />
                        <a
                          href={selectedResort.user.profilePhoto}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                        >
                          <ImageIcon className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                        {selectedResort.user.name?.charAt(0)?.toUpperCase() || 'O'}
                      </div>
                    )}
                    <div>
                      <p className="text-white text-sm font-medium">
                        {selectedResort.user.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {selectedResort.user.email}
                      </p>
                      {selectedResort.user.phone && (
                        <p className="text-gray-400 text-xs mt-1">
                          <Phone className="w-3 h-3 inline mr-1" />
                          {selectedResort.user.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerifyResort(selectedResort._id)}
                  disabled={verifying === selectedResort._id}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {verifying === selectedResort._id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Verify Resort</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnverifiedPetResorts;