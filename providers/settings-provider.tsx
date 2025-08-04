"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Layout template types
export type LayoutTemplate = "default" | "modern" | "minimal" | "classic"

// Color theme types
export type ColorTheme = "purple" | "blue" | "green" | "orange" | "red" | "teal"

// Sidebar position types
export type SidebarPosition = "right" | "left"

// Card style types
export type CardStyle = "default" | "glass" | "solid" | "bordered"

// Animation level types
export type AnimationLevel = "none" | "minimal" | "moderate" | "high"

// Font size types
export type FontSize = "small" | "default" | "large"

// Border radius types
export type BorderRadius = "none" | "small" | "default" | "large" | "full"

interface SettingsContextType {
  // Layout template
  layoutTemplate: LayoutTemplate
  setLayoutTemplate: (template: LayoutTemplate) => void

  // Color theme
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void

  // Dark mode
  darkMode: boolean
  setDarkMode: (isDark: boolean) => void

  // Sidebar position
  sidebarPosition: SidebarPosition
  setSidebarPosition: (position: SidebarPosition) => void

  // Card style
  cardStyle: CardStyle
  setCardStyle: (style: CardStyle) => void

  // Animation level
  animationLevel: AnimationLevel
  setAnimationLevel: (level: AnimationLevel) => void

  // Font size
  fontSize: FontSize
  setFontSize: (size: FontSize) => void

  // Border radius
  borderRadius: BorderRadius
  setBorderRadius: (radius: BorderRadius) => void

  // Reset all settings to default
  resetSettings: () => void
}

const defaultSettings = {
  layoutTemplate: "classic" as LayoutTemplate, // Changed from "default" to "classic"
  colorTheme: "purple" as ColorTheme,
  darkMode: true,
  sidebarPosition: "right" as SidebarPosition,
  cardStyle: "glass" as CardStyle,
  animationLevel: "moderate" as AnimationLevel,
  fontSize: "default" as FontSize,
  borderRadius: "default" as BorderRadius,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with default values
  const [layoutTemplate, setLayoutTemplate] = useState<LayoutTemplate>(defaultSettings.layoutTemplate)
  const [colorTheme, setColorTheme] = useState<ColorTheme>(defaultSettings.colorTheme)
  const [darkMode, setDarkMode] = useState<boolean>(defaultSettings.darkMode)
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>(defaultSettings.sidebarPosition)
  const [cardStyle, setCardStyle] = useState<CardStyle>(defaultSettings.cardStyle)
  const [animationLevel, setAnimationLevel] = useState<AnimationLevel>(defaultSettings.animationLevel)
  const [fontSize, setFontSize] = useState<FontSize>(defaultSettings.fontSize)
  const [borderRadius, setBorderRadius] = useState<BorderRadius>(defaultSettings.borderRadius)

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setLayoutTemplate(parsedSettings.layoutTemplate || defaultSettings.layoutTemplate)
        setColorTheme(parsedSettings.colorTheme || defaultSettings.colorTheme)
        setDarkMode(parsedSettings.darkMode !== undefined ? parsedSettings.darkMode : defaultSettings.darkMode)
        setSidebarPosition(parsedSettings.sidebarPosition || defaultSettings.sidebarPosition)
        setCardStyle(parsedSettings.cardStyle || defaultSettings.cardStyle)
        setAnimationLevel(parsedSettings.animationLevel || defaultSettings.animationLevel)
        setFontSize(parsedSettings.fontSize || defaultSettings.fontSize)
        setBorderRadius(parsedSettings.borderRadius || defaultSettings.borderRadius)
      } catch (error) {
        console.error("Failed to parse settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      layoutTemplate,
      colorTheme,
      darkMode,
      sidebarPosition,
      cardStyle,
      animationLevel,
      fontSize,
      borderRadius,
    }
    localStorage.setItem("appSettings", JSON.stringify(settings))

    // Apply CSS variables for the selected theme
    document.documentElement.setAttribute("data-theme", colorTheme)
    document.documentElement.setAttribute("data-layout", layoutTemplate)
    document.documentElement.setAttribute("data-card-style", cardStyle)
    document.documentElement.setAttribute("data-animation", animationLevel)
    document.documentElement.setAttribute("data-font-size", fontSize)
    document.documentElement.setAttribute("data-radius", borderRadius)

    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Apply RTL/LTR based on sidebar position
    document.documentElement.setAttribute("dir", sidebarPosition === "right" ? "rtl" : "ltr")
  }, [layoutTemplate, colorTheme, darkMode, sidebarPosition, cardStyle, animationLevel, fontSize, borderRadius])

  // Reset all settings to default
  const resetSettings = () => {
    setLayoutTemplate(defaultSettings.layoutTemplate)
    setColorTheme(defaultSettings.colorTheme)
    setDarkMode(defaultSettings.darkMode)
    setSidebarPosition(defaultSettings.sidebarPosition)
    setCardStyle(defaultSettings.cardStyle)
    setAnimationLevel(defaultSettings.animationLevel)
    setFontSize(defaultSettings.fontSize)
    setBorderRadius(defaultSettings.borderRadius)
  }

  return (
    <SettingsContext.Provider
      value={{
        layoutTemplate,
        setLayoutTemplate,
        colorTheme,
        setColorTheme,
        darkMode,
        setDarkMode,
        sidebarPosition,
        setSidebarPosition,
        cardStyle,
        setCardStyle,
        animationLevel,
        setAnimationLevel,
        fontSize,
        setFontSize,
        borderRadius,
        setBorderRadius,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
