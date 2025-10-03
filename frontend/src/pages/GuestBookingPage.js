import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';

const guestBookingSchema = z.object({
  service_id: z.number().min(1, 'Please select a service'),
  scheduled_date: z.string().min(1, 'Date is required'),
  scheduled_time: z.string().min(1, 'Time is required'),
  address: z.string().min(1, 'Address is required'),
  square_meters: z.number().min(1, 'Square meters must be at least 1'),
  special_instructions: z.string().optional(),
  guest_name: z.string().min(1, 'Name is required'),
  guest_email: z.string().email('Invalid email address'),
  guest_phone: z.string().min(1, 'Phone number is required'),
  billing_address: z.string().min(1, 'Billing address is required'),
  billing_city: z.string().min(1, 'Billing city is required'),
  billing_state: z.string().min(1, 'Billing state is required'),
  billing_zip_code: z.string().min(5, 'Valid zip code is required'),
  billing_country: z.string().min(1, 'Billing country is required'),
});

const GuestBookingPage = () => {
  const [services, setServices] = useState([]);
  const [estimate, setEstimate] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(guestBookingSchema),
    defaultValues: {
      square_meters: 50,
      scheduled_date: new Date().toISOString().split('T')[0],
      billing_state: 'FL',
      billing_country: 'United States',
    },
  });

  const [sameAsService, setSameAsService] = useState(true);

  const watchedValues = watch(['service_id', 'square_meters']);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (watchedValues[0] && watchedValues[1]) {
      fetchEstimate(watchedValues[0], watchedValues[1]);
    }
  }, [watchedValues]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.services);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchEstimate = async (serviceId, squareMeters) => {
    try {
      const response = await api.get(`/quote/estimate?service_id=${serviceId}&square_meters=${squareMeters}`);
      setEstimate(response.data.estimate);
    } catch (error) {
      console.error('Failed to fetch estimate:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/guest/booking', data);
      setBooking(response.data.booking);
    } catch (error) {
      console.error('Failed to create booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-2xl font-bold text-white">🎉 Booking Confirmed!</h3>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-2xl font-bold text-gray-900">Your cleaning is scheduled!</h2>
                <p className="text-gray-600 mt-2">We can't wait to make your space sparkle!</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Booking Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Booking ID:</span>
                    <p className="text-lg font-bold text-blue-600">#{booking.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total Price:</span>
                    <p className="text-lg font-bold text-green-600">${booking.total_price?.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-lg">{(() => {
                      // Parse scheduled_date carefully to avoid timezone conversion
                      const dateStr = booking.scheduled_date.includes('T') 
                        ? booking.scheduled_date.split('T')[0] 
                        : booking.scheduled_date;
                      const [year, month, day] = dateStr.split('-');
                      const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                      return localDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      });
                    })()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Time:</span>
                    <p className="text-lg">{booking.scheduled_time}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Service:</span>
                    <p className="text-lg">{booking.service_name}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Contact:</span>
                    <p>{booking.guest_email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">📧 What's Next?</h3>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Confirmation email sent to {booking.guest_email}</li>
                  <li>• We'll call you 1 day before to confirm details</li>
                  <li>• Our team will arrive on time and make your space shine!</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  🏠 Back to Home
                </button>
                <button
                  onClick={() => window.location.href = '/guest-booking'}
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  📅 Book Another Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">🚀 Quick Book - No Account Needed!</h1>
            <p className="text-orange-100 mt-2">Get your space cleaned in just 2 minutes. Super easy!</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <label className="block text-lg font-semibold text-gray-800 mb-3">🧹 Choose Your Service</label>
                <select
                  {...register('service_id', { valueAsNumber: true })}
                  className="block w-full p-4 text-lg border-2 border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">✨ Select the perfect service for you</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.base_price} ({service.duration_hours}h) ⏰
                    </option>
                  ))}
                </select>
                {errors.service_id && <p className="mt-2 text-sm text-red-600">⚠️ {errors.service_id.message}</p>}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  📏 Space Size (Square Meters) 
                  {estimate && <span className="text-green-600 ml-2">💰 Estimated: ${estimate.toFixed(2)}</span>}
                </label>
                <input
                  type="number"
                  {...register('square_meters', { valueAsNumber: true })}
                  className="block w-full p-4 text-lg border-2 border-green-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="How big is your space?"
                />
                {errors.square_meters && <p className="mt-2 text-sm text-red-600">⚠️ {errors.square_meters.message}</p>}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 When do you need us?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      {...register('scheduled_date')}
                      min={new Date().toISOString().split('T')[0]}
                      className="block w-full p-4 text-lg border-2 border-purple-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    />
                    {errors.scheduled_date && <p className="mt-2 text-sm text-red-600">⚠️ {errors.scheduled_date.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <select
                      {...register('scheduled_time')}
                      className="block w-full p-4 text-lg border-2 border-purple-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="">🕐 Pick your preferred time</option>
                      {Array.from({ length: 9 }, (_, i) => i + 9).map(hour => (
                        <option key={hour} value={`${hour}:00`}>
                          {hour}:00 {hour < 12 ? '☀️ AM' : '🌤️ PM'}
                        </option>
                      ))}
                    </select>
                    {errors.scheduled_time && <p className="mt-2 text-sm text-red-600">⚠️ {errors.scheduled_time.message}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
                <label className="block text-lg font-semibold text-gray-800 mb-3">🏠 Where should we come?</label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="block w-full p-4 text-lg border-2 border-indigo-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="📍 Enter your complete address with apartment/unit number..."
                />
                {errors.address && <p className="mt-2 text-sm text-red-600">⚠️ {errors.address.message}</p>}
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📞 How can we reach you?</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      {...register('guest_name')}
                      className="block w-full p-4 text-lg border-2 border-yellow-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                      placeholder="Your full name"
                    />
                    {errors.guest_name && <p className="mt-2 text-sm text-red-600">⚠️ {errors.guest_name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      {...register('guest_phone')}
                      className="block w-full p-4 text-lg border-2 border-yellow-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                      placeholder="(555) 123-4567"
                    />
                    {errors.guest_phone && <p className="mt-2 text-sm text-red-600">⚠️ {errors.guest_phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    {...register('guest_email')}
                    className="block w-full p-4 text-lg border-2 border-yellow-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                  {errors.guest_email && <p className="mt-2 text-sm text-red-600">⚠️ {errors.guest_email.message}</p>}
                </div>
              </div>

              {/* Billing Address Section */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">💳 Billing Address (Required for Invoice)</h3>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsService}
                      onChange={(e) => {
                        setSameAsService(e.target.checked);
                        if (e.target.checked) {
                          // Copy service address to billing address
                          const serviceAddress = watch('address');
                          setValue('billing_address', serviceAddress);
                        }
                      }}
                      className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Same as service address</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      {...register('billing_address')}
                      disabled={sameAsService}
                      className={`block w-full p-4 text-lg border-2 border-green-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        sameAsService ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                      placeholder="123 Main Street, Unit 5"
                    />
                    {errors.billing_address && <p className="mt-2 text-sm text-red-600">⚠️ {errors.billing_address.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        {...register('billing_city')}
                        className="block w-full p-4 text-lg border-2 border-green-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="Miami"
                      />
                      {errors.billing_city && <p className="mt-2 text-sm text-red-600">⚠️ {errors.billing_city.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <select
                        {...register('billing_state')}
                        className="block w-full p-4 text-lg border-2 border-green-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      >
                        <option value="FL">Florida</option>
                        <option value="AL">Alabama</option>
                        <option value="GA">Georgia</option>
                        <option value="SC">South Carolina</option>
                        <option value="NC">North Carolina</option>
                      </select>
                      {errors.billing_state && <p className="mt-2 text-sm text-red-600">⚠️ {errors.billing_state.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        {...register('billing_zip_code')}
                        className="block w-full p-4 text-lg border-2 border-green-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="33101"
                        maxLength="10"
                      />
                      {errors.billing_zip_code && <p className="mt-2 text-sm text-red-600">⚠️ {errors.billing_zip_code.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <select
                        {...register('billing_country')}
                        className="block w-full p-4 text-lg border-2 border-green-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                      </select>
                      {errors.billing_country && <p className="mt-2 text-sm text-red-600">⚠️ {errors.billing_country.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
                <label className="block text-lg font-semibold text-gray-800 mb-3">💭 Anything special we should know?</label>
                <textarea
                  {...register('special_instructions')}
                  rows={3}
                  className="block w-full p-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
                  placeholder="💡 Pet-friendly products needed? Areas needing extra attention? Let us know!"
                />
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating your booking...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      🚀 Book My Cleaning Now!
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestBookingPage;