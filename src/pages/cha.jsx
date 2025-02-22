import React from 'react';
import './characters2.css';
import { useTranslation } from 'react-i18next';

// Import images
import MamaBagelImage from '../assets/4.png';
import PapaBagelImage from '../assets/5.png';
import JillImage from '../assets/6.png';
import JackieImage from '../assets/7.png';

const characters = [
  {
    key: 'mamaBagel',
    image: MamaBagelImage,
  },
  {
    key: 'papaBagel',
    image: PapaBagelImage,
  },
  {
    key: 'jill',
    image: JillImage,
  },
  {
    key: 'jackie',
    image: JackieImage,
  },
];

const BagelFamilyIntro = () => {
  const { t } = useTranslation();

  return (
    <div className="app">
      <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text my-4 py-2">{t('meetTeam')}</h1>
      <div className="character-grid">
        {characters.map((character, index) => (
          <div key={index} className="character-card bg-gray-100 dark:bg-gray-900 grid place-items-center">
            <img src={character.image} alt={t(`${character.key}.name`)} className="character-image dark:bg-gray-800" />
            <h2 className="character-name text-black dark:text-white">{t(`${character.key}.name`)}</h2>
            <p className="character-description text-gray-900 dark:text-gray-300 text-justify">
              {t(`${character.key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BagelFamilyIntro;
