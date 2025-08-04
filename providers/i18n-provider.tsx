"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSettings } from "@/providers/settings-provider"
import { ar } from "@/locales/ar"
import { en } from "@/locales/en"

export type Language = "ar" | "en"
type Direction = "rtl" | "ltr"

interface I18nContextType {
  language: Language
  direction: Direction
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations = {
  ar,
  en,
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar") // Default to Arabic
  const { setSidebarPosition } = useSettings()
  const direction: Direction = language === "ar" ? "rtl" : "ltr"

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    const newDirection = lang === "ar" ? "right" : "left"
    setSidebarPosition(newDirection)
    document.documentElement.setAttribute("dir", newDirection === "right" ? "rtl" : "ltr")
    document.documentElement.setAttribute("lang", lang)

    // Update body class for font
    if (lang === "ar") {
      document.body.classList.add("font-arabic")
      document.body.classList.remove("font-english")
    } else {
      document.body.classList.add("font-english")
      document.body.classList.remove("font-arabic")
    }
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      handleSetLanguage(savedLanguage)
    } else {
      // Set Arabic as default
      handleSetLanguage("ar")
    }
  }, [])

  return (
    <I18nContext.Provider
      value={{
        language,
        direction,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
