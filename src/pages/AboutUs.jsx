import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import famImage from '../assets/fam.png';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className=" mt-24 min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold  text-gray-900 dark:text-white">
            {t('About BagelCademy')}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Family Image Section */}
          <motion.div 
            onClick={() => navigate('/characters')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer group relative"
          >
            <img 
              src={famImage} 
              alt="Bagel Family" 
              className="w-full rounded-2xl shadow-xl transition-transform duration-300 group-hover:shadow-2xl"
            />
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-xl font-bold bg-gray-800 px-4 py-2 rounded-lg">
                {t('Meet the Bagel Family')}
              </span>
            </div>
          </motion.div>

          {/* Text Content Section */}
          <div className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <p className="text-lg text-gray-700 text-justify dark:text-gray-300">
              {t('Welcome to')} <strong>BagelCademy</strong>, {t('your go-to platform for engaging, gamified learning!')} 
              {t('Our unique approach to education combines interactive lessons with personalized motivational support from the Bagel family—Dad Bagel, Mom Bagel, and their two enthusiastic kids.')}
            </p>

            <p className="text-lg text-gray-700 text-justify dark:text-gray-300">
              {t('At BagelCademy, we believe that learning should be both productive and enjoyable.')}
              {t('Whether you\'re mastering new skills or perfecting your craft, our virtual Bagel family is here to support you every step of the way.')} 
              {t('Each family member brings their own unique personality and encouragement to help you stay motivated.')}
            </p>

            <p className="text-lg text-gray-700 text-justify dark:text-gray-300">
              {t('Join us at BagelCademy and let our Bagel family guide you through your educational journey, one fun and motivating step at a time!')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;