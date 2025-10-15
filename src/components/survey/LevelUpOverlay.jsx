import React from 'react';
import Confetti from 'react-confetti';

import { Trophy } from "lucide-react";

const LevelUpOverlay = ({ t }) => (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10 animate-fade-in">
    <div className="text-center">
      <Trophy
        size={64}
        className="text-yellow-400 mx-auto mb-4 animate-bounce"
      />
      <h3 className="text-3xl font-bold text-white mb-2">
        {t("Level Up!")}
      </h3>
      <p className="text-yellow-300">{t("Keep going!")}</p>
    </div>
  </div>
);

export default LevelUpOverlay;
