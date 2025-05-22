import React from 'react';
import { ChevronsDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const GuidanceSection = ({ scrollToTop }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8 w-full max-w-2xl mt-8 text-white"
    >
      <h2 className="text-2xl font-bold mb-4">{t("How to Use the AI Course Generator")}</h2>
      <div className="space-y-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">{t("1. Describe Your Learning Goal")}</h3>
          <p className="text-blue-200">
            {t("Enter what you want to learn in the text area. Be specific about the subject and what aspects you want to focus on.")}
          </p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">{t("2. Check for Similar Courses")}</h3>
          <p className="text-blue-200">
            {t("As you type (3+ characters), the system automatically searches for similar existing courses.")}
          </p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">{t("3. Select Language and Level")}</h3>
          <p className="text-blue-200">
            {t("Choose your preferred language for the course and select your learning level.")}
          </p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">{t("4. Generate Your Course")}</h3>
          <p className="text-blue-200">
            {t("Click the button to generate your personalized AI course.")}
          </p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={scrollToTop}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <ChevronsDown className="w-5 h-5 mr-2 rotate-180" />
          {t("Back to Top")}
        </button>
      </div>
    </motion.div>
  );
};

export default GuidanceSection;
