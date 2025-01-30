import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Users,
  Code,
  Palette,
  Coffee,
  Baby,
  User,
  UserPlus,
  Zap,
  Search,
  MessageCircle,
  Share2,
  Radio,
  Book,
  Award,
  School,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Survey = () => {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [explodingOption, setExplodingOption] = useState(null);
  const navigate = useNavigate();

  const iconMap = {
    [t("Developer")]: Code,
    [t("Designer")]: Palette,
    [t("Manager")]: Users,
    [t("Student")]: GraduationCap,
    [t("Entrepreneur")]: Briefcase,
    [t("Other")]: Coffee,
    [t("18-24")]: Baby,
    [t("25-34")]: User,
    [t("35-44")]: UserPlus,
    [t("45-54")]: Zap,
    [t("55-64")]: Radio,
    [t("65+")]: Coffee,
    [t("Search Engine")]: Search,
    [t("Social Media")]: Share2,
    [t("Friend")]: MessageCircle,
    [t("Advertisement")]: Radio,
    [t("Blog")]: Coffee,
    [t("Bachelor's")]: Book,
    [t("Master's")]: Award,
    [t("PhD")]: School,
    [t("Diploma")]: BookOpen,
    [t("Under High School")]: GraduationCap,
  };

  const questions = [
    {
      question: t("What's your job?"),
      options: [t("Developer"), t("Designer"), t("Manager"), t("Student"), t("Entrepreneur"), t("Other")]
    },
    {
      question: t("What's your age?"),
      options: [t("18-24"), t("25-34"), t("35-44"), t("45-54"), t("55-64"), t("65+")]
    },
    {
      question: t("How did you find Bagel Academy?"),
      options: [t("Search Engine"), t("Social Media"), t("Friend"), t("Advertisement"), t("Blog"), t("Other")]
    },
    {
      question: t("What is your education level?"),
      options: [t("Bachelor's"), t("Master's"), t("PhD"), t("Diploma"), t("Under High School")]
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
    }, 500);
  };

  const submitSurvey = async () => {
    if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://bagelapi.bagelcademy.org/account/user-info/Survey/', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job: answers[0],
          range: answers[1],
          introduction: answers[2],
          education: answers[3],
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
  }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center p-4">
      <div className="bg-white dark:bg-darkBackground rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
          {questions[currentQuestion].question}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {questions[currentQuestion].options.map((option) => (
            <ExplosiveOption
              key={option}
              option={option}
              onSelect={handleSelect}
              isExploding={explodingOption === option}
              iconMap={iconMap}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ExplosiveOption = ({ option, onSelect, isExploding, iconMap }) => {
  const Icon = iconMap[option] || Coffee;

  return (
    <button
      onClick={() => onSelect(option)}
      className={`p-4 rounded-lg shadow-md transition-all duration-300 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white
        ${isExploding ? 'animate-[explosion_0.5s_ease-out]' : ''}`}
    >
      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <Icon size={32} className="text-white" />
      </div>
      <p className="text-sm font-medium">{option}</p>
    </button>
  );
};

export default Survey;