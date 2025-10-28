import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white bg-opacity-10 rounded-lg p-4 mb-4 border border-blue-500 border-opacity-20 hover:border-opacity-40 transition-all"
    >
      <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
      <p className="text-blue-200 mb-2">
        <span className="font-medium text-blue-300">{t("Language")}:</span> {t(course.language)}
      </p>
      <p className="text-blue-200 mb-2">
        <span className="font-medium text-blue-300">{t("Level")}:</span> {t(course.level)}
      </p>
      <button
        onClick={() => navigate(`/course/${course.id}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
      >
        {t("View Course")} <ArrowRight className="ml-2 w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default CourseCard;
