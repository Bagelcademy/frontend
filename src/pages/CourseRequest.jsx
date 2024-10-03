import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ChevronDown } from 'lucide-react';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Mandarin Chinese', value: 'zh' },
  { label: 'Spanish', value: 'es' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Russian', value: 'ru' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Japanese', value: 'ja' },
  { label: 'German', value: 'de' },
  { label: 'French', value: 'fr' },
  { label: 'Persian (Farsi)', value: 'fa' },
  { label: 'Korean', value: 'ko' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Italian', value: 'it' },
  { label: 'Vietnamese', value: 'vi' },
  { label: 'Thai', value: 'th' },
  { label: 'Indonesian', value: 'id' },
  { label: 'Dutch', value: 'nl' },
  { label: 'Polish', value: 'pl' },
  { label: 'Swedish', value: 'sv' },
  { label: 'Greek', value: 'el' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Czech', value: 'cs' },
  { label: 'Finnish', value: 'fi' },
  { label: 'Danish', value: 'da' },
  { label: 'Norwegian', value: 'no' },
  { label: 'Hebrew', value: 'he' },
  { label: 'Hungarian', value: 'hu' },
  { label: 'Swahili', value: 'sw' },
];




const levels = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

const Listbox = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full py-3 bg-white bg-opacity-20 rounded-lg text-white font-semibold flex items-center justify-between px-4"
        onClick={toggleOpen}
      >
        {value.label}
        <ChevronDown className={`w-5 h-5 text-yellow-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute bg-white bg-opacity-20 backdrop-blur-lg rounded-lg mt-2 z-10 w-full max-h-28 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="block w-full py-2 px-4 hover:bg-white hover:bg-opacity-30 transition-colors text-left"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
      <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
      <p className="text-blue-200 mb-2">Language: {course.language}</p>
      <p className="text-blue-200 mb-2">Level: {course.level}</p>
      <button
        onClick={() => navigate(`/course/${course.id}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        View Course
      </button>
    </div>
  );
};

const RequestPage = () => {
  const [request, setRequest] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [courses, setCourses] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://bagelapi.artina.org//courses/course-generation/generate_gpt_course/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: request,
          language: selectedLanguage.value,
          level: selectedLevel.value,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit request');

      const data = await response.json();
      setSubmitStatus('success');
      setCourses([...courses, data]); // Add the new course to the courses array
      setRequest('');
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8 w-full max-w-2xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-white text-center mb-6"
        >
          Explore the Universe of Knowledge
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-blue-200 text-center mb-8"
        >
          Ask what you can't find, and let curiosity be your guide!
        </motion.p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.textarea
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="What knowledge are you seeking?"
            className="w-full p-4 bg-white bg-opacity-20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
          />

          <div className="flex space-x-4 bg-opacity-10 text-white-300 " >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex-1"
            >
              <Listbox value={selectedLanguage} onChange={setSelectedLanguage} options={languages} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex-1"
            >
              <Listbox value={selectedLevel} onChange={setSelectedLevel} options={levels} />
            </motion.div>
          </div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting || !request.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            type="submit"
          >
            <span>Launch Your Question</span>
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mt-4 p-3 rounded-lg text-center ${
              submitStatus === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {submitStatus === 'success'
              ? 'Your quest for knowledge has begun!'
              : 'Oops! There was an error. Please try again.'}
          </motion.div>
        )}
        {courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Generated Courses</h2>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </motion.div>
        )}
      </motion.div>
      <StarField />
    </div>
  );
};


const StarField = () => {
  const stars = Array.from({ length: 50 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 2 + Math.random() * 3,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    />
  ));

  return <div className="fixed inset-0 pointer-events-none">{stars}</div>;
};

export default RequestPage;