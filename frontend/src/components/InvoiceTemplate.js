import React from 'react';

const InvoiceTemplate = ({ invoice }) => {
  if (!invoice) return null;

  const formatDate = (dateString) => {
    // Parse date carefully to avoid timezone conversion issues
    if (dateString.includes('T')) {
      // Extract just the date part: "2025-10-10T00:00:00Z" -> "2025-10-10"
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-');
      const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return localDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    // If it's already just a date string
    const [year, month, day] = dateString.split('-');
    const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return localDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString || timeString === '00:00' || timeString === '00:00:00') {
      return 'N/A';
    }
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      if (isNaN(time.getTime())) {
        return 'N/A';
      }
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="bg-white max-w-4xl mx-auto p-8 shadow-lg" id="invoice-template">
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-blue-600 mb-2">✨ PREMIER PRIME</h1>
            <p className="text-lg text-gray-600">Professional Cleaning Services</p>
            <div className="mt-4 text-sm text-gray-600">
              <p>📧 adaperez@premierprime.com</p>
              <p>📞 (561) 452-3128</p>
              <p>🌐 www.premierprime.com</p>
              <p>🆔 Florida Tax ID: FL-123456789</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Invoice Number</p>
              <p className="text-xl font-bold text-blue-600">#{invoice.invoice_number}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📄 Invoice Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Issue Date:</span>
              <span className="font-medium">{formatDate(invoice.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium">{formatDate(invoice.due_date)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🏠 Service Address</h3>
          <div className="text-sm text-gray-700 whitespace-pre-line">
            {invoice.service_address}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💳 Bill To</h3>
          <div className="text-sm text-gray-700 whitespace-pre-line">
            {invoice.billing_address}
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🧹 Service Details</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type:</span>
                  <span className="font-medium">{invoice.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Date:</span>
                  <span className="font-medium">{formatDate(invoice.service_date)}</span>
                </div>
                {invoice.service_time && invoice.service_time !== '00:00' && invoice.service_time !== '00:00:00' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Time:</span>
                    <span className="font-medium">{formatTime(invoice.service_time)}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="space-y-3">
                {invoice.service_duration && invoice.service_duration > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{invoice.service_duration} hours</span>
                  </div>
                )}
                {invoice.square_meters && invoice.square_meters > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area Size:</span>
                    <span className="font-medium">{invoice.square_meters} sq meters</span>
                  </div>
                )}
                {invoice.special_instructions && (
                  <div>
                    <span className="text-gray-600 block mb-1">Special Instructions:</span>
                    <span className="text-sm text-gray-700">{invoice.special_instructions}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Services */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Services Provided</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-900">Qty</th>
                <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-900">Rate</th>
                <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{invoice.service_name}</p>
                    <p className="text-gray-600 text-xs">
                      Professional cleaning service for {invoice.square_meters} sq meters
                    </p>
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-right">1</td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-right">${invoice.subtotal.toFixed(2)}</td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-right font-medium">${invoice.subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Florida Sales Tax (7%):</span>
                <span className="font-medium">${invoice.tax_amount.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">${invoice.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information - Only show if paid */}
      {invoice.status === 'paid' && invoice.payment_date && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Payment Received</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-green-600">Payment Date:</span>
              <p className="font-medium">{formatDate(invoice.payment_date)}</p>
            </div>
            <div>
              <span className="text-green-600">Payment Method:</span>
              <p className="font-medium">{invoice.payment_method || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-green-600">Reference:</span>
              <p className="font-medium">{invoice.payment_reference || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Instructions - Always show for unpaid invoices */}
      {/* <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">💳 Payment Instructions</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Payment Methods Accepted:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Cash payment upon service completion</li>
            <li>Check payable to "Premier Prime Cleaning Services"</li>
            <li>Credit/Debit Card (Visa, MasterCard, American Express)</li>
            <li>Bank Transfer/ACH</li>
          </ul>
          <p className="mt-3"><strong>Payment Due:</strong> {formatDate(invoice.due_date)}</p>
          <p className="text-xs text-blue-600 mt-2">Late payments subject to 1.5% monthly service charge.</p>
        </div>
      </div> */}

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6 text-center">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank You for Choosing Premier Prime! ✨</h3>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            We appreciate your business and trust in our professional cleaning services. 
            Your satisfaction is our priority, and we look forward to serving you again.
          </p>
        </div>
        
        <div className="flex justify-center space-x-8 text-xs text-gray-500">
          <span>📧 adaperez@premierprime.com</span>
          <span>📞 (561) 452-3128</span>
          <span>🌐 www.premierprime.com</span>
        </div>
        
        <div className="mt-4 text-xs text-gray-400">
          <p>Premier Prime Cleaning Services • Licensed & Insured • Florida License #123456</p>
          <p>This invoice was generated electronically and is valid without signature.</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;