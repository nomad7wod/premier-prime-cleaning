import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingInvoices, setBookingInvoices] = useState({}); // Track which bookings have invoices
  const [showRecentOnly, setShowRecentOnly] = useState(false); // Filter for recent bookings
  const [statusFilter, setStatusFilter] = useState('all'); // Status filter

  // Format time in 12-hour format
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      // Handle PostgreSQL timestamp format: "0000-01-01T12:00:00Z"
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
      }
      
      // Handle simple time format: "12:00:00" or "12:00"
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch (error) {
      return timeString; // Return original if parsing fails
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/admin/bookings');
        setBookings(response.data.bookings);
        
        // Check invoice status for all completed bookings
        await checkInvoiceStatus(response.data.bookings);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to check which bookings have invoices
  const checkInvoiceStatus = async (bookingsList) => {
    const invoiceStatus = {};
    
    // Get all invoices to check which bookings have them
    try {
      const response = await axios.get('/api/admin/invoices');
      const invoices = response.data.invoices || [];
      
      // Create a map of booking_id to invoice info
      invoices.forEach(invoice => {
        if (invoice.booking_id) {
          invoiceStatus[invoice.booking_id] = {
            exists: true,
            invoice_number: invoice.invoice_number,
            invoice_id: invoice.id
          };
        }
      });
      
      setBookingInvoices(invoiceStatus);
    } catch (err) {
      console.error('Failed to fetch invoice status:', err);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`/api/admin/bookings/${bookingId}`, { status: newStatus });
      // Update the local state to reflect the change
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const generateInvoice = async (booking) => {
    try {
      const response = await axios.post(`/api/admin/invoices/from-booking/${booking.id}`);
      
      if (response.status === 201) {
        alert(`Invoice generated successfully! Invoice #${response.data.invoice_number}`);
        
        // Update the booking invoice status
        setBookingInvoices(prev => ({
          ...prev,
          [booking.id]: {
            exists: true,
            invoice_number: response.data.invoice_number,
            invoice_id: response.data.invoice_id
          }
        }));
      }
    } catch (err) {
      if (err.response?.status === 409) {
        alert('Invoice already exists for this booking');
        // Mark as having an invoice if we get a conflict
        setBookingInvoices(prev => ({
          ...prev,
          [booking.id]: { exists: true }
        }));
      } else {
        alert('Failed to generate invoice: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  // Calculate status counts for display
  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    in_progress: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  // Filter bookings based on recent filter and status filter
  const filteredBookings = bookings.filter(booking => {
    // Apply recent filter
    const passesRecentFilter = showRecentOnly 
      ? (() => {
          const bookingDate = new Date(booking.created_at);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return bookingDate >= yesterday;
        })()
      : true;

    // Apply status filter
    const passesStatusFilter = statusFilter === 'all' || booking.status === statusFilter;

    return passesRecentFilter && passesStatusFilter;
  });

  if (loading) {
    return <div className="text-center py-10">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
        <p className="mt-2 text-gray-600">View and manage all service bookings</p>
        
        {/* Filter Controls */}
        <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Recent Bookings Filter */}
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showRecentOnly}
                onChange={(e) => setShowRecentOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Show recent bookings only (last 24 hours)</span>
            </label>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
            >
              <option value="all">All Status ({statusCounts.all})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="confirmed">Confirmed ({statusCounts.confirmed})</option>
              <option value="in_progress">In Progress ({statusCounts.in_progress})</option>
              <option value="completed">Completed ({statusCounts.completed})</option>
              <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredBookings.map((booking) => (
            <li key={booking.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-blue-600 truncate">
                    Booking #{booking.id} - {booking.service_name}
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="mr-6">
                      <p className="text-sm text-gray-500">Customer: {booking.user_id}</p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Date: {(() => {
                        // Parse scheduled_date carefully to avoid timezone conversion
                        // Backend sends "2025-10-03T00:00:00Z" where the date part is correct
                        const dateStr = booking.scheduled_date.split('T')[0]; // "2025-10-03"
                        const [year, month, day] = dateStr.split('-');
                        const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        return localDate.toLocaleDateString();
                      })()}</p>
                      <span className="mx-2">•</span>
                      <p>Time: {formatTime(booking.scheduled_time)}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Price: ${booking.total_price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Address: {booking.address}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Square Meters: {booking.square_meters}, Instructions: {booking.special_instructions || 'None'}
                  </p>
                </div>
                
                <div className="mt-4 flex space-x-3">
                  <select
                    value={booking.status}
                    onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                    className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  {booking.status === 'completed' && (
                    <>
                      {bookingInvoices[booking.id]?.exists ? (
                        <div className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Invoice Generated
                          {bookingInvoices[booking.id]?.invoice_number && (
                            <span className="ml-2 text-xs text-gray-500">
                              #{bookingInvoices[booking.id].invoice_number}
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => generateInvoice(booking)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Generate Invoice
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {filteredBookings.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {bookings.length === 0 
              ? 'No bookings found.' 
              : `No bookings match the current filters. (${bookings.length} total bookings available)`
            }
          </p>
          {(showRecentOnly || statusFilter !== 'all') && (
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your filters to see more results.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;