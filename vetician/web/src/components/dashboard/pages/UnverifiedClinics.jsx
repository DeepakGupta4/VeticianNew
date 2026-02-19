import { useState, useEffect } from 'react';
import { Crown, MapPin, Building, Clock, CheckCircle, AlertCircle, X, FileText, Image as ImageIcon, Phone, User, Mail } from 'lucide-react';
import apiService from '../../../services/api';

const UnverifiedClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUnverifiedClinics();
      setClinics(response.clinics || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClinic = async (clinicId) => {
    try {
      setVerifying(clinicId);
      await apiService.verifyClinic(clinicId);
      setClinics(prevClinics => prevClinics.filter(clinic => clinic._id !== clinicId));
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(null);
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

  const ClinicCard = ({ clinic }) => {
    const verifiedFields = [
      'clinicName',
      'establishmentType',
      'city',
      'locality',
      'streetAddress',
      'clinicNumber',
      'fees',
      'ownerProof',
      'registrationDocument'
    ].filter(field => clinic[field] && (field === 'ownerProof' || field === 'registrationDocument' ? true : clinic[field]));

    const progressPercentage = (verifiedFields.length / 9) * 100;

    return (
      <div 
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/70 transition-all duration-200 hover:border-gray-600/50 cursor-pointer"
        onClick={() => openClinicModal(clinic)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white font-semibold">
              {clinic.clinicName?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div>
              <h3 className="text-white font-medium">
                {clinic.clinicName}
              </h3>
              <div className="flex items-center space-x-1 text-gray-400 text-xs">
                <Building className="w-3 h-3" />
                <span>{clinic.establishmentType}</span>
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
            <span className="text-xs text-gray-300">{verifiedFields.length}/9</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
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

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {Object.values(clinic.timings || {}).find(t => t?.start)?.start || '--'} - {Object.values(clinic.timings || {}).find(t => t?.end)?.end || '--'}
          </div>
          <div className="text-xs">
            Applied: {new Date(clinic.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
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
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Crown className="w-6 h-6 text-yellow-400" />
          <div>
            <p className="text-yellow-400 font-semibold">
              {clinics.length} Unverified Clinics
            </p>
            <p className="text-gray-400 text-sm">
              Clinics pending verification and approval
            </p>
          </div>
        </div>
      </div>

      {/* Clinics Grid */}
      {clinics.length === 0 ? (
        <div className="text-center py-12">
          <Crown className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No unverified clinics found
          </h3>
          <p className="text-gray-500">
            All clinics have been verified
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinics.map((clinic) => (
            <ClinicCard key={clinic._id} clinic={clinic} />
          ))}
        </div>
      )}

      {/* Clinic Verification Modal */}
      {isModalOpen && selectedClinic && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Verify Clinic Details
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
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white font-semibold text-2xl">
                    {selectedClinic.clinicName?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedClinic.clinicName}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <AlertCircle className="w-4 h-4 mr-1 text-orange-400" />
                    <span>Pending Verification</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Clinic Information</h4>
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
                        <p className="text-xs text-gray-400">Proposed Fees</p>
                        <p className="text-sm text-white">₹{selectedClinic.fees}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Documents</h4>
                  <div className="space-y-3">
                    {selectedClinic.ownerProof && (
                      <div>
                        <p className="text-xs text-gray-400">Owner Proof</p>
                        <a
                          href={selectedClinic.ownerProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View Owner Proof
                        </a>
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
                          View Registration
                        </a>
                      </div>
                    )}
                    {selectedClinic.additionalDocuments && selectedClinic.additionalDocuments.map((doc, index) => (
                      <div key={index}>
                        <p className="text-xs text-gray-400">Additional Document {index + 1}</p>
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View Document
                        </a>
                      </div>
                    ))}
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
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          selectedClinic.veterinarian.isVerified 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {selectedClinic.veterinarian.isVerified ? 'Verified Vet' : 'Unverified Vet'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timings */}
              {selectedClinic.timings && (
                <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Proposed Operating Hours</h4>
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

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerifyClinic(selectedClinic._id)}
                  disabled={verifying === selectedClinic._id}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {verifying === selectedClinic._id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Verify Clinic</span>
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

export default UnverifiedClinics;