import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-page min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ⚙️ <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-700">Admin Dashboard</span>
          </h1>
          <p className="text-2xl text-gray-600">Manage your Premier Prime cleaning service business</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Bookings Management */}
          <Link 
            to="/admin/bookings"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-brand-300 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-brand-100 rounded-full p-3 group-hover:bg-brand-200 transition-colors duration-300">
                  <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">📅 Manage Bookings</h3>
              <p className="text-lg text-gray-600 mb-4">
                View, approve, and manage all service bookings from customers
              </p>
              <div className="flex items-center text-brand-600 font-medium text-lg group-hover:text-brand-700">
                <span>Manage Bookings</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Quote Requests */}
          <Link 
            to="/admin/quotes"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-brand-300 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-brand-100 rounded-full p-3 group-hover:bg-brand-200 transition-colors duration-300">
                  <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">💬 Quote Requests</h3>
              <p className="text-lg text-gray-600 mb-4">
                View and respond to customer quote requests
              </p>
              <div className="flex items-center text-brand-600 font-medium text-lg group-hover:text-brand-700">
                <span>Manage Quotes</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Calendar View */}
          <Link 
            to="/admin/calendar"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-brand-300 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-brand-100 rounded-full p-3 group-hover:bg-brand-200 transition-colors duration-300">
                  <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">📆 Calendar View</h3>
              <p className="text-lg text-gray-600 mb-4">
                View bookings in calendar format by day, week, or month
              </p>
              <div className="flex items-center text-brand-600 font-medium text-lg group-hover:text-brand-700">
                <span>View Calendar</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Invoice Management */}
          <Link 
            to="/admin/invoices"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-brand-300 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-brand-100 rounded-full p-3 group-hover:bg-brand-200 transition-colors duration-300">
                  <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">💳 Invoice Management</h3>
              <p className="text-gray-600 mb-4">
                Generate, track, and manage customer invoices with PDF export
              </p>
              <div className="flex items-center text-brand-600 font-medium group-hover:text-brand-700">
                <span>Manage Invoices</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Reports & Analytics */}
          <Link 
            to="/admin/reports"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-brand-300 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-brand-100 rounded-full p-3 group-hover:bg-brand-200 transition-colors duration-300">
                  <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">📊 Reports & Analytics</h3>
              <p className="text-lg text-gray-600 mb-4">
                View business metrics, revenue reports, and export data
              </p>
              <div className="flex items-center text-brand-600 font-medium text-lg group-hover:text-brand-700">
                <span>View Reports</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            📈 Quick Business Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-1">Quick Actions</h3>
              <p className="text-sm text-gray-600">
                Access all admin functions from this central dashboard
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-3xl font-bold text-brand-600 mb-2">✨</div>
              <h3 className="font-semibold text-gray-900 mb-1">Premier Service</h3>
              <p className="text-sm text-gray-600">
                Manage your cleaning service business efficiently
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">📱</div>
              <h3 className="font-semibold text-gray-900 mb-1">Data Insights</h3>
              <p className="text-sm text-gray-600">
                Export reports in Excel and PDF formats
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;