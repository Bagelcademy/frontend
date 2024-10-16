import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import img6 from '../assets/6.png';
import img7 from '../assets/7.png';

const characters = [
  { id: 1, nameKey: "mama_bagel", image: img4, backstoryKey: "mama_bagel_backstory" },
  { id: 2, nameKey: "papa_bagel", image: img5, backstoryKey: "papa_bagel_backstory" },
  { id: 3, nameKey: "emily_bagel", image: img6, backstoryKey: "emily_bagel_backstory" },
  { id: 4, nameKey: "jackie_bagel", image: img7, backstoryKey: "jackie_bagel_backstory" },
];

const CharacterCard = ({ character, onClick }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(character)}
    >
      <img src={character.image} alt={t(character.nameKey)} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t(character.nameKey)}</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">{t(character.backstoryKey).substring(0, 50)}...</p>
      </div>
    </motion.div>
  );
};

const CharacterModal = ({ character, onClose }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t(character.nameKey)}</h2>
        <img src={character.image} alt={t(character.nameKey)} className="w-full h-64 object-cover rounded-lg mb-4" />
        <p className="text-gray-700 dark:text-gray-300">{t(character.backstoryKey)}</p>
        <button
          className="mt-4 bg-buttonColor text-white px-4 py-2 rounded hover:bg-opacity-80"
          onClick={onClose}
        >
          {t('close')}
        </button>
      </motion.div>
    </motion.div>
  );
};

const CharacterIntroPage = () => {
  const { t } = useTranslation();
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  return (
    <div className="min-h-screen bg-lightBackground dark:bg-darkBackground py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-8">{t('meet our characters')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={setSelectedCharacter}
            />
          ))}
        </div>
        <AnimatePresence>
          {selectedCharacter && (
            <CharacterModal
              character={selectedCharacter}
              onClose={() => setSelectedCharacter(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CharacterIntroPage;