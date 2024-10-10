import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the hook


const AboutUs = () => {
  const { t } = useTranslation(); // Call the useTranslation hook

  return (
    <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-black dark:text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold border-b-4 border-buttonColor inline-block pb-2">
            {t('About BagelAcademy')}
          </h1>
        </div>

        <div className="space-y-8 bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg">
            {t('Welcome to')} <strong>BagelAcademy</strong>, {t('your go-to platform for engaging, gamified learning!')} 
            {t('Our unique approach to education combines interactive lessons with personalized motivational support from the Bagel family—Dad Bagel, Mom Bagel, and their two enthusiastic kids.')}
          </p>

          <p className="text-lg">
            {t('At BagelAcademy, we believe that learning should be both productive and enjoyable.') }
            {t('Whether you\'re mastering new skills or perfecting your craft, our virtual Bagel family is here to support you every step of the way.')} 
            {t('Each family member brings their own unique personality and encouragement to help you stay motivated.')}
          </p>

          <p className="text-lg">
            {t('Join us at BagelAcademy and let our Bagel family guide you through your educational journey, one fun and motivating step at a time!')}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
