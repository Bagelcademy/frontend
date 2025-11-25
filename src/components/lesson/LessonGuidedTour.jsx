import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import "./LessonGuidedTour.css";

const SCREEN_THRESHOLD = 600; // px
const SIDE_MARGIN = 8; // px from screen edges on mobile

const LessonGuidedTour = () => {
  const { t , i18n } = useTranslation();
  // determine document direction from i18n if available, fallback to common RTL languages
  const dir = (typeof i18n.dir === 'function')
    ? i18n.dir()
    : (['fa'].includes(i18n.language) ? 'rtl' : 'ltr');

  // Define the steps for the tour
  const steps = useMemo(
    () => [
      {
        id: "content-tab",
        text: t("LessonTabsTour.Content"),
        attachTo: { element: ".tour-content-tab", on: "bottom" },
        buttons: [{ text: t("Next"), action: function () { this.next(); } }]
      },
      {
        id: "quiz-tab",
        text: t("LessonTabsTour.Quiz"),
        attachTo: { element: ".tour-quiz-tab", on: "bottom" },
        buttons: [
          { text: t("Back"), action: function () { this.back(); } },
          { text: t("Next"), action: function () { this.next(); } }
        ]
      },
      {
        id: "notes-tab",
        text: t("LessonTabsTour.Notes"),
        attachTo: { element: ".tour-notes-tab", on: "bottom" },
        buttons: [
          { text: t("Back"), action: function () { this.back(); } },
          { text: t("Next"), action: function () { this.next(); } }
        ]
      },
      {
        id: "code-tab",
        text: t("LessonTabsTour.CodeLab"),
        attachTo: { element: ".tour-code-tab", on: "bottom" },
        buttons: [
          { text: t("Back"), action: function () { this.back(); } },
          { text: t("Next"), action: function () { this.next(); } }
        ]
      },
      {
        id: "ai-tab",
        text: t("LessonTabsTour.AI_Assistant"),
        attachTo: { element: ".tour-ai-tab", on: "bottom" },
        buttons: [
          { text: t("Back"), action: function () { this.back(); } },
          { text: t("Finish"), action: function () { this.complete(); } }
        ]
      }
    ],
    [t]
  );

  useEffect(() => {
    // Only show the tour once per user. Use localStorage as a persistent flag.
    // Support a URL override `?showTour=1` to force showing the tour (useful for QA).
    const SEEN_KEY = 'lessonGuidedTourSeen_v1';
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const forceShow = urlParams ? urlParams.get('showTour') === '1' : false;
    const alreadySeen = !forceShow && typeof window !== 'undefined' && localStorage.getItem(SEEN_KEY) === 'true';

    // Initialize Shepherd tour only when not seen before
    let tour = null;
    if (!alreadySeen) {
      tour = new Shepherd.Tour({
        defaultStepOptions: {
          // add a custom class so our CSS selectors match and include rtl/ltr
          classes: `shepherd-theme-arrows custom-shepherd-tooltip ${dir}`,
          scrollTo: { behavior: "smooth", block: "center" },
          showCancelLink: true,
        },
        useModalOverlay: true,
      });
    }

    // Add steps and inject a Skip button into each step so users can cancel anytime
    if (tour) {
      steps.forEach((step) => {
        const skipLabel = t("Skip") || "Skip";
        const skipButton = {
          text: skipLabel,
          action: function () {
            // mark as seen when user explicitly skips, then cancel the tour
            try { localStorage.setItem(SEEN_KEY, 'true'); } catch (e) {}
            if (tour) tour.cancel();
          },
          classes: "shepherd-button-secondary shepherd-shepherd-skip-button shepherd-skip-button",
        };

        const buttons = [skipButton, ...(step.buttons || [])];

        let stepToAdd = { ...step, buttons };
        if (step.attachTo && step.attachTo.element) {
          try {
            const el = document.querySelector(step.attachTo.element);
            if (!el) {
              // remove attachTo to make it modal/fallback
              const { attachTo, ...rest } = stepToAdd;
              stepToAdd = { ...rest, buttons };
            }
          } catch (e) {
            // on any error, fallback to modal step
            const { attachTo, ...rest } = stepToAdd;
            stepToAdd = { ...rest, buttons };
          }
        }

        tour.addStep(stepToAdd);
      });

      // mark seen on complete so the tour won't show again
      tour.on('complete', () => localStorage.setItem(SEEN_KEY, 'true'));
    }

    // Wait for first target element before starting tour (only if tour exists)
    const MAX_ATTEMPTS = 50;
    let attempts = 0;
    const interval = setInterval(() => {
      if (!tour) {
        clearInterval(interval);
        return;
      }
      attempts += 1;
      const hasTarget = !!document.querySelector(".tour-content-tab");
      if (hasTarget || attempts >= MAX_ATTEMPTS) {
        try {
          tour.start();
          console.debug('LessonGuidedTour: started tour', { hasTarget, attempts });
        } catch (err) {
          console.warn('LessonGuidedTour: tour.start() failed, attempting to show first step as fallback', err);
          try {
            const first = tour.steps && tour.steps[0];
            if (first && typeof first.show === 'function') {
              first.show();
            }
          } catch (e) {
            console.error('LessonGuidedTour: fallback show also failed', e);
          }
        }
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (tour) tour.cancel();
    };
  }, [steps, i18n.language]);

  return null; // Shepherd renders its own tooltips
};

export default LessonGuidedTour;
