import React from "react";
import { Button } from "../ui/button";
import {
  Volume2,
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  RotateCcw,
  VolumeX,
} from "lucide-react";
//import { formatTime } from './utils/audioUtils';

const formatTime = (seconds) => {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const LessonAudio = ({
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
  t,
}) => {
  return (
    <div className="mt-4 p-6 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg shadow-inner">
      {!audioUrl ? (
       <div className="flex items-center justify-center">
       <Button
         onClick={generateAudio}
         disabled={isGeneratingAudio}
         className={`flex items-center gap-2 
           ${isGeneratingAudio 
             ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 opacity-70 cursor-not-allowed' 
             : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:shadow-lg hover:scale-105'}
           text-white font-medium px-6 py-3 rounded-lg transition-all duration-300`}
       >
         {isGeneratingAudio ? (
           <Loader2 className="w-5 h-5 animate-spin text-white" />
         ) : (
           <Volume2 className="w-5 h-5" />
         )}
         <span>
           {isGeneratingAudio ? t('Generating Audio...') : t('Generate Audio')}
         </span>
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
                  style={{
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  }}
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
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>

              {/* Volume Control */}
              {/* Volume Control */}
              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <div className="relative w-28 h-2 rounded-full bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 shadow-inner overflow-hidden">
                  {/* Filled part */}
                  <div
                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_6px_rgba(59,130,246,0.6)] transition-all duration-500 ease-out"
                    style={{ width: `${volume * 100}%` }}
                  />

                  {/* Knob */}
                  <div
                    className="absolute top-1/2 w-4 h-4 bg-white dark:bg-slate-200 rounded-full shadow-md border border-gray-300 dark:border-gray-600 transform -translate-y-1/2 transition-transform duration-300 hover:scale-110"
                    style={{ left: `calc(${volume * 100}% - 8px)` }}
                  />

                  {/* Invisible slider for interactivity */}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Volume percentage */}
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-8 text-right">
                  {(volume * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Playback Speed */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Speed:
              </span>
              <div className="flex gap-1">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <Button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    size="sm"
                    variant={playbackRate === rate ? "default" : "outline"}
                    className={`text-xs px-2 py-1 ${
                      playbackRate === rate
                        ? "bg-blue-600 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
  );
};

export default LessonAudio;
