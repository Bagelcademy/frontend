import React, { useEffect } from 'react';

const GoogleTranslateWidget = () => {
  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    // Initialize the translate widget
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en', // Set this to your website's primary language
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    addScript();

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      const script = document.querySelector('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]');
      if (script) {
        document.body.removeChild(script);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslateWidget;