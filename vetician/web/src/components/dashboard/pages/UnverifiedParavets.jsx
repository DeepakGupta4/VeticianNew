import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, FileText, CheckCircle, XCircle, Eye, Calendar, Award, Shield } from 'lucide-react';
import apiService from '../../../services/api';

const UnverifiedParavets = () => {
  const [paravets, setParavets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParavet, setSelectedParavet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchParavets();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchParavets, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchParavets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUnverifiedParavets();
      if (response.success) {
        setParavets(response.paravets || []);
      }
    } catch (error) {
      console.error('Error fetching paravets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (paravetId) => {
    if (!confirm('Are you sure you want to verify this paravet?')) return;

    try {
      setActionLoading(true);
      const response = await apiService.verifyParavet(paravetId);
      if (response.success) {
        alert('Paravet verified successfully!');
        fetchParavets();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error verifying paravet:', error);
      alert('Failed to verify paravet');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (paravetId) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;

    try {
      setActionLoading(true);
      const response = await apiService.rejectParavet(paravetId, reason);
      if (response.success) {
        alert('Paravet rejected successfully!');
        fetchParavets();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error rejecting paravet:', error);
      alert('Failed to reject paravet');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Verification</p>
              <p className="text-2xl font-bold text-yellow-400">{paravets.length}</p>
            </div>
            <Shield className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Submitted Today</p>
              <p className="text-2xl font-bold text-blue-400">
                {paravets.filter(p => {
                  const today = new Date().toDateString();
                  return new Date(p.applicationStatus?.submittedAt).toDateString() === today;
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Awaiting Action</p>
              <p className="text-2xl font-bold text-orange-400">
                {paravets.filter(p => p.applicationStatus?.approvalStatus === 'under_review').length}
              </p>
            </div>
            <Award className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Paravets Grid */}
      {paravets.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-12 text-center">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Pending Applications</h3>
          <p className="text-gray-500">All paravet applications have been processed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paravets.map((paravet) => (
            <div
              key={paravet._id}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all"
            >
              {/* Profile Photo */}
              <div className="flex items-center space-x-4 mb-4">
                {paravet.documents?.profilePhoto?.url ? (
                  <img
                    src={paravet.documents.profilePhoto.url}
                    alt={paravet.personalInfo?.fullName?.value || 'Paravet'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {paravet.personalInfo?.fullName?.value?.charAt(0).toUpperCase() || 'P'}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">
                    {paravet.personalInfo?.fullName?.value || 'Unknown'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {(() => {
                      const years = paravet.experience?.yearsOfExperience?.value;
                      return typeof years === 'number' ? `${years} years experience` : '0 years experience';
                    })()}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-300">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {paravet.personalInfo?.mobileNumber?.value || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {paravet.personalInfo?.email?.value || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {paravet.personalInfo?.city?.value || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                  {Array.isArray(paravet.experience?.areasOfExpertise?.value) && paravet.experience.areasOfExpertise.value.length > 0
                    ? paravet.experience.areasOfExpertise.value.slice(0, 2).join(', ')
                    : 'N/A'}
                </div>
              </div>

              {/* Submission Date */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pb-4 border-b border-gray-700">
                <span>Submitted:</span>
                <span>{formatDate(paravet.applicationStatus?.submittedAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedParavet(paravet);
                    setShowModal(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedParavet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Paravet Application Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center text-lg">
                  <User className="w-5 h-5 mr-2 text-blue-400" />
                  Personal Information
                </h3>
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Full Name</p>
                      <p className="text-white font-medium">{selectedParavet.personalInfo?.fullName?.value || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Mobile Number</p>
                      <p className="text-white font-medium">{selectedParavet.personalInfo?.mobileNumber?.value || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-medium">{selectedParavet.personalInfo?.email?.value || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">City</p>
                      <p className="text-white font-medium">{selectedParavet.personalInfo?.city?.value || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Service Area</p>
                      <p className="text-white font-medium">{selectedParavet.personalInfo?.serviceArea?.value || 'N/A'} km</p>
                    </div>
                  </div>
                  {selectedParavet.personalInfo?.emergencyContact && (
                    <div className="pt-3 border-t border-gray-600">
                      <p className="text-gray-400 text-sm mb-2">Emergency Contact</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 text-xs">Name</p>
                          <p className="text-white">{selectedParavet.personalInfo.emergencyContact.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Number</p>
                          <p className="text-white">{selectedParavet.personalInfo.emergencyContact.number || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience & Skills */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center text-lg">
                  <Briefcase className="w-5 h-5 mr-2 text-green-400" />
                  Experience & Skills
                </h3>
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Years of Experience</p>
                      <p className="text-white font-medium text-2xl">
                        {(() => {
                          const years = selectedParavet.experience?.yearsOfExperience?.value;
                          return typeof years === 'number' ? years : 0;
                        })()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Areas of Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedParavet.experience?.areasOfExpertise?.value) && selectedParavet.experience.areasOfExpertise.value.length > 0
                        ? selectedParavet.experience.areasOfExpertise.value.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                              {String(skill)}
                            </span>
                          ))
                        : <span className="text-gray-500">None specified</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Languages Spoken</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedParavet.experience?.languagesSpoken?.value) && selectedParavet.experience.languagesSpoken.value.length > 0
                        ? selectedParavet.experience.languagesSpoken.value.map((lang, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                              {String(lang)}
                            </span>
                          ))
                        : <span className="text-gray-500">None specified</span>}
                    </div>
                  </div>
                  {selectedParavet.experience?.availability && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Availability</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-gray-500 text-xs">Days</p>
                          <p className="text-white text-sm">
                            {Array.isArray(selectedParavet.experience.availability.days) 
                              ? selectedParavet.experience.availability.days.join(', ') 
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Start Time</p>
                          <p className="text-white text-sm">{selectedParavet.experience.availability.startTime || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">End Time</p>
                          <p className="text-white text-sm">{selectedParavet.experience.availability.endTime || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                  Documents
                </h3>
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedParavet.documents?.profilePhoto?.url && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Profile Photo</p>
                        <img
                          src={selectedParavet.documents.profilePhoto.url}
                          alt="Profile"
                          className="w-32 h-32 rounded-lg object-cover border border-gray-600"
                        />
                      </div>
                    )}
                    {selectedParavet.documents?.governmentId?.url && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Government ID ({selectedParavet.documents.governmentId.idType})</p>
                        <a
                          href={selectedParavet.documents.governmentId.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          View Document
                        </a>
                      </div>
                    )}
                    {selectedParavet.documents?.certificationProof?.url && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Certification Proof</p>
                        <a
                          href={selectedParavet.documents.certificationProof.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          View Certificate
                        </a>
                      </div>
                    )}
                    {selectedParavet.documents?.vetRecommendation?.url && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Vet Recommendation</p>
                        <a
                          href={selectedParavet.documents.vetRecommendation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          View Recommendation
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Application Status */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center text-lg">
                  <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                  Application Status
                </h3>
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Submitted At:</span>
                    <span className="text-white">{formatDate(selectedParavet.applicationStatus?.submittedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                      {selectedParavet.applicationStatus?.approvalStatus || 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Completion:</span>
                    <span className="text-white">{selectedParavet.applicationStatus?.completionPercentage || 0}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => handleVerify(selectedParavet._id)}
                  disabled={actionLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center font-semibold"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {actionLoading ? 'Processing...' : 'Verify & Approve'}
                </button>
                <button
                  onClick={() => handleReject(selectedParavet._id)}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center font-semibold"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  {actionLoading ? 'Processing...' : 'Reject Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnverifiedParavets;
