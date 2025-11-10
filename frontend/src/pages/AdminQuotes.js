import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/quotes');
      setQuotes(response.data.quotes || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuote = async (quoteId, status, estimatedPrice, adminNotes) => {
    try {
      setUpdating(true);
      await api.put(`/admin/quotes/${quoteId}`, {
        status,
        estimated_price: estimatedPrice,
        admin_notes: adminNotes,
      });
      await fetchQuotes();
      setSelectedQuote(null);
      alert('Quote updated successfully!');
    } catch (error) {
      console.error('Error updating quote:', error);
      alert('Failed to update quote');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed':
        return 'bg-brand-100 text-brand-800 border-brand-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'converted':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
          <p className="mt-4 text-lg text-brand-700">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💬 Quote Requests</h1>
          <p className="text-xl text-gray-600">View and manage customer quote requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">
              {quotes.filter((q) => q.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="bg-brand-50 rounded-xl p-4 border border-brand-200">
            <div className="text-2xl font-bold text-brand-600">
              {quotes.filter((q) => q.status === 'reviewed').length}
            </div>
            <div className="text-sm text-brand-700">Reviewed</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {quotes.filter((q) => q.status === 'sent').length}
            </div>
            <div className="text-sm text-blue-700">Sent to Customer</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {quotes.filter((q) => q.status === 'converted').length}
            </div>
            <div className="text-sm text-green-700">Converted to Booking</div>
          </div>
        </div>

        {/* Quotes List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {quotes.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No quote requests yet</h3>
              <p className="text-gray-600">When customers request quotes, they'll appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{quote.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{quote.contact_name}</div>
                        <div className="text-sm text-gray-500">{quote.contact_email}</div>
                        {quote.contact_phone && (
                          <div className="text-sm text-gray-500">{quote.contact_phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{quote.service_name}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{quote.square_meters} m²</div>
                        {quote.address && (
                          <div className="text-sm text-gray-500">{quote.address}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(quote.status)}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quote Detail Modal */}
        {selectedQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-brand-600 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Quote #{selectedQuote.id}</h2>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-base"><strong>Name:</strong> {selectedQuote.contact_name}</p>
                    <p className="text-base"><strong>Email:</strong> {selectedQuote.contact_email}</p>
                    {selectedQuote.contact_phone && (
                      <p className="text-base"><strong>Phone:</strong> {selectedQuote.contact_phone}</p>
                    )}
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-base"><strong>Service:</strong> {selectedQuote.service_name}</p>
                    <p className="text-base"><strong>Square Meters:</strong> {selectedQuote.square_meters} m²</p>
                    {selectedQuote.address && (
                      <p className="text-base"><strong>Address:</strong> {selectedQuote.address}</p>
                    )}
                    {selectedQuote.preferred_date && (
                      <p className="text-base"><strong>Preferred Date:</strong> {new Date(selectedQuote.preferred_date).toLocaleDateString()}</p>
                    )}
                    {selectedQuote.special_requirements && (
                      <div>
                        <strong className="text-base">Special Requirements:</strong>
                        <p className="text-base text-gray-700 mt-1">{selectedQuote.special_requirements}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Update Quote */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Quote</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      handleUpdateQuote(
                        selectedQuote.id,
                        formData.get('status'),
                        parseFloat(formData.get('estimated_price')),
                        formData.get('admin_notes')
                      );
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        defaultValue={selectedQuote.status}
                        className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="sent">Sent to Customer</option>
                        <option value="converted">Converted to Booking</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Estimated Price ($)</label>
                      <input
                        type="number"
                        name="estimated_price"
                        step="0.01"
                        defaultValue={selectedQuote.estimated_price}
                        className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Admin Notes</label>
                      <textarea
                        name="admin_notes"
                        rows="4"
                        defaultValue={selectedQuote.admin_notes || ''}
                        className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        placeholder="Add internal notes about this quote..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 bg-brand-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-brand-700 disabled:opacity-50"
                      >
                        {updating ? 'Updating...' : 'Update Quote'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedQuote(null)}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuotes;
