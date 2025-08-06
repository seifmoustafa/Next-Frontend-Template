"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Layout template types
export type LayoutTemplate =
  | "classic"
  | "elegant"
  | "modern"
  | "minimal"
  | "compact"
  | "floating"
  | "navigation";

// Color theme types - Extended
export type ColorTheme =
  | "purple"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "teal"
  | "pink"
  | "indigo"
  | "cyan";

// Background theme types - Separate for light and dark
export type LightBackgroundTheme =
  | "default"
  | "warm"
  | "cool"
  | "neutral"
  | "soft"
  | "cream"
  | "mint"
  | "lavender"
  | "rose";

export type DarkBackgroundTheme =
  | "default"
  | "darker"
  | "pitch"
  | "slate"
  | "warm-dark"
  | "forest"
  | "ocean"
  | "purple-dark"
  | "crimson";

// Shadow intensity types - New
export type ShadowIntensity = "none" | "subtle" | "moderate" | "strong";

// Sidebar position types
export type SidebarPosition = "right" | "left";

// Card style types - Extended
export type CardStyle = "default" | "glass" | "solid" | "bordered" | "elevated";

// Logo type types
export type LogoType = "sparkles" | "shield" | "image" | "custom";

// Animation level types
export type AnimationLevel = "none" | "minimal" | "moderate" | "high";

// Font size types
export type FontSize = "small" | "default" | "large";

// Border radius types
export type BorderRadius = "none" | "small" | "default" | "large" | "full";

interface SettingsContextType {
  // Layout template
  layoutTemplate: LayoutTemplate;
  setLayoutTemplate: (template: LayoutTemplate) => void;

  // Color theme
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;

  // Background themes - Separate for light and dark
  lightBackgroundTheme: LightBackgroundTheme;
  setLightBackgroundTheme: (theme: LightBackgroundTheme) => void;

  darkBackgroundTheme: DarkBackgroundTheme;
  setDarkBackgroundTheme: (theme: DarkBackgroundTheme) => void;

  // Shadow intensity
  shadowIntensity: ShadowIntensity;
  setShadowIntensity: (intensity: ShadowIntensity) => void;

  // Sidebar position
  sidebarPosition: SidebarPosition;
  setSidebarPosition: (position: SidebarPosition) => void;

  // Card style
  cardStyle: CardStyle;
  setCardStyle: (style: CardStyle) => void;

  // Logo type
  logoType: LogoType;
  setLogoType: (type: LogoType) => void;

  // Animation level
  animationLevel: AnimationLevel;
  setAnimationLevel: (level: AnimationLevel) => void;

  // Font size
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;

  // Border radius
  borderRadius: BorderRadius;
  setBorderRadius: (radius: BorderRadius) => void;

  // Reset all settings to default
  resetSettings: () => void;
}

