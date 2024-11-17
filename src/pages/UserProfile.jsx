import React, { useState, useEffect } from 'react';
import { Flame, Mail, Star, Calendar, Edit3, Upload, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Button = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 bg-buttonColor text-white rounded-md hover:bg-opacity-90 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = React.forwardRef(({ label, placeholder, className = '', ...props }, ref) => (
  <div className="mb-4">
    <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">{label}</label>
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-buttonColor placeholder-gray-400 ${className}`}
      placeholder={placeholder}
      ref={ref}
      {...props}
    />
  </div>
));

const Textarea = React.forwardRef(({ label, placeholder, className = '', ...props }, ref) => (
  <div className="mb-4">
    <label className="block text-gray-600 dark:text-gray-300 font-semibold mb-1">{label}</label>
    <textarea
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-buttonColor placeholder-gray-400 ${className}`}
      placeholder={placeholder}
      ref={ref}
      {...props}
    />
  </div>
));

const UserProfilePage = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { 'Authorization': `Bearer ${token}` };

        const [userResponse, notificationsResponse] = await Promise.all([
          fetch('https://bagelapi.artina.org/account/user-info/', { headers }),
          fetch('https://bagelapi.artina.org/account/NotifyUser/', { headers })
        ]);

        if (!userResponse.ok || !notificationsResponse.ok) {
          throw new Error(t('fetchError'));
        }

        const userData = await userResponse.json();
        const notificationsData = await notificationsResponse.json();

        setUser(userData);
        setBio(userData.bio || '');
        setNotifications(notificationsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [t]);

  const handleBioChange = (e) => setBio(e.target.value);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch('https://bagelapi.artina.org/account/profile/update_profile/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: user.first_name,
          bio,
          phone_number: user.phone_number,
          birthdate: user.birthdate,
          email: user.email,
          national_code: user.national_code,
        }),
      });

      const updatedUserData = await response.json();
      console.log(t('updateProfileResponse'), updatedUserData);

      if (!response.ok) {
        throw new Error(t('updateProfileError'));
      }

      setUser({ ...user, ...updatedUserData });
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch('https://bagelapi.artina.org/account/upload-profile-picture/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t('uploadProfilePicError'));
      }

      const data = await response.json();
      setUser({ ...user, profile_picture: data.profile_picture_url });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-4 text-gray-500">{t('loading')}</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!user) return <div className="text-center p-4 text-gray-500">{t('noUserData')}</div>;

  return (
    <div className="mt-24 min-h-screen bg-lightBackground dark:bg-darkBackground transition-colors duration-500 p-6">
      <div className="relative max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-buttonColor text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{user.first_name}</h1>
          <Button onClick={() => setEditMode(!editMode)} variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            {editMode ? t('cancel') : t('editProfile')}
          </Button>
        </div>

        <div className="p-6">
          <div className="relative flex flex-col md:flex-col items-center mb-6">
            <div
              className={`relative mb-4 ${i18n.language === 'fa' ? 'md:ml-6' : 'md:mr-6'
                }`}
            >
              <img
                src={user.profile_picture || '/api/placeholder/150/150'}
                alt={user.first_name}
                className="w-32 h-32 rounded-full border-4 border-buttonColor"
              />

              <div className="absolute top-0 right-0 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                <Flame className="w-5 h-5 text-white" />
                <span className="text-xs font-bold ml-1">{user.streak}</span>
              </div>

              {editMode && (
                <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-buttonColor text-white p-2 rounded-full cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <input
                    id="profile-picture"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <div className="flex-1 space-y-4">
              {editMode ? (
                <>
                  <Input
                    label={t('name')}
                    placeholder={t('enterName')}
                    value={user.first_name}
                    name="first_name"
                    onChange={handleInputChange}
                  />
                  <Input
                    label={t('phoneNumber')}
                    placeholder={t('enterPhoneNumber')}
                    value={user.phone_number}
                    name="phone_number"
                    onChange={handleInputChange}
                  />
                  <Input
                    label={t('birthdate')}
                    placeholder={t('enterBirthdate')}
                    value={user.birthdate}
                    name="birthdate"
                    onChange={handleInputChange}
                  />
                  <Input
                    label={t('email')}
                    placeholder={t('enterEmail')}
                    value={user.email}
                    name="email"
                    onChange={handleInputChange}
                  />
                  <Textarea
                    label={t('bio')}
                    placeholder={t('enterBio')}
                    value={bio}
                    onChange={handleBioChange}
                  />
                  <Textarea
                    label={t('nationalCode')}
                    placeholder={t('enterNationalCode')}
                    value={user.national_code}
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <>
                  <div className="flex-col justify-between space-y-4 w-full">
                    <div className="flex ">
                      <div className="flex gap-2 w-1/2">
                        <label className="block text-gray-500 dark:text-gray-300 w-24">{t('name')}</label>
                        <p className="text-black dark:text-gray-300 ">{user.first_name}</p>
                      </div>
                      <div className="flex gap-2 w-1/2">
                        <label className="block text-gray-500 dark:text-gray-300 w-28">{t('phoneNumber')}</label>
                        <p className="text-black dark:text-gray-300 ">{user.phone_number}</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex gap-2 w-1/2">
                        <label className="block text-gray-500 dark:text-gray-300 w-24">{t('birthdate')}</label>
                        <p className="text-black dark:text-gray-300 ">{user.birthdate}</p>
                      </div>
                      <div className="flex gap-2 w-1/2">
                        <label className="block text-gray-500 dark:text-gray-300 w-28">{t('email')}</label>
                        <p className="text-black dark:text-gray-300 ">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex gap-2 w-1/2">
                        <label className="block text-gray-500 dark:text-gray-300 w-24">{t('NationalCode')}</label>
                        <p className="text-black dark:text-gray-300 ">{user.national_code}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex gap-2 w-full">
                      <label className="block text-gray-500 dark:text-gray-300 w-24">{t('bio')}</label>
                      <p className="text-black dark:text-gray-300 ">{user.bio || t('noBio')}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {editMode && (
            <Button onClick={handleSave} className="mb-4">
              {t('saveChanges')}
            </Button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center text-gray-600 dark:text-gray-300 gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="ml-2 text-xl">{t('totalPoints')}</span>
              </div>
              <span className="font-medium dark:text-gray-400 text-black">{user.points}</span>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center text-gray-600 dark:text-gray-300 gap-2">
                <Calendar className="w-6 h-6 text-green-500" />
                <span className="ml-2 text-xl">{t('subscription')}</span>
              </div>
              <span className="font-medium dark:text-gray-400 text-black">{user.subscriptionDaysLeft} {t('daysLeft')}</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl mb-4 text-black">{t('myNotifications')}</h2>
            {notifications.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {notifications.map((notification) => (
                  <li key={notification.id} className={`text-gray-600 dark:text-gray-300 mx-4 ${!notification.message_seen ? 'font-semibold' : ''}`}>
                    {notification.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">{t('noNewNotifications')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
