import React, { useState } from 'react';
import { Briefcase, GraduationCap, Users, Code, Palette, Coffee, Baby, User, UserPlus, Zap, Search, MessageCircle, Share2, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const iconMap = {
  Developer: Code,
  Designer: Palette,
  Manager: Users,
  Student: GraduationCap,
  Entrepreneur: Briefcase,
  Other: Coffee,
  "18-24": Baby,
  "25-34": User,
  "35-44": UserPlus,
  "45-54": Zap,
  "55-64": Radio,
  "65+": Coffee,
  "Search Engine": Search,
  "Social Media": Share2,
  "Friend": MessageCircle,
  "Advertisement": Radio,
  "Blog": Coffee,
};

const ExplosiveOption = ({ option, onSelect, isExploding }) => {
  const Icon = iconMap[option] || Coffee;
  
  return (
    <button
      onClick={() => onSelect(option)}
      className={`p-4 rounded-lg shadow-md transition-all duration-300 bg-spaceArea hover:bg-borderColor hover:text-white
        ${isExploding ? 'animate-[explosion_0.5s_ease-out]' : ''}`}
    >
      <div className="w-16 h-16 mx-auto mb-2 bg-lightBackground rounded-full flex items-center justify-center">
        <Icon size={32} className="text-buttonColor" />
      </div>
      <p className="text-sm font-medium">{option}</p>
    </button>
  );
};

const Survey = () => {
  const { t } = useTranslation(); // Initialize the translation hook
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [explodingOption, setExplodingOption] = useState(null);
  const navigate = useNavigate();

  const questions = [
    {
      question: t("What's your job?"), // Translate this string
      options: [t("Developer"), t("Designer"), t("Manager"), t("Student"), t("Entrepreneur"), t("Other")] // Translate options
    },
    {
      question: t("What's your age?"), // Translate this string
      options: [t("18-24"), t("25-34"), t("35-44"), t("45-54"), t("55-64"), t("65+")] // Translate options
    },
    {
      question: t("How did you find Bagel Academy?"), // Translate this string
      options: [t("Search Engine"), t("Social Media"), t("Friend"), t("Advertisement"), t("Blog"), t("Other")] // Translate options
    }
  ];

  const handleSelect = (answer) => {
    setExplodingOption(answer);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));

    setTimeout(() => {
      setExplodingOption(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        submitSurvey();
      }
    }, 500); // Wait for explosion animation to finish
  };
  
  const submitSurvey = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://bagelapi.artina.org/account/user-info/Survey/', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job: answers[0],     
          range: answers[1],    
          introduction: answers[2], 
        }),
      });
      
      if (response.ok) {
        console.log('Survey submitted successfully');
        navigate('/');

      } else {
        console.error('Failed to submit survey');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-lightBackground dark:bg-darkBackground flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-buttonColor mb-6">{questions[currentQuestion].question}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {questions[currentQuestion].options.map((option) => (
            <ExplosiveOption
              key={option}
              option={option}
              onSelect={handleSelect}
              isExploding={explodingOption === option}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Survey;
