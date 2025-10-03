import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-white hover:text-blue-100 transition-colors duration-200">
                ✨ Premier Prime
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
                <Link 
                  to="/" 
                  className="text-blue-100 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-500"
                >
                  🏠 Home
                </Link>
                <Link 
                  to="/booking" 
                  className="text-blue-100 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-500"
                >
                  📅 Book Service
                </Link>
                <Link 
                  to="/guest-booking" 
                  className="text-blue-100 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-500"
                >
                  🚀 Quick Book
                </Link>
                <Link 
                  to="/quote" 
                  className="text-blue-100 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-500"
                >
                  💰 Get Quote
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-blue-100 font-medium">
                    👋 Welcome, {user.first_name}!
                  </span>
                  {user.role === 'admin' && (
                    <>
                      <Link 
                        to="/admin" 
                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                      >
                        ⚙️ Admin
                      </Link>
                      <Link 
                        to="/admin/calendar" 
                        className="bg-green-400 hover:bg-green-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                      >
                        📅 Calendar
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-blue-100 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-500"
                  >
                    👋 Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link 
                    to="/login" 
                    className="text-blue-100 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-500"
                  >
                    🔑 Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    ⭐ Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">✨ Premier Prime</h3>
              <p className="text-gray-300">Premier Prime - Making your space shine with professional cleaning services. Your satisfaction is our priority!</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">📞 Contact</h3>
              <p className="text-gray-300">Phone: (561) 452-3128</p>
              <p className="text-gray-300">Email: test@premierprime.com</p>
              <p className="text-gray-300">Hours: Mon-Sat 8AM-6PM</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">🌟 Services</h3>
              <ul className="text-gray-300 space-y-1">
                <li>🏠 Residential Cleaning</li>
                <li>🏢 Commercial Cleaning</li>
                <li>✨ Deep Cleaning</li>
                <li>🔄 Regular Maintenance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Premier Prime. Made with ❤️ for cleaner spaces.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;