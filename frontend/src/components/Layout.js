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
      <div className="w-full bg-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between text-base sm:text-lg">
          <p className="font-medium">Serving Jupiter, Palm Beach Gardens, Tequesta & surrounding areas</p>
          <a href="tel:+15614523128" className="flex items-center gap-2 font-semibold hover:text-gold-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            (561) 452-3128
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-brand-700 flex items-center justify-center text-gold-400" aria-hidden>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <Link to="/" className="font-bold tracking-tight text-xl text-brand-800 leading-tight block">
                PREMIER PRIME <span className="text-gold-600">SERVICES</span>
              </Link>
              <p className="text-xs text-zinc-500 -mt-0.5 tracking-wide uppercase">Professional Cleaning & Home Organization</p>
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
                <Link to="/quote" className="hidden sm:inline-flex px-6 py-3 text-lg rounded-xl bg-brand-700 text-white font-medium shadow hover:bg-brand-800">
                  Request a Free Quote
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
      <footer className="mt-20 bg-brand-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-gold-400 text-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p className="font-semibold text-xl">Premier Prime <span className="text-gold-400">Services</span></p>
            </div>
            <p className="mt-3 text-white/70 text-lg">Trusted cleaners for homes and offices across Palm Beach County.</p>
          </div>
          <div>
            <p className="font-semibold text-xl mb-4">Company</p>
            <ul className="mt-3 space-y-2 text-white/70 text-lg">
              <li><Link to="/" className="hover:text-gold-400">Home</Link></li>
              <li><Link to="/guest-booking" className="hover:text-gold-400">Book</Link></li>
              <li><Link to="/quote" className="hover:text-gold-400">Quote</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xl mb-4">Services</p>
            <ul className="mt-3 space-y-2 text-white/70 text-lg">
              <li><Link to="/services/residential" className="hover:text-gold-400">Residential Cleaning</Link></li>
              <li><Link to="/services/commercial" className="hover:text-gold-400">Office & Commercial</Link></li>
              <li><Link to="/services/airbnb" className="hover:text-gold-400">Airbnb Turnover</Link></li>
              <li><Link to="/services/custom" className="hover:text-gold-400">Custom Cleaning</Link></li>
              <li><Link to="/services/post-renovation" className="hover:text-gold-400">Post-Renovation</Link></li>
              <li><Link to="/services/move-in-out" className="hover:text-gold-400">Move In/Out</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xl mb-4">Get in touch</p>
            <ul className="mt-3 space-y-2 text-white/70 text-lg">
              <li>adaperez@premierprime.org</li>
              <li>(561) 452-3128</li>
              <li>Palm Beach County, FL</li>
            </ul>
          </div>
        </div>
        <div className="text-base text-white/50 py-6 text-center border-t border-white/10">© {new Date().getFullYear()} Premier Prime Services — All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Layout;