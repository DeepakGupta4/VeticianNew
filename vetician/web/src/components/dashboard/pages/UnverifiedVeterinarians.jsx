import { useState, useEffect } from 'react';
import { UserX, Mail, MapPin, Stethoscope, Clock, CheckCircle, AlertCircle, Eye, FileText, Image as ImageIcon } from 'lucide-react';
import apiService from '../../../services/api';

const UnverifiedVeterinarians = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifyingField, setVerifyingField] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const fetchVeterinarians = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUnverifiedVeterinarians();
      setVeterinarians(response.veterinarians || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyField = async (veterinarianId, fieldName) => {
    try {
      setVerifyingField(`${veterinarianId}-${fieldName}`);
      await apiService.verifyVeterinarianField(veterinarianId, fieldName);
      
      // Update the local state
      setVeterinarians(prevVets => 
        prevVets.map(vet => 
          vet._id === veterinarianId 
            ? {
                ...vet,
                [fieldName]: { ...vet[fieldName], verified: true },
                // Check if this was the last field to verify
                isVerified: Object.keys(vet).every(key => 
                  !['name', 'title', 'gender', 'city', 'experience', 'specialization', 
                    'qualification', 'registration', 'identityProof', 'profilePhotoUrl',
                    'qualificationUrl', 'registrationUrl', 'identityProofUrl'].includes(key) ||
                  (key === fieldName ? true : vet[key]?.verified)
                )
              }
            : vet
        ).filter(vet => !vet.isVerified) // Remove from unverified list if fully verified
      );

      // Also update the selected vet in modal if it's the same one
      if (selectedVet && selectedVet._id === veterinarianId) {
        setSelectedVet(prev => ({
          ...prev,
          [fieldName]: { ...prev[fieldName], verified: true },
          isVerified: Object.keys(prev).every(key => 
            !['name', 'title', 'gender', 'city', 'experience', 'specialization', 
              'qualification', 'registration', 'identityProof', 'profilePhotoUrl',
              'qualificationUrl', 'registrationUrl', 'identityProofUrl'].includes(key) ||
            (key === fieldName ? true : prev[key]?.verified)
          )
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifyingField(null);
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

  const VerificationField = ({ label, value, isVerified, isVerifying, onVerify, isUrl = false }) => {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-300">
              {label}
            </span>
            {isVerified && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          </div>
          <div className="flex items-center space-x-2">
            {isUrl && value ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
              >
                {label.includes('Photo') ? <ImageIcon className="w-4 h-4 mr-1" /> : <FileText className="w-4 h-4 mr-1" />}
                View Document
              </a>
            ) : (
              <span className="text-sm text-gray-400">{value || 'Not provided'}</span>
            )}
          </div>
        </div>
        {!isVerified && (
          <button
            onClick={onVerify}
            disabled={isVerifying}
            className="ml-3 px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
        )}
      </div>
    );
  };

  const VeterinarianCard = ({ veterinarian }) => {
    const verifiedFields = [
      'name', 'title', 'gender', 'city', 'experience', 'specialization',
      'qualification', 'registration', 'identityProof', 'profilePhotoUrl',
      'qualificationUrl', 'registrationUrl', 'identityProofUrl'
    ].filter(field => veterinarian[field]?.verified);

    const totalFields = 12; // Total fields to verify
    const progressPercentage = (verifiedFields.length / totalFields) * 100;

    return (
      <div 
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/70 transition-all duration-200 hover:border-gray-600/50 cursor-pointer"
        onClick={() => openVetModal(veterinarian)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {veterinarian.profilePhotoUrl?.value ? (
              <img
                src={veterinarian.profilePhotoUrl.value}
                alt={veterinarian.name?.value}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-semibold">
                {veterinarian.name?.value?.charAt(0)?.toUpperCase() || 'V'}
              </div>
            )}
            <div>
              <h3 className="text-white font-medium">
                {veterinarian.title?.value} {veterinarian.name?.value}
              </h3>
              <div className="flex items-center space-x-1 text-gray-400 text-xs">
                <MapPin className="w-3 h-3" />
                <span>{veterinarian.city?.value || 'Location not provided'}</span>
              </div>
            </div>
          </div>
          <div className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full">
            {verifiedFields.length}/{totalFields}
          </div>
        </div>

        <div className="mt-3 w-full bg-gray-700/50 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
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
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <UserX className="w-6 h-6 text-orange-400" />
          <div>
            <p className="text-orange-400 font-semibold">
              {veterinarians.length} Unverified Veterinarians
            </p>
            <p className="text-gray-400 text-sm">
              Veterinarians pending verification and approval
            </p>
          </div>
        </div>
      </div>

      {/* Veterinarians Grid */}
      {veterinarians.length === 0 ? (
        <div className="text-center py-12">
          <UserX className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No unverified veterinarians found
          </h3>
          <p className="text-gray-500">
            All veterinarians have been verified
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {veterinarians.map((veterinarian) => (
            <VeterinarianCard key={veterinarian._id} veterinarian={veterinarian} />
          ))}
        </div>
      )}

      {/* Verification Modal */}
      {isModalOpen && selectedVet && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Verify Veterinarian Details
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0">
                  {selectedVet.profilePhotoUrl?.value ? (
                    <img
                      src={selectedVet.profilePhotoUrl.value}
                      alt={selectedVet.name?.value}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-semibold text-2xl">
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
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{selectedVet.city?.value || 'Location not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <VerificationField
                  label="Title"
                  value={selectedVet.title?.value}
                  isVerified={selectedVet.title?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-title`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'title')}
                />
                <VerificationField
                  label="Full Name"
                  value={selectedVet.name?.value}
                  isVerified={selectedVet.name?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-name`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'name')}
                />
                <VerificationField
                  label="Gender"
                  value={selectedVet.gender?.value}
                  isVerified={selectedVet.gender?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-gender`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'gender')}
                />
                <VerificationField
                  label="City"
                  value={selectedVet.city?.value}
                  isVerified={selectedVet.city?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-city`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'city')}
                />
                <VerificationField
                  label="Experience (years)"
                  value={selectedVet.experience?.value}
                  isVerified={selectedVet.experience?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-experience`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'experience')}
                />
                <VerificationField
                  label="Specialization"
                  value={selectedVet.specialization?.value}
                  isVerified={selectedVet.specialization?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-specialization`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'specialization')}
                />
              </div>

              <h4 className="text-md font-semibold text-white mb-3">Documents Verification</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <VerificationField
                  label="Qualification"
                  value={selectedVet.qualification?.value}
                  isVerified={selectedVet.qualification?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-qualification`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'qualification')}
                />
                <VerificationField
                  label="Qualification Document"
                  value={selectedVet.qualificationUrl?.value}
                  isVerified={selectedVet.qualificationUrl?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-qualificationUrl`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'qualificationUrl')}
                  isUrl={true}
                />
                <VerificationField
                  label="Registration Number"
                  value={selectedVet.registration?.value}
                  isVerified={selectedVet.registration?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-registration`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'registration')}
                />
                <VerificationField
                  label="Registration Document"
                  value={selectedVet.registrationUrl?.value}
                  isVerified={selectedVet.registrationUrl?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-registrationUrl`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'registrationUrl')}
                  isUrl={true}
                />
                <VerificationField
                  label="Identity Proof"
                  value={selectedVet.identityProof?.value}
                  isVerified={selectedVet.identityProof?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-identityProof`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'identityProof')}
                />
                <VerificationField
                  label="Identity Proof Document"
                  value={selectedVet.identityProofUrl?.value}
                  isVerified={selectedVet.identityProofUrl?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-identityProofUrl`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'identityProofUrl')}
                  isUrl={true}
                />
                <VerificationField
                  label="Profile Photo"
                  value={selectedVet.profilePhotoUrl?.value}
                  isVerified={selectedVet.profilePhotoUrl?.verified}
                  isVerifying={verifyingField === `${selectedVet._id}-profilePhotoUrl`}
                  onVerify={() => handleVerifyField(selectedVet._id, 'profilePhotoUrl')}
                  isUrl={true}
                />
              </div>

              {/* <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
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

export default UnverifiedVeterinarians;