import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Star, Zap, Brain, Rocket } from 'lucide-react';

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
  },
  {
    key: 'pinkRobot',
    image: PinkRobotImage,
    primaryColor: '#fce7f3',
    accentColor: '#ec4899',
    icon: Star,
  },
  {
    key: 'blackRobot',
    image: BlackRobotImage,
    primaryColor: '#1f2937',
    accentColor: '#6b7280',
    icon: Zap,
  },
  {
    key: 'blueRobot',
    image: BlueRobotImage,
    primaryColor: '#dbeafe',
    accentColor: '#3b82f6',
    icon: Rocket,
  },
];

const RobotCard = ({ robot, isActive, onClick }) => {
  const { t } = useTranslation();
  const IconComponent = robot.icon;
  
  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 ease-out
        ${isActive ? 'scale-105' : 'scale-100 hover:scale-102'}
      `}
      onClick={() => onClick(robot)}
    >
      {/* Card Background */}
      <div 
        className={`
          relative overflow-hidden rounded-3xl p-8 h-80
          ${isActive ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'}
          transition-all duration-300
        `}
        style={{
          background: `linear-gradient(135deg, ${robot.primaryColor} 0%, rgba(255,255,255,0.1) 100%)`,
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Robot Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={robot.image}
              alt={t(`${robot.key}.name`)}
              className={`w-24 h-24 object-contain transition-transform duration-300 ${
                isActive ? 'scale-110' : ''
              }`}
            />
            {isActive && (
              <div 
                className="absolute inset-0 rounded-full blur-lg opacity-50"
                style={{ backgroundColor: robot.accentColor }}
              />
            )}
          </div>
        </div>

        {/* Robot Name */}
        <h3 
          className="text-2xl font-bold text-center mb-4"
          style={{ color: robot.accentColor }}
        >
          {t(`${robot.key}.name`)}
        </h3>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <IconComponent 
            size={32} 
            style={{ color: robot.accentColor }}
            className={isActive ? 'animate-pulse' : ''}
          />
        </div>

        {/* Click indicator */}
        <div className="flex justify-center">
          <ChevronDown 
            size={20}
            style={{ color: robot.accentColor }}
            className={`transition-transform duration-300 ${
              isActive ? 'rotate-180' : 'animate-bounce'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

const RobotDetails = ({ robot }) => {
  const { t } = useTranslation();
  
  return (
    <div 
      className="mt-12 p-8 rounded-3xl transition-all duration-500 ease-out"
      style={{
        background: `linear-gradient(135deg, ${robot.primaryColor} 0%, rgba(255,255,255,0.05) 100%)`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Large Robot Image */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={robot.image}
              alt={t(`${robot.key}.name`)}
              className="w-40 h-40 object-contain"
            />
            <div 
              className="absolute inset-0 rounded-full blur-2xl opacity-30"
              style={{ backgroundColor: robot.accentColor }}
            />
          </div>
        </div>

        {/* Robot Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 
            className="text-4xl font-bold mb-4"
            style={{ color: robot.accentColor }}
          >
            {t(`${robot.key}.name`)}
          </h2>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t(`${robot.key}.description`)}
          </p>
          
          <div 
            className="inline-block px-4 py-2 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: robot.accentColor,
              color: robot.primaryColor === '#1f2937' ? '#fff' : '#000'
            }}
          >
            {t(`${robot.key}.role`)}
          </div>
        </div>
      </div>
    </div>
  );
};

const AIRobotsCharacters = () => {
  const { t } = useTranslation();
  const [selectedRobot, setSelectedRobot] = useState(robots[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('meetTeam')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('teamIntro')}
          </p>
        </div>

        {/* Robot Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {robots.map((robot, index) => (
            <div
              key={robot.key}
              className={`transition-all duration-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <RobotCard
                robot={robot}
                isActive={selectedRobot?.key === robot.key}
                onClick={setSelectedRobot}
              />
            </div>
          ))}
        </div>

        {/* Selected Robot Details */}
        {selectedRobot && (
          <div className={`transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <RobotDetails robot={selectedRobot} />
          </div>
        )}

        {/* Mission Statement */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              {t('ourMission')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('missionText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRobotsCharacters;
