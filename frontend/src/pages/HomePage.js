import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-white" />
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl/tight sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
              Home & Office Cleaning —
              <span className="block text-brand-700">booked in under 60 seconds</span>
            </h1>
            <p className="mt-6 text-zinc-600 text-xl sm:text-2xl">
              Reliable, insured cleaners. Transparent pricing. Same‑day bookings when available. Manage everything online.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/guest-booking" className="px-5 py-3 rounded-xl bg-brand-600 text-white font-medium shadow hover:bg-brand-700">
                Book a Cleaner
              </Link>
              <Link to="/quote" className="px-5 py-3 rounded-xl border border-zinc-200 hover:border-zinc-300">
                Get Free Quote
              </Link>
            </div>
            <ul className="mt-6 text-base text-zinc-600 grid grid-cols-2 gap-2 max-w-lg">
              <li>✔ Vetted & trained staff</li>
              <li>✔ Equipment & supplies available</li>
              <li>✔ Secure online payments</li>
              <li>✔ Recurring discounts</li>
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-white shadow-lg flex items-center justify-center p-8">
              <img src="/images/FRONT.png" alt="Premier Prime Cleaning Services" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="border-y border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-4xl sm:text-5xl font-extrabold">4.9★</p>
            <p className="text-sm text-zinc-500">Average rating</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-extrabold">5000+</p>
            <p className="text-sm text-zinc-500">Cleans completed</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-extrabold">7 days</p>
            <p className="text-sm text-zinc-500">We never close</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-extrabold">100%</p>
            <p className="text-sm text-zinc-500">Satisfaction focus</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Why Choose Premier Prime?</h2>
          <div className="mt-2 h-1 w-16 bg-brand-600 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-100 p-6 hover:shadow-lg transition-all">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-base text-zinc-600">Book in under 2 minutes! No long forms, no hassle. Just quick, easy booking.</p>
          </div>
          <div className="rounded-2xl border border-zinc-100 p-6 hover:shadow-lg transition-all">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">100% Insured</h3>
            <p className="text-base text-zinc-600">Fully bonded and insured professionals. Your peace of mind is guaranteed.</p>
          </div>
          <div className="rounded-2xl border border-zinc-100 p-6 hover:shadow-lg transition-all">
            <div className="text-5xl mb-4">💚</div>
            <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-base text-zinc-600">Safe, non-toxic products that are gentle on your family, pets, and the planet.</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Services</h2>
          <div className="mt-2 h-1 w-16 bg-brand-600 rounded" />
          <p className="mt-4 text-xl text-zinc-600">Professional cleaning solutions tailored to your needs</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Residential Cleaning */}
          <div className="group rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-video relative overflow-hidden">
              <img src="/images/services/residential.jpg" alt="Residential Cleaning" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 bg-white">
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Residential Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Keep your home spotless with our regular or one-time cleaning services. Perfect for busy families.</p>
              <ul className="text-sm text-zinc-600 space-y-1 mb-4">
                <li>✓ Living rooms & bedrooms</li>
                <li>✓ Kitchen & bathrooms</li>
                <li>✓ Dusting & vacuuming</li>
              </ul>
              <div className="flex gap-3">
                <Link to="/services/residential" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/guest-booking" state={{ selectedService: 'Residential Cleaning' }} className="inline-flex items-center text-brand-700 text-base font-semibold hover:text-brand-800 transition-colors">
                  Book Now <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Office & Commercial */}
          <div className="group rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-video relative overflow-hidden">
              <img src="/images/services/commercial.jpg" alt="Office & Commercial Cleaning" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 bg-white">
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Office & Commercial Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Maintain a professional environment with scheduled cleaning for offices and commercial spaces.</p>
              <ul className="text-sm text-zinc-600 space-y-1 mb-4">
                <li>✓ Offices & workspaces</li>
                <li>✓ Conference rooms</li>
                <li>✓ Break rooms & restrooms</li>
              </ul>
              <div className="flex gap-3">
                <Link to="/services/commercial" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/guest-booking" state={{ selectedService: 'Office & Commercial Cleaning' }} className="inline-flex items-center text-brand-700 text-base font-semibold hover:text-brand-800 transition-colors">
                  Book Now <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Airbnb Turnover */}
          <div className="group rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-video relative overflow-hidden">
              <img src="/images/services/airbnb.jpg" alt="Airbnb Turnover Cleaning" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 bg-white">
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Airbnb Turnover Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Fast, thorough cleaning between guests. We'll have your property guest-ready in no time.</p>
              <ul className="text-sm text-zinc-600 space-y-1 mb-4">
                <li>✓ Quick turnaround</li>
                <li>✓ Fresh linen service</li>
                <li>✓ Guest-ready checklist</li>
              </ul>
              <div className="flex gap-3">
                <Link to="/services/airbnb" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/guest-booking" state={{ selectedService: 'Airbnb Turnover Cleaning' }} className="inline-flex items-center text-brand-700 text-base font-semibold hover:text-brand-800 transition-colors">
                  Book Now <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Custom Cleaning */}
          <div className="group rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-video relative overflow-hidden">
              <img src="/images/services/custom.jpg" alt="Custom Cleaning" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 bg-white">
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Custom Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Need something specific? We create custom cleaning plans tailored to your unique requirements.</p>
              <ul className="text-sm text-zinc-600 space-y-1 mb-4">
                <li>✓ Personalized service</li>
                <li>✓ Flexible scheduling</li>
                <li>✓ Special requests welcome</li>
              </ul>
              <div className="flex gap-3">
                <Link to="/services/custom" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/quote" state={{ selectedService: 'Custom Cleaning' }} className="inline-flex items-center text-brand-700 text-base font-semibold hover:text-brand-800 transition-colors">
                  Get Quote <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Post-Renovation */}
          <div className="group rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-video relative overflow-hidden">
              <img src="/images/services/post-renovation.jpg" alt="Post-Renovation Cleaning" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 bg-white">
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Post-Renovation Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Heavy-duty cleanup after construction or renovation. We handle dust, debris, and detail work.</p>
              <ul className="text-sm text-zinc-600 space-y-1 mb-4">
                <li>✓ Construction dust removal</li>
                <li>✓ Paint & adhesive cleanup</li>
                <li>✓ Final detail work</li>
              </ul>
              <div className="flex gap-3">
                <Link to="/services/post-renovation" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/quote" state={{ selectedService: 'Post-Renovation Cleaning' }} className="inline-flex items-center text-brand-700 text-base font-semibold hover:text-brand-800 transition-colors">
                  Get Quote <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Move In/Out */}
          <div className="group rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-video relative overflow-hidden">
              <img src="/images/services/move-in-out.jpg" alt="Move In/Out Deep Cleaning" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 bg-white">
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Move In/Out Deep Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Complete deep clean for moving day. Leave your old place spotless or start fresh in your new home.</p>
              <ul className="text-sm text-zinc-600 space-y-1 mb-4">
                <li>✓ Empty home cleaning</li>
                <li>✓ Inside cabinets & drawers</li>
                <li>✓ Windows & baseboards</li>
              </ul>
              <div className="flex gap-3">
                <Link to="/services/move-in-out" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/quote" state={{ selectedService: 'Move In/Out Deep Cleaning' }} className="inline-flex items-center text-brand-700 text-base font-semibold hover:text-brand-800 transition-colors">
                  Get Quote <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-600 to-brand-700" />
        <div className="mx-auto max-w-7xl px-4 py-12 text-white grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-3xl font-bold">Same‑day slots may be available</h3>
            <p className="text-white/80 mt-2 text-lg">Get an instant quote and secure your time in under a minute.</p>
          </div>
          <div className="flex md:justify-end">
            <Link to="/guest-booking" className="px-6 py-3 text-lg rounded-xl bg-white text-brand-700 font-semibold shadow hover:bg-zinc-100">
              Book a Cleaner
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What customers say</h2>
          <div className="mt-2 h-1 w-16 bg-brand-600 rounded" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <figure className="rounded-2xl border border-zinc-100 p-6 bg-white shadow-sm">
            <blockquote className="text-base text-zinc-700">"Amazing service! My house has never been this clean. The team was professional and friendly!"</blockquote>
            <figcaption className="mt-4 text-sm text-zinc-500">— Sarah M.</figcaption>
          </figure>
          <figure className="rounded-2xl border border-zinc-100 p-6 bg-white shadow-sm">
            <blockquote className="text-base text-zinc-700">"Booking was so easy! They arrived on time and did an incredible job. Highly recommend!"</blockquote>
            <figcaption className="mt-4 text-sm text-zinc-500">— Mike R.</figcaption>
          </figure>
          <figure className="rounded-2xl border border-zinc-100 p-6 bg-white shadow-sm">
            <blockquote className="text-base text-zinc-700">"Great value for money! Our office looks fantastic and the team was very thorough."</blockquote>
            <figcaption className="mt-4 text-sm text-zinc-500">— Lisa K.</figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
};

export default HomePage;