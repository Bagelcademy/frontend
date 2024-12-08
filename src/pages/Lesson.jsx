import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import InterLessonDialog from '../components/dialog/InterLessonDialog';
import { motion } from 'framer-motion';
import mama from '../assets/87.gif';
import ReactMarkdown from 'react-markdown';
import Confetti from 'react-confetti';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/ui/loading';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const LessonPage = () => {
  const { t, i18n } = useTranslation(); // Use i18n to get the current language
  const [openDialog, setOpenDialog] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentGenerating, setContentGenerating] = useState(false);
  const [quizGenerating, setQuizGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [isNextAvailable, setIsNextAvailable] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const { courseId, lessonId, quizId } = useParams();
  const [isLastLesson, setIsLastLesson] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndFetchLesson = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        Notify.failure(t('Please login first.'));
        navigate('/login');
        return; // Stop further execution
      }

      try {
        setContentGenerating(true);
        const generationResponse = await fetch(
          `https://bagelapi.bagelcademy.org/courses/course-generation/content-generation/${courseId}/${lessonId}/`
        );

        if (generationResponse.status === 201) {
          console.log('Generating course content...');
          window.location.reload();
          return;
        }

        const lessonResponse = await fetch(
          `https://bagelapi.bagelcademy.org/courses/courses/${courseId}/lessons/${lessonId}/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!lessonResponse.ok) {
          throw new Error('Failed to fetch lesson data');
        }
        const data = await lessonResponse.json();
        setLesson(data);
        if (data.is_last_lesson) {
          setIsLastLesson(true);
        }
        setIsNextAvailable(data.isCompleted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setContentGenerating(false);
      }
    };

    checkAndFetchLesson();
  }, [courseId, lessonId]);


  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError(t('User not found, please log in.'));
        return;
      }
      try {
        setQuizGenerating(true); // Start loading
        const generationResponse = await fetch(`https://bagelapi.bagelcademy.org/courses/generate-quiz/${courseId}/${lessonId}/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (generationResponse.status === 201) {
          window.location.reload();
          return;
        }

        const response = await fetch(`https://bagelapi.bagelcademy.org/courses/exams/${lessonId}/Qlist/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.detail === 'You do not have a subscription') {
            navigate('/shop');
            return;
          }
        }

        if (!response.ok) {
          throw new Error(t('Failed to fetch quiz data'));
        }
        const quizData = await response.json();
        setQuizzes(quizData);
      } catch (err) {
        setError(err.message);
      } finally {
        setQuizGenerating(false); // End loading
      }
    };

    if (lessonId) {
      fetchQuiz();
    }
  }, [lessonId]);

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setError(t('User not found, please log in.'));
      return;
    }
    try {
      const response = await fetch(`https://bagelapi.bagelcademy.org/courses/quizzes/${lessonId}/submit_answers/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
            question_id: parseInt(questionId),
            selected_option: selectedOption
          })),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setQuizResults(result);
        setDialogMessage(
          `${t('Quiz submitted successfully.')}\n\n${t('Total Score')}: ${result.total_score}\n${t('Points Earned')}: ${result.points_earned}`
        );
        setIsNextAvailable(true);
        setIsDialogOpen(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || t('Failed to submit answer'));
      }
    } catch (err) {
      setError(err.message);
    }
  };



  const handleCompleteLessonAndNavigate = async (direction) => {
    if (direction === 'next') {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError(t('User not found, please log in.'));
          return;
        }

        const response = await fetch(`https://bagelapi.bagelcademy.org/courses/student-progress/${lessonId}/complete-lesson/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lesson_id: lessonId
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || t('Failed to complete lesson'));
        }

        const result = await response.json();
        console.log('Lesson completion result:', result);

        // After successful completion, handle navigation
        if (isLastLesson) {
          setOpenDialog(true);
        } else {
          const currentLessonId = parseInt(lessonId);
          const newLessonId = currentLessonId + 1;
          navigate(`/courses/${courseId}/lessons/${newLessonId}`);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error completing lesson:', err);
      }
    } else {
      // For previous navigation, just navigate without completing
      const currentLessonId = parseInt(lessonId);
      const newLessonId = currentLessonId - 1;
      if (currentLessonId > 1) {
        navigate(`/courses/${courseId}/lessons/${newLessonId}`);
      }
    }
  };

  const handleNavigation = (direction) => {
    if (direction === 'next') {
      // Allow navigation if quizzes are empty
      if (!isNextAvailable && quizzes[0].questions.length === 0) {
        handleCompleteLessonAndNavigate(direction);
        return;
      }

      // If quizzes are present, ensure the lesson is marked as completed
      if (!isNextAvailable) {
        Notify.failure(t('Please complete the current lesson first.'));
        return;
      }
    }
    handleCompleteLessonAndNavigate(direction);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setQuizResults(null);
  };

  if (loading) return <div className="text-center p-4">{t('Loading...')}</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!lesson) return <div className="text-center p-4">{t('No lesson found')}</div>;

  const isPersian = i18n.language === 'fa'; // Check if the language is Persian
  return (
    <div
      className={`mt-24 flex flex-col h-screen bg-gray-100 dark:bg-gray-900 ${isPersian ? 'rtl' : 'ltr'}`}
    >
      <div className="flex flex-grow overflow-hidden">
        {/* Left side: Lesson Content */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-white dark:bg-darkBackground">
          {contentGenerating ? (
            <LoadingSpinner />
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{lesson?.title}</h1>
              <div className="markdown-content">
                <ReactMarkdown className="prose max-w-none dark:prose-dark">
                  {lesson?.content}
                </ReactMarkdown>
              </div>
            </>
          )}
        </div>
        {/* Right side: Quiz section */}
        <div className="w-full md:w-1/2 bg-spaceArea text-black dark:bg-gray-900 p-6 flex flex-col h-full overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
            <BookOpen className="w-6 h-6 mx-2" />
            {t('Quiz')}
          </h2>
          {quizGenerating ? (
            <LoadingSpinner />
          ) : (
            <form onSubmit={handleSubmitQuiz} className="flex-grow flex flex-col">

              {quizzes.length > 0 ? (
                quizzes.map((quiz) =>
                  quiz.questions.map((question) => (
                    <div key={question.id} className="mb-4 flex-grow">
                      <p className="font-semibold dark:text-white">{question.question_text}</p>
                      {['option_1', 'option_2', 'option_3', 'option_4'].map((option, index) => (
                        <motion.div
                          key={index}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [question.id]: question[option] })}
                          className={`cursor-pointer p-2 rounded-lg border-2 mb-2 ${selectedAnswers[question.id] === question[option]
                            ? 'border-gray-600 dark:text-white bg-red-100 dark:bg-red-600'
                            : 'border-gray-500 dark:text-white hover:border-red-400'
                            }`}
                        >
                          {question[option]}
                        </motion.div>
                      ))}
                    </div>
                  ))
                )
              ) : (
                <p>{t('No quiz available for this lesson.')}</p>
              )}
              <button
                type="submit"
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 flex items-center mt-auto"
              >
                <Send className="w-4 h-4 mr-2" />
                {t('Submit Answer')}
              </button>
            </form>
          )}
          {quizResults && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">{t('Quiz Results')}:</h3>
              <div className="bg-white dark:bg-darkBase p-2 rounded-lg text-gray-900 dark:text-gray-300">
                {quizResults.message}<br />
                {t('Total Score')}: {quizResults.total_score}<br />
                {t('Points Earned')}: {quizResults.points_earned}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800">
        <button
          onClick={() => handleNavigation('previous')}
          disabled={lesson.lessonId === 1}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('Previous Lesson')}
        </button>
        <button
          onClick={() => handleNavigation('next')}
          disabled={!isNextAvailable && quizzes[0]?.questions?.length > 0}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('Next Lesson')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t('Congratulations')}</DialogTitle>
        <DialogContent>
          <img src={mama} alt="Congratulations" />
          <p>{t('Would you like to get a certificate for this course?')}</p>
          <Button variant="contained" color="primary" onClick={() => alert('Certificate generated!')}>
            {t('Get Certificate')}
          </Button>
        </DialogContent>
      </Dialog>
      {openDialog && <Confetti />}

      <InterLessonDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        message={
          <span
            className={`block p-4 rounded-lg ${isPersian ? 'rtl' : 'ltr'
              } ${document.body.classList.contains('dark')
                ? 'text-white bg-gray-900'
                : 'text-black bg-white'
              }`}>
            {dialogMessage}
          </span>
        }
        svgUrl={mama}
      />

      <style jsx global>{`
        .markdown-content {
          text-align: justify;
          line-height: 1.8;
          color: #333;
        }
        .dark .markdown-content {
          color: #e0e0e0;
        }
        .markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6 {
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          font-weight: 600;
        }
        .markdown-content p {
          margin-bottom: 1.25em;
        }
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.5em;
          margin-bottom: 1.25em;
        }
        .markdown-content li {
          margin-bottom: 0.5em;
        }
        .markdown-content blockquote {
          border-left: 4px solid #e0e0e0;
          padding-left: 1em;
          margin-left: 0;
          font-style: italic;
        }
        .dark .markdown-content blockquote {
          border-left-color: #4a4a4a;
        }
        .markdown-content code {
          background-color: #f0f0f0;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
          direction: ltr;
          text-align: left;
        }
        .markdown-content pre,
        .markdown-content code {
          background-color: #f5f5f5;
          padding: 1em;
          border-radius: 5px;
          overflow-x: auto;
          direction: ltr; /* Set text direction to left */
          text-align: left;
        }
        .dark .markdown-content code {
          background-color: #2a2a2a;
        }
        .markdown-content pre {
          background-color: #f5f5f5;
          padding: 1em;
          border-radius: 5px;
          overflow-x: auto;
        }
        .dark .markdown-content pre {
          background-color: #1a1a1a;
        }

        @media (max-width: 768px) {
          .flex-grow {
            flex-direction: column;
          }
          .w-1/2 {
            width: 100%;
          }
          .quiz-section {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
};

export default LessonPage;