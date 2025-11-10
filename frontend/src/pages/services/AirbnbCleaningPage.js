import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AirbnbCleaningPage = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/guest-booking', { state: { selectedService: 'Airbnb Turnover Cleaning' } });
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/services/airbnb.jpg" 
            alt="Airbnb Turnaround Cleaning" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 h-full flex items-center bg-black bg-opacity-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl font-bold mb-4">Airbnb Turnover Cleaning</h1>
            <p className="text-2xl mb-6">Fast, thorough cleaning between guests - maximize your bookings with 5-star reviews</p>
            <button onClick={handleBookNow} className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
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
              Running an Airbnb requires quick turnarounds and consistently high standards. Our specialized Airbnb cleaning service ensures your property is guest-ready, spotless, and earns those crucial 5-star reviews.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We understand the tight schedules of vacation rentals. Our team works efficiently to have your property sparkling between check-out and check-in, with attention to every detail your guests will notice.
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-purple-900">Why Hosts Choose Us</h3>
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start"><span className="text-purple-600 mr-2 text-xl">✓</span><span>Same-day turnover available</span></li>
                <li className="flex items-start"><span className="text-purple-600 mr-2 text-xl">✓</span><span>Detailed checklist approach</span></li>
                <li className="flex items-start"><span className="text-purple-600 mr-2 text-xl">✓</span><span>Fresh linen service option</span></li>
                <li className="flex items-start"><span className="text-purple-600 mr-2 text-xl">✓</span><span>Photo documentation provided</span></li>
                <li className="flex items-start"><span className="text-purple-600 mr-2 text-xl">✓</span><span>Last-minute booking accommodated</span></li>
              </ul>
            </div>
          </div>
          <div>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-6">Service Includes</h3>
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-purple-600">Standard Turnover</h4>
                  <p className="text-base text-gray-600">Complete cleaning, linen change, restocking essentials</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-purple-600">Deep Clean Package</h4>
                  <p className="text-base text-gray-600">Monthly deep clean with turnover service</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-purple-600">Inspection Service</h4>
                  <p className="text-base text-gray-600">Damage check and photo report</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-purple-600">Emergency Service</h4>
                  <p className="text-base text-gray-600">Last-minute cancellations and quick turnarounds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-center">Our Turnover Checklist</h2>
          <p className="text-xl text-gray-600 text-center mb-12">Everything your guests expect and more</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🛏️</div>
              <h3 className="text-2xl font-semibold mb-4">Bedrooms</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Strip and remake all beds</li>
                <li>• Fresh linens and pillowcases</li>
                <li>• Dust all surfaces</li>
                <li>• Vacuum floors thoroughly</li>
                <li>• Check under beds</li>
                <li>• Empty all drawers</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🚿</div>
              <h3 className="text-2xl font-semibold mb-4">Bathrooms</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Scrub toilet, tub, shower</li>
                <li>• Clean and shine fixtures</li>
                <li>• Fresh towels and bath mat</li>
                <li>• Restock toilet paper & soap</li>
                <li>• Polish mirrors spotless</li>
                <li>• Mop floors</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🍳</div>
              <h3 className="text-2xl font-semibold mb-4">Kitchen</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Clean all appliances inside/out</li>
                <li>• Wipe counters and backsplash</li>
                <li>• Check and empty refrigerator</li>
                <li>• Clean dishes if left</li>
                <li>• Sweep and mop floors</li>
                <li>• Take out trash</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🛋️</div>
              <h3 className="text-2xl font-semibold mb-4">Living Areas</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Dust all surfaces</li>
                <li>• Vacuum/mop all floors</li>
                <li>• Fluff cushions and pillows</li>
                <li>• Clean windows and mirrors</li>
                <li>• Remove all personal items</li>
                <li>• Empty trash bins</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-semibold mb-4">Final Touches</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Replace amenities</li>
                <li>• Check all light bulbs</li>
                <li>• Adjust thermostat</li>
                <li>• Lock all windows/doors</li>
                <li>• Photo documentation</li>
                <li>• Host notification sent</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-500">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold mb-4 text-purple-600">Add-Ons</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Laundry service</li>
                <li>• Pool/patio cleaning</li>
                <li>• Welcome basket setup</li>
                <li>• Deep carpet cleaning</li>
                <li>• Key exchange service</li>
                <li>• Maintenance reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold mb-4 text-center">What Hosts Say</h2>
        <p className="text-xl text-gray-600 text-center mb-12">Trusted by Airbnb Superhosts</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-4"><div className="text-yellow-400 text-2xl">★★★★★</div></div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "Game changer for my Airbnb business! They're fast, reliable, and my guests always mention how clean the place is. My ratings went up after switching to Premier Prime."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">L</div>
              <div className="ml-4">
                <p className="font-semibold text-base">Lisa Johnson</p>
                <p className="text-sm text-gray-500">Airbnb Superhost, 3 Properties</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-4"><div className="text-yellow-400 text-2xl">★★★★★</div></div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "They handle everything - cleaning, laundry, even restocking. I can manage my property remotely without worry. Worth every penny!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">T</div>
              <div className="ml-4">
                <p className="font-semibold text-base">Tom Rivera</p>
                <p className="text-sm text-gray-500">Property Manager</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-4"><div className="text-yellow-400 text-2xl">★★★★★</div></div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "Professional and consistent. They understand the Airbnb business and work around my booking schedule perfectly. Highly recommend!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">K</div>
              <div className="ml-4">
                <p className="font-semibold text-base">Karen White</p>
                <p className="text-sm text-gray-500">Vacation Rental Owner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-600 to-purple-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready for 5-Star Reviews?</h2>
          <p className="text-xl mb-8">Let us handle the cleaning while you focus on hosting</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleBookNow} className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Book This Service
            </button>
            <Link to="/quote" state={{ selectedService: 'Airbnb Turnover Cleaning' }} className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all inline-block">
              Get a Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AirbnbCleaningPage;
