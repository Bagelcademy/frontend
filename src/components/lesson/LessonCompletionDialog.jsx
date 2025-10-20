import React, { useState } from "react";
import { Dialog, DialogContent } from "../dialog/dialog";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import Confetti from "react-confetti";
import { useTranslation } from "react-i18next";

const LessonCompletionDialog = ({ open, onClose, courseId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const handleSubmitRating = () => {
    if (rating === 0) {
      Notify.failure(t("Please select a rating before submitting."));
      return;
    }

    fetch(
      `https://api.tadrisino.org/courses/CourseRating/${courseId}/set_rate/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rateDigit: rating }),
      }
    )
      .then(() => {
        Notify.success(t("Thanks for your feedback!"));
        setHasRated(true);
      })
      .catch(() => Notify.failure(t("Failed to submit rating")));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="bg-white dark:bg-gray-200 sm:max-w-md">
        <div className="flex flex-col items-center">
          <div className="text-center space-y-4">
            <h3 className="text-2xl text-black font-bold text-slate-500 dark:text-white">
              {t("Congratulations")}
            </h3>
            <p className="text-black dark:text-white">
              {t("You've completed the entire course!")}
              {t("A certificate of completion will be emailed to you shortly.")}
            </p>

            <p className="text-lg font-semibold text-black dark:text-white">
              {t("Rate this Course")}
            </p>
            <div className="flex gap-2 my-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`bg-buttonColor ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                  disabled={hasRated}
                >
                  ★
                </button>
              ))}
            </div>
            <Button
              className="bg-slate-700 text-white w-full mt-4"
              onClick={handleSubmitRating}
              disabled={hasRated || rating === 0}
            >
              {hasRated ? t("Rating Submitted") : t("Submit Rating")}
            </Button>

            <Button
              className="bg-slate-700 text-white dark:text-white w-full"
              onClick={() => navigate("/courses")}
            >
              {t("Back to Courses")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonCompletionDialog;
