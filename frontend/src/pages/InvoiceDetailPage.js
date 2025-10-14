import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InvoiceTemplate from '../components/InvoiceTemplate';

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/invoices/${id}`);
      setInvoice(response.data.invoice);
      setLoading(false);
    } catch (err) {
      setError('Failed to load invoice');
      setLoading(false);
    }
  };

  const downloadInvoicePDF = async () => {
    try {
      // Import jsPDF dynamically to reduce bundle size
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      const invoiceElement = document.getElementById('invoice-template');
      
      // Temporarily show the invoice element if it's hidden
      const originalDisplay = invoiceElement.style.display;
      invoiceElement.style.display = 'block';

      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Restore original display
      invoiceElement.style.display = originalDisplay;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice-${invoice.invoice_number}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to simple text download
      downloadInvoiceText();
    }
  };

  const downloadInvoiceText = () => {
    const invoiceContent = `
PREMIER PRIME CLEANING SERVICES
✨ Professional Cleaning Services ✨

INVOICE #${invoice.invoice_number}
=====================================

Invoice Details:
- Issue Date: ${new Date(invoice.created_at).toLocaleDateString()}
- Due Date: ${new Date(invoice.due_date).toLocaleDateString()}
- Status: ${invoice.status.toUpperCase()}

Service Address:
${invoice.service_address}

Billing Address:
${invoice.billing_address}

Service Details:
- Service: ${invoice.service_name}
- Date: ${new Date(invoice.service_date).toLocaleDateString()}
- Time: ${invoice.service_time}
- Duration: ${invoice.service_duration} hours
- Area: ${invoice.square_meters} sq meters

Itemized Charges:
=====================================
${invoice.service_name}                    $${invoice.subtotal.toFixed(2)}
Florida Sales Tax (7%)                     $${invoice.tax_amount.toFixed(2)}
                                          --------
TOTAL AMOUNT                               $${invoice.total_amount.toFixed(2)}

${invoice.status === 'paid' ? `
Payment Information:
- Payment Date: ${new Date(invoice.payment_date).toLocaleDateString()}
- Payment Method: ${invoice.payment_method || 'Not specified'}
- Reference: ${invoice.payment_reference || 'N/A'}
` : `
Payment Instructions:
- Payment Methods: Cash, Check, Credit Card, Bank Transfer
- Payment Terms: Net 30 days
- Late Fee: 1.5% per month on overdue balances
`}

Thank you for choosing Premier Prime! ✨
Your satisfaction is our priority.

Contact Information:
📧 adaperez@premierprime.com
📞 (561) 452-3128
🌐 www.premierprime.com

Licensed & Insured • Florida License #123456
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `Invoice-${invoice.invoice_number}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const printInvoice = () => {
    window.print();
  };

  const markAsPaid = async () => {
    try {
      await axios.put(`/api/admin/invoices/${id}/mark-paid`, {
        payment_method: 'manual',
        payment_reference: `Manual-${Date.now()}`
      });
      fetchInvoice(); // Refresh the invoice
    } catch (err) {
      setError('Failed to mark invoice as paid');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Invoice</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/invoices')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-4">The requested invoice could not be found.</p>
          <button
            onClick={() => navigate('/admin/invoices')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/invoices')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Invoices</span>
              </button>
              <div className="text-gray-400">|</div>
              <h1 className="text-xl font-semibold text-gray-900">
                Invoice #{invoice.invoice_number}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {invoice.status === 'pending' && (
                <button
                  onClick={markAsPaid}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mark as Paid</span>
                </button>
              )}
              
              <button
                onClick={printInvoice}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print</span>
              </button>

              <button
                onClick={downloadInvoicePDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InvoiceTemplate invoice={invoice} />
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .sticky { position: static !important; }
          .bg-gray-50 { background: white !important; }
          button { display: none !important; }
          .border-gray-200 { border: none !important; }
          .shadow-lg { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default InvoiceDetailPage;