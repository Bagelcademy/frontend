import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X , Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "download_app_banner_dismissed";

export default function DownloadAppBanner() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setVisible(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  const handleDownload = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    navigate("/download");
    setVisible(false);
  };

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 right-1 z-50 w-[70%] max-w-sm"
        >
          <div dir="rtl" className="flex items-center justify-between gap-3 rounded-xl bg-gray-300 dark:bg-slate-600 p-2.5 shadow-lg">
            <button
                onClick={dismiss}
                className="rounded-xl p-2 bg-gray-900 text-gray-200 hover:bg-gray-500"
                aria-label="Close"
              >
                <X size={18} />
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
              {t("Tadrisino App")}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="rounded-lg border border-purple-800 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-3 py-2 text-sm font-medium text-white active:scale-95"
              >
                <Download size={16} className="inline-block" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
