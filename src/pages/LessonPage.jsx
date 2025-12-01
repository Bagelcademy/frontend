import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Quiz from '../components/ui/quiz';
import Notes from '../components/ui/notes';
import CodeEditor from '../components/ui/code-editor';
import AIAssistant from '../components/dialog/chat';
import LoadingSpinner from '../components/ui/loading';
import LessonCompletionDialog from '../components/lesson/LessonCompletionDialog';
import LessonAudio from '../components/lesson/LessonAudio';
import LessonTabs from '../components/lesson/LessonTabs'; // اختیاری
import LessonGuidedTour from '../components/lesson/LessonGuidedTour';
/////////////////////////////////////////////////////////////////////////



import LessonContent from '../components/lesson/LessonContent';
import { Dialog, DialogContent } from '../components/dialog/dialog';


import LessonFooter from '../components/lesson/LessonFooter';
import LessonLoader from '../components/lesson/LessonLoader';
import Confetti from 'react-confetti';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Pencil,
  Terminal,
  BrainCircuit,
  ChevronLeft,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Loader2,
  SkipBack,
  SkipForward,
} from 'lucide-react';



const LessonPage = () => {
  const { t } = useTranslation();
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const TABS = [
    { id: 'content', icon: BookOpen, label: t('Content'), tourClass: 'tour-content-tab' },
    { id: 'quiz', icon: Trophy, label: t('Quiz'), tourClass: 'tour-quiz-tab' },
    { id: 'notes', icon: Pencil, label: t('Notes'), tourClass: 'tour-notes-tab' },
    { id: 'code', icon: Terminal, label: t('Code Lab'), tourClass: 'tour-code-tab' },
    { id: 'ai', icon: BrainCircuit, label: t('AI Assistant'), tourClass: 'tour-ai-tab' },
  ];
  
  const [activeTab, setActiveTab] = useState('content');
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNextAvailable, setIsNextAvailable] = useState(false);
  const [isLastLesson, setIsLastLesson] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [noQuiz, setNoQuiz] = useState(false);
  const [contentGenerating, setContentGenerating] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isLoadingNextLesson, setIsLoadingNextLesson] = useState(false);
  const [originalOrder, setOriginalOrder] = useState(null);

  // Audio related states
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioElement, setAudioElement] = useState(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  const handleBack = () => {
    navigate(`/course/${courseId}`);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [activeTab]);
  


  useEffect(() => {
    if (audioElement) {
      const updateTime = () => setCurrentTime(audioElement.currentTime);
      const updateDuration = () => setDuration(audioElement.duration);
  
      audioElement.addEventListener("timeupdate", updateTime);
      audioElement.addEventListener("loadedmetadata", updateDuration);
  
      // پاکسازی وقتی audioElement عوض میشه
      return () => {
        audioElement.removeEventListener("timeupdate", updateTime);
        audioElement.removeEventListener("loadedmetadata", updateDuration);
      };
    }
  }, [audioElement]);
  
  const togglePlayPause = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (audioElement) {
      audioElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const resetAudio = () => {
    if (audioElement) {
      audioElement.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying) {
        audioElement.play();
      }
    }
  };
  
  const skipForward = () => {
    if (audioElement) {
      audioElement.currentTime = Math.min(audioElement.currentTime + 10, duration);
    }
  };
  
  const skipBackward = () => {
    if (audioElement) {
      audioElement.currentTime = Math.max(audioElement.currentTime - 10, 0);
    }
  };
  
  // Audio generation function
  const generateAudio = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      Notify.failure(t('Please login first.'));
      return;
    }

    setIsGeneratingAudio(true);
    try {
      const response = await fetch(
        `https://api.tadrisino.org/courses/lesson-tts/generate_voice/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lesson_id: lessonId }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        // Construct full URL for the audio file
      const fullAudioUrl = typeof data.audio_url === 'string' && data.audio_url.startsWith('http') 
        ? data.audio_url 
        : `http://localhost:8000${data.audio_url}`;
        setAudioUrl(fullAudioUrl);
        Notify.success(t('Audio generated successfully!'));
      } else {
        Notify.failure(data.error || t('Failed to generate audio'));
      }
    } catch (error) {
      Notify.failure(t('Error generating audio'));
      console.error('Audio generation error:', error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Audio control functions
  

  

  

  

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioElement) {
      audioElement.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (audioElement) {
      audioElement.playbackRate = rate;
    }
  };

  const handleTimeUpdate = () => {
    if (audioElement) {
      setCurrentTime(audioElement.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioElement) {
      setDuration(audioElement.duration);
    }
  };

  const handleSeek = (e) => {
    if (audioElement) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioElement.currentTime = pos * duration;
    }
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handleCanPlay = () => {
    setIsBuffering(false);
  };

  

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
          `https://api.tadrisino.org/courses/course-generation/content-generation/${courseId}/${lessonId}/`
        );

        if (generationResponse.status === 201) {
          console.log('Generating course content...');
          window.location.reload();
          return;
        }

        const lessonResponse = await fetch(
          `https://api.tadrisino.org/courses/courses/${courseId}/lessons/${lessonId}/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!lessonResponse.ok && lessonResponse.status === 403) {
          throw new Error(t('You do not have subscription anymore.'));
        }

        if (!lessonResponse.ok) {
          throw new Error(t('Failed to fetch lesson data'));
        }

        const data = await lessonResponse.json();
        setLesson(data);
        setIsLastLesson(data.is_last_lesson);
        setOriginalOrder(data.order ?? (lessonId ? parseInt(lessonId) : null));

        // Check if lesson has existing audio and construct full URL
        if (typeof data.audio === 'string' && data.audio.trim() !== '') {
          const fullAudioUrl = data.audio.startsWith('http') 
            ? data.audio 
            : `http://localhost:8000${data.audio}`;
          setAudioUrl(fullAudioUrl);
        }


        if (data.has_quiz === false) {
          setNoQuiz(true);
          setIsNextAvailable(true);

          await fetch(
            `https://api.tadrisino.org/courses/student-progress/${lessonId}/complete-lesson/`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
        } else {
          setNoQuiz(false);
        }
        setIsNextAvailable(data.isCompleted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setContentGenerating(false);
        setIsLoadingNextLesson(false);
      }
    };

    checkAndFetchLesson();
  }, [courseId, lessonId, navigate, t]);

  // Initialize audio element when audioUrl changes
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.volume = volume;
      audio.playbackRate = playbackRate;
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        Notify.failure(t('Failed to load audio'));
      });
      setAudioElement(audio);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', () => setIsPlaying(false));
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.pause();
      };
    }
  }, [audioUrl, volume, playbackRate]);

  const handleNavigation = async (direction) => {
    if (direction === 'next' && !isNextAvailable) {
      Notify.failure(t('Complete the lesson first'));
      return;
    }

    // Pause audio if playing
    if (audioElement && isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    }

    setIsNavigating(true);
    setIsLoadingNextLesson(true);

    if (direction === 'next') {
      try {
        const token = localStorage.getItem('accessToken');
        await fetch(`https://api.tadrisino.org/courses/student-progress/${lessonId}/complete-lesson/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (isLastLesson) {
          setOpenDialog(true);
          setIsLoadingNextLesson(false);
        } else {
          setActiveTab('content');
          navigate(`/courses/${courseId}/lessons/${parseInt(lessonId) + 1}`);
        }
      } catch (err) {
        setError(err.message);
        setIsLoadingNextLesson(false);
      } finally {
        setIsNavigating(false);
      }
    } else {
      if (parseInt(lessonId) > 1) {
        setIsLoadingNextLesson(true);
        navigate(`/courses/${courseId}/lessons/${parseInt(lessonId) - 1}`);
      }
    }
  };
  
  const handleQuizComplete = () => {
    setIsNextAvailable(true);
    Notify.success(t('Quiz completed successfully'));
  };

  if (loading || isLoadingNextLesson) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/50 z-50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
            {isLoadingNextLesson ? t('Loading next lesson...') : t('Loading lesson...')}
          </p>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (

    
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Tab Navigation */}
      <LessonTabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
      <LessonGuidedTour/>
      {/* Back Button - Fixed position under tabs */}
      <div className="fixed left-4 sm:top-[calc(7rem+40px)] md:top-[calc(7rem+64px)] top-[calc(9rem+30px)] z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-600 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('Back to Course')}
        </Button>
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
                  <CardTitle className="text-2xl font-bold">{lesson?.order}. {lesson?.title}</CardTitle>
                  <LessonAudio
                    audioUrl={audioUrl}
                    isGeneratingAudio={isGeneratingAudio}
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    isBuffering={isBuffering}
                    duration={duration}
                    currentTime={currentTime}
                    playbackRate={playbackRate}
                    volume={volume}
                    generateAudio={generateAudio}
                    skipForward={skipForward}
                    skipBackward={skipBackward}
                    togglePlayPause={togglePlayPause}
                    toggleMute={toggleMute}
                    resetAudio={resetAudio}
                    handleVolumeChange={handleVolumeChange}
                    handlePlaybackRateChange={handlePlaybackRateChange}
                    handleSeek={handleSeek}
                    t={t}
                  />
                </CardHeader>
                
                  {/* Enhanced Audio Section */}
                  
                
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">

                    
                    <ReactMarkdown className="text-justify"
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const content = String(children).trim();
                          // Check for LaTeX block math ($$...$$ or \[...\])
                          if (!inline && (
                            (content.startsWith('$$') && content.endsWith('$$')) ||
                            (content.startsWith('\\[') && content.endsWith('\\]'))
                          )) {
                            const math = content.startsWith('$$') 
                              ? content.slice(2, -2) 
                              : content.slice(2, -2);
                            return (
                              <BlockMath math={math} />
                            );
                          }
                          // Check for LaTeX inline math ($...$ or \(...\))
                          if (inline && (
                            (content.startsWith('$') && content.endsWith('$')) ||
                            (content.startsWith('\\(') && content.endsWith('\\)'))
                          )) {
                            const math = content.startsWith('$') 
                              ? content.slice(1, -1) 
                              : content.slice(2, -2);
                            return <InlineMath math={math} />;
                          }
                          return inline ? (
                            <code {...props}>{children}</code>
                          ) : (
                            <pre
                              style={{
                                direction: "ltr",
                                textAlign: "left",
                              }}
                              {...props}
                            >
                              <code>{children}</code>
                            </pre>
                          );
                        },
                      }}
                    >
                      {lesson?.content}
                    </ReactMarkdown>
                  </div>
                  <div className="mt-20 mb-3 flex justify-center">
                    <Button
                      onClick={() => setActiveTab('quiz')}
                      className="px-3 py-5 gap-x-2 text-lg bg-blue-500 hover:bg-blue-600 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white dark:text-gray-300"
                    >
                      <Trophy className="w-5 h-5" /> {t('Quiz')}
                    </Button>
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
      <LessonFooter
        handleNavigation={handleNavigation}
        t={t}
        isNextAvailable={isNextAvailable}
        isNavigating={isNavigating}
        isLoadingNextLesson={isLoadingNextLesson}
        lessonId={lessonId}
        lessonOrder={originalOrder}
      />


      {/* Completion Dialog */}
      <LessonCompletionDialog open={openDialog} onClose={() => setOpenDialog(false)} courseId={courseId} />

        
    </div>
  );
};

export default LessonPage;