import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import img6 from '../assets/6.png';
import img7 from '../assets/7.png';

const characters = [
  { id: 1, name: "mama bagel", image: img4, backstory: "A mama who wants you to finish your courses and get a good job and live a nice life" },
  { id: 2, name: "papa bagel", image: img5, backstory: "A dad that wants you to have knowledge and learn about anything you want" },
  { id: 3, name: "emily bagel", image: img6, backstory: "OH she just cares about herself and her friends! But now YOU are one of her friends. So get ready for prom!" },
  { id: 4, name: "jackie bagel", image: img7, backstory: "Wants to get a break and play Call of Duty together?" },
];


const CharacterCard = ({ character, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardSpring = useSpring({
    scale: isHovered ? 1.05 : 1,
    boxShadow: isHovered ? '0px 10px 30px rgba(0, 0, 0, 0.2)' : '0px 5px 15px rgba(0, 0, 0, 0.1)',
  });

  return (
    <animated.div
      style={cardSpring}
      className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(character)}
    >
      <img src={character.image} alt={character.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{character.name}</h3>
        <p className="text-gray-700 text-sm">{character.backstory.substring(0, 50)}...</p>
      </div>
    </animated.div>
  );
};

const CharacterModal = ({ character, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white p-8 rounded-lg max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-4">{character.name}</h2>
        <img src={character.image} alt={character.name} className="w-full h-64 object-cover rounded-lg mb-4" />
        <p className="text-gray-700">{character.backstory}</p>
        <button
          className="mt-4 bg-buttonColor text-white px-4 py-2 rounded hover:bg-gray-500"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

const CharacterIntroPage = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-8">
      <h1 className="text-4xl font-bold text-white text-center mb-8">Meet Our Characters</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onClick={setSelectedCharacter}
          />
        ))}
      </div>
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </div>
  );
};

export default CharacterIntroPage;