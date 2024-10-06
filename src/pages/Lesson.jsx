import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import InterLessonDialog from '../components/dialog/InterLessonDialog';
import { motion } from 'framer-motion';
import mama from '../assets/4.png';

const LessonPage = () => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [isNextAvailable, setIsNextAvailable] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndFetchLesson = async () => {
      try {
        // First, check if the course needs to be generated
        const generationResponse = await fetch(`https://bagelapi.artina.org/courses/course-generation/content-generation/${courseId}/${lessonId}`);
        
        if (generationResponse.status === 201) {
          // Course needs to be generated
          console.log('Generating course content...');
          // You might want to show a loading indicator or message here
          window.location.reload(); // Refresh the page after generation
          return; // Exit the function early to avoid fetching lesson data before the refresh
        }
        
        // If status is 200 or any other status, proceed with fetching lesson data
        const lessonResponse = await fetch(`https://bagelapi.artina.org/courses/courses/${courseId}/lessons/${lessonId}`);
        if (!lessonResponse.ok) {
          throw new Error('Failed to fetch lesson data');
        }
        const data = await lessonResponse.json();
        setLesson(data);
        setIsNextAvailable(data.isCompleted);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    checkAndFetchLesson();
  }, [courseId, lessonId]);

  // Fetch quiz questions for the lesson
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`https://bagelapi.artina.org//courses/quizzes/${lessonId}/Qlist/`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz data');
        }
        const quizData = await response.json();
        setQuizzes(quizData);
      } catch (err) {
        setError(err.message);
      }
    };

    if (lessonId) {
      fetchQuiz();
    }
  }, [lessonId]);

  // Handle answer submission
  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError('User not found, please log in.');
      return;
    }

    try {
      const response = await fetch(`https://bagelapi.artina.org//courses/answers/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: [{ question: selectedAnswer.questionId, selected_option: selectedAnswer.answer }],
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setQuizResults(result);
        setIsNextAvailable(true);
        setIsDialogOpen(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit answer');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNavigation = (direction) => {
    const currentLessonId = parseInt(lessonId);
    const newLessonId = direction === 'next' ? currentLessonId + 1 : currentLessonId - 1;
    if (currentLessonId > 0) {
      navigate(`/courses/${courseId}/lessons/${newLessonId}`);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setQuizResults(null);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!lesson) return <div className="text-center p-4">No lesson found</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-grow overflow-hidden">
        {/* Left side: Lesson Content */}
        <div className="w-full p-6 overflow-y-auto bg-white dark:bg-darkBackground">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{lesson.title}</h1>
          <div className="prose max-w-none dark:prose-dark dark:text-white" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>

        {/* Right side: Quiz section */}
        <div className="w-full bg-spaceArea dark:bg-gray-900 p-6 flex flex-col overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
            <BookOpen className="w-6 h-6 mr-2" />
            Quiz
          </h2>
          <form onSubmit={handleSubmitQuiz}>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) =>
                quiz.questions.map((question) => (
                  <div key={question.id} className="mb-4">
                    <p className="font-semibold">{question.question_text}</p>
                    {['option_1', 'option_2', 'option_3', 'option_4'].map((option, index) => (
                      <motion.div
                        key={index}
                        onClick={() => setSelectedAnswer({ questionId: question.id, answer: question[option] })}
                        className={`cursor-pointer p-2 rounded-lg border-2 mb-2 ${
                          selectedAnswer?.questionId === question.id && selectedAnswer.answer === question[option]
                            ? 'border-blue-500 bg-blue-100'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {question[option]}
                      </motion.div>
                    ))}
                  </div>
                ))
              )
            ) : (
              <p>No quiz available for this lesson.</p>
            )}
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Answer
            </button>
          </form>
          {quizResults && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Quiz Results:</h3>
              <p className="bg-white dark:bg-gray-700 p-2 rounded-lg text-gray-900 dark:text-gray-300">
                Correct Answers: {quizResults.correct_answers} / {quizResults.total_questions} ({quizResults.score}%)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800">
        <button
          onClick={() => handleNavigation('previous')}
          disabled={lesson.lessonId === 1}  // Disable only if it's the first lesson
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous Lesson
        </button>
        <button
          onClick={() => handleNavigation('next')}
          disabled={!isNextAvailable}  // Enable only when the quiz is passed
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Lesson
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      <InterLessonDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        message={dialogMessage}
        svgUrl={mama}
      />
    </div>
  );
};

export default LessonPage;
