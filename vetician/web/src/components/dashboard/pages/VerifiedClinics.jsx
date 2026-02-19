import { useState, useEffect } from 'react';
import { Users, Mail, MapPin, Building, Clock, CheckCircle, Calendar, X, Phone, FileText, Image as ImageIcon } from 'lucide-react';
import apiService from '../../../services/api';

const VerifiedClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    establishmentType: '',
    locality: '',
  });
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchClinics();
  }, [filters]);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      
      const response = await apiService.getVerifiedClinics(filters);
      setClinics(response.clinics || []);
      console.log(selectedClinic)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openClinicModal = (clinic) => {
    setSelectedClinic(clinic);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClinic(null);
  };

  const ClinicCard = ({ clinic }) => (
    <div
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/70 transition-all duration-200 hover:border-gray-600/50 group cursor-pointer"
      onClick={() => openClinicModal(clinic)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {clinic.clinicName?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div>
            <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
              {clinic.clinicName}
            </h3>
            <div className="flex items-center space-x-1 text-gray-400 text-xs">
              <Building className="w-3 h-3" />
              <span>{clinic.establishmentType}</span>
            </div>
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
          <span>{clinic.locality}, {clinic.city}</span>
        </div>
        {clinic.veterinarian && (
          <div className="flex items-center space-x-2 text-gray-300 text-sm">
            <span className="text-xs bg-gray-700/50 px-2 py-0.5 rounded">
              Dr. {clinic.veterinarian.name.split(' ')[0]}
            </span>
            <span className="text-xs text-gray-400">
              {clinic.veterinarian.specialization}
            </span>
          </div>
        )}
      </div>

      {clinic.timings && (
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          {Object.values(clinic.timings).find(t => t?.start)?.start || '--'} - {Object.values(clinic.timings).find(t => t?.end)?.end || '--'}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
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
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter city name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Establishment Type
            </label>
            <select
              value={filters.establishmentType}
              onChange={(e) => setFilters(prev => ({ ...prev, establishmentType: e.target.value }))}
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="Owner of establishment">Owner of establishment</option>
              <option value="Consultant doctor">Consultant doctor</option>
              <option value="Rented at other establishment">Rented at other establishment</option>
              <option value="Practicing at home">Practicing at home</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Locality
            </label>
            <input
              type="text"
              value={filters.locality}
              onChange={(e) => setFilters(prev => ({ ...prev, locality: e.target.value }))}
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter locality"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-blue-400 font-semibold">
              {clinics.length} Verified Clinics
            </p>
            <p className="text-gray-400 text-sm">
              All clinics have been verified and approved
            </p>
          </div>
        </div>
      </div>

      {/* Clinics Grid */}
      {clinics.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No verified clinics found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinics.map((clinic) => (
            <ClinicCard key={clinic._id} clinic={clinic} />
          ))}
        </div>
      )}

      {/* Clinic Details Modal */}
      {isModalOpen && selectedClinic && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Clinic Details
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
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl">
                    {selectedClinic.clinicName?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedClinic.clinicName}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 mr-1 text-emerald-400" />
                    <span>Verified Clinic</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Basic Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Establishment Type</p>
                      <p className="text-sm text-white">{selectedClinic.establishmentType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-sm text-white">
                        {selectedClinic.locality}, {selectedClinic.city}
                      </p>
                    </div>
                    {selectedClinic.streetAddress && (
                      <div>
                        <p className="text-xs text-gray-400">Address</p>
                        <p className="text-sm text-white">{selectedClinic.streetAddress}</p>
                      </div>
                    )}
                    {selectedClinic.clinicNumber && (
                      <div>
                        <p className="text-xs text-gray-400">Contact</p>
                        <div className="flex items-center text-sm text-white">
                          <Phone className="w-4 h-4 mr-1" />
                          {selectedClinic.clinicNumber}
                        </div>
                      </div>
                    )}
                    {selectedClinic.fees && (
                      <div>
                        <p className="text-xs text-gray-400">Consultation Fees</p>
                        <p className="text-sm text-white">₹{selectedClinic.fees}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Verification Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Verified On</p>
                      <p className="text-sm text-white">
                        {new Date(selectedClinic.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedClinic.registrationNumber && (
                      <div>
                        <p className="text-xs text-gray-400">Registration Number</p>
                        <p className="text-sm text-white">{selectedClinic.registrationNumber}</p>
                      </div>
                    )}
                    {selectedClinic.registrationDocument && (
                      <div>
                        <p className="text-xs text-gray-400">Registration Document</p>
                        <a
                          href={selectedClinic.registrationDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Veterinarian Info */}
              {selectedClinic.veterinarian && (
                <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Primary Veterinarian</h4>
                  <div className="flex items-center space-x-3">
                    {selectedClinic.veterinarian.profilePhotoUrl ? (
                      <div className="group relative">
                        <img
                          src={selectedClinic.veterinarian.profilePhotoUrl}
                          alt={selectedClinic.veterinarian.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-600"
                        />
                        <a
                          href={selectedClinic.veterinarian.profilePhotoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                        >
                          <ImageIcon className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                        {selectedClinic.veterinarian.name?.charAt(0)?.toUpperCase() || 'V'}
                      </div>
                    )}
                    <div>
                      <p className="text-white text-sm font-medium">
                        {selectedClinic.veterinarian.title} {selectedClinic.veterinarian.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {selectedClinic.veterinarian.specialization} • {selectedClinic.veterinarian.experience}+ years
                      </p>
                      {selectedClinic.veterinarian.qualification && (
                        <p className="text-gray-400 text-xs mt-1">
                          {selectedClinic.veterinarian.qualification}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Timings */}
              {selectedClinic.timings && (
                <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Operating Hours</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Object.entries(selectedClinic.timings).map(([day, timing]) => (
                      timing?.start && timing?.end && (
                        <div key={day} className="flex justify-between items-center">
                          <span className="text-gray-400 capitalize">{day}:</span>
                          <span className="text-white">
                            {timing.start} - {timing.end}
                            {timing.type && (
                              <span className="ml-2 text-blue-400 text-xs">({timing.type})</span>
                            )}
                          </span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
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

export default VerifiedClinics;