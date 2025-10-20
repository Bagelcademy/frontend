import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '../components/dialog/dialog';
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

import AIAssistant from '../components/dialog/chat';
import CodeEditor from '../components/ui/code-editor';
import Quiz from '../components/ui/quiz';
import Notes from '../components/ui/notes';
import LoadingSpinner from '../components/ui/loading';

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
  const [noQuiz, setNoQuiz] = useState(false);
  const [contentGenerating, setContentGenerating] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isLoadingNextLesson, setIsLoadingNextLesson] = useState(false);

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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
      {/* Back Button */}
      <div className="fixed sm:top-28 top-36 left-4 z-50">
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

      {/* Tab Navigation */}
      <div className="fixed top-20 left-0 right-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 z-40">
        <div className="mx-auto px-0">
          <div className="flex items-center justify-center h-20">
            <div className="flex items-center gap-4">
              {TABS.map(({ id, icon: Icon, label }) => (
                <Button
                  key={id}
                  variant="ghost"
                  onClick={() => setActiveTab(id)}
                  className={activeTab === id ? 'text-blue-500 bg-gray-300' : 'text-gray-700 bg-gray-300'}
                >
                  <Icon className="w-5 h-5" />
                  <span className="mx-2 hidden sm:inline">{label}</span>
                </Button>
              ))}
            </div>
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
                  <CardTitle className="text-2xl font-bold">{lesson.order}.{lesson?.title}</CardTitle>
                  
                  {/* Enhanced Audio Section */}
                  <div className="mt-4 p-6 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg shadow-inner">
                    {!audioUrl ? (
                      <div className="flex items-center justify-center">
                        <Button
                          onClick={generateAudio}
                          disabled={isGeneratingAudio}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200"
                        >
                          {isGeneratingAudio ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                          {isGeneratingAudio ? t('Generating Audio...') : t('Generate Audio')}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Main Audio Controls */}
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <Button
                            onClick={skipBackward}
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <SkipBack className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            onClick={togglePlayPause}
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200"
                            disabled={isBuffering}
                          >
                            {isBuffering ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : isPlaying ? (
                              <Pause className="w-6 h-6" />
                            ) : (
                              <Play className="w-6 h-6" />
                            )}
                          </Button>
                          
                          <Button
                            onClick={skipForward}
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <SkipForward className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="relative">
                            <div
                              onClick={handleSeek}
                              className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer shadow-inner"
                            >
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 shadow-sm"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>

                        {/* Secondary Controls */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3">
                            <Button
                              onClick={resetAudio}
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              onClick={toggleMute}
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </Button>
                            
                            {/* Volume Control */}
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                              />
                            </div>
                          </div>
                          
                          {/* Playback Speed */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Speed:</span>
                            <div className="flex gap-1">
                              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                <Button
                                  key={rate}
                                  onClick={() => handlePlaybackRateChange(rate)}
                                  size="sm"
                                  variant={playbackRate === rate ? "default" : "outline"}
                                  className={`text-xs px-2 py-1 ${
                                    playbackRate === rate
                                      ? 'bg-blue-600 text-white'
                                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  {rate}x
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown className="text-justify"
                      components={{
                        code({ node, inline, className, children, ...props }) {
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
      <div className="left-0 right-0 bg-white dark:bg-slate-800 border-t dark:border-slate-700 p-4 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => handleNavigation('previous')}
            disabled={parseInt(lessonId) === 1 || isLoadingNextLesson}
            className="w-24 bg-gray-700 hoveer:bg-gray-800 text-white hover:border-blue-700"
          >
            {isLoadingNextLesson ? (
              <span className="animate-spin border-2 border-slate-500 border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              t('Previous')
            )}
          </Button>
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            {t('For the next lesson, complete the exam first.')}
          </div>
          <Button
            onClick={() => handleNavigation('next')}
            disabled={!isNextAvailable || isNavigating || isLoadingNextLesson}
            className="w-24 flex items-center justify-center bg-gray-700 hoveer:bg-gray-800 text-white hover:border-blue-700"
          >
            {isLoadingNextLesson ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              t('Next')
            )}
          </Button>
        </div>
      </div>

      {/* Completion Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent className="bg-white dark:bg-gray-200 sm:max-w-md">
          <div className="flex flex-col items-center">
            <div className="text-center space-y-4">
              <h3 className="text-2xl text-black font-bold text-slate-500 dark:text-white">
                {t("Congratulations")}
              </h3>
              <p className="text-black dark:text-white">
                {t("You've completed the entire course!")}
                {t("A certificate of completion will be emailed to you shortly.")}
              </p>

              <p className="text-lg font-semibold text-black dark:text-white">{t("Rate this Course")}</p>
              <div className="flex gap-2 my-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`bg-buttonColor ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    disabled={hasRated}
                  >
                    ★
                  </button>
                ))}
              </div>

              <Button
                className="bg-slate-700 text-white dark:text-white w-full mt-4"
                onClick={() => {
                  if (rating === 0) {
                    Notify.failure(t('Please select a rating before submitting.'));
                    return;
                  }

                  fetch(`https://api.tadrisino.org/courses/CourseRating/${courseId}/set_rate/`, {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ rateDigit: rating }),
                  })
                    .then(() => {
                      Notify.success(t('Thanks for your feedback!'));
                      setHasRated(true);
                    })
                    .catch(() => Notify.failure(t('Failed to submit rating')));
                }}
                disabled={hasRated || rating === 0}
              >
                {hasRated ? t('Rating Submitted') : t('Submit Rating')}
              </Button>

              <Button
                className="bg-slate-700 text-white dark:text-white w-full"
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
    </div>
  );
};

export default LessonPage;