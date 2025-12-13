import React from 'react';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Trophy } from 'lucide-react';
import LessonAudio from './LessonAudio';

const LessonContent = ({
  lesson,
  courseLanguage,
  audioUrl,
  isGeneratingAudio,
  isPlaying,
  isMuted,
  isBuffering,
  duration,
  currentTime,
  playbackRate,
  volume,
  generateAudio,
  skipForward,
  skipBackward,
  togglePlayPause,
  toggleMute,
  resetAudio,
  handleVolumeChange,
  handlePlaybackRateChange,
  handleSeek,
  setActiveTab,
  t,
}) => {
  return (
    <Card
      className={`max-w-4xl mx-auto mt-8 sm:mt-2 ${
        courseLanguage === 'Persian'
          ? '[direction:rtl] text-right'
          : '[direction:ltr] text-left'
      }`}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {lesson?.order}. {lesson?.title}
        </CardTitle>
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

      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            className={`text-justify ${
              courseLanguage === 'Persian'
                ? '[direction:rtl] text-right'
                : '[direction:ltr] text-left'
            }`}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const content = String(children).trim();
                // Check for LaTeX block math ($$...$$ or \[...\])
                if (
                  !inline &&
                  ((content.startsWith('$$') && content.endsWith('$$')) ||
                    (content.startsWith('\\[') && content.endsWith('\\]')))
                ) {
                  const math = content.startsWith('$$')
                    ? content.slice(2, -2)
                    : content.slice(2, -2);
                  return <BlockMath math={math} />;
                }
                // Check for LaTeX inline math ($...$ or \(...\))
                if (
                  inline &&
                  ((content.startsWith('$') && content.endsWith('$')) ||
                    (content.startsWith('\\(') && content.endsWith('\\)')))
                ) {
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
                      direction: 'ltr',
                      textAlign: 'left',
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
  );
};

export default LessonContent;
