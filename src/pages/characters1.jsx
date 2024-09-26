import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Brain, Zap, Shield, ChevronDown, RotateCcw } from 'lucide-react';

const characters = [
  { id: 1, name: "Neo-Zephyr", image: "/api/placeholder/300/300", backstory: "An AI-enhanced wind manipulator...", element: "air", stats: { intelligence: 90, power: 60, defense: 40 } },
  { id: 2, name: "Cyber-Igneous", image: "/api/placeholder/300/300", backstory: "A nanotech-infused rock entity...", element: "earth", stats: { intelligence: 70, power: 80, defense: 95 } },
  { id: 3, name: "Quantum-Aquarius", image: "/api/placeholder/300/300", backstory: "A hyper-intelligent water-based lifeform...", element: "water", stats: { intelligence: 95, power: 50, defense: 75 } },
  { id: 4, name: "Pyra-X", image: "/api/placeholder/300/300", backstory: "A plasma-powered AI with unmatched processing power...", element: "fire", stats: { intelligence: 100, power: 85, defense: 35 } },
];

const elementColors = {
  air: ["#00FFFF", "#4169E1"],
  earth: ["#32CD32", "#006400"],
  water: ["#1E90FF", "#0000CD"],
  fire: ["#FF4500", "#8B0000"]
};

const CharacterCard = ({ character, isSelected, onClick }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start(isSelected ? 'selected' : 'notSelected');
  }, [isSelected, controls]);

  return (
    <motion.div
      className="relative cursor-pointer perspective-1000 w-64 h-96"
      onClick={() => onClick(character)}
      initial="notSelected"
      animate={controls}
      variants={{
        notSelected: { 
          rotateY: 0,
          z: 0,
          transition: { type: 'spring', stiffness: 300, damping: 20 }
        },
        selected: { 
          rotateY: 180,
          z: 50,
          transition: { type: 'spring', stiffness: 400, damping: 17 }
        }
      }}
    >
      <motion.div className="w-full h-full absolute backface-hidden rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(45deg, ${elementColors[character.element][0]}, ${elementColors[character.element][1]})`,
          boxShadow: `0 0 20px ${elementColors[character.element][0]}`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <img src={character.image} alt={character.name} className="w-full h-full object-cover mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-2xl font-bold mb-1">{character.name}</h3>
          <p className="text-sm opacity-75">{character.element.toUpperCase()} ELEMENT</p>
        </div>
        <motion.div 
          className="absolute top-2 right-2 w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-80" />
        </motion.div>
      </motion.div>
      <motion.div 
        className="w-full h-full absolute backface-hidden bg-gray-900 rounded-2xl p-6 text-white flex flex-col justify-between"
        style={{ rotateY: 180, boxShadow: `0 0 20px ${elementColors[character.element][0]}` }}
      >
        <div>
          <h3 className="text-2xl font-bold mb-2">{character.name}</h3>
          <p className="text-sm mb-4">{character.backstory}</p>
        </div>
        <div className="space-y-4">
          {Object.entries(character.stats).map(([stat, value]) => (
            <div key={stat} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="capitalize flex items-center">
                  {stat === 'intelligence' && <Brain size={16} className="mr-1" />}
                  {stat === 'power' && <Zap size={16} className="mr-1" />}
                  {stat === 'defense' && <Shield size={16} className="mr-1" />}
                  {stat}
                </span>
                <span>{value}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${elementColors[character.element][0]}, ${elementColors[character.element][1]})`,
                    width: `${value}%`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const AIAnalysis = ({ character }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-6 rounded-t-3xl"
      style={{ 
        boxShadow: `0 -5px 20px ${elementColors[character.element][0]}`,
        maxHeight: isExpanded ? '80%' : '30%',
        transition: 'max-height 0.3s ease-in-out'
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">AI Analysis: {character.name}</h2>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown size={24} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </motion.button>
      </div>
      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: isExpanded ? 'calc(100% - 4rem)' : '100px' }}>
        <p>Character Strengths: {character.element} manipulation, {Object.entries(character.stats).sort((a, b) => b[1] - a[1])[0][0]} proficiency</p>
        <p>Recommended Tactics: Utilize {character.element} abilities to {character.stats.intelligence > 75 ? 'outmaneuver' : 'overpower'} opponents</p>
        <p>Synergy Potential: High compatibility with {['air', 'earth', 'water', 'fire'].filter(e => e !== character.element)[0]} element characters</p>
        <p>Performance Forecast: {Math.round((character.stats.intelligence + character.stats.power + character.stats.defense) / 3)}% success rate in upcoming missions</p>
      </div>
    </motion.div>
  );
};

const CharacterIntroPage = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8 overflow-hidden relative">
      <div className="absolute inset-0" style={{
        background: `radial-gradient(circle at ${50 + Math.cos(rotation * Math.PI / 180) * 20}% ${50 + Math.sin(rotation * Math.PI / 180) * 20}%, rgba(0, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 60%)`,
        mixBlendMode: 'screen',
      }} />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12 relative"
      >
        <h1 className="text-6xl font-bold text-white mb-2">Neuro-Link: Hero Selector</h1>
        <p className="text-xl text-cyan-300">Interface with our AI to analyze and select your optimal character</p>
      </motion.div>
      <motion.div 
        className="flex justify-center items-center gap-8 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, staggerChildren: 0.1 }}
      >
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedCharacter?.id === character.id}
            onClick={setSelectedCharacter}
          />
        ))}
      </motion.div>
      <AnimatePresence>
        {selectedCharacter && (
          <AIAnalysis character={selectedCharacter} />
        )}
      </AnimatePresence>
      <motion.button 
        className="fixed bottom-4 right-4 bg-cyan-500 text-white rounded-full p-3 cursor-pointer"
        whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
        whileTap={{ scale: 0.9 }}
      >
        <RotateCcw size={24} />
      </motion.button>
    </div>
  );
};

export default CharacterIntroPage;