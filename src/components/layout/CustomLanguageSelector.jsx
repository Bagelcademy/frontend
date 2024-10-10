import React, { useState, useCallback } from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fa', name: 'فارسی' },
  { code: 'es', name: 'Español' },
  { code: 'zh-CN', name: '中文' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ar', name: 'العربية' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
];




const CustomLanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const translatePage = useCallback((languageCode) => {
    const googleTranslateUrl = `https://translate.google.com/translate?hl=en&sl=auto&tl=${languageCode}&u=${encodeURIComponent(window.location.href)}`;
    window.open(googleTranslateUrl, '_blank');
  }, []);

  const changeLanguage = useCallback((languageCode) => {
    setSelectedLanguage(languageCode);
    translatePage(languageCode);
  }, [translatePage]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="p-0">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onSelect={() => changeLanguage(lang.code)}
            className={selectedLanguage === lang.code ? 'bg-accent' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomLanguageSelector;