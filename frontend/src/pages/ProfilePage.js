import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
      
      {user && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <p className="mt-1 text-lg text-gray-900">{user.first_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <p className="mt-1 text-lg text-gray-900">{user.last_name}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg text-gray-900">{user.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="mt-1 text-lg text-gray-900">{user.phone || 'Not provided'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-lg text-gray-900 capitalize">{user.role}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="mt-1 text-lg text-gray-900">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;