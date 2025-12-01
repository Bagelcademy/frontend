import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPress = useRef(0);
  const pathRef = useRef(location.pathname);

  // Keep ref in sync with location
  useEffect(() => {
    pathRef.current = location.pathname;
    console.log('[BackButtonHandler] location changed:', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    console.log('[BackButtonHandler] initializing, platform =', platform);

    if (platform !== 'android') {
      console.log('[BackButtonHandler] not android, skipping listener');
      return;
    }

    console.log('[BackButtonHandler] registering backButton listener (Capacitor 6 style)');

    const listener = CapacitorApp.addListener('backButton', (event) => {
      console.log('[BackButtonHandler] backButton event received:', event);

      // In Capacitor 6, you must register your handler via event.handler(...)
      // Priority: 10 (higher = handled earlier; 0 is default)
      event.handler(10, () => {
        const currentPath = pathRef.current;
        console.log('[BackButtonHandler] handler invoked. currentPath =', currentPath);

        // If we're not on root ("/" or "/home"), go back in React Router
        const isRoot = currentPath === '/' || currentPath === '/home';

        if (!isRoot) {
          console.log(
            '[BackButtonHandler] not on root. Navigating back with React Router'
          );
          navigate(-1);
          return;
        }

        // On root, implement double-press-to-exit
        const now = Date.now();
        const diff = now - lastBackPress.current;
        console.log(
          '[BackButtonHandler] on root. ms since last back press =',
          diff
        );

        if (diff < 2000) {
          console.log('[BackButtonHandler] second press within 2s → exitApp()');
          CapacitorApp.exitApp();
        } else {
          lastBackPress.current = now;
          console.log('[BackButtonHandler] first press → "Press back again to exit"');
          // TODO: show a toast/snackbar instead of console.log
        }
      });
    });

    return () => {
      console.log('[BackButtonHandler] removing backButton listener');
      listener.remove();
    };
  }, [navigate]);

  return null;
};

export default BackButtonHandler;
