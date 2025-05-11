import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CourseCard from '../components/ui/coursecard'; // Import CourseCard component

const questions = [
  {
    id: 1,
    question: "What kind of tasks do you enjoy the most?",
    options: ["Building things", "Helping people", "Solving puzzles", "Creating art"],
    categoryMapping: {
      "Building things": "technology",
      "Helping people": "social_sciences",
      "Solving puzzles": "science",
      "Creating art": "arts"
    }
  },
  {
    id: 2,
    question: "Which of these activities sounds most interesting?",
    options: ["Writing code", "Starting a business", "Conducting experiments", "Learning about history"],
    categoryMapping: {
      "Writing code": "technology",
      "Starting a business": "business",
      "Conducting experiments": "science",
      "Learning about history": "social_sciences"
    }
  },
  {
    id: 3,
    question: "What would you prefer to work on?",
    options: ["Designing a logo", "Developing an app", "Running a marketing campaign", "Writing a research paper"],
    categoryMapping: {
      "Designing a logo": "arts",
      "Developing an app": "technology",
      "Running a marketing campaign": "business",
      "Writing a research paper": "social_sciences"
    }
  },
  {
    id: 4,
    question: "How do you prefer to solve problems?",
    options: ["Using logical reasoning", "Collaborating with others", "Innovating new ideas", "Analyzing data"],
    categoryMapping: {
      "Using logical reasoning": "science",
      "Collaborating with others": "social_sciences",
      "Innovating new ideas": "arts",
      "Analyzing data": "technology"
    }
  },
  {
    id: 5,
    question: "Which of these fields would you like to explore more?",
    options: ["Engineering and Programming", "Psychology and Sociology", "Fine Arts and Design", "Finance and Marketing"],
    categoryMapping: {
      "Engineering and Programming": "technology",
      "Psychology and Sociology": "social_sciences",
      "Fine Arts and Design": "arts",
      "Finance and Marketing": "business"
    }
  }
];

const QuizComponent = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const categoryCounts = {
      technology: 0,
      arts: 0,
      science: 0,
      business: 0,
      social_sciences: 0,
    };

    answers.forEach((answer, index) => {
      const question = questions[index];
      const category = question.categoryMapping[answer];
      categoryCounts[category] += 1;
    });

    const preferredCategory = Object.keys(categoryCounts).reduce((a, b) =>
      categoryCounts[a] > categoryCounts[b] ? a : b
    );

    try {
      const response = await fetch('https://api.tadrisino.org/courses/Category/popular-courses/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: preferredCategory }),
      });

      if (!response.ok) throw new Error('Failed to submit quiz');

      const data = await response.json();
      setResult({ feedback: `${t("Your recommended category is:")} ${t(preferredCategory)}` });
      setRecommendedCourses(data);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-center dark:text-white dark:bg-black">
      <AnimatePresence mode="wait">
        {!quizCompleted ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">{t("Question")} {currentQuestion + 1} {t("of")} {questions.length}</h2>
            <p className="text-lg mb-6 text-black dark:text-white">{t(questions[currentQuestion].question)}</p>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full px-4 py-3 rounded-lg text-lg font-medium transition-all ${answers[currentQuestion] === option
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-black dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600'
                    }`}
                  onClick={() => handleAnswer(option)}
                >
                  {t(option)}
                </motion.button>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              {!isRtl ? (
                // **LTR Layout (English, etc.)**
                <>
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="flex items-center px-3 py-2 rounded-lg text-lg font-semibold bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    {t("Previous")}
                  </button>

                  {currentQuestion < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      disabled={answers[currentQuestion] === null}
                      className="flex items-center px-3 py-2 rounded-lg text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white disabled:opacity-50"
                    >
                      {t("Next")}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center px-3 py-2 rounded-lg text-lg font-semibold bg-green-700 text-white"
                    >
                      {t("Submit")}
                      <Send className="w-5 h-5 ml-2" />
                    </button>
                  )}
                </>
              ) : (
                // **RTL Layout (Persian, etc.)**
                <>
                  {currentQuestion < questions.length - 1 ? (
                    <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="flex items-center px-3 py-2 rounded-lg text-lg font-semibold bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5 mx-2" /> {/* RTL: Chevron Right on Previous */}
                    {t("Previous")}
                  </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center px-3 py-2 rounded-lg text-lg font-semibold bg-green-700 text-white"
                    >
                      <Send className="w-5 h-5 mx-2" /> {/* RTL: Chevron Left on Submit */}
                      {t("Submit")}
                    </button>
                  )}

                  <button
                      onClick={handleNext}
                      disabled={answers[currentQuestion] === null}
                      className="flex items-center px-3 py-2 rounded-lg text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white disabled:opacity-50"
                    >
                      {t("Next")}
                      <ChevronLeft className="w-5 h-5 mx-2" /> {/* RTL: Chevron Left on Next */}
                    </button>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center dark:text-white"
          >
            <h2 className="text-2xl font-bold mb-4">{t("Quiz Completed!")}</h2>
            <p className="text-lg mb-6">{result.feedback}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedCourses.map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizComponent;
