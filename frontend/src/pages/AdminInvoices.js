import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom Invoice Modal Component
const CustomInvoiceModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    billing_address: '',
    billing_city: '',
    billing_state: 'FL',
    billing_zip_code: '',
    service_address: '',
    service_city: '',
    service_state: 'FL',
    service_zip_code: '',
    service_name: '',
    service_date: new Date().toISOString().split('T')[0],
    subtotal: '',
    tax_exempt: false,
    tax_exempt_reason: '',
    notes: '',
    due_days: 30
  });
  
  const [sameAsService, setSameAsService] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [isCustomService, setIsCustomService] = useState(false);

  useEffect(() => {
    // Total amount entered by user (tax-inclusive)
    const totalAmount = parseFloat(formData.subtotal) || 0;
    
    if (formData.tax_exempt) {
      // If tax exempt, total = subtotal
      setCalculatedTotal(totalAmount);
    } else {
      // Calculate backwards: if total includes 7% tax, then total = subtotal * 1.07
      // So subtotal = total / 1.07
      // And tax = total - subtotal
      setCalculatedTotal(totalAmount);
    }
  }, [formData.subtotal, formData.tax_exempt]);

  useEffect(() => {
    if (sameAsService) {
      setFormData(prev => ({
        ...prev,
        service_address: prev.billing_address,
        service_city: prev.billing_city,
        service_state: prev.billing_state,
        service_zip_code: prev.billing_zip_code
      }));
    }
  }, [sameAsService, formData.billing_address, formData.billing_city, formData.billing_state, formData.billing_zip_code]);

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data.services || []);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };
    fetchServices();
  }, []);

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setSelectedService(value);
    
    if (value === 'custom') {
      setIsCustomService(true);
      setFormData(prev => ({ ...prev, service_name: '' }));
    } else {
      setIsCustomService(false);
      const service = services.find(s => s.id === parseInt(value));
      if (service) {
        setFormData(prev => ({ ...prev, service_name: service.name }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert string values to numbers before submitting
      const submitData = {
        ...formData,
        subtotal: parseFloat(formData.subtotal) || 0,
        due_days: parseInt(formData.due_days) || 30
      };
      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                ✏️ Create Custom Invoice
              </h2>
              <p className="text-sm text-gray-600 mt-1">Generate an invoice for services outside the booking system</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">👤</span>
                Customer Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🏠</span>
                Billing Address
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="billing_address"
                    value={formData.billing_address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="billing_city"
                    value={formData.billing_city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Miami"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="billing_state"
                    value={formData.billing_state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="FL"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="billing_zip_code"
                    value={formData.billing_zip_code}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="33101"
                  />
                </div>
              </div>
            </div>

            {/* Service Address */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-2xl mr-2">📍</span>
                  Service Address
                </h3>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsService}
                    onChange={(e) => setSameAsService(e.target.checked)}
                    className="mr-2 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Same as billing</span>
                </label>
              </div>
              {!sameAsService && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="service_address"
                      value={formData.service_address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="service_city"
                      value={formData.service_city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Miami"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="service_state"
                      value={formData.service_state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="FL"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="service_zip_code"
                      value={formData.service_zip_code}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="33101"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Service Details */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🧹</span>
                Service Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service *
                  </label>
                  <select
                    value={selectedService}
                    onChange={handleServiceChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select a service...</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                    <option value="custom">➕ Custom Service</option>
                  </select>
                </div>
                {isCustomService && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Service Name *
                    </label>
                    <input
                      type="text"
                      name="service_name"
                      value={formData.service_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter custom service name"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Date *
                  </label>
                  <input
                    type="date"
                    name="service_date"
                    value={formData.service_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount (Tax Included) * $
                  </label>
                  <input
                    type="number"
                    name="subtotal"
                    value={formData.subtotal}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="150.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the final price you want to charge</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Due (days)
                  </label>
                  <input
                    type="number"
                    name="due_days"
                    value={formData.due_days}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="30"
                  />
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">💰</span>
                Tax & Pricing
              </h3>
              <div className="space-y-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="tax_exempt"
                    checked={formData.tax_exempt}
                    onChange={handleChange}
                    className="mr-2 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Tax Exempt</span>
                </label>
                {formData.tax_exempt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Exempt Reason
                    </label>
                    <input
                      type="text"
                      name="tax_exempt_reason"
                      value={formData.tax_exempt_reason}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Non-profit organization"
                    />
                  </div>
                )}
                <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                  <div className="flex justify-between pt-2 border-b-2 border-indigo-200 pb-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                    <span className="text-lg font-bold text-indigo-600">${calculatedTotal.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    {!formData.tax_exempt && (
                      <>
                        <div className="flex justify-between">
                          <span>Includes FL Tax (7%):</span>
                          <span className="font-medium">${(calculatedTotal - (calculatedTotal / 1.07)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Subtotal (before tax):</span>
                          <span className="font-medium">${(calculatedTotal / 1.07).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    {formData.tax_exempt && (
                      <div className="flex justify-between text-green-700">
                        <span>✓ Tax Exempt</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📝</span>
                Additional Notes
              </h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Any special terms or conditions..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 sticky bottom-0 bg-white pb-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? 'Creating...' : 'Create Custom Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCustomInvoiceModal, setShowCustomInvoiceModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    overdue: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchInvoices();
    fetchBookings();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/admin/invoices' 
        : `/api/admin/invoices?status=${filter}`;
      const response = await axios.get(url);
      const invoiceData = response.data.invoices || [];
      setInvoices(invoiceData);

      // Calculate stats
      const stats = invoiceData.reduce((acc, invoice) => {
        acc.total++;
        acc[invoice.status]++;
        if (invoice.status === 'paid') {
          acc.totalRevenue += invoice.total_amount;
        }
        return acc;
      }, { total: 0, pending: 0, paid: 0, overdue: 0, totalRevenue: 0 });

      setStats(stats);
      setLoading(false);
    } catch (err) {
      setError('Failed to load invoices');
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/admin/bookings');
      console.log('All bookings:', response.data.bookings); // Debug log
      const completedBookings = response.data.bookings.filter(
        booking => booking.status === 'completed' && (booking.invoice_id === null || booking.invoice_id === undefined)
      );
      console.log('Filtered bookings (no invoice):', completedBookings); // Debug log
      setBookings(completedBookings);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  const createInvoiceFromBooking = async () => {
    if (!selectedBooking) return;

    try {
      const response = await axios.post(`/api/admin/invoices/from-booking/${selectedBooking.id}`);
      setShowCreateModal(false);
      setSelectedBooking(null);
      fetchInvoices();
      fetchBookings();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create invoice';
      setError(errorMessage);
      // Close modal after showing error briefly
      setTimeout(() => {
        setShowCreateModal(false);
        setSelectedBooking(null);
      }, 3000);
    }
  };

  const createCustomInvoice = async (formData) => {
    try {
      const response = await axios.post('/api/admin/invoices/custom', formData);
      setShowCustomInvoiceModal(false);
      fetchInvoices();
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create custom invoice');
    }
  };

  const markAsPaid = async (invoiceId) => {
    try {
      await axios.put(`/api/admin/invoices/${invoiceId}/mark-paid`, {
        payment_method: 'cash',
        payment_reference: `Payment-${Date.now()}`
      });
      fetchInvoices();
    } catch (err) {
      setError('Failed to mark invoice as paid');
    }
  };

  const viewInvoice = (invoiceId) => {
    navigate(`/admin/invoice/${invoiceId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };

    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            💳 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">Invoice Management</span>
          </h1>
          <p className="text-xl text-gray-600">Manage and track all service invoices</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Invoices</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinujoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
                <p className="text-sm text-gray-600">Paid</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(0)}</p>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Invoices', icon: '📋' },
                { key: 'pending', label: 'Pending', icon: '⏳' },
                { key: 'paid', label: 'Paid', icon: '✅' },
                { key: 'overdue', label: 'Overdue', icon: '⚠️' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === key
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* Create Invoice Button */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowCustomInvoiceModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Custom Invoice</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>From Booking</span>
              </button>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first invoice</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Invoice
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer" 
                                onClick={() => viewInvoice(invoice.id)}>
                              💳 Invoice #{invoice.invoice_number}
                            </h3>
                            <p className="text-sm text-gray-600">{invoice.service_name}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(invoice.status)}`}>
                            {invoice.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${invoice.total_amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Total Amount</p>
                        </div>
                      </div>

                      <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Service Date:</p>
                          <p className="font-medium">
                            {formatDate(invoice.service_date)}
                            {invoice.service_time && ` at ${invoice.service_time}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Created:</p>
                          <p className="font-medium">{formatDate(invoice.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Due Date:</p>
                          <p className="font-medium">{formatDate(invoice.due_date)}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Bill To:</p>
                        <p className="text-sm text-gray-700 truncate">{invoice.billing_address}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={() => viewInvoice(invoice.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View</span>
                        </button>

                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => markAsPaid(invoice.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Mark Paid</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Invoice Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">✨ Create Invoice from Booking</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">Select a completed booking to create an invoice:</p>
                  
                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No completed bookings available for invoicing</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedBooking?.id === booking.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{booking.service_name}</h4>
                              <p className="text-sm text-gray-600">Customer: {booking.customer_name}</p>
                              <p className="text-sm text-gray-600">
                                {formatDate(booking.scheduled_date)} at {booking.scheduled_time}
                              </p>
                              <p className="text-sm text-gray-600">{booking.address}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-green-600">${booking.total_price.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">Booking #{booking.id}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createInvoiceFromBooking}
                    disabled={!selectedBooking}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Invoice Modal */}
        {showCustomInvoiceModal && (
          <CustomInvoiceModal
            onClose={() => setShowCustomInvoiceModal(false)}
            onSubmit={createCustomInvoice}
          />
        )}
      </div>
    </div>
  );
};

export default AdminInvoices;