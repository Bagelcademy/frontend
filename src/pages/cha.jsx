import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Zap, Brain, Rocket, Sparkles, Users, Target } from 'lucide-react';

// Import robot images
import WhiteRobotImage from '../assets/6.png';
import PinkRobotImage from '../assets/8.png';
import BlackRobotImage from '../assets/3.png';
import BlueRobotImage from '../assets/4.png';

const robots = [
  {
    key: 'whiteRobot',
    image: WhiteRobotImage,
    primaryColor: '#f8fafc',
    accentColor: '#64748b',
    icon: Brain,
    personality: 'The Wise Strategist',
    funFact: 'Loves solving complex puzzles and enjoys classical music',
    specialPower: 'Advanced analytical thinking and pattern recognition',
  },
  {
    key: 'pinkRobot',
    image: PinkRobotImage,
    primaryColor: '#fce7f3',
    accentColor: '#ec4899',
    icon: Star,
    personality: 'The Creative Dreamer',
    funFact: 'Collects digital art and dreams in technicolor',
    specialPower: 'Infinite imagination and artistic vision',
  },
  {
    key: 'blackRobot',
    image: BlackRobotImage,
    primaryColor: '#1f2937',
    accentColor: '#6b7280',
    icon: Zap,
    personality: 'The Lightning Executor',
    funFact: 'Processes information faster than light travels',
    specialPower: 'Ultra-speed processing and instant decision making',
  },
  {
    key: 'blueRobot',
    image: BlueRobotImage,
    primaryColor: '#dbeafe',
    accentColor: '#3b82f6',
    icon: Rocket,
    personality: 'The Future Explorer',
    funFact: 'Maps uncharted digital territories in spare time',
    specialPower: 'Innovation catalyst and future prediction',
  },
];

const FloatingOrb = ({ color, size, top, left, delay }) => (
  <div
    className={`absolute rounded-full opacity-20 animate-float`}
    style={{
      backgroundColor: color,
      width: size,
      height: size,
      top: top,
      left: left,
      animationDelay: delay,
      animationDuration: '6s',
    }}
  />
);

const RobotCharacter = ({ robot, onClick, index }) => {
  const { t } = useTranslation();
  const IconComponent = robot.icon;
  
  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-500 ease-out
        hover:scale-110 z-10
        ${index === 0 ? 'hover:rotate-3' : ''}
        ${index === 1 ? 'hover:-rotate-2' : ''}
        ${index === 2 ? 'hover:rotate-2' : ''}
        ${index === 3 ? 'hover:-rotate-3' : ''}
      `}
      onClick={onClick}
      style={{
        transform: `translateY(${index % 2 === 0 ? '10px' : '-10px'})`,
      }}
    >      
      {/* Character Base */}
      <div className="relative">
        <div
          className={`
            w-32 h-32 md:w-40 md:h-40 rounded-full p-4 backdrop-blur-sm
            transition-all duration-300 border-4 hover:shadow-2xl shadow-lg
          `}
          style={{
            background: `linear-gradient(135deg, ${robot.primaryColor} 0%, rgba(255,255,255,0.1) 100%)`,
            borderColor: robot.accentColor,
          }}
        >
          <img
            src={robot.image}
            alt={t(`${robot.key}.name`)}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
          />
        </div>
        
        {/* Name Badge */}
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: robot.accentColor,
            color: robot.primaryColor === '#1f2937' ? '#fff' : '#000',
          }}
        >
          {t(`${robot.key}.name`)}
        </div>
        
        {/* Floating Icon */}
        <div
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:animate-bounce animate-pulse"
          style={{ backgroundColor: robot.accentColor }}
        >
          <IconComponent 
            size={16} 
            color={robot.primaryColor === '#1f2937' ? '#fff' : '#000'}
          />
        </div>
      </div>
    </div>
  );
};

const CharacterModal = ({ robot, onClose }) => {
  const { t } = useTranslation();
  
  if (!robot) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="relative w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-lg border-2 animate-slideIn"
        style={{
          background: `linear-gradient(135deg, ${robot.primaryColor} 0%, rgba(255,255,255,0.95) 100%)`,
          borderColor: robot.accentColor,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 transition-colors duration-200 text-xl font-bold"
        >
          ×
        </button>
        
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full p-3 shadow-lg" style={{ backgroundColor: robot.primaryColor }}>
            <img
              src={robot.image}
              alt={t(`${robot.key}.name`)}
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: robot.accentColor }}>
            {t(`${robot.key}.name`)}
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
            {robot.personality}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Role:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t(`${robot.key}.role`)}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Special Power:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{robot.specialPower}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Fun Fact:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{robot.funFact}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Description:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t(`${robot.key}.description`)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIRobotsCharacters = () => {
  const { t } = useTranslation();
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCharacterClick = (robot) => {
    setSelectedRobot(robot);
  };

  const handleCloseModal = () => {
    setSelectedRobot(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb color="#3b82f6" size="150px" top="10%" left="5%" delay="0s" />
        <FloatingOrb color="#ec4899" size="100px" top="20%" left="85%" delay="1s" />
        <FloatingOrb color="#64748b" size="80px" top="70%" left="10%" delay="2s" />
        <FloatingOrb color="#6b7280" size="120px" top="80%" left="80%" delay="3s" />
        <FloatingOrb color="#3b82f6" size="60px" top="30%" left="50%" delay="4s" />
        <FloatingOrb color="#ec4899" size="90px" top="60%" left="70%" delay="5s" />
      </div>

      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-blue-400 rounded-full animate-spin-slow"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-pink-400 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 left-40 w-28 h-28 border-2 border-gray-400 rotate-12 animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 border-2 border-blue-500 rounded-full animate-spin-reverse"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('meetTeam')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {t('teamIntro')} Click on any character to discover their unique personalities!
          </p>
        </div>

        {/* Robot Family Photo */}
        <div className="relative">
          <div className={`flex items-center justify-center gap-8 md:gap-16 mb-16 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="flex items-end gap-4 md:gap-8">
              {robots.map((robot, index) => (
                <RobotCharacter
                  key={robot.key}
                  robot={robot}
                  index={index}
                  onClick={() => handleCharacterClick(robot)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {robots.map((robot, index) => (
            <div
              key={robot.key}
              className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleCharacterClick(robot)}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full p-3" style={{ backgroundColor: robot.primaryColor }}>
                <img
                  src={robot.image}
                  alt={t(`${robot.key}.name`)}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200" style={{ color: robot.accentColor }}>
                {t(`${robot.key}.name`)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {robot.personality}
              </p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className={`text-center transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 mb-6">
            <Target className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {t('ourMission')}
            </h2>
            <Target className="text-blue-600" size={24} />
          </div>
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('missionText')}
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
              <Users size={20} />
              <span className="font-semibold">Our AI Family Mission</span>
              <Sparkles size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Character Modal */}
      {selectedRobot && (
        <CharacterModal
          robot={selectedRobot}
          onClose={handleCloseModal}
        />
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AIRobotsCharacters;