import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../assets/icon.png";
import { useTranslation } from "react-i18next";

const IntroScreen = () => {
  const fullText = "Tadrisino";
  const [displayedText, setDisplayedText] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;

    // typing effect
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
      }
    }, 100); // typing speed

    // hide intro after 2 seconds and navigate to homepage
    const timeout = setTimeout(() => {
      setShowIntro(false);
      navigate("/home");
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!showIntro) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col items-center gap-4 animate-[fadeInUp_0.6s_ease-out]">
        {/* IMAGE IN THE MIDDLE */}
        <img
          src= {icon} // change this to your image path
          alt="Tadrisino logo"
          className="w-32 h-32 object-contain rounded-2xl"
        />

        {/* TYPED TEXT BELOW */}
        <div className="flex items-center mr-2 text-3xl font-bold tracking-[0.2m]">
          <span>{displayedText}</span>
          <span className="ml-1 inline-block animate-[blink_0.8s_step-start_infinite]">
            |
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="text-center text-gray-400 text-sm pt-2 w-full max-w-screen-sm px-4">
          <p>&copy; 2025 Tadrisino. {t('All rights reserved.')}</p>
        </div>
      </div>

      {/* Tailwind-compatible inline keyframes via style tag */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default IntroScreen;
