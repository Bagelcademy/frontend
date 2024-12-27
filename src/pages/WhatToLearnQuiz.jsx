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
  const { t } = useTranslation();
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

    // Tally categories based on the answers
    answers.forEach((answer, index) => {
      const question = questions[index];
      const category = question.categoryMapping[answer];
      categoryCounts[category] += 1;
    });

    // Find the most frequent category
    const preferredCategory = Object.keys(categoryCounts).reduce((a, b) => 
      categoryCounts[a] > categoryCounts[b] ? a : b
    );

    try {
      const response = await fetch('https://bagelapi.bagelcademy.org//courses/Category/popular-courses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: preferredCategory }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      setResult({ feedback: t("Your recommended category is:") + ` ${t(preferredCategory)}` });
      setRecommendedCourses(data);  // Store the recommended courses
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const allQuestionsAnswered = answers.every((answer) => answer !== null);

  return (
    <div className="mt-24 max-w-2xl mx-auto p-6 dark:text-white">
      <AnimatePresence mode="wait">
        {!quizCompleted ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{t("Question")} {currentQuestion + 1} {t("of")} {questions.length}</h2>
            <p className="text-lg mb-4 dark:text-white">{t(questions[currentQuestion].question)}</p>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full p-2 rounded-lg text-left ${
                    answers[currentQuestion] === option
                      ? 'bg-buttonColor text-white dark:bg-buttonColor-dark'
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleAnswer(option)}
                >
                  {t(option)}
                </motion.button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 dark:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                {t("Previous")}
              </button>
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={answers[currentQuestion] === null}
                  className="flex items-center px-4 py-2 bg-buttonColor text-white rounded-lg disabled:opacity-50 dark:bg-buttonColor-dark"
                >
                  {t("Next")}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered}
                  className="flex items-center px-4 py-2 bg-green-800 text-white rounded-lg disabled:opacity-50 dark:bg-green-700"
                >
                  {t("Submit")}
                  <Send className="w-5 h-5 ml-2" />
                </button>
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
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{t("Quiz Completed!")}</h2>
            <p className="text-lg mb-4 dark:text-white">{result.feedback}</p>

            {/* Render recommended courses using CourseCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizComponent;
