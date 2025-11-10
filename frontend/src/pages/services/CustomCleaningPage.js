import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CustomCleaningPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/services/custom.jpg" 
            alt="Custom Cleaning Services" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 h-full flex items-center bg-black bg-opacity-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl font-bold mb-4">Custom Cleaning Services</h1>
            <p className="text-2xl mb-6">Tailored cleaning solutions designed specifically for your unique needs</p>
            <Link to="/quote" state={{ selectedService: 'Custom Cleaning' }} className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Get a Custom Quote →
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">About This Service</h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Every space is unique, and so are your cleaning needs. Our custom cleaning service allows you to create a personalized cleaning plan that fits your specific requirements, schedule, and budget.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Whether you need specialized cleaning for unique surfaces, flexible scheduling, or a combination of services, we work with you to design the perfect cleaning solution. No job is too unique or too challenging for our experienced team.
            </p>
            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-green-900">Custom Options Include</h3>
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start"><span className="text-green-600 mr-2 text-xl">✓</span><span>Flexible scheduling</span></li>
                <li className="flex items-start"><span className="text-green-600 mr-2 text-xl">✓</span><span>Specialized equipment/products</span></li>
                <li className="flex items-start"><span className="text-green-600 mr-2 text-xl">✓</span><span>Unique space requirements</span></li>
                <li className="flex items-start"><span className="text-green-600 mr-2 text-xl">✓</span><span>Combination services</span></li>
                <li className="flex items-start"><span className="text-green-600 mr-2 text-xl">✓</span><span>One-time or recurring</span></li>
              </ul>
            </div>
          </div>
          <div>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-6">Popular Custom Plans</h3>
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-green-600">Event Cleaning</h4>
                  <p className="text-base text-gray-600">Pre/post event setup and cleanup</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-green-600">Seasonal Deep Clean</h4>
                  <p className="text-base text-gray-600">Spring cleaning or seasonal maintenance</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-green-600">Specialty Spaces</h4>
                  <p className="text-base text-gray-600">Garages, basements, attics, storage areas</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-green-600">Combined Services</h4>
                  <p className="text-base text-gray-600">Mix residential, office, and specialized cleaning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-center">Custom Service Examples</h2>
          <p className="text-xl text-gray-600 text-center mb-12">We can handle virtually any cleaning challenge</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-semibold mb-4">Event Spaces</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Pre-event setup cleaning</li>
                <li>• Post-event cleanup</li>
                <li>• Venue restoration</li>
                <li>• Tent and outdoor areas</li>
                <li>• Same-day service available</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🏚️</div>
              <h3 className="text-2xl font-semibold mb-4">Specialty Areas</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Garage organization & cleaning</li>
                <li>• Basement deep cleaning</li>
                <li>• Attic dust removal</li>
                <li>• Workshop cleaning</li>
                <li>• Storage unit cleanup</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-2xl font-semibold mb-4">Green Cleaning</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• 100% eco-friendly products</li>
                <li>• Allergy-sensitive cleaning</li>
                <li>• Chemical-free options</li>
                <li>• Pet-safe solutions</li>
                <li>• Sustainable practices</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🏋️</div>
              <h3 className="text-2xl font-semibold mb-4">Specialized Facilities</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Gym equipment sanitizing</li>
                <li>• Studio cleaning (yoga, dance)</li>
                <li>• Salon & spa services</li>
                <li>• Pet grooming facilities</li>
                <li>• Daycare centers</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-semibold mb-4">Unique Requests</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Art studio cleaning</li>
                <li>• Antique care</li>
                <li>• Delicate surface cleaning</li>
                <li>• Historical property care</li>
                <li>• Luxury item maintenance</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-500">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-semibold mb-4 text-green-600">Your Idea?</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Tell us what you need</li>
                <li>• We'll create a plan</li>
                <li>• Flexible scheduling</li>
                <li>• Custom pricing</li>
                <li>• No job too unique!</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p className="text-base text-gray-600">Tell us about your unique cleaning needs</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Consultation</h3>
            <p className="text-base text-gray-600">We discuss your requirements and create a plan</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Custom Quote</h3>
            <p className="text-base text-gray-600">Receive a detailed proposal and pricing</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">4</div>
            <h3 className="text-xl font-semibold mb-2">We Clean</h3>
            <p className="text-base text-gray-600">Expert service exactly as specified</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-600 to-green-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Let's Create Your Perfect Cleaning Plan</h2>
          <p className="text-xl mb-8">Every space deserves personalized care</p>
          <Link to="/quote" state={{ selectedService: 'Custom Cleaning' }} className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
            Get a Custom Quote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CustomCleaningPage;
