import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const bookingSchema = z.object({
  serviceId: z.number().min(1, 'Please select a service'),
  scheduledDate: z.date().min(new Date(), 'Date must be in the future'),
  scheduledTime: z.string().min(1, 'Please select a time'),
  address: z.string().min(1, 'Address is required'),
  squareMeters: z.number().min(1, 'Square meters must be greater than 0'),
  specialInstructions: z.string().optional(),
});

const BookingPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      scheduledDate: new Date(),
    },
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data.services);
        setLoading(false);
      } catch (err) {
        setError('Failed to load services');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const onSubmit = async (data) => {
    try {
      const bookingData = {
        ...data,
        scheduledDate: data.scheduledDate.toISOString().split('T')[0],
      };
      
      await axios.post('/api/bookings', bookingData);
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to create booking';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-blue-700">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">✨ Book Your Cleaning Service</h1>
            <p className="text-blue-100 mt-2">Let us make your space sparkle and shine!</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {bookingSuccess && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-lg">
                <p className="text-sm text-green-700">🎉 Booking created successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-200">
                <label htmlFor="serviceId" className="block text-lg font-semibold text-gray-800 mb-3">
                  🧹 Select Your Service
                </label>
                <select
                  id="serviceId"
                  className={`block w-full p-4 text-lg border-2 ${
                    errors.serviceId ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-white'
                  } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200`}
                  {...register('serviceId', { valueAsNumber: true })}
                >
                  <option value="">🤔 Choose your perfect service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.base_price}/hour ⏰
                    </option>
                  ))}
                </select>
                {errors.serviceId && (
                  <p className="mt-2 text-sm text-red-600">⚠️ {errors.serviceId.message}</p>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 When would you like us to come?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Controller
                      control={control}
                      name="scheduledDate"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          minDate={new Date()}
                          className={`w-full p-4 text-lg border-2 ${
                            errors.scheduledDate ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-white'
                          } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                          placeholderText="Select a date"
                          dateFormat="MMMM d, yyyy"
                        />
                      )}
                    />
                    {errors.scheduledDate && (
                      <p className="mt-2 text-sm text-red-600">⚠️ {errors.scheduledDate.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <select
                      id="scheduledTime"
                      className={`block w-full p-4 text-lg border-2 ${
                        errors.scheduledTime ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-white'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      {...register('scheduledTime')}
                    >
                      <option value="">🕐 Choose a time</option>
                      <option value="08:00">08:00 AM ☀️</option>
                      <option value="09:00">09:00 AM ☀️</option>
                      <option value="10:00">10:00 AM ☀️</option>
                      <option value="11:00">11:00 AM ☀️</option>
                      <option value="12:00">12:00 PM 🌤️</option>
                      <option value="13:00">01:00 PM 🌤️</option>
                      <option value="14:00">02:00 PM 🌤️</option>
                      <option value="15:00">03:00 PM 🌤️</option>
                      <option value="16:00">04:00 PM 🌅</option>
                      <option value="17:00">05:00 PM 🌅</option>
                    </select>
                    {errors.scheduledTime && (
                      <p className="mt-2 text-sm text-red-600">⚠️ {errors.scheduledTime.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🏠 Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      id="address"
                      rows="3"
                      className={`block w-full p-4 text-lg border-2 ${
                        errors.address ? 'border-red-300 bg-red-50' : 'border-green-200 bg-white'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                      placeholder="📍 Enter your complete address..."
                      {...register('address')}
                    />
                    {errors.address && (
                      <p className="mt-2 text-sm text-red-600">⚠️ {errors.address.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="squareMeters" className="block text-sm font-medium text-gray-700 mb-2">
                      📏 Square Meters
                    </label>
                    <input
                      type="number"
                      id="squareMeters"
                      className={`block w-full p-4 text-lg border-2 ${
                        errors.squareMeters ? 'border-red-300 bg-red-50' : 'border-green-200 bg-white'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                      placeholder="100"
                      {...register('squareMeters', { valueAsNumber: true })}
                    />
                    {errors.squareMeters && (
                      <p className="mt-2 text-sm text-red-600">⚠️ {errors.squareMeters.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <label htmlFor="specialInstructions" className="block text-lg font-semibold text-gray-800 mb-3">
                  💭 Special Instructions (Optional)
                </label>
                <textarea
                  id="specialInstructions"
                  rows="4"
                  className="block w-full p-4 text-lg border-2 border-purple-200 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="💡 Any special requests or areas that need extra attention?"
                  {...register('specialInstructions')}
                />
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating your booking...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      ✨ Book My Cleaning Service
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

export default BookingPage;