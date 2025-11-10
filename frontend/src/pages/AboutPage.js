import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">About Premier Prime Cleaning</h1>
          <p className="text-2xl max-w-3xl mx-auto leading-relaxed">
            Your trusted partner for professional cleaning services in Palm Beach County since 2020
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Premier Prime Cleaning was founded with a simple mission: to provide exceptional cleaning services that make life easier for our clients. What started as a small team serving a few neighborhoods has grown into Palm Beach County's trusted cleaning partner.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We understand that your home or business is more than just a space—it's where you live, work, and create memories. That's why we treat every property with the same care and attention we'd give our own.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Today, we're proud to serve residential and commercial clients throughout Palm Beach County, with a team of trained professionals dedicated to delivering spotless results every time.
            </p>
          </div>
          <div className="bg-gradient-to-br from-brand-100 to-brand-200 rounded-3xl p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">✨</div>
              <p className="text-2xl font-semibold text-brand-700">Excellence in Every Clean</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Premier Prime?</h2>
            <p className="text-xl text-gray-600">What sets us apart from other cleaning services</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-semibold mb-4">Vetted Professionals</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Every team member is background-checked, trained, and insured. You can trust who enters your space.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">🧼</div>
              <h3 className="text-2xl font-semibold mb-4">Eco-Friendly Products</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                We use environmentally safe, non-toxic cleaning products that are effective and safe for your family and pets.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold mb-4">Quality Guarantee</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Not satisfied? We'll come back and make it right. Your happiness is our top priority—100% guaranteed.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-2xl font-semibold mb-4">Flexible Scheduling</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                One-time, weekly, bi-weekly, or monthly—we work around your schedule, not the other way around.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-2xl font-semibold mb-4">Transparent Pricing</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                No hidden fees, no surprises. You'll know exactly what you're paying for before we start.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-semibold mb-4">Fully Insured</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                We're fully licensed and insured for your peace of mind. Your property is protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-gray-600">The principles that guide everything we do</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-2">Quality</h3>
            <p className="text-base text-gray-600">Excellence in every detail, every time</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Integrity</h3>
            <p className="text-base text-gray-600">Honest, reliable, and trustworthy</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">💚</div>
            <h3 className="text-xl font-semibold mb-2">Care</h3>
            <p className="text-base text-gray-600">We treat your space like our own</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-base text-gray-600">Always improving our methods</p>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Dedicated professionals committed to your satisfaction</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <div className="w-32 h-32 bg-brand-100 rounded-full flex items-center justify-center text-6xl mx-auto mb-6">👨‍💼</div>
              <h3 className="text-2xl font-semibold mb-2">Management Team</h3>
              <p className="text-base text-brand-600 mb-4">Leadership & Operations</p>
              <p className="text-base text-gray-600">
                Our management team oversees quality control, scheduling, and ensures every client receives exceptional service.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <div className="w-32 h-32 bg-brand-100 rounded-full flex items-center justify-center text-6xl mx-auto mb-6">👷</div>
              <h3 className="text-2xl font-semibold mb-2">Cleaning Professionals</h3>
              <p className="text-base text-brand-600 mb-4">Trained & Certified</p>
              <p className="text-base text-gray-600">
                Our cleaning technicians are expertly trained, background-checked, and passionate about delivering spotless results.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <div className="w-32 h-32 bg-brand-100 rounded-full flex items-center justify-center text-6xl mx-auto mb-6">📞</div>
              <h3 className="text-2xl font-semibold mb-2">Customer Support</h3>
              <p className="text-base text-brand-600 mb-4">Always Here to Help</p>
              <p className="text-base text-gray-600">
                Our friendly support team is available to answer questions, adjust schedules, and ensure your complete satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-brand-600 mb-2">5000+</div>
            <p className="text-lg text-gray-600">Cleans Completed</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-brand-600 mb-2">500+</div>
            <p className="text-lg text-gray-600">Happy Clients</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-brand-600 mb-2">4.9★</div>
            <p className="text-lg text-gray-600">Average Rating</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-brand-600 mb-2">24/7</div>
            <p className="text-lg text-gray-600">Customer Support</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-xl mb-8">Join hundreds of satisfied customers in Palm Beach County</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/guest-booking" className="inline-block bg-white text-brand-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Book a Cleaning
            </Link>
            <Link to="/quote" className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-brand-600 transition-all">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
