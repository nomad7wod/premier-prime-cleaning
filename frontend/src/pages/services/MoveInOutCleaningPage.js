import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MoveInOutCleaningPage = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/guest-booking', { state: { selectedService: 'Move In/Out Deep Cleaning' } });
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/services/move-in-out.jpg" 
            alt="Move In/Out Deep Cleaning" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 h-full flex items-center bg-black bg-opacity-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl font-bold mb-4">Move In/Out Deep Cleaning</h1>
            <p className="text-2xl mb-6">Start fresh in your new home or leave your old place spotless</p>
            <button onClick={handleBookNow} className="bg-white text-red-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Book This Service →
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">About This Service</h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Moving is stressful enough without worrying about cleaning. Our move in/out deep cleaning service takes care of every detail, whether you're preparing to welcome new occupants or ensuring you get your full security deposit back.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We clean empty homes from top to bottom, reaching areas that are usually hidden by furniture. This thorough approach ensures the space is fresh, sanitized, and ready for its next chapter.
            </p>
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-red-900">Perfect For</h3>
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start"><span className="text-red-600 mr-2 text-xl">✓</span><span>Landlords between tenants</span></li>
                <li className="flex items-start"><span className="text-red-600 mr-2 text-xl">✓</span><span>Homeowners selling property</span></li>
                <li className="flex items-start"><span className="text-red-600 mr-2 text-xl">✓</span><span>Renters moving out</span></li>
                <li className="flex items-start"><span className="text-red-600 mr-2 text-xl">✓</span><span>New homeowners moving in</span></li>
                <li className="flex items-start"><span className="text-red-600 mr-2 text-xl">✓</span><span>Real estate staging prep</span></li>
              </ul>
            </div>
          </div>
          <div>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-6">Service Options</h3>
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-red-600">Move-Out Cleaning</h4>
                  <p className="text-base text-gray-600">Deep clean to secure your deposit and leave on good terms</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-red-600">Move-In Cleaning</h4>
                  <p className="text-base text-gray-600">Fresh start in your new home with sanitized surfaces</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-red-600">Turnover Service</h4>
                  <p className="text-base text-gray-600">For landlords: complete cleaning between tenants</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-red-600">Sale Prep Cleaning</h4>
                  <p className="text-base text-gray-600">Make your home show-ready for potential buyers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-center">Complete Deep Clean Checklist</h2>
          <p className="text-xl text-gray-600 text-center mb-12">Every corner, every surface, spotless</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🍳</div>
              <h3 className="text-2xl font-semibold mb-4">Kitchen Deep Clean</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Inside/outside all cabinets</li>
                <li>• Inside refrigerator & freezer</li>
                <li>• Inside oven & microwave</li>
                <li>• Behind/under appliances</li>
                <li>• Countertops & backsplash</li>
                <li>• Sink & faucet polish</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🚿</div>
              <h3 className="text-2xl font-semibold mb-4">Bathroom Detailing</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Scrub tub, shower, tiles & grout</li>
                <li>• Deep clean toilet (all parts)</li>
                <li>• Inside cabinets & drawers</li>
                <li>• Polish all fixtures & mirrors</li>
                <li>• Exhaust fan cleaning</li>
                <li>• Floor scrub & sanitize</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🛏️</div>
              <h3 className="text-2xl font-semibold mb-4">Bedrooms & Closets</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Dust ceiling fans & light fixtures</li>
                <li>• Clean inside all closets</li>
                <li>• Wipe down shelves & rods</li>
                <li>• Windows & window sills</li>
                <li>• Vacuum/mop all floors</li>
                <li>• Dust baseboards & trim</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🛋️</div>
              <h3 className="text-2xl font-semibold mb-4">Living Areas</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Dust all surfaces & shelves</li>
                <li>• Clean light switches & outlets</li>
                <li>• Wipe door frames & doors</li>
                <li>• Clean windows inside/out</li>
                <li>• Vacuum or mop all floors</li>
                <li>• Cobweb removal</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-2xl font-semibold mb-4">Additional Areas</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Laundry room deep clean</li>
                <li>• Garage sweep (if applicable)</li>
                <li>• Patio/balcony cleaning</li>
                <li>• Inside windows throughout</li>
                <li>• Air vents & returns</li>
                <li>• Light fixture cleaning</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-red-500">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-semibold mb-4 text-red-600">Extra Touches</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Baseboard deep cleaning</li>
                <li>• Door & cabinet hardware polish</li>
                <li>• Switch plates wiped</li>
                <li>• Blinds dusting</li>
                <li>• Final walkthrough inspection</li>
                <li>• Photo documentation available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold mb-4 text-center">What Our Customers Say</h2>
        <p className="text-xl text-gray-600 text-center mb-12">Trusted for stress-free moves</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-4"><div className="text-yellow-400 text-2xl">★★★★★</div></div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "Got my full deposit back thanks to Premier Prime! They cleaned areas I didn't even think of. The landlord was impressed. Worth every penny!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">A</div>
              <div className="ml-4">
                <p className="font-semibold text-base">Amanda Wilson</p>
                <p className="text-sm text-gray-500">Former Tenant</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-4"><div className="text-yellow-400 text-2xl">★★★★★</div></div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "Moving into a spotless home made all the difference. Everything smelled fresh and looked brand new. Highly recommend for anyone moving!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">C</div>
              <div className="ml-4">
                <p className="font-semibold text-base">Carlos Garcia</p>
                <p className="text-sm text-gray-500">New Homeowner</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-4"><div className="text-yellow-400 text-2xl">★★★★★</div></div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "As a landlord, I use them for every tenant turnover. Fast, thorough, and professional. My properties are always rent-ready on time."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">P</div>
              <div className="ml-4">
                <p className="font-semibold text-base">Patricia Lee</p>
                <p className="text-sm text-gray-500">Property Manager</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-red-600 to-red-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Moving? Let Us Handle the Cleaning!</h2>
          <p className="text-xl mb-8">Focus on your move, we'll make it spotless</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleBookNow} className="bg-white text-red-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Book This Service
            </button>
            <Link to="/quote" state={{ selectedService: 'Move In/Out Deep Cleaning' }} className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-red-600 transition-all inline-block">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MoveInOutCleaningPage;
