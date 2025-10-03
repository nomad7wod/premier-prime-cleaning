import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="block">✨ Your Space,</span>
            <span className="block text-yellow-300">Sparkling Clean!</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl">
            Professional cleaning services that bring joy to your home and business. 
            Book online in minutes and experience the magic of a spotless space! 🏠✨
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/booking"
              className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold py-4 px-8 rounded-2xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              📅 Book Now (Member)
            </Link>
            <Link
              to="/guest-booking"
              className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-4 px-8 rounded-2xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-white"
            >
              🚀 Quick Book (No Account)
            </Link>
            <Link
              to="/quote"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-2xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              💰 Get Free Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Why Choose Premier Prime? 🌟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just cleaners - we're happiness creators! Here's what makes us special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-l-4 border-blue-500">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Book in under 2 minutes! No long forms, no hassle. Just quick, easy booking.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-l-4 border-green-500">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Insured</h3>
              <p className="text-gray-600">Fully bonded and insured professionals. Your peace of mind is guaranteed.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-l-4 border-purple-500">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Eco-Friendly</h3>
              <p className="text-gray-600">Safe, non-toxic products that are gentle on your family, pets, and the planet.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Magical Services ✨</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From cozy homes to bustling offices, we make every space shine!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-blue-200">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Residential Cleaning</h3>
              <p className="text-gray-600 mb-6">
                Transform your home into a sparkling sanctuary! Perfect for busy families who want to come home to cleanliness.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Starting at $80</span>
                <span className="ml-2">💫</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-green-200">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Commercial Cleaning</h3>
              <p className="text-gray-600 mb-6">
                Professional cleaning for offices, retail spaces, and commercial properties. Impress your clients with spotless spaces!
              </p>
              <div className="flex items-center text-green-600 font-semibold">
                <span>Starting at $120</span>
                <span className="ml-2">🌟</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-purple-200">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Deep Cleaning</h3>
              <p className="text-gray-600 mb-6">
                Intensive cleaning that reaches every corner! Perfect for spring cleaning, moving in/out, or special occasions.
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                <span>Starting at $150</span>
                <span className="ml-2">🎉</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Happy Customers Say... 💬</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-600 mb-4">"Amazing service! My house has never been this clean. The team was professional and friendly!"</p>
              <p className="font-semibold text-gray-900">- Sarah M. 😊</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-600 mb-4">"Booking was so easy! They arrived on time and did an incredible job. Highly recommend!"</p>
              <p className="font-semibold text-gray-900">- Mike R. 👍</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-gray-600 mb-4">"Great value for money! Our office looks fantastic and the team was very thorough."</p>
              <p className="font-semibold text-gray-900">- Lisa K. 🎉</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold mb-4">Ready to Sparkle? ✨</h2>
          <p className="text-xl mb-8">Join thousands of happy customers who trust us with their cleaning needs!</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/guest-booking"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 px-8 rounded-2xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🚀 Book Now - 2 Minutes!
            </Link>
            <Link
              to="/quote"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-2xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              💰 Get Free Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;