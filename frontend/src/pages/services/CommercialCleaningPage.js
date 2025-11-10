import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CommercialCleaningPage = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/guest-booking', { state: { selectedService: 'Office & Commercial Cleaning' } });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/services/commercial.jpg" 
            alt="Office and Commercial Cleaning" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 h-full flex items-center bg-black bg-opacity-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl font-bold mb-4">Office & Commercial Cleaning</h1>
            <p className="text-2xl mb-6">Maintain a professional, productive environment with our commercial cleaning services</p>
            <button
              onClick={handleBookNow}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Book This Service →
            </button>
          </div>
        </div>
      </section>

      {/* About This Service */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">About This Service</h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              A clean workspace is a productive workspace. Our commercial cleaning services ensure your office, retail space, or facility maintains a professional appearance that impresses clients and motivates employees.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We work around your schedule, providing after-hours or flexible cleaning times that don't disrupt your business operations. Our trained team uses commercial-grade equipment and proven techniques to deliver consistently excellent results.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Why Choose Us?</h3>
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 text-xl">✓</span>
                  <span>Flexible scheduling (after-hours, weekends)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 text-xl">✓</span>
                  <span>Commercial-grade equipment and products</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 text-xl">✓</span>
                  <span>Background-checked, uniformed staff</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 text-xl">✓</span>
                  <span>Customized cleaning plans</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 text-xl">✓</span>
                  <span>Fully insured and bonded</span>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-6">We Serve</h3>
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-blue-600">Office Buildings</h4>
                  <p className="text-base text-gray-600">Corporate offices, coworking spaces, executive suites</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-blue-600">Retail Spaces</h4>
                  <p className="text-base text-gray-600">Stores, boutiques, showrooms, shopping centers</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-blue-600">Medical Facilities</h4>
                  <p className="text-base text-gray-600">Clinics, dental offices, therapy centers</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-blue-600">Other Commercial</h4>
                  <p className="text-base text-gray-600">Restaurants, gyms, warehouses, and more</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cleaning Details */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-center">What's Included</h2>
          <p className="text-xl text-gray-600 text-center mb-12">Comprehensive commercial cleaning services</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-2xl font-semibold mb-4">Workspaces</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Dust desks and surfaces</li>
                <li>• Empty trash and recycling</li>
                <li>• Vacuum carpets and floors</li>
                <li>• Wipe down monitors and phones</li>
                <li>• Sanitize keyboards and mice</li>
                <li>• Organize desk areas</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🚪</div>
              <h3 className="text-2xl font-semibold mb-4">Common Areas</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Lobby and reception cleaning</li>
                <li>• Dust and wipe furniture</li>
                <li>• Clean glass doors and windows</li>
                <li>• Vacuum or mop floors</li>
                <li>• Sanitize door handles</li>
                <li>• Empty waste receptacles</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🚻</div>
              <h3 className="text-2xl font-semibold mb-4">Restrooms</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Clean and disinfect toilets</li>
                <li>• Sanitize sinks and counters</li>
                <li>• Polish mirrors and fixtures</li>
                <li>• Refill soap and paper products</li>
                <li>• Mop floors with disinfectant</li>
                <li>• Remove trash</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">☕</div>
              <h3 className="text-2xl font-semibold mb-4">Break Rooms</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Clean countertops and tables</li>
                <li>• Wipe down appliances</li>
                <li>• Clean microwave inside/out</li>
                <li>• Empty trash and recycling</li>
                <li>• Sweep and mop floors</li>
                <li>• Organize common items</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-semibold mb-4">Conference Rooms</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Clean tables and chairs</li>
                <li>• Dust surfaces and equipment</li>
                <li>• Clean whiteboards/glass boards</li>
                <li>• Vacuum or mop floors</li>
                <li>• Empty trash bins</li>
                <li>• Organize materials neatly</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-500 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Specialized Services</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Floor stripping and waxing</li>
                <li>• Carpet deep cleaning</li>
                <li>• Window cleaning (interior/exterior)</li>
                <li>• Disinfection services</li>
                <li>• Post-construction cleanup</li>
                <li>• Green cleaning options</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold mb-4 text-center">What Our Clients Say</h2>
        <p className="text-xl text-gray-600 text-center mb-12">Trusted by businesses across Palm Beach County</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 text-2xl">★★★★★</div>
            </div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "Premier Prime has been cleaning our office for over a year. They're reliable, thorough, and our team loves coming into a fresh, clean workspace every morning."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                R
              </div>
              <div className="ml-4">
                <p className="font-semibold text-base">Robert Chen</p>
                <p className="text-sm text-gray-500">CEO, Tech Solutions Inc.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 text-2xl">★★★★★</div>
            </div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "Professional service at competitive rates. They work quietly after hours and never disrupt our operations. Our clients always comment on how clean our showroom looks."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                S
              </div>
              <div className="ml-4">
                <p className="font-semibold text-base">Sarah Martinez</p>
                <p className="text-sm text-gray-500">Owner, Luxury Auto Gallery</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 text-2xl">★★★★★</div>
            </div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "Outstanding attention to detail. They understand the importance of maintaining a sanitary environment in our medical office. Highly recommended!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                D
              </div>
              <div className="ml-4">
                <p className="font-semibold text-base">Dr. Michael Brown</p>
                <p className="text-sm text-gray-500">Family Dental Care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready for a Spotless Workplace?</h2>
          <p className="text-xl mb-8">Get a custom cleaning plan for your business today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookNow}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Book This Service
            </button>
            <Link
              to="/quote"
              state={{ selectedService: 'Office & Commercial Cleaning' }}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all inline-block"
            >
              Get a Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommercialCleaningPage;
