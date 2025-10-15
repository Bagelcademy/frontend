import React from 'react';
import Confetti from 'react-confetti';

const ConfettiEffect = () => (
<div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: [
                    "#ff6b6b",
                    "#48dbfb",
                    "#feca57",
                    "#1dd1a1",
                    "#5f27cd",
                  ][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
          </div>
        </div>
        );

        export default ConfettiEffect;