const defaultSettings = {
  layoutTemplate: "classic" as LayoutTemplate,
  colorTheme: "purple" as ColorTheme,
  lightBackgroundTheme: "default" as LightBackgroundTheme,
  darkBackgroundTheme: "default" as DarkBackgroundTheme,
  shadowIntensity: "moderate" as ShadowIntensity,
  sidebarPosition: "right" as SidebarPosition,
  cardStyle: "glass" as CardStyle,
  logoType: "image" as LogoType,
  animationLevel: "moderate" as AnimationLevel,
  fontSize: "default" as FontSize,
  borderRadius: "default" as BorderRadius,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [layoutTemplate, setLayoutTemplate] = useState<LayoutTemplate>(
    defaultSettings.layoutTemplate
  );
  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    defaultSettings.colorTheme
  );
  const [lightBackgroundTheme, setLightBackgroundTheme] =
    useState<LightBackgroundTheme>(defaultSettings.lightBackgroundTheme);
  const [darkBackgroundTheme, setDarkBackgroundTheme] =
    useState<DarkBackgroundTheme>(defaultSettings.darkBackgroundTheme);
  const [shadowIntensity, setShadowIntensity] = useState<ShadowIntensity>(
    defaultSettings.shadowIntensity
  );
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>(
    defaultSettings.sidebarPosition
  );
  const [cardStyle, setCardStyle] = useState<CardStyle>(
    defaultSettings.cardStyle
  );
  const [logoType, setLogoType] = useState<LogoType>(defaultSettings.logoType);
  const [animationLevel, setAnimationLevel] = useState<AnimationLevel>(
    defaultSettings.animationLevel
  );
  const [fontSize, setFontSize] = useState<FontSize>(defaultSettings.fontSize);
  const [borderRadius, setBorderRadius] = useState<BorderRadius>(
    defaultSettings.borderRadius
  );
  const [mounted, setMounted] = useState(false);

  // Effect to load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setLayoutTemplate(
          parsedSettings.layoutTemplate || defaultSettings.layoutTemplate
        );
        setColorTheme(parsedSettings.colorTheme || defaultSettings.colorTheme);
        setLightBackgroundTheme(
          parsedSettings.lightBackgroundTheme ||
            defaultSettings.lightBackgroundTheme
        );
        setDarkBackgroundTheme(
          parsedSettings.darkBackgroundTheme ||
            defaultSettings.darkBackgroundTheme
        );
        setShadowIntensity(
          parsedSettings.shadowIntensity || defaultSettings.shadowIntensity
        );
        setSidebarPosition(
          parsedSettings.sidebarPosition || defaultSettings.sidebarPosition
        );
        setCardStyle(parsedSettings.cardStyle || defaultSettings.cardStyle);
        setLogoType(parsedSettings.logoType || defaultSettings.logoType);
        setAnimationLevel(
          parsedSettings.animationLevel || defaultSettings.animationLevel
        );
        setFontSize(parsedSettings.fontSize || defaultSettings.fontSize);
        setBorderRadius(
          parsedSettings.borderRadius || defaultSettings.borderRadius
        );
      }
    } catch (error) {
      console.error("Failed to parse settings:", error);
    }
    setMounted(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      layoutTemplate,
      colorTheme,
      lightBackgroundTheme,
      darkBackgroundTheme,
      shadowIntensity,
      sidebarPosition,
      cardStyle,
      logoType,
      animationLevel,
      fontSize,
      borderRadius,
    };
    localStorage.setItem("appSettings", JSON.stringify(settings));

    // Apply CSS variables for the selected themes
    document.documentElement.setAttribute("data-theme", colorTheme);
    document.documentElement.setAttribute(
      "data-light-bg-theme",
      lightBackgroundTheme
    );
    document.documentElement.setAttribute(
      "data-dark-bg-theme",
      darkBackgroundTheme
    );
    document.documentElement.setAttribute("data-shadow", shadowIntensity);
    document.documentElement.setAttribute("data-layout", layoutTemplate);
    document.documentElement.setAttribute("data-card-style", cardStyle);
    document.documentElement.setAttribute("data-animation", animationLevel);
    document.documentElement.setAttribute("data-font-size", fontSize);
    document.documentElement.setAttribute("data-radius", borderRadius);

    // Apply RTL/LTR based on sidebar position
    document.documentElement.setAttribute(
      "dir",
      sidebarPosition === "right" ? "rtl" : "ltr"
    );
  }, [
    layoutTemplate,
    colorTheme,
    lightBackgroundTheme,
    darkBackgroundTheme,
    shadowIntensity,
    sidebarPosition,
    cardStyle,
    logoType,
    animationLevel,
    fontSize,
    borderRadius,
  ]);

  // Reset all settings to default
  const resetSettings = () => {
    setLayoutTemplate(defaultSettings.layoutTemplate);
    setColorTheme(defaultSettings.colorTheme);
    setLightBackgroundTheme(defaultSettings.lightBackgroundTheme);
    setDarkBackgroundTheme(defaultSettings.darkBackgroundTheme);
    setShadowIntensity(defaultSettings.shadowIntensity);
    setSidebarPosition(defaultSettings.sidebarPosition);
    setCardStyle(defaultSettings.cardStyle);
    setLogoType(defaultSettings.logoType);
    setAnimationLevel(defaultSettings.animationLevel);
    setFontSize(defaultSettings.fontSize);
    setBorderRadius(defaultSettings.borderRadius);
  };

  // Render nothing until the component has mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <SettingsContext.Provider
      value={{
        layoutTemplate,
        setLayoutTemplate,
        colorTheme,
        setColorTheme,
        lightBackgroundTheme,
        setLightBackgroundTheme,
        darkBackgroundTheme,
        setDarkBackgroundTheme,
        shadowIntensity,
        setShadowIntensity,
        sidebarPosition,
        setSidebarPosition,
        cardStyle,
        setCardStyle,
        logoType,
        setLogoType,
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
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
