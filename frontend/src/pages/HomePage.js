import React from 'react';
import { Link } from 'react-router-dom';

const placeholder = (label, bg = '#eef2f8', fg = '#182a49') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" font-family="sans-serif" font-size="26" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  )}`;

const onImgError = (label) => (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = placeholder(label);
};

const Stars = () => (
  <div className="flex gap-1 text-gold-500" aria-hidden>
    {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-white" />
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl/tight sm:text-6xl font-extrabold tracking-tight text-brand-800">
              More Than Cleaning.
              <span className="block font-serif italic text-gold-600 mt-2">We Care for Your Home.</span>
            </h1>
            <p className="mt-6 text-zinc-600 text-xl">
              Professional Cleaning & Home Organization for Busy Families in Jupiter, Palm Beach Gardens & Surrounding Areas.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Trusted & Insured', icon: '🛡️' },
                { label: 'Attention to Every Detail', icon: '✨' },
                { label: 'Baby & Pet Friendly Options', icon: '🏠' },
                { label: 'Easy Online Booking', icon: '📅' },
              ].map((f) => (
                <div key={f.label} className="text-center">
                  <div className="text-2xl mb-1" aria-hidden>{f.icon}</div>
                  <p className="text-sm text-zinc-600 leading-tight">{f.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/quote" className="px-5 py-3 rounded-xl bg-brand-700 text-white font-medium shadow hover:bg-brand-800">
                Request a Free Quote
              </Link>
              <Link to="/guest-booking" className="px-5 py-3 rounded-xl bg-gold-600 text-white font-medium shadow hover:bg-gold-700">
                Book Your Cleaning
              </Link>
            </div>
            <p className="mt-4 text-sm text-zinc-500">✓ Satisfaction Guaranteed</p>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
              <img
                src="/images/hero-kitchen.jpg"
                onError={onImgError('Add hero-kitchen.jpg')}
                alt="Clean, organized kitchen"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-6 -left-6 max-w-xs bg-brand-800 text-white rounded-2xl shadow-xl p-5">
              <div className="text-gold-400 text-2xl mb-2" aria-hidden>♡</div>
              <p className="font-medium">
                We don't just clean homes. We care for the people who live in them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Founder */}
      <section className="mx-auto max-w-7xl px-4 py-16 grid lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-1">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-md bg-brand-50">
            <img
              src="/images/founder-ada.jpg"
              onError={onImgError('Add founder-ada.jpg')}
              alt="Ada, Founder of Premier Prime Services"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-3xl font-bold text-brand-800">Meet Ada — Founder of Premier Prime Services</h2>
          <p className="mt-4 text-lg text-zinc-600 leading-relaxed">
            For nearly 10 years, I worked as a nanny for families in Jupiter, caring not only for children but also helping keep their homes organized, clean, and running smoothly.
          </p>
          <p className="mt-4 text-lg text-zinc-600 leading-relaxed">
            That experience taught me that every home deserves trust, attention to detail, and genuine care.
          </p>
          <p className="mt-4 text-lg text-zinc-600 leading-relaxed">
            I founded Premier Prime Services to bring that same level of dedication to every family we serve.
          </p>
          <p className="mt-6 font-serif italic text-2xl text-brand-700">Ada ♡</p>
        </div>
        <div className="lg:col-span-1 bg-brand-50 rounded-2xl p-8">
          <div className="text-gold-600 text-2xl mb-3" aria-hidden>♡</div>
          <h3 className="text-xl font-bold text-brand-800 mb-4">Our Promise</h3>
          <ul className="space-y-3 text-zinc-700">
            <li className="flex gap-2"><span className="text-brand-700">✓</span> We treat your home with the same care and respect as our own.</li>
            <li className="flex gap-2"><span className="text-brand-700">✓</span> Reliable, honest & detail-oriented cleaning professionals.</li>
            <li className="flex gap-2"><span className="text-brand-700">✓</span> Personalized service tailored to your family's needs.</li>
            <li className="flex gap-2"><span className="text-brand-700">✓</span> Your satisfaction is always our priority.</li>
          </ul>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="h-px w-10 bg-gold-500" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-800">Our Services</h2>
            <span className="h-px w-10 bg-gold-500" />
          </div>
          <p className="mt-4 text-xl text-zinc-600">Professional cleaning solutions tailored to your needs</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Residential Cleaning */}
          <div className="group rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-video relative overflow-hidden">
              <img src="/images/services/residential.jpg" alt="Residential Cleaning" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 bg-white">
              <h3 className="font-bold text-2xl mb-3 text-brand-800">Residential Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Keep your home spotless with our regular or one-time cleaning services. Perfect for busy families.</p>
              <div className="flex gap-3">
                <Link to="/services/residential" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/guest-booking" state={{ selectedService: 'Residential Cleaning' }} className="inline-flex items-center text-gold-600 text-base font-semibold hover:text-gold-700 transition-colors">
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
              <h3 className="font-bold text-2xl mb-3 text-brand-800">Office & Commercial Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Maintain a professional environment with scheduled cleaning for offices and commercial spaces.</p>
              <div className="flex gap-3">
                <Link to="/services/commercial" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/guest-booking" state={{ selectedService: 'Office & Commercial Cleaning' }} className="inline-flex items-center text-gold-600 text-base font-semibold hover:text-gold-700 transition-colors">
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
              <h3 className="font-bold text-2xl mb-3 text-brand-800">Airbnb Turnover Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Fast, thorough cleaning between guests. We'll have your property guest-ready in no time.</p>
              <div className="flex gap-3">
                <Link to="/services/airbnb" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/guest-booking" state={{ selectedService: 'Airbnb Turnover Cleaning' }} className="inline-flex items-center text-gold-600 text-base font-semibold hover:text-gold-700 transition-colors">
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
              <h3 className="font-bold text-2xl mb-3 text-brand-800">Custom Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Need something specific? We create custom cleaning plans tailored to your unique requirements.</p>
              <div className="flex gap-3">
                <Link to="/services/custom" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/quote" state={{ selectedService: 'Custom Cleaning' }} className="inline-flex items-center text-gold-600 text-base font-semibold hover:text-gold-700 transition-colors">
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
              <h3 className="font-bold text-2xl mb-3 text-brand-800">Post-Renovation Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Heavy-duty cleanup after construction or renovation. We handle dust, debris, and detail work.</p>
              <div className="flex gap-3">
                <Link to="/services/post-renovation" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/quote" state={{ selectedService: 'Post-Renovation Cleaning' }} className="inline-flex items-center text-gold-600 text-base font-semibold hover:text-gold-700 transition-colors">
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
              <h3 className="font-bold text-2xl mb-3 text-brand-800">Move In/Out Deep Cleaning</h3>
              <p className="text-base text-zinc-600 mb-4">Complete deep clean for moving day. Leave your old place spotless or start fresh in your new home.</p>
              <div className="flex gap-3">
                <Link to="/services/move-in-out" className="inline-flex items-center text-zinc-600 text-sm font-medium hover:text-brand-700 transition-colors">
                  Learn More
                </Link>
                <Link to="/quote" state={{ selectedService: 'Move In/Out Deep Cleaning' }} className="inline-flex items-center text-gold-600 text-base font-semibold hover:text-gold-700 transition-colors">
                  Get Quote <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Experience / Stats Section */}
      <section className="bg-brand-50">
        <div className="mx-auto max-w-7xl px-4 py-14 grid lg:grid-cols-4 gap-8 items-center">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold text-brand-800">Experience That Makes a Difference</h2>
            <p className="mt-3 text-zinc-600">
              Built on nearly 10 years of caring for families and their homes. We understand what matters most: trust, reliability and a home that feels peaceful and organized.
            </p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2" aria-hidden>🏅</div>
              <p className="text-2xl font-extrabold text-brand-800">10+</p>
              <p className="text-sm text-zinc-500">Years of Experience</p>
            </div>
            <div>
              <div className="text-3xl mb-2" aria-hidden>✔️</div>
              <p className="text-2xl font-extrabold text-brand-800">100%</p>
              <p className="text-sm text-zinc-500">Satisfaction Guaranteed</p>
            </div>
            <div>
              <div className="text-3xl mb-2" aria-hidden>🛡️</div>
              <p className="text-2xl font-extrabold text-brand-800">Fully Insured</p>
              <p className="text-sm text-zinc-500">& Bonded</p>
            </div>
            <div>
              <div className="text-3xl mb-2" aria-hidden>👍</div>
              <p className="text-2xl font-extrabold text-brand-800">Trusted</p>
              <p className="text-sm text-zinc-500">By Families</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="h-px w-10 bg-gold-500" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-800">What Our Clients Say</h2>
            <span className="h-px w-10 bg-gold-500" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <figure className="rounded-2xl border border-zinc-100 p-6 bg-white shadow-sm">
            <Stars />
            <blockquote className="mt-3 text-base text-zinc-700">"Amazing service! My house has never been this clean. The team was professional and friendly!"</blockquote>
            <figcaption className="mt-4 text-sm text-zinc-500">— Sarah M.</figcaption>
          </figure>
          <figure className="rounded-2xl border border-zinc-100 p-6 bg-white shadow-sm">
            <Stars />
            <blockquote className="mt-3 text-base text-zinc-700">"Booking was so easy! They arrived on time and did an incredible job. Highly recommend!"</blockquote>
            <figcaption className="mt-4 text-sm text-zinc-500">— Mike R.</figcaption>
          </figure>
          <figure className="rounded-2xl border border-zinc-100 p-6 bg-white shadow-sm">
            <Stars />
            <blockquote className="mt-3 text-base text-zinc-700">"Great value for money! Our office looks fantastic and the team was very thorough."</blockquote>
            <figcaption className="mt-4 text-sm text-zinc-500">— Lisa K.</figcaption>
          </figure>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-brand-800" />
        <div className="mx-auto max-w-7xl px-4 py-12 text-white grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-3xl font-bold">Ready for a Cleaner Home?</h3>
            <p className="text-white/80 mt-2 text-lg">Let us take care of the cleaning so you can enjoy more time with your family.</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <Link to="/quote" className="px-6 py-3 text-lg rounded-xl bg-gold-600 text-white font-semibold shadow hover:bg-gold-700">
              Request a Free Quote
            </Link>
            <p className="text-sm text-white/60">Fast Response • Easy Booking</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
