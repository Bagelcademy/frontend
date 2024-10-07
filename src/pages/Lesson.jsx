import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import InterLessonDialog from '../components/dialog/InterLessonDialog';
import { motion } from 'framer-motion';
import mama from '../assets/87.gif';
import ReactMarkdown from 'react-markdown';

const LessonPage = () => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
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
        const lessonResponse = await fetch(`https://bagelapi.artina.org/courses/courses/${courseId}/lessons/${lessonId}/`);
        if (!lessonResponse.ok) {
          throw new Error('Failed to fetch lesson data');
        }
        const data = await lessonResponse.json();
        setLesson(data);
        if (data.is_last_lesson) {
        setIsLastLesson(true);
      }
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
        const generationResponse = await fetch(`https://bagelapi.artina.org/courses/generate-quiz/${courseId}/${lessonId}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (generationResponse.status === 201) {
          // Course needs to be generated
          console.log('Generating course content...');
          // You might want to show a loading indicator or message here
          window.location.reload(); // Refresh the page after generation
          return; // Exit the function early to avoid fetching lesson data before the refresh
        }
                
        const response = await fetch(`https://bagelapi.artina.org/courses/quizzes/${lessonId}/Qlist/`);
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
          answers: Object.entries(selectedAnswers).map(([questionId, answer]) => ({
            question: questionId,
            selected_option: answer
          })),
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
    if (isLastLesson) {
      setOpenDialog(true);}
    else {
    const currentLessonId = parseInt(lessonId);
    const newLessonId = direction === 'next' ? currentLessonId + 1 : currentLessonId - 1;
    if (currentLessonId > 0) {
      navigate(`/courses/${courseId}/lessons/${newLessonId}`);
    }}
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
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{lesson.title}</h1>
          <div className="markdown-content">
            <ReactMarkdown className="prose max-w-none dark:prose-dark">
              {lesson.content}
            </ReactMarkdown>
          </div>
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
                        onClick={() => setSelectedAnswers({...selectedAnswers, [question.id]: question[option]})}
                        className={`cursor-pointer p-2 rounded-lg border-2 mb-2 ${
                          selectedAnswers[question.id] === question[option]
                            ? 'border-gray-600 bg-red-100'
                            : 'border-gray-300 hover:border-red-400'
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
              {/* Dialog for certificate */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Congratulations!</DialogTitle>
        <DialogContent>
          <img src={pic} alt="Congratulations" />
          <p>Would you like to get a certificate for this course?</p>
          <Button variant="contained" color="primary" onClick={() => alert('Certificate generated!')}>
            Get Certificate
          </Button>
        </DialogContent>
      </Dialog>

      {/* Confetti animation */}
      {openDialog && <Confetti />}
      </div>

      <InterLessonDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        message={dialogMessage}
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
      `}</style>
    </div>
  );
};

export default LessonPage;