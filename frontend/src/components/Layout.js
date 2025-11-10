import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Announcement Bar */}
      <div className="w-full bg-brand-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between text-base sm:text-lg">
          <p className="font-medium">Serving Florida & surrounding areas — 7 days a week</p>
          <a href="tel:+15614523128" className="underline font-semibold">(561) 452-3128</a>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-brand-600 flex items-center justify-center text-white text-2xl" aria-hidden>
              ✨
            </div>
            <div>
              <Link to="/" className="font-semibold tracking-tight text-xl">Premier Prime</Link>
              <p className="text-base text-zinc-500 -mt-0.5">Professional Cleaning Services</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-lg">
            <Link to="/" className="hover:text-brand-700 font-medium">Home</Link>
            
            {/* Services Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="hover:text-brand-700 font-medium flex items-center gap-1">
                Services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {servicesOpen && (
                <div 
                  className="absolute top-full left-0 mt-0 w-64 bg-white border border-zinc-200 rounded-xl shadow-xl py-2 z-50"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link to="/services/residential" className="block px-4 py-3 text-base hover:bg-brand-50 hover:text-brand-700 transition-colors">
                    Residential Cleaning
                  </Link>
                  <Link to="/services/commercial" className="block px-4 py-3 text-base hover:bg-brand-50 hover:text-brand-700 transition-colors">
                    Office & Commercial
                  </Link>
                  <Link to="/services/airbnb" className="block px-4 py-3 text-base hover:bg-brand-50 hover:text-brand-700 transition-colors">
                    Airbnb Turnover
                  </Link>
                  <Link to="/services/custom" className="block px-4 py-3 text-base hover:bg-brand-50 hover:text-brand-700 transition-colors">
                    Custom Cleaning
                  </Link>
                  <Link to="/services/post-renovation" className="block px-4 py-3 text-base hover:bg-brand-50 hover:text-brand-700 transition-colors">
                    Post-Renovation
                  </Link>
                  <Link to="/services/move-in-out" className="block px-4 py-3 text-base hover:bg-brand-50 hover:text-brand-700 transition-colors">
                    Move In/Out
                  </Link>
                </div>
              )}
            </div>

            {/* About Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button className="hover:text-brand-700 font-medium flex items-center gap-1">
                About
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {aboutOpen && (
                <div 
                  className="absolute top-full left-0 mt-0 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl py-2 z-50"
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <Link to="/about" className="block px-4 py-3 text-base hover:bg-brand-50 hover:text-brand-700 transition-colors">
                    Our Story
                  </Link>
                  <Link to="/about#why-choose-us" className="block px-4 py-3 text-base hover:bg-brand-50 hover:text-brand-700 transition-colors">
                    Why Choose Us
                  </Link>
                  <Link to="/about#team" className="block px-4 py-3 text-base hover:bg-brand-50 hover:text-brand-700 transition-colors">
                    Our Team
                  </Link>
                </div>
              )}
            </div>

            {/* Areas We Serve Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setAreasOpen(true)}
              onMouseLeave={() => setAreasOpen(false)}
            >
              <button className="hover:text-brand-700 font-medium flex items-center gap-1">
                Areas
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {areasOpen && (
                <div 
                  className="absolute top-full left-0 mt-0 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl py-2 z-50"
                  onMouseEnter={() => setAreasOpen(true)}
                  onMouseLeave={() => setAreasOpen(false)}
                >
                  <Link to="/areas" className="block px-4 py-3 text-base hover:bg-brand-50 hover:text-brand-700 transition-colors">
                    Palm Beach County
                  </Link>
                  <div className="border-t border-zinc-100 my-2"></div>
                  <div className="px-4 py-2 text-sm text-zinc-500">We serve all cities in Palm Beach County</div>
                </div>
              )}
            </div>

            <Link to="/guest-booking" className="hover:text-brand-700 font-medium">Book</Link>
            <Link to="/quote" className="hover:text-brand-700 font-medium">Quote</Link>
            {user && user.role === 'admin' && (
              <>
                <Link to="/admin" className="hover:text-brand-700 font-medium">Admin</Link>
                <Link to="/admin/calendar" className="hover:text-brand-700 font-medium">Calendar</Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-lg text-zinc-600 hidden sm:inline">Welcome, {user.first_name}!</span>
                <button
                  onClick={handleLogout}
                  className="text-lg px-4 py-2 rounded-lg hover:bg-zinc-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-lg px-4 py-2 rounded-lg hover:bg-zinc-100">
                  Login
                </Link>
                <Link to="/guest-booking" className="hidden sm:inline-flex px-6 py-3 text-lg rounded-xl bg-brand-600 text-white font-medium shadow hover:bg-brand-700">
                  Book now
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-12 w-12 rounded-full bg-brand-600 flex items-center justify-center text-white text-xl">
                ✨
              </div>
              <p className="font-semibold text-xl">Premier Prime</p>
            </div>
            <p className="mt-3 text-zinc-600 text-lg">Trusted cleaners for homes and offices across Florida.</p>
          </div>
          <div>
            <p className="font-semibold text-xl mb-4">Company</p>
            <ul className="mt-3 space-y-2 text-zinc-600 text-lg">
              <li><Link to="/" className="hover:text-brand-700">Home</Link></li>
              <li><Link to="/guest-booking" className="hover:text-brand-700">Book</Link></li>
              <li><Link to="/quote" className="hover:text-brand-700">Quote</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xl mb-4">Services</p>
            <ul className="mt-3 space-y-2 text-zinc-600 text-lg">
              <li><Link to="/services/residential" className="hover:text-brand-700">Residential Cleaning</Link></li>
              <li><Link to="/services/commercial" className="hover:text-brand-700">Office & Commercial</Link></li>
              <li><Link to="/services/airbnb" className="hover:text-brand-700">Airbnb Turnover</Link></li>
              <li><Link to="/services/custom" className="hover:text-brand-700">Custom Cleaning</Link></li>
              <li><Link to="/services/post-renovation" className="hover:text-brand-700">Post-Renovation</Link></li>
              <li><Link to="/services/move-in-out" className="hover:text-brand-700">Move In/Out</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xl mb-4">Get in touch</p>
            <ul className="mt-3 space-y-2 text-zinc-600 text-lg">
              <li>adaperez@premierprime.org</li>
              <li>(561) 452-3128</li>
              <li>Florida, USA</li>
            </ul>
          </div>
        </div>
        <div className="text-base text-zinc-400 py-6 text-center">© {new Date().getFullYear()} Premier Prime — All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Layout;