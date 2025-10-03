import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedClient, setSelectedClient] = useState('');
  const [clients, setClients] = useState([]);
  const [reportData, setReportData] = useState({
    bookings: [],
    invoices: [],
    revenue: {},
    services: {},
    clients: {}
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchClients();
    generateReport();
  }, []);

  useEffect(() => {
    generateReport();
  }, [dateRange, selectedClient]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/admin/bookings');
      const uniqueClients = [...new Set(response.data.bookings.map(booking => booking.customer_name))]
        .filter(name => name)
        .sort();
      setClients(uniqueClients);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
        ...(selectedClient && { client: selectedClient })
      });

      const response = await axios.get(`/api/admin/reports?${params}`);
      
      const reportData = response.data;
      const bookings = reportData.bookings || [];
      const invoices = reportData.invoices || [];
      const analytics = reportData.analytics || {};

      // Calculate analytics from the response
      const revenue = {
        total: analytics.totalRevenue || 0,
        pending: analytics.pendingRevenue || 0,
        tax: analytics.totalTax || 0,
        count: invoices.filter(inv => inv.status === 'paid').length,
        average: analytics.averageInvoice || 0
      };

      const services = analytics.serviceStats || {};
      const clientStats = analytics.clientStats || {};

      setReportData({
        bookings,
        invoices,
        revenue,
        services,
        clients: clientStats
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenue = (invoices) => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
    
    return {
      total: paidInvoices.reduce((sum, inv) => sum + inv.total_amount, 0),
      pending: pendingInvoices.reduce((sum, inv) => sum + inv.total_amount, 0),
      tax: paidInvoices.reduce((sum, inv) => sum + inv.tax_amount, 0),
      count: paidInvoices.length,
      average: paidInvoices.length > 0 ? paidInvoices.reduce((sum, inv) => sum + inv.total_amount, 0) / paidInvoices.length : 0
    };
  };

  const calculateServiceStats = (bookings) => {
    const serviceStats = {};
    bookings.forEach(booking => {
      if (!serviceStats[booking.service_name]) {
        serviceStats[booking.service_name] = { count: 0, revenue: 0 };
      }
      serviceStats[booking.service_name].count++;
      serviceStats[booking.service_name].revenue += booking.total_price || 0;
    });
    return serviceStats;
  };

  const calculateClientStats = (bookings) => {
    const clientStats = {};
    bookings.forEach(booking => {
      const client = booking.customer_name || booking.guest_name || 'Unknown';
      if (!clientStats[client]) {
        clientStats[client] = { bookings: 0, revenue: 0, lastService: null };
      }
      clientStats[client].bookings++;
      clientStats[client].revenue += booking.total_price || 0;
      if (!clientStats[client].lastService || new Date(booking.scheduled_date) > new Date(clientStats[client].lastService)) {
        clientStats[client].lastService = booking.scheduled_date;
      }
    });
    return clientStats;
  };

  const exportToExcel = (reportType) => {
    let data = [];
    let filename = '';

    switch (reportType) {
      case 'bookings':
        data = reportData.bookings.map(booking => ({
          'Booking ID': booking.id,
          'Customer': booking.customer_name || booking.guest_name || 'Guest',
          'Service': booking.service_name,
          'Date': new Date(booking.scheduled_date).toLocaleDateString(),
          'Time': booking.scheduled_time,
          'Status': booking.status,
          'Address': booking.address,
          'Total Price': `$${booking.total_price?.toFixed(2) || '0.00'}`,
          'Square Meters': booking.square_meters
        }));
        filename = `Bookings_Report_${dateRange.startDate}_to_${dateRange.endDate}.xlsx`;
        break;

      case 'revenue':
        data = reportData.invoices
          .filter(inv => inv.status === 'paid')
          .map(invoice => ({
            'Invoice Number': invoice.invoice_number,
            'Customer': invoice.billing_address?.split('\n')[0] || 'N/A',
            'Service': invoice.service_name,
            'Service Date': new Date(invoice.service_date).toLocaleDateString(),
            'Subtotal': `$${invoice.subtotal.toFixed(2)}`,
            'Tax': `$${invoice.tax_amount.toFixed(2)}`,
            'Total': `$${invoice.total_amount.toFixed(2)}`,
            'Payment Date': invoice.payment_date ? new Date(invoice.payment_date).toLocaleDateString() : 'N/A',
            'Payment Method': invoice.payment_method || 'N/A'
          }));
        filename = `Revenue_Report_${dateRange.startDate}_to_${dateRange.endDate}.xlsx`;
        break;

      case 'services':
        data = Object.entries(reportData.services).map(([service, stats]) => ({
          'Service Name': service,
          'Total Bookings': stats.count,
          'Total Revenue': `$${stats.revenue.toFixed(2)}`,
          'Average per Booking': `$${(stats.revenue / stats.count).toFixed(2)}`
        }));
        filename = `Services_Report_${dateRange.startDate}_to_${dateRange.endDate}.xlsx`;
        break;

      case 'clients':
        data = Object.entries(reportData.clients).map(([client, stats]) => ({
          'Client Name': client,
          'Total Bookings': stats.bookings,
          'Total Revenue': `$${stats.revenue.toFixed(2)}`,
          'Average per Booking': `$${(stats.revenue / stats.bookings).toFixed(2)}`,
          'Last Service': stats.lastService ? new Date(stats.lastService).toLocaleDateString() : 'N/A'
        }));
        filename = `Clients_Report_${dateRange.startDate}_to_${dateRange.endDate}.xlsx`;
        break;

      default:
        return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType.charAt(0).toUpperCase() + reportType.slice(1));
    XLSX.writeFile(wb, filename);
  };

  const exportToPDF = (reportType) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text('✨ PREMIER PRIME CLEANING SERVICES', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, pageWidth / 2, 35, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Period: ${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()}`, pageWidth / 2, 45, { align: 'center' });
    
    if (selectedClient) {
      doc.text(`Client: ${selectedClient}`, pageWidth / 2, 55, { align: 'center' });
    }

    let tableData = [];
    let columns = [];

    switch (reportType) {
      case 'overview':
        // Summary statistics
        doc.setFontSize(14);
        doc.text('📊 Summary Statistics', 20, 70);
        
        const stats = [
          ['Total Bookings', reportData.bookings.length.toString()],
          ['Total Revenue', `$${reportData.revenue.total.toFixed(2)}`],
          ['Pending Revenue', `$${reportData.revenue.pending.toFixed(2)}`],
          ['Tax Collected', `$${reportData.revenue.tax.toFixed(2)}`],
          ['Average Invoice', `$${reportData.revenue.average.toFixed(2)}`],
          ['Unique Clients', Object.keys(reportData.clients).length.toString()]
        ];

        doc.autoTable({
          startY: 80,
          head: [['Metric', 'Value']],
          body: stats,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] }
        });

        // Top services
        doc.setFontSize(14);
        doc.text('🧹 Top Services', 20, doc.lastAutoTable.finalY + 20);
        
        const topServices = Object.entries(reportData.services)
          .sort(([,a], [,b]) => b.revenue - a.revenue)
          .slice(0, 5)
          .map(([service, stats]) => [
            service,
            stats.count.toString(),
            `$${stats.revenue.toFixed(2)}`
          ]);

        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 30,
          head: [['Service', 'Bookings', 'Revenue']],
          body: topServices,
          theme: 'grid',
          headStyles: { fillColor: [34, 197, 94] }
        });
        break;

      case 'bookings':
        columns = ['ID', 'Customer', 'Service', 'Date', 'Status', 'Total'];
        tableData = reportData.bookings.slice(0, 50).map(booking => [
          booking.id,
          (booking.customer_name || booking.guest_name || 'Guest').substring(0, 20),
          booking.service_name.substring(0, 25),
          new Date(booking.scheduled_date).toLocaleDateString(),
          booking.status,
          `$${booking.total_price?.toFixed(2) || '0.00'}`
        ]);
        break;

      case 'revenue':
        columns = ['Invoice', 'Customer', 'Service', 'Date', 'Total'];
        tableData = reportData.invoices
          .filter(inv => inv.status === 'paid')
          .slice(0, 50)
          .map(invoice => [
            invoice.invoice_number,
            (invoice.billing_address?.split('\n')[0] || 'N/A').substring(0, 20),
            invoice.service_name.substring(0, 25),
            new Date(invoice.service_date).toLocaleDateString(),
            `$${invoice.total_amount.toFixed(2)}`
          ]);
        break;

      case 'services':
        columns = ['Service', 'Bookings', 'Revenue', 'Avg/Booking'];
        tableData = Object.entries(reportData.services).map(([service, stats]) => [
          service.substring(0, 30),
          stats.count,
          `$${stats.revenue.toFixed(2)}`,
          `$${(stats.revenue / stats.count).toFixed(2)}`
        ]);
        break;

      case 'clients':
        columns = ['Client', 'Bookings', 'Revenue', 'Last Service'];
        tableData = Object.entries(reportData.clients)
          .sort(([,a], [,b]) => b.revenue - a.revenue)
          .slice(0, 50)
          .map(([client, stats]) => [
            client.substring(0, 25),
            stats.bookings,
            `$${stats.revenue.toFixed(2)}`,
            stats.lastService ? new Date(stats.lastService).toLocaleDateString() : 'N/A'
          ]);
        break;
    }

    if (reportType !== 'overview') {
      doc.autoTable({
        startY: selectedClient ? 65 : 55,
        head: [columns],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 9 }
      });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`${reportType}_report_${dateRange.startDate}_to_${dateRange.endDate}.pdf`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tabs = [
    { key: 'overview', label: '📊 Overview', icon: '📈' },
    { key: 'bookings', label: '📅 Bookings', icon: '📋' },
    { key: 'revenue', label: '💰 Revenue', icon: '💳' },
    { key: 'services', label: '🧹 Services', icon: '🏠' },
    { key: 'clients', label: '👥 Clients', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">Reports & Analytics</span>
          </h1>
          <p className="text-xl text-gray-600">Comprehensive business insights and data exports</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filters & Date Range</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Filter</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Clients</option>
                {clients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>📊 Generate Report</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{reportData.bookings.length}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
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
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.revenue.total)}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
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
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.revenue.pending)}</p>
                <p className="text-sm text-gray-600">Pending Revenue</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6l2 2v9a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.revenue.tax)}</p>
                <p className="text-sm text-gray-600">Tax Collected</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-indigo-100 rounded-full p-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.revenue.average)}</p>
                <p className="text-sm text-gray-600">Avg Invoice</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-pink-100 rounded-full p-3">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{Object.keys(reportData.clients).length}</p>
                <p className="text-sm text-gray-600">Unique Clients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Export Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => exportToExcel(activeTab)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>📊 Export Excel</span>
              </button>
              
              <button
                onClick={() => exportToPDF(activeTab)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>📄 Export PDF</span>
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Revenue Chart Placeholder */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Performance Overview</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">💰 Revenue Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Paid Invoices:</span>
                          <span className="font-medium">{formatCurrency(reportData.revenue.total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pending Invoices:</span>
                          <span className="font-medium text-yellow-600">{formatCurrency(reportData.revenue.pending)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax Collected:</span>
                          <span className="font-medium">{formatCurrency(reportData.revenue.tax)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-900 font-semibold">Net Revenue:</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(reportData.revenue.total - reportData.revenue.tax)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">🧹 Top Services</h4>
                      <div className="space-y-2">
                        {Object.entries(reportData.services)
                          .sort(([,a], [,b]) => b.revenue - a.revenue)
                          .slice(0, 5)
                          .map(([service, stats]) => (
                            <div key={service} className="flex justify-between">
                              <span className="text-gray-600 truncate">{service.substring(0, 25)}</span>
                              <span className="font-medium">{formatCurrency(stats.revenue)}</span>
                            </div>
                          ))}
                      </div>
                    </div>  
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.bookings.slice(0, 20).map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">#{booking.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {booking.customer_name || booking.guest_name || 'Guest'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{booking.service_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatDate(booking.scheduled_date)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(booking.total_price || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reportData.bookings.length > 20 && (
                  <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500">
                    Showing first 20 of {reportData.bookings.length} bookings. Export to Excel/PDF for complete data.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'revenue' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.invoices.filter(inv => inv.status === 'paid').slice(0, 20).map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">#{invoice.invoice_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {invoice.billing_address?.split('\n')[0]?.substring(0, 30) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{invoice.service_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.service_date)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(invoice.subtotal)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(invoice.tax_amount)}</td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">{formatCurrency(invoice.total_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(reportData.services).map(([service, stats]) => (
                  <div key={service} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{service}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Bookings:</span>
                        <span className="font-medium">{stats.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Revenue:</span>
                        <span className="font-medium text-green-600">{formatCurrency(stats.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg per Booking:</span>
                        <span className="font-medium">{formatCurrency(stats.revenue / stats.count)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'clients' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg per Booking</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Service</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(reportData.clients)
                      .sort(([,a], [,b]) => b.revenue - a.revenue)
                      .slice(0, 20)
                      .map(([client, stats]) => (
                        <tr key={client}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{client}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{stats.bookings}</td>
                          <td className="px-6 py-4 text-sm font-medium text-green-600">{formatCurrency(stats.revenue)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(stats.revenue / stats.bookings)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {stats.lastService ? formatDate(stats.lastService) : 'N/A'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;