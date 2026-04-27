"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";
export type LanguageCode = "uz" | "ru" | "en";

export function useProcarePreferences() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("uz");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("procare-theme");
    const storedLanguage = window.localStorage.getItem("procare-language");

    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }

    if (storedLanguage === "uz" || storedLanguage === "ru" || storedLanguage === "en") {
      setLanguage(storedLanguage);
    }

    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    if (themeLoaded) {
      window.localStorage.setItem("procare-theme", theme);
    }
  }, [theme, themeLoaded]);

  useEffect(() => {
    document.documentElement.lang = language;

    if (themeLoaded) {
      window.localStorage.setItem("procare-language", language);
    }
  }, [language, themeLoaded]);

  return {
    theme,
    setTheme,
    language,
    setLanguage
  };
}
