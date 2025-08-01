import React, { useState, useEffect } from 'react';
import {
  Flame, Mail, Calendar, Edit3, Upload, Bell,
  Trophy, Target, CircleSlash, Gift, CreditCard, Clock, BookOpen, Award, Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Notiflix from 'notiflix';
import * as Yup from 'yup';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

const StatsCard = ({ icon: Icon, label, value, gradient }) => (
  <Card className="overflow-hidden border-0 bg-gray-50 dark:bg-gray-800">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const UserProfilePage = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [birthDate, setBirthDate] = useState({
    day: '',
    month: '',
    year: ''
  });

  Notiflix.Notify.init({
    width: '280px',
    position: 'right-top',
    distance: '10px',
    opacity: 0.9,
    fontSize: '20px',
    borderRadius: '5px',
  });

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, t("invalidName"))
      .max(20, t("nameTooLong")),
    birthDay: Yup.number()
      .min(1, t("invalidDay"))
      .max(31, t("invalidDay")),
    birthMonth: Yup.number()
      .min(1, t("invalidMonth"))
      .max(12, t("invalidMonth")),
    birthYear: Yup.number()
      .min(1330, t("invalidYear"))
      .max(1390, t("invalidYear")),
    national_code: Yup.string()
      .matches(/^[0-9]{10}$/, t("invalidNationalCode")),
  });

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { 'Authorization': `Bearer ${token}` };

      const [userResponse, notificationsResponse] = await Promise.all([
        fetch('https://api.tadrisino.org/account/user-info/', { headers }),
        fetch('https://api.tadrisino.org/account/NotifyUser/', { headers })
      ]);

      if (!userResponse.ok || !notificationsResponse.ok) {
        throw new Error(t('fetchError'));
      }

      const userData = await userResponse.json();
      const notificationsData = await notificationsResponse.json();

      // Parse birthdate into separate fields
      if (userData.birthdate) {
        const [year, month, day] = userData.birthdate.split('-');
        setBirthDate({
          day: parseInt(day),
          month: parseInt(month),
          year: parseInt(year)
        });
      }

      setUser(userData);
      setBio(userData.bio || '');
      setNotifications(notificationsData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [t]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      Notiflix.Notify.failure(t('fileTooLarge'));
      return;
    }

    try {
      Notiflix.Notify.info(t('uploadInProgress'));

      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("image", file);

      const filePreview = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, profile_picture: filePreview }));

      const uploadResponse = await fetch('https://api.tadrisino.org/account/MyImage/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(t('uploadProfilePicError'));
      }

      const uploadData = await uploadResponse.json();

      const updateProfileResponse = await fetch('https://api.tadrisino.org/account/profile/update_profile/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          pic_url: uploadData.image,
        }),
      });

      if (!updateProfileResponse.ok) {
        throw new Error(t('updateProfileError'));
      }

      const updatedUserData = await updateProfileResponse.json();
      setUser((prev) => ({
        ...prev,
        profile_picture: updatedUserData.profile_picture || uploadData.image,
      }));

      Notiflix.Notify.success(t('profilePictureUpdated'));
    } catch (err) {
      setError(err.message);
      Notiflix.Notify.failure(err.message);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    // Only validate if the field has a value
    if (value.trim() !== '') {
      try {
        await validationSchema.validateAt(name, { [name]: value });
        setValidationErrors((prev) => ({ ...prev, [name]: null }));
      } catch (err) {
        setValidationErrors((prev) => ({ ...prev, [name]: err.message }));
      }
    } else {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBirthDateChange = (field) => (e) => {
    const value = e.target.value;
    
    setBirthDate(prev => ({
      ...prev,
      [field]: value
    }));

    // Update the main user object with the combined date
    const updatedBirthDate = {
      ...birthDate,
      [field]: value
    };
    
    if (updatedBirthDate.day && updatedBirthDate.month && updatedBirthDate.year) {
      const formattedDate = `${updatedBirthDate.year}-${
        String(updatedBirthDate.month).padStart(2, '0')
      }-${String(updatedBirthDate.day).padStart(2, '0')}`;
      
      setUser(prev => ({
        ...prev,
        birthdate: formattedDate
      }));
    }

    // Only validate if the field has a value
    if (value.trim() !== '') {
      try {
        validationSchema.validateAt(`birth${field.charAt(0).toUpperCase() + field.slice(1)}`, { [`birth${field.charAt(0).toUpperCase() + field.slice(1)}`]: value });
        setValidationErrors(prev => ({ ...prev, [field]: null }));
      } catch (err) {
        setValidationErrors(prev => ({ ...prev, [field]: err.message }));
      }
    } else {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleBioChange = (e) => setBio(e.target.value);

  const handleSave = async () => {
    try {
      // Only validate fields that have values
      const fieldsToValidate = {};
      
      if (user.first_name && user.first_name.trim() !== '') {
        fieldsToValidate.first_name = user.first_name;
      }
      
      if (birthDate.day && birthDate.day.toString().trim() !== '') {
        fieldsToValidate.birthDay = birthDate.day;
      }
      
      if (birthDate.month && birthDate.month.toString().trim() !== '') {
        fieldsToValidate.birthMonth = birthDate.month;
      }
      
      if (birthDate.year && birthDate.year.toString().trim() !== '') {
        fieldsToValidate.birthYear = birthDate.year;
      }
      
      if (user.national_code && user.national_code.trim() !== '') {
        fieldsToValidate.national_code = user.national_code;
      }

      // Only validate if there are fields to validate
      if (Object.keys(fieldsToValidate).length > 0) {
        await validationSchema.validate(fieldsToValidate, { abortEarly: false });
      }

      const token = localStorage.getItem("accessToken");
      const response = await fetch('https://api.tadrisino.org/account/profile/update_profile/', {
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
      
      // Refresh data after successful update
      await fetchUserData();
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

  const renderBirthDateInputs = () => (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <select
          className={`w-full bg-gray-50 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg border ${
            validationErrors.day ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          value={birthDate.day}
          onChange={handleBirthDateChange('day')}
        >
          <option value="">{t('day')}</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>
      <div>
        <select
          className={`w-full bg-gray-50 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg border ${
            validationErrors.month ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          value={birthDate.month}
          onChange={handleBirthDateChange('month')}
        >
          <option value="">{t('month')}</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <div>
        <select
          className={`w-full bg-gray-50 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg border ${
            validationErrors.year ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          value={birthDate.year}
          onChange={handleBirthDateChange('year')}
        >
          <option value="">{t('year')}</option>
          {Array.from({ length: 61 }, (_, i) => 1330 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
    </div>
  );

  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!user) return <div className="text-center p-4 text-gray-500">{t('noUserData')}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="container mx-auto px-4 py-16 pt-32">
          <div className="relative max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={user.profile_picture || '/api/placeholder/150/150'}
                  alt={user.first_name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {editMode && (
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full cursor-pointer shadow-lg hover:bg-opacity-90 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-blue-600" />
                    <input
                      id="profile-picture"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
                <div className="absolute -top-2 -right-2 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5" />
                  <span className="text-xs font-bold ml-1">{user.streak}</span>
                </div>
              </div>

              <h1 className="mt-4 text-3xl font-bold text-white">
                {user.first_name}
              </h1>
              <p className="text-white/80 mt-2 max-w-xl text-center">
                {user.bio || t('noBio')}
              </p>

              <Button
                onClick={() => setEditMode(!editMode)}
                className="mt-4 bg-white/20 hover:bg-white/30 text-white"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {editMode ? t('cancel') : t('editProfile')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 space-y-6 pb-12 max-w-4xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatsCard
            icon={Calendar}
            label={t('subscription')}
            value={`${user.subscriptionDaysLeft} ${t('daysLeft')}`}
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatsCard
            icon={CreditCard}
            label={t('credits')}
            value={user.credit || 0}
            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </div>

        {/* Profile Details */}
        <Card className="border-0 bg-white dark:bg-gray-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              {t('personalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className={`w-full bg-gray-50 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg border ${
                      validationErrors.first_name ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder={t('enterName')}
                    value={user.first_name}
                    name="first_name"
                    onChange={handleInputChange}
                  />
                  {/* Replace single birthdate input with separated inputs */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('birthdate')}
                    </label>
                    {renderBirthDateInputs()}
                  </div>
                  <input
                    className={`w-full bg-gray-50 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg border ${
                      validationErrors.national_code ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder={t('enterNationalCode')}
                    value={user?.national_code || ''}
                    name="national_code"
                    onChange={handleInputChange}
                  />
                  <textarea
                    className="w-full bg-gray-50 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('enterBio')}
                    value={bio}
                    onChange={handleBioChange}
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleSave}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  {t('saveChanges')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('name')}</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.first_name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('birthdate')}</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.birthdate}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('NationalCode')}</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.national_code}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('bio')}</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.bio || t('noBio')}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>


{/* Notifications */}
<Card className="border-0 bg-white dark:bg-gray-800 shadow-md">
  <CardHeader>
    <div className="flex items-center gap-2">
      <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      <CardTitle className="text-xl font-bold">
        {t('myNotifications')}
      </CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    {notifications.length > 0 ? (
      <div className="space-y-4">
        {notifications
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by date (newest first)
          .map((notification, index) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-700 ${
                index === 0 && !notification.message_seen ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <p className="text-gray-600 dark:text-gray-300">
                {notification.text}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(notification.created_at).toLocaleDateString()}
                </div>
                {index === 0 && !notification.message_seen && ( // Only show "new" label for the first notification
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                    {t('new')}
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">{t('no New Notifications')}</p>
      </div>
    )}
  </CardContent>
</Card>
      </div>
    </div>
  );
};

export default UserProfilePage;