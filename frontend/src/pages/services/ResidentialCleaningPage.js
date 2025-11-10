import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ResidentialCleaningPage = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/guest-booking', { state: { selectedService: 'Residential Cleaning' } });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/services/residential.jpg" 
            alt="Residential Cleaning" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 h-full flex items-center bg-black bg-opacity-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl font-bold mb-4">Residential Cleaning</h1>
            <p className="text-2xl mb-6">Keep your home spotless with our professional cleaning services</p>
            <button
              onClick={handleBookNow}
              className="bg-white text-brand-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
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
              Our residential cleaning service is perfect for busy families who want to come home to a spotless house without the hassle of cleaning themselves. Whether you need a one-time deep clean or regular weekly service, we've got you covered.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We understand that your home is your sanctuary. That's why our trained professionals treat your space with the utmost care and attention to detail. Using eco-friendly products and proven cleaning techniques, we ensure every corner of your home shines.
            </p>
            <div className="bg-brand-50 border-l-4 border-brand-600 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-brand-900">Why Choose Us?</h3>
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-brand-600 mr-2 text-xl">✓</span>
                  <span>Vetted and background-checked cleaners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-600 mr-2 text-xl">✓</span>
                  <span>Eco-friendly, non-toxic products</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-600 mr-2 text-xl">✓</span>
                  <span>Flexible scheduling - weekly, bi-weekly, or monthly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-600 mr-2 text-xl">✓</span>
                  <span>100% satisfaction guarantee</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-600 mr-2 text-xl">✓</span>
                  <span>Fully insured and bonded</span>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-6">Service Options</h3>
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-brand-600">Weekly Cleaning</h4>
                  <p className="text-base text-gray-600">Regular maintenance to keep your home consistently clean and fresh</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-brand-600">Bi-Weekly Cleaning</h4>
                  <p className="text-base text-gray-600">Perfect balance of cleanliness and budget for most families</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-brand-600">Monthly Deep Clean</h4>
                  <p className="text-base text-gray-600">Thorough cleaning for the entire home, top to bottom</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-brand-600">One-Time Cleaning</h4>
                  <p className="text-base text-gray-600">Special occasions, events, or move-in preparation</p>
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
          <p className="text-xl text-gray-600 text-center mb-12">Comprehensive cleaning for every room in your home</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🛋️</div>
              <h3 className="text-2xl font-semibold mb-4">Living Areas</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Dust all surfaces and furniture</li>
                <li>• Vacuum carpets and rugs</li>
                <li>• Mop hard floors</li>
                <li>• Clean glass surfaces and mirrors</li>
                <li>• Empty and clean trash bins</li>
                <li>• Straighten cushions and pillows</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🍳</div>
              <h3 className="text-2xl font-semibold mb-4">Kitchen</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Clean and sanitize countertops</li>
                <li>• Clean exterior of appliances</li>
                <li>• Clean and shine sink and faucet</li>
                <li>• Sweep and mop floors</li>
                <li>• Wipe down cabinet fronts</li>
                <li>• Take out trash and recycling</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🚿</div>
              <h3 className="text-2xl font-semibold mb-4">Bathrooms</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Scrub and disinfect toilet</li>
                <li>• Clean shower/tub and tiles</li>
                <li>• Clean sink, vanity, and countertops</li>
                <li>• Polish mirrors and fixtures</li>
                <li>• Sweep and mop floors</li>
                <li>• Replace towels (if provided)</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🛏️</div>
              <h3 className="text-2xl font-semibold mb-4">Bedrooms</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Dust all furniture and surfaces</li>
                <li>• Make beds (change linens if provided)</li>
                <li>• Vacuum carpets and hard floors</li>
                <li>• Clean mirrors and glass</li>
                <li>• Empty trash bins</li>
                <li>• Organize visible items neatly</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🪟</div>
              <h3 className="text-2xl font-semibold mb-4">Additional Areas</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Hallways and staircases</li>
                <li>• Entryway and mudroom</li>
                <li>• Dust baseboards and trim</li>
                <li>• Wipe light switches and handles</li>
                <li>• Clean window sills</li>
                <li>• Pet areas (if applicable)</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-brand-500 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold mb-4 text-brand-600">Add-On Services</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Interior window cleaning</li>
                <li>• Inside refrigerator cleaning</li>
                <li>• Inside oven cleaning</li>
                <li>• Laundry wash & fold</li>
                <li>• Carpet deep cleaning</li>
                <li>• Wall washing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold mb-4 text-center">What Our Customers Say</h2>
        <p className="text-xl text-gray-600 text-center mb-12">Real reviews from satisfied homeowners in Palm Beach County</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 text-2xl">★★★★★</div>
            </div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "The team from Premier Prime did an amazing job! My house has never looked better. They were professional, thorough, and respectful of our home and belongings."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-2xl">
                M
              </div>
              <div className="ml-4">
                <p className="font-semibold text-base">Maria Rodriguez</p>
                <p className="text-sm text-gray-500">West Palm Beach, FL</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 text-2xl">★★★★★</div>
            </div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "I've been using their weekly service for 6 months now. Always punctual, always excellent work. My home sparkles every time. Worth every penny!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-2xl">
                J
              </div>
              <div className="ml-4">
                <p className="font-semibold text-base">Jennifer Smith</p>
                <p className="text-sm text-gray-500">Boca Raton, FL</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 text-2xl">★★★★★</div>
            </div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "Fantastic service! They pay attention to every detail and use eco-friendly products which is very important to my family. Highly recommend!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-2xl">
                D
              </div>
              <div className="ml-4">
                <p className="font-semibold text-base">David Thompson</p>
                <p className="text-sm text-gray-500">Delray Beach, FL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready for a Spotless Home?</h2>
          <p className="text-xl mb-8">Book your residential cleaning service today and experience the Premier Prime difference</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookNow}
              className="bg-white text-brand-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Book This Service
            </button>
            <Link
              to="/quote"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-brand-600 transition-all inline-block"
            >
              Get a Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResidentialCleaningPage;
