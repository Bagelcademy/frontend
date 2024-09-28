import React, { useState, useEffect } from 'react';
import { Flame, Mail, Star, Calendar } from 'lucide-react';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Replace with the key where the token is stored
        const response = await fetch('https://bagelapi.artina.org//account/user-info/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div className="text-center p-4 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!user) return <div className="text-center p-4 text-gray-500">No user data found</div>;

  return (
    <div className="min-h-screen bg-lightBackground dark:bg-darkBackground transition-colors duration-500">
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition-transform duration-500 hover:scale-105">
          <div className="bg-buttonColor text-white p-4 rounded-t-lg">
            <h1 className="text-2xl font-bold">{user.name}</h1>
          </div>
          <div className="p-6 flex flex-col items-center">
            <img
              src={user.profile_picture || '/api/placeholder/150/150'}
              alt={user.first_name}
              className="w-24 h-24 rounded-full border-4 border-buttonColor mb-4 transition-transform duration-300 transform hover:scale-110"
            />
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Flame className="w-6 h-6 text-orange-500 mr-2" />
                  <span className="font-semibold">Streak</span>
                </div>
                <span className="font-medium dark:text-gray-400" >{user.streak} days</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Mail className="w-6 h-6 text-gray-500 mr-2" />
                  <span className="font-semibold">Email</span>
                </div>
                <span className="font-medium dark:text-gray-400">{user.email}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Star className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="font-semibold">Points</span>
                </div>
                <span className="font-medium dark:text-gray-400">{user.points}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="w-6 h-6 text-green-500 mr-2" />
                  <span className="font-semibold">Subscription</span>
                </div>
                <span className="font-medium dark:text-gray-400">{user.subscriptionDaysLeft} days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
