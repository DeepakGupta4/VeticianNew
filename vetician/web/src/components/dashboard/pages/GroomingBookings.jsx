import { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Mail, DollarSign, CheckCircle, XCircle, AlertCircle, Eye, Filter } from 'lucide-react';
import apiService from '../../../services/api';

const GroomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllGroomingBookings();
      if (response.success) {
        setBookings(response.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await apiService.updateGroomingBookingStatus(bookingId, newStatus);
      if (response.success) {
        fetchBookings();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString || 'Not specified';
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-white">{bookings.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Confirmed</p>
              <p className="text-2xl font-bold text-blue-400">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-400">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Cancelled</p>
              <p className="text-2xl font-bold text-red-400">
                {bookings.filter(b => b.status === 'cancelled').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center space-x-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-2">
        <Filter className="w-5 h-5 text-gray-400 ml-2" />
        {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Pet
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-300">
                        #{booking._id?.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {booking.userId?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">
                            {booking.userId?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {booking.userId?.phone || 'No phone'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{booking.petId?.name || 'Unknown Pet'}</div>
                      <div className="text-sm text-gray-400">{booking.petId?.species || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-white">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(booking.appointmentDate)}
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatTime(booking.appointmentTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.serviceType === 'home'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {booking.serviceType === 'home' ? '🏠 Home' : '🏢 Salon'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
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

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking ID */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Booking ID</p>
                <p className="text-white font-mono text-lg">#{selectedBooking._id?.slice(-8).toUpperCase()}</p>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-400" />
                  Customer Information
                </h3>
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{selectedBooking.userId?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white">{selectedBooking.userId?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white">{selectedBooking.userId?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Pet Info */}
              <div>
                <h3 className="text-white font-semibold mb-3">Pet Information</h3>
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{selectedBooking.petId?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Species:</span>
                    <span className="text-white">{selectedBooking.petId?.species || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Breed:</span>
                    <span className="text-white">{selectedBooking.petId?.breed || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-400" />
                  Appointment Details
                </h3>
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{formatDate(selectedBooking.appointmentDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-white">{formatTime(selectedBooking.appointmentTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service Type:</span>
                    <span className="text-white capitalize">{selectedBooking.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full border ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              <div>
                <h3 className="text-white font-semibold mb-3">Update Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedBooking.status === 'pending' && (
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'confirmed')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Confirm Booking
                    </button>
                  )}
                  {selectedBooking.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'in-progress')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {selectedBooking.status === 'in-progress' && (
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'completed')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'cancelled')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroomingBookings;
