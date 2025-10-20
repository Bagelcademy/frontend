import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const ProfileDetails = ({
  user, editMode, t,
  validationErrors, birthDate,
  handleInputChange, handleBirthDateChange,
  handleBioChange, handleSave,bio 
}) => {
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

  return (
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
  );
};

export default ProfileDetails;

