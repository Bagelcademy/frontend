import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent} from '../components/dialog/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ReactMarkdown from 'react-markdown';
import Confetti from 'react-confetti';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Pencil,
  Terminal,
  BrainCircuit,
} from 'lucide-react';

// Import our custom components
import AIAssistant from '../components/dialog/chat';
import CodeEditor from '../components/ui/code-editor';
import Quiz from '../components/ui/quiz';
import Notes from '../components/ui/notes';
import LoadingSpinner from '../components/ui/loading';
// Tabs configuration for cleaner code


const LessonPage = () => {
  const { t } = useTranslation();
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const TABS = [
    { id: 'content', icon: BookOpen, label: t('Content') },
    { id: 'quiz', icon: Trophy, label: t('Quiz') },
    { id: 'notes', icon: Pencil, label: t('Notes') },
    { id: 'code', icon: Terminal, label: t('Code Lab') },
    { id: 'ai', icon: BrainCircuit, label: t('AI Assistant') },
  ];
  const [activeTab, setActiveTab] = useState('content');
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNextAvailable, setIsNextAvailable] = useState(false);
  const [isLastLesson, setIsLastLesson] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [contentGenerating, setContentGenerating] = useState(false);
  useEffect(() => {
    const checkAndFetchLesson = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        Notify.failure(t('Please login first.'));
        navigate('/login');
        return;
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
  }, [courseId, lessonId, navigate, t]);

  const handleNavigation = async (direction) => {
    if (direction === 'next' && !isNextAvailable) {
      Notify.failure(t('Complete the lesson first'));
      return;
    }

    if (direction === 'next') {
      try {
        const token = localStorage.getItem('accessToken');
        await fetch(`https://bagelapi.bagelcademy.org/courses/student-progress/${lessonId}/complete-lesson/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (isLastLesson) {
          setOpenDialog(true);
        } else {
          navigate(`/courses/${courseId}/lessons/${parseInt(lessonId) + 1}`);
        }
      } catch (err) {
        setError(err.message);
      }
    } else {
      if (parseInt(lessonId) > 1) {
        navigate(`/courses/${courseId}/lessons/${parseInt(lessonId) - 1}`);
      }
    }
  };

  const handleQuizComplete = () => {
    setIsNextAvailable(true);
    Notify.success(t('Quiz completed successfully'));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Progress Bar */}
      {/* <div className="fixed top-16 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${(parseInt(lessonId) / lesson?.totalLessons) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div> */}

      {/* Tab Navigation */}
      <div className="fixed top-20 left-0 right-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 z-40">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center gap-4">
              {TABS.map(({ id, icon: Icon, label }) => (
                <Button
                  key={id}
                  variant="ghost"
                  onClick={() => setActiveTab(id)}
                  className={activeTab === id ? 'text-blue-500' : ''}
                >
                  <Icon className="w-5 h-5" />
                  <span className="ml-2 hidden sm:inline">{label}</span>
                </Button>
              ))}
            </div>
            {/* <div className="text-sm font-medium text-slate-500">
              {t('Lesson')} {lessonId} / {lesson?.totalLessons}
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pt-16 pb-24 flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'content' && (
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{lesson?.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{lesson?.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'quiz' && (
              <Quiz lessonId={lessonId} courseId={courseId} onComplete={handleQuizComplete} />
            )}

            {activeTab === 'notes' && (
              <Notes lessonId={lessonId} courseId={courseId} />
            )}

            {activeTab === 'code' && (
              <CodeEditor />
            )}

            {activeTab === 'ai' && (
              <div className="h-full"> 
              <AIAssistant lessonContent={lesson?.content} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      <div className=" left-0 right-0 bg-white dark:bg-slate-800 border-t dark:border-slate-700 p-4 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => handleNavigation('previous')}
            disabled={parseInt(lessonId) === 1}
            className="w-24"
          >
            {t('Previous')}
          </Button>
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            {t('Lesson')} {lessonId} / {lesson?.totalLessons}
          </div>
          <Button
            onClick={() => handleNavigation('next')}
            disabled={!isNextAvailable}
            className="w-24"
          >
            {t('Next')}
          </Button>
        </div>
      </div>

      {/* Completion Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">
                {t("Congratulations! 🎉")}
              </h3>
              <p className="text-slate-500">
                {t("You've completed the entire course!")}
              </p>
              <Button
                className="w-full"
                onClick={() => navigate('/courses')}
              >
                {t('Back to Courses')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {openDialog && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
    


      <style jsx global>{`
        .prose {
          max-width: none;
        }
        .prose pre {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        .prose code {
          color: #e2e8f0;
          background-color: #334155;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .prose img {
          border-radius: 0.5rem;
          margin: 2rem auto;
        }
        .prose a {
          color: #3b82f6;
          text-decoration: none;
        }
        .prose a:hover {
          text-decoration: underline;
        }
        .dark .prose {
          color: #e2e8f0;
        }
        .dark .prose strong {
          color: #f8fafc;
        }
        .dark .prose a {
          color: #60a5fa;
        }
        .dark .prose blockquote {
          border-left-color: #475569;
        }
        .dark .prose code {
          background-color: #1e293b;
        }
        .dark .prose pre {
          background-color: #0f172a;
        }
        .dark .prose hr {
          border-color: #334155;
        }
        .dark .prose thead {
          border-bottom-color: #334155;
        }
        .dark .prose tbody tr {
          border-bottom-color: #1e293b;
        }
        @media (max-width: 768px) {
          .prose {
            font-size: 0.925em;
          }
          .prose pre {
            padding: 0.75rem;
          }
          .prose img {
            margin: 1.5rem auto;
          }
        }
      `}</style>
    </div>
  );
};

export default LessonPage;