
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

const CTASection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {t("Ready to start learning?")}
        </h2>
        <p className="text-white/80 mb-8 text-lg">
          {t("Sign up now and get access to all our courses!")}
        </p>
        <Button
          onClick={() => navigate("/signup")}
          className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-4 dark:bg-gray-800"
        >
          {t("Sign Up Now")}
        </Button>
      </div>
    </div>
  );
};

export default CTASection;
