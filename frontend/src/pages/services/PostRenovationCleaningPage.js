import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PostRenovationCleaningPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/services/post-renovation.jpg" 
            alt="Post-Renovation Cleaning" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 h-full flex items-center bg-black bg-opacity-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl font-bold mb-4">Post-Renovation Cleaning</h1>
            <p className="text-2xl mb-6">Heavy-duty cleanup after construction - transform your space from worksite to showcase</p>
            <Link to="/quote" state={{ selectedService: 'Post-Renovation Cleaning' }} className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Get a Quote →
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">About This Service</h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Construction and renovation leave behind dust, debris, and residue that standard cleaning can't handle. Our post-renovation cleaning service tackles the toughest cleanup jobs, revealing the beauty of your newly renovated space.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              From sawdust and drywall dust to paint splatters and adhesive residue, we have the specialized equipment and expertise to make your space move-in ready. We work closely with contractors and homeowners to ensure a flawless finish.
            </p>
            <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-orange-900">Why Choose Us</h3>
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start"><span className="text-orange-600 mr-2 text-xl">✓</span><span>Specialized construction cleanup equipment</span></li>
                <li className="flex items-start"><span className="text-orange-600 mr-2 text-xl">✓</span><span>Experience with all renovation types</span></li>
                <li className="flex items-start"><span className="text-orange-600 mr-2 text-xl">✓</span><span>Safe removal of construction debris</span></li>
                <li className="flex items-start"><span className="text-orange-600 mr-2 text-xl">✓</span><span>Coordination with contractors</span></li>
                <li className="flex items-start"><span className="text-orange-600 mr-2 text-xl">✓</span><span>Move-in ready guarantee</span></li>
              </ul>
            </div>
          </div>
          <div>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-6">Project Types</h3>
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-orange-600">Residential Renovations</h4>
                  <p className="text-base text-gray-600">Kitchen, bathroom, bedroom, full home remodels</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-orange-600">Commercial Build-Outs</h4>
                  <p className="text-base text-gray-600">Office spaces, retail stores, restaurants</p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="text-xl font-semibold mb-2 text-orange-600">New Construction</h4>
                  <p className="text-base text-gray-600">Final cleanup before move-in or grand opening</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-orange-600">Emergency Cleanup</h4>
                  <p className="text-base text-gray-600">Fire, water, or storm damage restoration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-center">What We Clean</h2>
          <p className="text-xl text-gray-600 text-center mb-12">Comprehensive post-construction cleanup</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">💨</div>
              <h3 className="text-2xl font-semibold mb-4">Dust & Debris</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Fine dust removal from all surfaces</li>
                <li>• Construction debris hauling</li>
                <li>• Drywall dust elimination</li>
                <li>• Sawdust and wood shavings</li>
                <li>• Air duct cleaning</li>
                <li>• Filter replacement</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🪟</div>
              <h3 className="text-2xl font-semibold mb-4">Windows & Glass</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Remove paint and stickers</li>
                <li>• Clean inside and outside</li>
                <li>• Frame and sill cleaning</li>
                <li>• Screen cleaning</li>
                <li>• Mirror polishing</li>
                <li>• Glass door cleaning</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-semibold mb-4">Paint & Adhesives</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Paint splatter removal</li>
                <li>• Sticker and tape residue</li>
                <li>• Grout haze elimination</li>
                <li>• Caulk cleanup</li>
                <li>• Adhesive removal</li>
                <li>• Touch-up protection</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🚪</div>
              <h3 className="text-2xl font-semibold mb-4">Fixtures & Hardware</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Light fixture cleaning</li>
                <li>• Cabinet hardware polishing</li>
                <li>• Door handle sanitizing</li>
                <li>• Appliance detailing</li>
                <li>• Plumbing fixture shine</li>
                <li>• Electrical outlet cleaning</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🧹</div>
              <h3 className="text-2xl font-semibold mb-4">Floors & Surfaces</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Hardwood floor cleaning</li>
                <li>• Tile and grout detailing</li>
                <li>• Carpet deep cleaning</li>
                <li>• Baseboard scrubbing</li>
                <li>• Staircase cleaning</li>
                <li>• Countertop polishing</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-orange-500">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold mb-4 text-orange-600">Final Details</h3>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• Final walkthrough inspection</li>
                <li>• Touch-up cleaning</li>
                <li>• Trash removal service</li>
                <li>• Air quality improvement</li>
                <li>• Photography-ready prep</li>
                <li>• White glove service</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold mb-4 text-center">Our Process</h2>
        <p className="text-xl text-gray-600 text-center mb-12">Professional approach to construction cleanup</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl mb-4">1</div>
            <h3 className="text-2xl font-semibold mb-4">Initial Assessment</h3>
            <p className="text-base text-gray-600">We visit the site to evaluate the scope, identify special requirements, and provide a detailed quote.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl mb-4">2</div>
            <h3 className="text-2xl font-semibold mb-4">Deep Cleaning</h3>
            <p className="text-base text-gray-600">Our team tackles the heavy-duty cleanup using specialized equipment and techniques for construction debris.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl mb-4">3</div>
            <h3 className="text-2xl font-semibold mb-4">Final Inspection</h3>
            <p className="text-base text-gray-600">We do a thorough walkthrough, ensuring every detail is perfect and your space is move-in ready.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Reveal Your Beautiful Renovation?</h2>
          <p className="text-xl mb-8">Let us handle the mess so you can enjoy the results</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quote" state={{ selectedService: 'Post-Renovation Cleaning' }} className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Get a Custom Quote
            </Link>
            <a href="tel:+15614523128" className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-orange-600 transition-all">
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostRenovationCleaningPage;
