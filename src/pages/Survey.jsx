/*import React, { useState, useEffect } from "react";
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
  Brain,
  Languages,
  Music,
  Database,
  ChartBar,
  HeartPulse,
  PenTool,
  Camera,
  Laptop,
  Sparkles,
  Trophy,
  Star,
  Calculator,
  Atom,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Notiflix from "notiflix";
import StepInput from "../components/survey/StepInput";
import StepDate from "../components/survey/StepDate";
import StepOptions from "../components/survey/StepOptions";
import StepMultiOptions from "../components/survey/StepMultiOptions";
import PointsDisplay from "../components/survey/PointsDisplay"; // اگر جدا کردی
import ProgressBar from "../components/survey/ProgressBar";
import ConfettiEffect from "../components/survey/ConfettiEffect";
import LevelUpOverlay from "../components/survey/LevelUpOverlay";
const Survey = () => {
  const { t } = useTranslation();
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
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const accessToken = localStorage.getItem("accessToken");

      if (!isLoggedIn || !accessToken) {
        // If not logged in, redirect to login page
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch(
          "https://api.tadrisino.org/courses/Category/"
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
          // Fallback to default categories if API fails
          setCategories([
            { id: 1, name: "General" },
            { id: 2, name: "Programming" },
            { id: 3, name: "Language Learning" },
            { id: 4, name: "Science" },
            { id: 5, name: "Mathematics" },
            { id: 6, name: "Business" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to default categories if API fails
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

  const categoryIconMap = {
    General: Sparkles,
    Programming: Code,
    "Language Learning": Languages,
    Science: Atom,
    Mathematics: Calculator,
    Business: ChartBar,
  };

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
      categories.map((category) => [
        category.name,
        categoryIconMap[category.name] || Sparkles,
      ])
    ),
  };

  useEffect(() => {
    const totalSteps = 6;
    const newProgress = (currentStep / totalSteps) * 100;
    setProgress(newProgress);
  }, [currentStep]);

  const awardPoints = (amount = 10) => {
    setPoints((prev) => prev + amount);
    if ((points + amount) % 50 === 0) {
      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 2000);
    }
  };

  const steps = [
    {
      type: "input",
      title: t("What's your name?"),
      field: "name",
      placeholder: t("Enter your name"),
      icon: "User",
    },

    {
      type: "date",
      title: t("When's your birthday?"),
      field: "birthday",
      placeholder: t("YYYY-MM-DD"),
      icon: Calendar,
    },

    {
      type: "options",
      title: t("What's your job?"),
      field: "job",
      options: [
        t("Developer"),
        t("Designer"),
        t("Manager"),
        t("Student"),
        t("Entrepreneur"),
        t("Other"),
      ],
    },

    {
      type: "options",
      title: t("What is your education level?"),
      field: "education",
      options: [
        t("Bachelor's"),
        t("Master's"),
        t("PhD"),
        t("Diploma"),
        t("High School"),
      ],
    },

    {
      type: "input",
      title: t("What's your major or field of study?"),
      field: "major",
      placeholder: t("e.g. Computer Science, Art, Business"),
      icon: BookOpen,
    },

    {
      type: "multiOptions",
      title: t("What are you interested in learning? (Select up to 3)"),
      field: "interests",
      options: categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
      isCategory: true,
    },
  ];

  const handleTextInput = (field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelect = (field, answer) => {
    setExplodingOption(answer);
    setAnswers((prev) => ({
      ...prev,
      [field]: answer,
    }));
    awardPoints();

    setTimeout(() => {
      setExplodingOption(null);
      moveToNextStep();
    }, 500);
  };

  const handleMultiSelect = (field, answer) => {
    setAnswers((prev) => {
      // Toggle selection
      const currentSelections = prev[field] || [];
      const newSelections = currentSelections.find(
        (item) => item.id === answer.id
      )
        ? currentSelections.filter((item) => item.id !== answer.id)
        : [...currentSelections, answer].slice(0, 3); // Limit to 3 selections

      return {
        ...prev,
        [field]: newSelections,
      };
    });
    awardPoints(5);
  };

  const moveToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowConfetti(true);
      setTimeout(() => {
        submitSurvey();
      }, 2000);
    }
  };

  const canProceed = () => {
    const currentStepData = steps[currentStep];
    const field = currentStepData.field;

    if (currentStepData.type === "input" || currentStepData.type === "date") {
      return answers[field] && answers[field].trim() !== "";
    }

    if (currentStepData.type === "multiOptions") {
      return answers[field] && answers[field].length > 0;
    }

    return true;
  };

  const submitSurvey = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No access token found");
        Notiflix.Notify.failure(t("authenticationError"));
        navigate("/login");
        return;
      }

      const interestIds = answers.interests.map((interest) => interest.id);

      const response = await fetch(
        "https://api.tadrisino.org/account/user-info/survey/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: answers.name,
            birthday: answers.birthday,
            job: answers.job,
            education: answers.education,
            major: answers.major,
            interests: interestIds,
          }),
        }
      );

      if (response.ok) {
        const userData = await response.json();

        const safeSet = (key, value) => {
          if (typeof value !== "undefined" && value !== null) {
            localStorage.setItem(key, value);
          }
        };

        if (userData.data) {
          safeSet("userRole", userData.data.role);
          safeSet("streak", userData.data.streak);
          safeSet("userName", userData.data.name);
          safeSet("accessToken", userData.data.access);
          safeSet("refreshToken", userData.data.refresh);
        }
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("completedSurvey", "true");

        Notiflix.Notify.success(t("surveyCompleted"));
        // Redirect to profile page instead of home
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Failed to submit survey:", errorData);
        Notiflix.Notify.failure(errorData.error || t("surveySubmissionFailed"));
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      Notiflix.Notify.failure(t("networkError"));
    }
  };

  const renderCurrentStep = () => {
    const currentStepData = steps[currentStep];

    switch (currentStepData.type) {
      case "input":
        return (
          <StepInput
            title={currentStepData.title}
            /*  icon={iconMap[currentStepData.icon] || User}*//* icon={
              currentStepData.icon
            }
            value={answers[currentStepData.field]}
            placeholder={currentStepData.placeholder}
            onChange={(val) => handleTextInput(currentStepData.field, val)}
            canProceed={canProceed()}
            onNext={moveToNextStep}
            t={t}
          />
        );
      case "date":
        return (
          <StepDate
            title={currentStepData.title}
            value={answers[currentStepData.field]}
            onChange={(val) => handleTextInput(currentStepData.field, val)}
            canProceed={canProceed()}
            onNext={moveToNextStep}
            t={t}
          />
        );
      case "options":
        return (
          <StepOptions
            currentStepData={currentStepData}
            explodingOption={explodingOption}
            iconMap={iconMap}
            handleSelect={handleSelect}
          />
        );
      case "multiOptions":
        return (
          <StepMultiOptions
            options={currentStepData.options}
            selectedOptions={answers[currentStepData.field] || []}
            onSelectMulti={(option) =>
              handleMultiSelect(currentStepData.field, option)
            }
            maxSelectionsReached={
              (answers[currentStepData.field] || []).length >= 3
            }
            t={t}
            canProceed={canProceed()}
            onNext={moveToNextStep}
            categoryIconMap={categoryIconMap}
            loadingCategories={loadingCategories}
            currentStepData={currentStepData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col items-center justify-center p-4">
      {/* Points display *//*}

      <PointsDisplay points={points} />
      <ProgressBar progress={progress} t={t} />

      {/* Progress bar *//*}

      {/* Main content *//*}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full relative overflow-hidden">
        {levelUp && <LevelUpOverlay t={t} />}

        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
          {steps[currentStep].title}
        </h2>

        {renderCurrentStep()}
      </div>

      {/* Confetti effect for completion *//*}

      {showConfetti && <ConfettiEffect />}
    </div>
  );
};

const styles = `
@keyframes explosion {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in-out;
}

.confetti-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  animation: fall 3s linear forwards;
}

@keyframes fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Survey;*/

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

  const categoryIconMap = {
    General: Sparkles,
    Programming: Code,
    "Language Learning": Languages,
    Science: Atom,
    Mathematics: Calculator,
    Business: ChartBar,
  };

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

  const handleSelect = (field, answer) => {
    setExplodingOption(answer);
    setAnswers((prev) => ({ ...prev, [field]: answer }));
    awardPoints();
    setTimeout(() => { setExplodingOption(null); moveToNextStep(); }, 500);
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
    if (step.type === "multiOptions") return (answers[field] || []).length > 0;
    return true;
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
      case "options":
        return <StepOptions currentStepData={step} explodingOption={explodingOption} iconMap={iconMap} handleSelect={handleSelect} />;
      case "multiOptions":
        return <StepMultiOptions options={step.options} selectedOptions={answers[step.field] || []} onSelectMulti={(opt) => handleMultiSelect(step.field, opt)} maxSelectionsReached={(answers[step.field] || []).length >= 3} t={t} canProceed={canProceed()} onNext={moveToNextStep} categoryIconMap={categoryIconMap} loadingCategories={loadingCategories} currentStepData={step} />;
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

