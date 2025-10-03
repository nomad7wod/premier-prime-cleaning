import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';

const quoteSchema = z.object({
  service_id: z.number().min(1, 'Please select a service'),
  square_meters: z.number().min(1, 'Square meters must be at least 1'),
  address: z.string().optional(),
  special_requirements: z.string().optional(),
  preferred_date: z.string().optional(),
  contact_name: z.string().min(1, 'Name is required'),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().optional(),
});

const QuotePage = () => {
  const [services, setServices] = useState([]);
  const [quote, setQuote] = useState(null);
  const [instantEstimate, setInstantEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      square_meters: 50,
    },
  });

  const watchedValues = watch(['service_id', 'square_meters']);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (watchedValues[0] && watchedValues[1]) {
      fetchInstantEstimate(watchedValues[0], watchedValues[1]);
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

  const fetchInstantEstimate = async (serviceId, squareMeters) => {
    try {
      const response = await api.get(`/quote/estimate?service_id=${serviceId}&square_meters=${squareMeters}`);
      setInstantEstimate(response.data.estimate);
    } catch (error) {
      console.error('Failed to fetch estimate:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/quote', data);
      setQuote(response.data.quote);
    } catch (error) {
      console.error('Failed to create quote:', error);
    } finally {
      setLoading(false);
    }
  };

  if (quote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🎉 Quote Request Submitted!</h1>
            <p className="text-xl text-gray-600">We'll send you a detailed quote within 24 hours</p>
          </div>

          {/* Quote Details Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">✨ Your Quote Details</h2>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quote ID</p>
                      <p className="font-bold text-gray-900">#{quote.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Price</p>
                      <p className="text-2xl font-bold text-green-600">${quote.estimated_price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="font-bold text-gray-900">{quote.service_name}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
                      <p className="font-medium text-gray-900">{quote.contact_email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Area Size</p>
                      <p className="font-bold text-gray-900">{quote.square_meters} sq meters</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 What happens next?</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                    <span>Our team will review your quote request within 2 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                    <span>We'll send you a detailed quote with exact pricing via email</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                    <span>You can book directly from the quote or contact us for questions</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.href = '/guest-booking'}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  🚀 Book Service Now
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-300"
                >
                  🏠 Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💰 Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">Free Quote</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get an instant estimate and request a detailed quote for your cleaning needs. 
            Our team will provide you with a comprehensive quote within 24 hours! ✨
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="hidden sm:block font-medium">Service Details</span>
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="hidden sm:block font-medium">Contact Info</span>
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                ✓
              </div>
              <span className="hidden sm:block font-medium">Complete</span>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-orange-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">🏠 Tell us about your cleaning needs</h2>
          </div>

          {/* Instant Estimate Banner */}
          {instantEstimate && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-green-800">⚡ Instant Estimate</h3>
                  <p className="text-sm text-green-600">*Final price may vary based on specific requirements</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">${instantEstimate.toFixed(2)}</p>
                  <p className="text-sm text-green-600">Estimated cost</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Service Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🧹 Choose Your Service Type
                </label>
                <select
                  {...register('service_id', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a cleaning service...</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.base_price} ({service.duration_hours} hours)
                    </option>
                  ))}
                </select>
                {errors.service_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.service_id.message}
                  </p>
                )}
              </div>

              {/* Square Meters */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📐 Area Size (Square Meters)
                </label>
                <input
                  type="number"
                  {...register('square_meters', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 100"
                />
                {errors.square_meters && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.square_meters.message}
                  </p>
                )}
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Preferred Date (Optional)
                </label>
                <input
                  type="date"
                  {...register('preferred_date')}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏠 Property Address (Optional)
                </label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your property address for more accurate pricing..."
                />
              </div>

              {/* Special Requirements */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📝 Special Requirements (Optional)
                </label>
                <textarea
                  {...register('special_requirements')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe any special cleaning requirements, access instructions, pets, or specific preferences..."
                />
              </div>

              {/* Contact Information Section */}
              <div className="md:col-span-2 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  📞 Contact Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      👤 Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('contact_name')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                    />
                    {errors.contact_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.contact_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📧 Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('contact_email')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                    {errors.contact_email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.contact_email.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📱 Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      {...register('contact_phone')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting || loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Quote Request...
                  </div>
                ) : (
                  '🚀 Get My Free Quote'
                )}
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>100% Free Quote • No Obligation • Quick Response</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuotePage;