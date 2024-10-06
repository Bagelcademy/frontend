import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '../dialog/dialog'; // Import our custom Dialog components

const sweetTreats = [
  { name: 'Donut', emoji: '🍩' },
  { name: 'Bagel', emoji: '🥯' },
  { name: 'Cookie', emoji: '🍪' },
  { name: 'Cake', emoji: '🍰' },
  { name: 'Candy', emoji: '🍬' }
];

const funnyQuips = [
  "Teaching AI to appreciate dad jokes...",
  "Debugging the AI's sweet tooth...",
  "Calculating the optimal chocolate chip distribution...",
  "Training neural networks to recognize deliciousness...",
  "Optimizing algorithms for maximum flavor...",
  "Analyzing the quantum mechanics of sprinkles...",
  "Solving the age-old 'Is a hot dog a sandwich?' debate...",
  "Teaching AI the art of the perfectly timed coffee break...",
  "Calibrating taste buds to detect traces of unicorn tears...",
  "Simulating the butterfly effect of a dropped ice cream cone..."
];

const AILoadingDialog = ({ isOpen, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [currentTreat, setCurrentTreat] = useState(sweetTreats[0]);
  const [currentQuip, setCurrentQuip] = useState(funnyQuips[0]);

  useEffect(() => {
    if (!isOpen) return;

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          onClose();
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);

    const treatInterval = setInterval(() => {
      setCurrentTreat(sweetTreats[Math.floor(Math.random() * sweetTreats.length)]);
    }, 2000);

    const quipInterval = setInterval(() => {
      setCurrentQuip(funnyQuips[Math.floor(Math.random() * funnyQuips.length)]);
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(treatInterval);
      clearInterval(quipInterval);
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white">
        <div className="flex flex-col items-center p-6">
          <div className="text-6xl mb-4 animate-bounce">{currentTreat.emoji}</div>
          
          <div className="text-2xl font-bold mb-4 text-yellow-300">AI Bakery</div>
          
          <div className="w-full bg-gray-700 h-2 rounded-full mb-4">
            <div 
              className="bg-yellow-300 h-2 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center mb-4">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-yellow-300" />
            <div className="text-sm font-semibold">{currentQuip}</div>
          </div>

          <div className="text-xs text-gray-400 text-center">
            Powered by AI and a sprinkle of magic
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AILoadingDialog;