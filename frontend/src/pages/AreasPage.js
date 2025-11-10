import React from 'react';
import { Link } from 'react-router-dom';

const AreasPage = () => {
  const cities = [
    'West Palm Beach', 'Boca Raton', 'Delray Beach', 'Boynton Beach',
    'Wellington', 'Jupiter', 'Palm Beach Gardens', 'Lake Worth',
    'Royal Palm Beach', 'Greenacres', 'Riviera Beach', 'North Palm Beach',
    'Palm Beach', 'Juno Beach', 'Tequesta', 'Palm Springs',
    'Lantana', 'Atlantis', 'Belle Glade', 'South Bay'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Areas We Serve</h1>
          <p className="text-2xl max-w-3xl mx-auto leading-relaxed">
            Professional cleaning services throughout Palm Beach County, Florida
          </p>
        </div>
      </section>

      {/* Main Coverage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Palm Beach County</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We proudly serve all communities across Palm Beach County with reliable, professional cleaning services. From residential homes to commercial offices, we're here to keep your space spotless.
          </p>
        </div>

        {/* Service Area Map Placeholder */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-3xl p-16 text-center">
            <div className="text-9xl mb-6">🗺️</div>
            <p className="text-2xl font-semibold text-brand-700 mb-4">Serving All of Palm Beach County</p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our mobile cleaning teams are strategically located to serve you efficiently throughout the county. We typically arrive within 30-60 minutes of your scheduled time.
            </p>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8">Cities & Communities We Serve</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.map((city) => (
              <div key={city} className="bg-white border border-zinc-200 rounded-xl p-4 text-center hover:border-brand-500 hover:shadow-md transition-all">
                <span className="text-lg font-medium text-gray-800">{city}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-base text-gray-500 mt-6">
            Don't see your city? We serve all Palm Beach County locations. <a href="tel:+15614523128" className="text-brand-600 font-semibold hover:underline">Call us</a> to confirm!
          </p>
        </div>
      </section>

      {/* Service Types by Area */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Services Available in All Areas</h2>
            <p className="text-xl text-gray-600">No matter where you are in Palm Beach County, we offer:</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-2xl font-semibold mb-3">Residential Cleaning</h3>
              <p className="text-base text-gray-600 mb-4">Regular or one-time home cleaning services</p>
              <Link to="/services/residential" className="text-brand-600 font-semibold hover:underline">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-2xl font-semibold mb-3">Commercial Cleaning</h3>
              <p className="text-base text-gray-600 mb-4">Office and business cleaning solutions</p>
              <Link to="/services/commercial" className="text-brand-600 font-semibold hover:underline">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">🛏️</div>
              <h3 className="text-2xl font-semibold mb-3">Airbnb Turnover</h3>
              <p className="text-base text-gray-600 mb-4">Fast cleaning between guest stays</p>
              <Link to="/services/airbnb" className="text-brand-600 font-semibold hover:underline">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-2xl font-semibold mb-3">Move In/Out</h3>
              <p className="text-base text-gray-600 mb-4">Deep cleaning for moving day</p>
              <Link to="/services/move-in-out" className="text-brand-600 font-semibold hover:underline">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">🔨</div>
              <h3 className="text-2xl font-semibold mb-3">Post-Renovation</h3>
              <p className="text-base text-gray-600 mb-4">Construction cleanup services</p>
              <Link to="/services/post-renovation" className="text-brand-600 font-semibold hover:underline">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-2xl font-semibold mb-3">Custom Cleaning</h3>
              <p className="text-base text-gray-600 mb-4">Tailored to your unique needs</p>
              <Link to="/services/custom" className="text-brand-600 font-semibold hover:underline">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Cover Palm Beach County */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Why Palm Beach County Trusts Us</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-2xl">🚗</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Local & Fast</h3>
                  <p className="text-base text-gray-600">We're based right here in Palm Beach County. Quick response times, no long-distance delays.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-2xl">👥</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Community Focused</h3>
                  <p className="text-base text-gray-600">We live and work in the communities we serve. Your neighbors are our neighbors.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-2xl">📅</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
                  <p className="text-base text-gray-600">We work around your schedule with same-day and emergency services available.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-2xl">⭐</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Proven Track Record</h3>
                  <p className="text-base text-gray-600">5000+ cleans completed with a 4.9-star average rating from local customers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-100 to-brand-200 rounded-3xl p-12">
            <div className="text-center">
              <div className="text-8xl mb-6">📍</div>
              <h3 className="text-3xl font-bold text-brand-700 mb-4">Serving Palm Beach County</h3>
              <p className="text-xl text-gray-700 mb-6">From coast to coast, north to south</p>
              <div className="space-y-2 text-lg text-gray-600">
                <p>📞 <a href="tel:+15614523128" className="font-semibold hover:text-brand-700">(561) 452-3128</a></p>
                <p>📧 <a href="mailto:adaperez@premierprime.org" className="font-semibold hover:text-brand-700">adaperez@premierprime.org</a></p>
                <p>🌐 <a href="https://premierprime.org" className="font-semibold hover:text-brand-700">premierprime.org</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Details */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Coverage Details</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <div className="text-5xl mb-4">🏘️</div>
              <h3 className="text-2xl font-semibold mb-3">Residential Areas</h3>
              <p className="text-base text-gray-600">All neighborhoods, gated communities, condos, apartments, and single-family homes</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <div className="text-5xl mb-4">🏙️</div>
              <h3 className="text-2xl font-semibold mb-3">Commercial Districts</h3>
              <p className="text-base text-gray-600">Downtown areas, business parks, shopping centers, and office complexes</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <div className="text-5xl mb-4">🌴</div>
              <h3 className="text-2xl font-semibold mb-3">Coastal Areas</h3>
              <p className="text-base text-gray-600">Beachfront properties, oceanview condos, and coastal communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Book in Your Area?</h2>
          <p className="text-xl mb-8">We're just a call away, serving all of Palm Beach County</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/guest-booking" className="inline-block bg-white text-brand-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Book Now
            </Link>
            <a href="tel:+15614523128" className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-brand-600 transition-all">
              Call (561) 452-3128
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AreasPage;
