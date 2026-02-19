import { useState, useEffect } from 'react';
import { UserCheck, Mail, MapPin, Stethoscope, Clock, CheckCircle, FileText, X, Image as ImageIcon } from 'lucide-react';
import apiService from '../../../services/api';

const VerifiedVeterinarians = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    specialization: '',
  });
  const [selectedVet, setSelectedVet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchVeterinarians();
  }, [filters]);

  const fetchVeterinarians = async () => {
    try {
      setLoading(true);
      const response = await apiService.getVerifiedVeterinarians(filters);
      setVeterinarians(response.veterinarians || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openVetModal = (veterinarian) => {
    setSelectedVet(veterinarian);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVet(null);
  };

  const VeterinarianCard = ({ veterinarian }) => (
    <div
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200 hover:border-gray-600/50 group cursor-pointer"
      onClick={() => openVetModal(veterinarian)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {veterinarian.profilePhotoUrl?.value ? (
            <img
              src={veterinarian.profilePhotoUrl.value}
              alt={veterinarian.name?.value}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-lg">
              {veterinarian.name?.value?.charAt(0)?.toUpperCase() || 'V'}
            </div>
          )}
          <div>
            <h3 className="text-white font-semibold text-lg group-hover:text-emerald-400 transition-colors">
              {veterinarian.title?.value} {veterinarian.name?.value}
            </h3>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Mail className="w-3 h-3" />
              <span>{veterinarian.email || 'Email not provided'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">{veterinarian.specialization?.value}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">{veterinarian.city?.value}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">{veterinarian.experience?.value}+ years</span>
          </div>
          <div className="text-gray-400 text-xs">
            Joined: {new Date(veterinarian.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-3">
        <p className="text-gray-300 text-sm">
          <strong>Qualification:</strong> {veterinarian.qualification?.value}
        </p>
        <p className="text-gray-300 text-sm mt-1">
          <strong>Registration:</strong> {veterinarian.registration?.value}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by City
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              placeholder="Enter city name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Specialization
            </label>
            <select
              value={filters.specialization}
              onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Specializations</option>
              <option value="Veterinarian">Veterinarian</option>
              <option value="Vetician">Vetician</option>
              <option value="Surgeon">Surgeon</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <UserCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-emerald-400 font-semibold">
              {veterinarians.length} Verified Veterinarians
            </p>
            <p className="text-gray-400 text-sm">
              All veterinarians have been verified and approved
            </p>
          </div>
        </div>
      </div>

      {/* Veterinarians Grid */}
      {veterinarians.length === 0 ? (
        <div className="text-center py-12">
          <UserCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No verified veterinarians found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {veterinarians.map((veterinarian) => (
            <VeterinarianCard key={veterinarian._id} veterinarian={veterinarian} />
          ))}
        </div>
      )}

      {/* Veterinarian Details Modal */}
      {isModalOpen && selectedVet && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Veterinarian Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0 group relative">
                  {selectedVet.profilePhotoUrl?.value ? (
                    <>
                      <img
                        src={selectedVet.profilePhotoUrl.value}
                        alt={selectedVet.name?.value}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-600 cursor-pointer"
                      />
                      <a
                        href={selectedVet.profilePhotoUrl.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                      >
                        <ImageIcon className="w-5 h-5 text-white" />
                      </a>
                    </>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-2xl">
                      {selectedVet.name?.value?.charAt(0)?.toUpperCase() || 'V'}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedVet.title?.value} {selectedVet.name?.value}
                  </h3>
                  <p className="text-gray-400 text-sm">{selectedVet.email}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 mr-1 text-emerald-400" />
                    <span>Verified Veterinarian</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Gender</p>
                      <p className="text-sm text-white">{selectedVet.gender?.value || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-sm text-white">{selectedVet.city?.value || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Member Since</p>
                      <p className="text-sm text-white">
                        {new Date(selectedVet.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Professional Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Specialization</p>
                      <p className="text-sm text-white">{selectedVet.specialization?.value || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Experience</p>
                      <p className="text-sm text-white">
                        {selectedVet.experience?.value || '0'} years
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Documents</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Registration Number</p>
                    <div className='ml-2 flex gap-3 items-center'>
                      <p className="text-sm text-white">{selectedVet.registration?.value || 'Not provided'}</p>
                      {selectedVet.registrationUrl?.value && (
                        <a
                          href={selectedVet.registrationUrl.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Qualification Proof</p>
                    <div className='ml-2 flex gap-3 items-center'>
                      <p className="text-sm text-white">{selectedVet.qualification?.value || 'Not specified'}</p>
                      {selectedVet.qualificationUrl?.value && (
                        <a
                          href={selectedVet.qualificationUrl.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Identity Proof</p>
                    <div className='ml-2 flex gap-3 items-center'>
                      <p className="text-sm text-white">{selectedVet.identityProof.value}</p>
                      {selectedVet.identityProofUrl?.value && (
                        <a
                          href={selectedVet.identityProofUrl.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                        </a>
                      )}

                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifiedVeterinarians;