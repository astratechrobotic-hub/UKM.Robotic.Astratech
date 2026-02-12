"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language/i18n";

type ThemeOption = "light" | "dark";
type LanguageOption = "id" | "en";

interface SettingsPreferencesProps {
  initialTheme?: ThemeOption;
  initialLanguage?: LanguageOption;
}

export function SettingsPreferences({
  initialTheme = "light",
  initialLanguage = "id",
}: SettingsPreferencesProps) {
  const [theme, setTheme] = useState<ThemeOption | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const { language, setLanguage, t } = useLanguage();

  // Load theme from localStorage on mount (to avoid balik ke default)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedTheme = window.localStorage.getItem("ra-theme") as ThemeOption | null;

    const effectiveTheme: ThemeOption =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : initialTheme;

    setTheme(effectiveTheme);
    document.documentElement.classList.toggle("dark", effectiveTheme === "dark");
    setLoaded(true);
  }, [initialTheme]);

  // Persist theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!theme) return;
    window.localStorage.setItem("ra-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (!loaded) {
    return (
      <div className="text-xs text-muted-foreground">
        {/* Hindari flicker dengan placeholder singkat */}
        Loading preferences...
      </div>
    );
  }

  return (
    <div className="grid gap-3 text-sm text-muted-foreground">
      <div className="flex items-center justify-between gap-4">
        <span>{t("preferences.theme")}</span>
        <div className="inline-flex rounded-md border bg-background p-1 text-xs">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`px-3 py-1 rounded-md ${
              theme === "light" ? "bg-primary text-white" : "text-foreground"
            }`}
          >
            {t("preferences.theme.light")}
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`px-3 py-1 rounded-md ${
              theme === "dark" ? "bg-primary text-white" : "text-foreground"
            }`}
          >
            {t("preferences.theme.dark")}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span>{t("preferences.language")}</span>
        <select
          value={language}
          onChange={(e) =>
            setLanguage((e.target.value as LanguageOption) ?? initialLanguage)
          }
          className="rounded-md border bg-background px-3 py-1 text-xs text-foreground"
        >
          <option value="id">{t("preferences.language.id")}</option>
          <option value="en">{t("preferences.language.en")}</option>
        </select>
      </div>

      <p className="text-xs">{t("preferences.note")}</p>
    </div>
  );
}

