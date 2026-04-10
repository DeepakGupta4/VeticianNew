import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, XCircle, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import apiService from '../../../services/api';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const SupportEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  useEffect(() => {
    fetchEnquiries();
    
    // Setup Socket.io for real-time updates
    const socket = io(API_URL);
    
    // Join support admin room
    socket.emit('join-support-admin');
    console.log('🔌 Connected to support admin room');
    
    socket.on('new-support-enquiry', (enquiry) => {
      console.log('🔔 New enquiry received:', enquiry);
      setEnquiries(prev => [enquiry, ...prev]);
      setStats(prev => ({ ...prev, total: prev.total + 1, open: prev.open + 1 }));
      showNotification('New Support Enquiry', `Ticket ${enquiry.ticketId} received`);
    });

    socket.on('enquiry-status-updated', (updatedEnquiry) => {
      console.log('🔄 Enquiry updated:', updatedEnquiry);
      setEnquiries(prev => prev.map(e => e._id === updatedEnquiry._id ? updatedEnquiry : e));
      fetchEnquiries(); // Refresh to update stats
    });

    return () => socket.disconnect();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSupportEnquiries();
      setEnquiries(response.enquiries || []);
      setStats(response.stats || { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, adminNotes = '') => {
    try {
      await apiService.updateSupportEnquiryStatus(id, { status, adminNotes });
      fetchEnquiries();
      setSelectedEnquiry(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const deleteEnquiry = async (id) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await apiService.deleteSupportEnquiry(id);
      fetchEnquiries();
      setSelectedEnquiry(null);
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      alert('Failed to delete enquiry');
    }
  };

  const showNotification = (title, message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/logo.png' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const filteredEnquiries = enquiries.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard icon={AlertCircle} label="Total" value={stats.total} color="blue" onClick={() => setFilter('all')} active={filter === 'all'} />
        <StatCard icon={Clock} label="Open" value={stats.open} color="blue" onClick={() => setFilter('open')} active={filter === 'open'} />
        <StatCard icon={AlertCircle} label="In Progress" value={stats.inProgress} color="yellow" onClick={() => setFilter('in-progress')} active={filter === 'in-progress'} />
        <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved} color="green" onClick={() => setFilter('resolved')} active={filter === 'resolved'} />
        <StatCard icon={XCircle} label="Closed" value={stats.closed} color="gray" onClick={() => setFilter('closed')} active={filter === 'closed'} />
      </div>

      {/* Enquiries List */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Support Enquiries</h2>
          <p className="text-gray-400 mt-1">Manage and respond to customer support requests</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Issue Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    No enquiries found
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{enquiry.ticketId}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{enquiry.userName}</div>
                      <div className="text-xs text-gray-400">{enquiry.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{enquiry.issueType}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(enquiry.priority)}`}>
                        {enquiry.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Enquiry Details - {selectedEnquiry.ticketId}</h3>
              <button onClick={() => setSelectedEnquiry(null)} className="text-gray-400 hover:text-white">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="User Name" value={selectedEnquiry.userName} />
                <InfoItem label="User Role" value={selectedEnquiry.userRole} />
                <InfoItem label="Email" value={selectedEnquiry.userEmail} />
                <InfoItem label="Phone" value={selectedEnquiry.userPhone} />
                <InfoItem label="Issue Type" value={selectedEnquiry.issueType} />
                <InfoItem label="Priority" value={selectedEnquiry.priority} />
                <InfoItem label="Contact Method" value={selectedEnquiry.contactMethod} />
                <InfoItem label="Status" value={selectedEnquiry.status} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <p className="text-gray-400 bg-gray-700 p-4 rounded-lg">{selectedEnquiry.description}</p>
              </div>

              {selectedEnquiry.adminNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Admin Notes</label>
                  <p className="text-gray-400 bg-gray-700 p-4 rounded-lg">{selectedEnquiry.adminNotes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button onClick={() => updateStatus(selectedEnquiry._id, 'in-progress')} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg">
                  Mark In Progress
                </button>
                <button onClick={() => updateStatus(selectedEnquiry._id, 'resolved')} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  Mark Resolved
                </button>
                <button onClick={() => updateStatus(selectedEnquiry._id, 'closed')} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                  Close
                </button>
                <button onClick={() => deleteEnquiry(selectedEnquiry._id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, onClick, active }) => (
  <button
    onClick={onClick}
    className={`p-6 rounded-lg transition-all ${
      active ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-800 hover:bg-gray-700'
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
      </div>
      <Icon className={`text-${color}-400`} size={32} />
    </div>
  </button>
);

const InfoItem = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <p className="text-white">{value || 'N/A'}</p>
  </div>
);

export default SupportEnquiries;
