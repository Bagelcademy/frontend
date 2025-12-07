import React from "react";
import { useTranslation } from 'react-i18next';
import {
  Download,
  Smartphone,
  ShieldCheck,
  Store,
  Info,
} from "lucide-react";
import AppImgLight from "../assets/AppLight.png";
import AppImgDark from "../assets/AppDark.png";


export default function DownloadAppContent() {
  const { t } = useTranslation();
  const APK_URL = "#";
  const PLAY_STORE_URL = import.meta.env.VITE_PLAY_STORE_URL || null;

  return (
    <div className="max-w-3xl mx-auto px-8 py-8 bg-white dark:bg-slate-950 transition-colors">
      {/* Title */}
      <section className="space-y-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-indigo-600 dark:text-indigo-500" />
          {t('Tadrisino Android app')}
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          {t('Install the Tadrisino Android app directly on your device.')}
        </p>
      </section>

      {/* ONE ROW LAYOUT */}
      <section className="grid md:grid-cols-[30%_70%] gap-6 items-start">
        {/* IMAGE with light/dark alternatives */}
        <div className="flex justify-center">
          <picture>
            <img
              src={AppImgLight}
              className="w-40 md:w-60 object-contain rounded-2xl dark:hidden"
            />
            <img
              src={AppImgDark}
              className="w-40 md:w-60 object-contain rounded-2xl hidden dark:block"
            />
          </picture>
        </div>

        {/* RIGHT COLUMN: How to install + Checklist */}
        <div className="space-y-6 mx-6">
          {/* Buttons */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-10">
            <a
              href={APK_URL}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm md:text-base font-semibold shadow hover:bg-indigo-700 transition"
              download
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4" />
              {t('Download APK')}
            </a>

            {/* {PLAY_STORE_URL ? (
              <a
                href={PLAY_STORE_URL}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm md:text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Store className="w-4 h-4" />
                {t('Open in Cafe Bazaar')}
              </a>
            ) : (
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-sm md:text-base font-semibold cursor-not-allowed"
                disabled
              >
                <Store className="w-4 h-4" />
                {t("Cafe Bazaar (coming soon)")}
              </button>
            )} */}
          </div>

          {/* How to install */}
          <div className="space-y-2">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              {t("How to install")}
            </h2>
            <ol className="list-decimal list-inside text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <li>{t("Download the APK on your device.")}</li>
              <li>{t("Enable 'Install unknown apps' in Settings.")}</li>
              <li>{t("Open the APK file and install the app.")}</li>
              <li>{t("Launch the app and sign in.")}</li>
            </ol>
          </div>

          {/* Installation checklist */}
          <aside className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Info className="w-4 h-4 text-indigo-600" />
              {t("Installation checklist")}
            </div>
            <ul className="text-xs md:text-sm text-slate-700 dark:text-slate-400 space-y-1.5">
              <li>• {t("Android 8.0 or higher")}</li>
              <li>• {t("Allow unknown sources for installation")}</li>
              {/* <li>• {("Optional: ADB + USB cable")}</li> */}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}
