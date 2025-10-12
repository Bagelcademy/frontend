import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';
import CircuitPattern from './CircuitPattern';

const FeatureSection = ({ icon: Icon, title, description, gradient, buttonText, linkTo, reversed, imageUrl, features }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`relative py-24 ${reversed ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} overflow-hidden`}
      >
        <CircuitPattern className="opacity-5" />
        <div className="max-w-7xl mx-auto px-4">
          <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
            <div className="flex-1 z-10">
              <motion.div
                initial={{ x: reversed ? 50 : -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
              >
                <div className={`p-4 rounded-xl inline-block ${gradient} bg-opacity-10 dark:bg-opacity-20`}>
                  <Icon className="w-12 h-12 text-white dark:text-blue-400" />
                </div>
              </motion.div>
              <motion.h2
                initial={{ x: reversed ? 50 : -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl font-bold mb-6 text-gray-900 dark:text-white"
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ x: reversed ? 50 : -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl mb-8 text-gray-600 dark:text-gray-300 text-justify"
              >
                {description}
              </motion.p>
              <motion.div
                initial={{ x: reversed ? 50 : -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  onClick={() => navigate(linkTo)}
                  className={`${gradient} text-white hover:opacity-90 text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  {buttonText}
                </Button>
              </motion.div>
            </div>
            <motion.div
              initial={{ x: reversed ? -50 : 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex-1 z-10"
            >
              <div className="relative group">
                <div className={`absolute inset-0 ${gradient} opacity-20 dark:opacity-40 blur-xl rounded-2xl transform group-hover:scale-105 transition-transform duration-500`}></div>
                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl transform group-hover:scale-102 transition-all duration-500">
                  <img
                    src={imageUrl || "/api/placeholder/600/400"}
                    alt={title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 dark:opacity-40 blur-2xl"></div>
                  <div className="relative z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg -mt-16 mx-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('Key Features')}
                    </h4>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                          <Check className="w-4 h-4 mr-2 text-blue-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  export default FeatureSection;