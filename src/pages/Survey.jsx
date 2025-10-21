import React, { useState, useEffect } from "react";
import {
  Briefcase,
  GraduationCap,
  Users,
  Code,
  Palette,
  Coffee,
  User,
  Calendar,
  BookOpen,
  Award,
  Languages,
  Calculator,
  Atom,
  ChartBar,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Notiflix from "notiflix";

import StepInput from "../components/survey/StepInput";
import StepDate from "../components/survey/StepDate";
import StepOptions from "../components/survey/StepOptions";
import StepMultiOptions from "../components/survey/StepMultiOptions";
import PointsDisplay from "../components/survey/PointsDisplay";
import ProgressBar from "../components/survey/ProgressBar";
import ConfettiEffect from "../components/survey/ConfettiEffect";
import LevelUpOverlay from "../components/survey/LevelUpOverlay";


const Survey = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [answers, setAnswers] = useState({
    name: "",
    birthday: "",
    job: "",
    education: "",
    major: "",
    interests: [],
  });
  const [explodingOption, setExplodingOption] = useState(null);
  const [points, setPoints] = useState(0);
  const [levelUp, setLevelUp] = useState(false);

  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const accessToken = localStorage.getItem("accessToken");
    if (!isLoggedIn || !accessToken) navigate("/login");
  }, [navigate]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch("https://api.tadrisino.org/courses/Category/");
        if (res.ok) setCategories(await res.json());
        else throw new Error("Fetch failed");
      } catch {
        setCategories([
          { id: 1, name: "General" },
          { id: 2, name: "Programming" },
          { id: 3, name: "Language Learning" },
          { id: 4, name: "Science" },
          { id: 5, name: "Mathematics" },
          { id: 6, name: "Business" },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

 /* const categoryIconMap = {
    General: Sparkles,
    Programming: Code,
    "Language Learning": Languages,
    Science: Atom,
    Mathematics: Calculator,
    Business: ChartBar,
  };*/
  const categoryIconMap = Object.fromEntries(
    categories.map((cat) => {
      const name = cat.name.trim(); // حذف فاصله اضافی
      const icon = {

        
        Data_science: Atom,
  technology: Code,
  history: BookOpen,
  math: Calculator,
  "How to": Sparkles,
  business: ChartBar,
  social_sciences: Atom,
  arts: Palette,
  artificial_intelligence: Code,
  Languages: Languages,
  programming: Code,
  agriculture: Atom,
  philosophy: BookOpen,
  HealthCare: Atom,
  electrical: Atom,
  Physics: Atom,
  Psychology: Atom,
  Chemistry: Atom,
  Economic: ChartBar,
  General: Sparkles,
  Mathematics: Calculator,
  Business: ChartBar,

        
        
        "Language Learning": Languages,
        Science: Atom,
       
      }[name] || Sparkles;
      return [name, icon];
    })
  );
  

  const iconMap = {
    [t("Developer")]: Code,
    [t("Designer")]: Palette,
    [t("Manager")]: Users,
    [t("Student")]: GraduationCap,
    [t("Entrepreneur")]: Briefcase,
    [t("Other")]: Coffee,
    [t("Bachelor's")]: BookOpen,
    [t("Master's")]: Award,
    [t("PhD")]: GraduationCap,
    [t("Diploma")]: BookOpen,
    [t("High School")]: BookOpen,
    ...Object.fromEntries(
      categories.map((cat) => [cat.name, categoryIconMap[cat.name] || Sparkles])
    ),
  };

  useEffect(() => {
    const totalSteps = 6;
    setProgress((currentStep / totalSteps) * 100);
  }, [currentStep]);

  const awardPoints = (amount = 10) => {
    setPoints((prev) => prev + amount);
    if ((points + amount) % 50 === 0) {
      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 2000);
    }
  };

  const steps = [
    { type: "input", title: t("What's your name?"), field: "name", placeholder: t("Enter your name"), icon: User },
    { type: "date", title: t("When's your birthday?"), field: "birthday", placeholder: t("YYYY-MM-DD"), icon: Calendar },
    { type: "options", title: t("What's your job?"), field: "job", options: [t("Developer"), t("Designer"), t("Manager"), t("Student"), t("Entrepreneur"), t("Other")] },
    { type: "options", title: t("What is your education level?"), field: "education", options: [t("Bachelor's"), t("Master's"), t("PhD"), t("Diploma"), t("High School")] },
    { type: "input", title: t("What's your major or field of study?"), field: "major", placeholder: t("e.g. Computer Science, Art, Business"), icon: BookOpen },
    { type: "multiOptions", title: t("What are you interested in learning? (Select up to 3)"), field: "interests", options: categories.map((c) => ({ id: c.id, name: c.name })), isCategory: true },
  ];

  const handleTextInput = (field, value) => setAnswers((prev) => ({ ...prev, [field]: value }));

  /*const handleSelect = (field, answer) => {
    setExplodingOption(answer);
    setAnswers((prev) => ({ ...prev, [field]: answer }));
    awardPoints();
    setTimeout(() => { setExplodingOption(null); moveToNextStep(); }, 500);
  };*/

  const handleSelect = (field, answer) => {
    setExplodingOption(answer);
    setAnswers(prev => ({ ...prev, [field]: answer })); // field دقیقاً "education" یا "job" باشد
    awardPoints();
    setTimeout(() => {
      setExplodingOption(null);
      moveToNextStep();
    }, 500);
  };
  

  const handleMultiSelect = (field, answer) => {
    setAnswers((prev) => {
      const current = prev[field] || [];
      const exists = current.find((i) => i.id === answer.id);
      const newSelections = exists ? current.filter((i) => i.id !== answer.id) : [...current, answer].slice(0, 3);
      return { ...prev, [field]: newSelections };
    });
    awardPoints(5);
  };

  const moveToNextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((p) => p + 1);
    else { setShowConfetti(true); setTimeout(submitSurvey, 2000); }
  };

  const canProceed = () => {
    const step = steps[currentStep];
    const field = step.field;
    if (["input", "date"].includes(step.type)) return answers[field]?.trim() !== "";
    if (step.type === "multiOptions") return (answers[field] || []).length === 3;

    return true;
  };


  const handleSurveyComplete = () => {
    setShowConfetti(true);
    setTimeout(() => {
      submitSurvey();
    }, 2000);
  };
  
  const submitSurvey = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) { Notiflix.Notify.failure(t("authenticationError")); navigate("/login"); return; }
      const interestIds = answers.interests.map((i) => i.id);
      const res = await fetch("https://api.tadrisino.org/account/user-info/survey/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, interests: interestIds }),
      });
      if (res.ok) {
        const userData = await res.json();
        if (userData.data) {
          const safeSet = (k, v) => v != null && localStorage.setItem(k, v);
          safeSet("userRole", userData.data.role);
          safeSet("streak", userData.data.streak);
          safeSet("userName", userData.data.name);
          safeSet("accessToken", userData.data.access);
          safeSet("refreshToken", userData.data.refresh);
        }
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("completedSurvey", "true");
        Notiflix.Notify.success(t("surveyCompleted"));
        navigate("/login");
      } else {
        const errorData = await res.json();
        Notiflix.Notify.failure(errorData.error || t("surveySubmissionFailed"));
      }
    } catch { Notiflix.Notify.failure(t("networkError")); }
  };

  const renderCurrentStep = () => {
    const step = steps[currentStep];
    switch (step.type) {
      case "input":
        return <StepInput title={step.title} icon={step.icon} value={answers[step.field]} placeholder={step.placeholder} onChange={(v) => handleTextInput(step.field, v)} canProceed={canProceed()} onNext={moveToNextStep} t={t} />;
      case "date":
        return <StepDate title={step.title} value={answers[step.field]} onChange={(v) => handleTextInput(step.field, v)} canProceed={canProceed()} onNext={moveToNextStep} t={t} />;
      /*case "options":
        return <StepOptions currentStepData={step} explodingOption={explodingOption} iconMap={iconMap} handleSelect={handleSelect} />;*/

        case "options":
  return (
    <StepOptions
      currentStepData={step}
      explodingOption={explodingOption}
      iconMap={iconMap}
      handleSelect={handleSelect}
      value={answers[step.field]} // ✅ اضافه کنید
      canProceed={canProceed} // ✅ اگر StepOptions ازش استفاده می‌کنه
    />
  );

      case "multiOptions":
        return <StepMultiOptions options={step.options} selectedOptions={answers[step.field] || []} onSelectMulti={(opt) => handleMultiSelect(step.field, opt)} maxSelectionsReached={(answers[step.field] || []).length >= 3} t={t} canProceed={canProceed} onNext={handleSurveyComplete} categoryIconMap={categoryIconMap} loadingCategories={loadingCategories} currentStepData={step} />;
      default:
        return null;
    }
  };
 
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col items-center justify-center p-4">
      <PointsDisplay points={points} />
      <ProgressBar progress={progress} t={t} />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full relative overflow-hidden">
        {levelUp && <LevelUpOverlay t={t} />}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6 text-center">{steps[currentStep].title}</h2>
        {renderCurrentStep()}
      </div>
      {showConfetti && <ConfettiEffect />}
    </div>
  );
};

export default Survey;

