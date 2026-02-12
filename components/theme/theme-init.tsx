"use client";

import { useEffect } from "react";

export function ThemeInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("ra-theme");
    const theme = stored === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");

    const storedLang = window.localStorage.getItem("ra-language");
    const lang = storedLang === "en" ? "en" : "id";
    document.documentElement.setAttribute("lang", lang);
  }, []);

  return null;
}

