import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { useTranslation } from 'react-i18next';

const CharacterWelcomePopup = ({ characters, isOpen, onClose, onContinue }) => {
  const { t } = useTranslation();
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && characters && characters.length > 0) {
      setCurrentCharacterIndex(0);
      setIsVisible(true);
    }
  }, [isOpen, characters]);

  if (!isOpen || !characters || characters.length === 0) {
    return null;
  }

  const currentCharacter = characters[currentCharacterIndex];
  const isLastCharacter = currentCharacterIndex === characters.length - 1;

  const handleNext = () => {
    if (isLastCharacter) {
      // Close popup and continue to next page
      setIsVisible(false);
      setTimeout(() => {
        onContinue();
      }, 300);
    } else {
      // Show next character
      setCurrentCharacterIndex(prev => prev + 1);
    }
  };

  const getMoodColor = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'happy':
        return 'text-yellow-500';
      case 'excited':
        return 'text-orange-500';
      case 'proud':
        return 'text-purple-500';
      case 'encouraging':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'happy':
        return '😊';
      case 'excited':
        return '🎉';
      case 'proud':
        return '🌟';
      case 'encouraging':
        return '💪';
      case 'encouraging':
        return '👋';  
      default:
        return '👋';
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Popup Container */}
      <div className={`
        relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl 
        w-11/12 max-w-md mx-4 p-6 transform transition-all duration-300
        ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 
                   flex items-center justify-center text-gray-600 dark:text-gray-400 
                   hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ✕
        </button>

        {/* Character Progress Dots */}
        {characters.length > 1 && (
          <div className="flex justify-center mb-4 space-x-2">
            {characters.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentCharacterIndex 
                    ? 'bg-blue-500' 
                    : index < currentCharacterIndex 
                      ? 'bg-green-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}

        {/* Character Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 dark:border-blue-800 shadow-lg">
              <img
                src={`http://localhost:8000${currentCharacter.avatar}`}
                alt={`Character ${currentCharacter.character}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23e2e8f0"/><text x="50" y="60" text-anchor="middle" font-size="30" fill="%236b7280">${currentCharacter.character}</text></svg>`;
                }}
              />
            </div>
            
            {/* Mood Indicator */}
            <div className={`
              absolute -bottom-1 -right-1 w-8 h-8 rounded-full 
              bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-800
              flex items-center justify-center text-lg shadow-lg
              ${getMoodColor(currentCharacter.new_mood)}
            `}>
              {getMoodEmoji(currentCharacter.new_mood)}
            </div>
          </div>
        </div>

        {/* Character Name */}
        <div className="text-center mb-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
  {t('Character')} {currentCharacter.character}
</h3>
<p className={`text-sm font-medium capitalize ${getMoodColor(currentCharacter.new_mood)}`}>
  {t(currentCharacter.new_mood)}
</p>


        </div>

        {/* Speech Bubble */}
        <div className="relative mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 relative">
            {/* Speech bubble tail */}
            <div className="absolute -top-2 left-6 w-4 h-4 bg-blue-50 dark:bg-blue-900/20 rotate-45"></div>
            
            <p className="text-gray-800 dark:text-gray-200 text-center font-medium leading-relaxed">
  {t(currentCharacter.reaction_message)}
</p>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isLastCharacter ? (
            <>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 rounded-xl border-2"
              >
                {t('Skip All')}
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                {t('Next')} →
              </Button>
            </>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-semibold"
            >
              {t('Continue')} ✨
            </Button>
          )}
        </div>

        {/* Character Counter */}
        {characters.length > 1 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
          {t('{{current}} of {{total}}', { current: currentCharacterIndex + 1, total: characters.length })}
        </p>
        
        )}
      </div>
    </div>
  );
};

export default CharacterWelcomePopup;
