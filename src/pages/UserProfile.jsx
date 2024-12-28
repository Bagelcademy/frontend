import React, { useState, useEffect } from 'react';
import {
  Flame, Mail, Star, Calendar, Edit3, Upload, Bell,
  Trophy, Target, CircleSlash, Gift, CreditCard
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Notiflix from 'notiflix';
import * as Yup from 'yup';

const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

const UserProfilePage = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  Notiflix.Notify.init({
    width: '280px',
    position: 'right-top',
    distance: '10px',
    opacity: 0.9,
    fontSize: '20px',
    borderRadius: '5px',
  });


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Check file size (5 MB = 5 * 1024 * 1024 bytes)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeInBytes) {
      Notiflix.Notify.failure(t('fileTooLarge')); // Notify the user
      return;
    }
  
    try {
      // Notify the user that the upload is in progress
      Notiflix.Notify.info(t('uploadInProgress')); // Translation key for "Upload in progress"
  
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("image", file);
  
      // Show the selected file as a preview before uploading
      const filePreview = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, profile_picture: filePreview }));
  
      // Upload the image to the MyImage endpoint
      const uploadResponse = await fetch('https://bagelapi.bagelcademy.org/account/MyImage/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error(t('uploadProfilePicError')); // Translation key for "Error uploading profile picture"
      }
  
      const uploadData = await uploadResponse.json();
  
      // Update the user profile with the new image URL
      const updateProfileResponse = await fetch('https://bagelapi.bagelcademy.org/account/profile/update_profile/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          pic_url: uploadData.image, // Make sure the API returns the correct field
        }),
      });
  
      if (!updateProfileResponse.ok) {
        throw new Error(t('updateProfileError')); // Translation key for "Error updating profile"
      }
  
      const updatedUserData = await updateProfileResponse.json();
      setUser((prev) => ({
        ...prev,
        profile_picture: updatedUserData.profile_picture || uploadData.image, // Update the profile picture
      }));
  
      // Notify the user that the upload was successful
      Notiflix.Notify.success(t('profilePictureUpdated')); // Translation key for "Profile picture updated successfully"
    } catch (err) {
      setError(err.message);
      Notiflix.Notify.failure(err.message); // Show the error notification
    }
  };  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { 'Authorization': `Bearer ${token}` };

        const [userResponse, notificationsResponse] = await Promise.all([
          fetch('https://bagelapi.bagelcademy.org/account/user-info/', { headers }),
          fetch('https://bagelapi.bagelcademy.org/account/NotifyUser/', { headers })
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
      await validationSchema.validate(user, { abortEarly: false });

      const token = localStorage.getItem("accessToken");
      const response = await fetch('https://bagelapi.bagelcademy.org/account/profile/update_profile/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          bio,
          pic_url: user.profile_picture,
        }),
      });

      const updatedUserData = await response.json();

      if (!response.ok) {
        throw new Error(t('updateProfileError'));
      }

      setUser({ ...user, ...updatedUserData });
      setEditMode(false);
      Notiflix.Notify.success(t('profileUpdated'));
    } catch (err) {
      if (err.name === "ValidationError") {
        err.inner.forEach((error) => {
          Notiflix.Notify.failure(error.message);
        });
      } else {
        setError(err.message);
        Notiflix.Notify.failure(err.message);
      }
    }
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, t("invalidName"))
      .max(20, t("nameTooLong")) // Ensure name is less than 20 characters
      .required(t("required")),
    phone_number: Yup.string() // Change to string for length validation
      .matches(/^\d+$/, t("invalidPhoneNumber")) // Ensure only digits
      .min(11, t("phoneNumberTooShort")) // At least 11 digits
      .max(13, t("phoneNumberTooLong")) // At most 13 digits
      .required(t("required")),
    email: Yup.string()
      .email(t("invalidEmail"))
      .required(t("required")),
    birthdate: Yup.date()
      .nullable()
      .min(new Date(1900, 0, 1), t("invalidBirthdate"))
      .max(new Date(), t("invalidBirthdate"))
      .required(t("required")),
    national_code: Yup.string()
      .matches(/^[0-9]{10}$/, t("invalidNationalCode"))
      .required(t("required")),
  });
  


  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    try {
      await validationSchema.validateAt(name, { [name]: value });
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    } catch (err) {
      setValidationErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };



  if (loading) return <div className="text-center p-4 text-gray-500">{t('loading')}</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!user) return <div className="text-center p-4 text-gray-500">{t('noUserData')}</div>;

  return (
    <div className=" mt-24 min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-buttonColor to-buttonColor/80">
            <button
              onClick={() => setEditMode(!editMode)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              {editMode ? t('cancel') : t('editProfile')}
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="relative flex flex-col items-center">
              <div className="relative -mt-16">
                <img
                  src={user.profile_picture || '/api/placeholder/150/150'}
                  alt={user.first_name}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                />
                {editMode && (
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-0 right-0 bg-buttonColor text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-opacity-90 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <input
                      id="profile-picture"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {uploadProgress > 0 && (
                      <div className="absolute -bottom-8 right-0 w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-buttonColor transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </label>
                )}

                <div className="absolute -top-2 -right-2 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                  <Flame className="w-5 h-5" />
                  <span className="text-xs font-bold ml-1">{user.streak}</span>
                </div>
              </div>

              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                {user.first_name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {user.bio || t('noBio')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            icon={Star}
            label={t('totalPoints')}
            value={user.points}
            color="bg-yellow-500"
          />
          <StatsCard
            icon={Calendar}
            label={t('subscription')}
            value={`${user.subscriptionDaysLeft} ${t('daysLeft')}`}
            color="bg-green-500"
          />
          <StatsCard
            icon={CreditCard}
            label={t('credits')}
            value={user.credit || 0}
            color="bg-purple-500"
          />
        </div>

        {/* Profile Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {t('personalInfo')}
          </h2>

          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className={`w-full bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-lg border ${validationErrors.first_name ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-buttonColor focus:border-transparent`}
                  placeholder={t('enterName')}
                  value={user.first_name}
                  name="first_name"
                  onChange={handleInputChange}
                  onBlur={handleInputChange}
                />
                <input
                  className={`w-full bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-lg border ${validationErrors.phone_number ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-buttonColor focus:border-transparent`}
                  placeholder={t('enterPhoneNumber')}
                  value={user?.phone_number || ''}
                  name="phone_number"
                  onChange={handleInputChange}
                />
                <input
                  className={`w-full bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-lg border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-buttonColor focus:border-transparent`}
                  placeholder={t('enterEmail')}
                  value={user?.email || ''}
                  name="email"
                  onChange={handleInputChange}
                />
                <input
                  className={`w-full bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-lg border ${validationErrors.birthdate ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-buttonColor focus:border-transparent`}
                  placeholder={t('enterBirthdate')}
                  value={user?.birthdate || ''}
                  name="birthdate"
                  onChange={handleInputChange}
                />
                <input
                  className={`w-full bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-lg border ${validationErrors.national_code ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-buttonColor focus:border-transparent`}
                  placeholder={t('enterNationalCode')}
                  value={user?.national_code || ''}
                  name="national_code"
                  onChange={handleInputChange}
                />
              </div>
              <textarea
                className="w-full bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-buttonColor focus:border-transparent"
                placeholder={t('enterBio')}
                value={bio}
                onChange={handleBioChange}
                rows={3}
              />
              <button
                onClick={handleSave}
                className="w-full md:w-auto px-6 py-2 bg-buttonColor text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                {t('saveChanges')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('name')}</p>
                <p className="text-gray-900 dark:text-white">{user.first_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('phoneNumber')}</p>
                <p className="text-gray-900 dark:text-white">{user.phone_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('email')}</p>
                <p className="text-gray-900 dark:text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('birthdate')}</p>
                <p className="text-gray-900 dark:text-white">{user.birthdate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('NationalCode')}</p>
                <p className="text-gray-900 dark:text-white">{user.national_code}</p>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('myNotifications')}
            </h2>
          </div>

          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-700 ${!notification.message_seen ? 'border-l-4 border-buttonColor' : ''
                    }`}
                >
                  <p className="text-gray-600 dark:text-gray-300">
                    {notification.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">{t('noNewNotifications')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;