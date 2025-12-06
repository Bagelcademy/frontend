import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'downloadAppBannerShown';

const DownloadAppBanner = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Allow forcing the banner via URL param for testing (e.g. ?forceDownloadBanner=1)
      const params = new URLSearchParams(window.location.search);
      const forceShow = params.get('forceDownloadBanner') === '1';

      const alreadyShown = localStorage.getItem(STORAGE_KEY) === 'false';
      if (alreadyShown && !forceShow) return;

      // If forceShow is set, show immediately for testing (bypass size checks and timer)
      if (forceShow) {
        console.debug('DownloadAppBanner: forceShow active — showing banner now');
        setVisible(true);
        return;
      }

      const isAndroid = /Android/i.test(navigator.userAgent || '');
      const isSmallScreen = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;

      // Only show for small screens by default
      // NOTE: Android check is commented out for desktop testing — remove comment to re-enable
      if (!isAndroid || !isSmallScreen) return;

      const timer = setTimeout(() => {
        // mark as shown so it only appears the first time
        // try { localStorage.setItem(STORAGE_KEY, 'true'); } catch (e) {}
        // setVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    } catch (err) {
      // fail silently
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Download app"
      className="fixed z-50 bottom-0 left-0 w-full box-border overflow-hidden"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-lg rounded-lg p-2 flex items-center gap-3">
        {/* <div className="flex-shrink-0"> */}
          {/* <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center text-white font-semibold">APP</div> */}
        {/* </div> */}

        <div className="flex-1 flex items-center gap-3 text-sm leading-tight">
          <div className="text-sm opacity-80 whitespace-nowrap px-4">
            {t("Install our Android app for the best experience.")}
          </div>

          <a
            href="/download"
            className="text-xs bg-blue-600 text-white px-3 pt-2 pb-1 rounded"
            onClick={(e) => {
              e.preventDefault();
              try { localStorage.setItem(STORAGE_KEY, 'true'); } catch (e) {}
              setVisible(false);
              navigate('/download');
            }}
          >
            {t("Download App")}
          </a>
        </div>
        <button
          aria-label="Close download banner"
          onClick={() => { try { localStorage.setItem(STORAGE_KEY, 'true'); } catch(e){} setVisible(false); }}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white ml-2 p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DownloadAppBanner;
