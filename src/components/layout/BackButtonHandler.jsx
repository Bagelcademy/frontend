import { useEffect, useRef } from "react";
import { App } from "@capacitor/app";
import { useLocation, useNavigate } from "react-router-dom";

export default function BackButtonHandler({
  exitOnRoot = true,
  rootPaths = ["/", "/home"],
  exitTimeout = 1500
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPress = useRef(0);

  useEffect(() => {
    const listener = App.addListener("backButton", ({ canGoBack }) => {
      const currentPath = location.pathname;

      if (canGoBack) {
        navigate(-1);
        return;
      }

      if (exitOnRoot && rootPaths.includes(currentPath)) {
        const now = Date.now();
        if (now - lastBackPress.current < exitTimeout) {
          App.exitApp();
        } else {
          lastBackPress.current = now;
        }
        return;
      }

      navigate("/home");
    });

    return () => {
      listener.remove();
    };
  }, [location, navigate, exitOnRoot, rootPaths, exitTimeout]);

  return null;
}