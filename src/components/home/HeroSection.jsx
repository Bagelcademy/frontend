import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import heroImage from '../../assets/5.png';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-[60vh] md:h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-blue-500/10 dark:to-zinc-900/90 bg-gradient-to-b from-blue-500/10 to-purple-800" />
          <div className="absolute inset-0 dark:bg-[#00ff9d]/5 bg-[#00ff9d]/10" />
          <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-zinc-900 dark:via-transparent dark:to-transparent bg-gradient-to-t from-gray-100 via-transparent to-transparent}\" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-4 sm:space-y-8 w-full max-w-4xl mx-auto mt-16 sm:mt-20"
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold dark:text-white text-black">
            <span className="bg-clip-text text-white drop-shadow-2xl">
              {t('Welcome')}
            </span>
          </h1>
          <div className="text-lg sm:text-4xl dark:text-zinc-300 text-gray-700 ">
            {t('LearnWithAI')}
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg"
                className="bg-[#082f49] hover:opacity-90 dark:text-white dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100 text-white font-bold px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
              >
                {t('Explore')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
  );
};
export default HeroSection;
