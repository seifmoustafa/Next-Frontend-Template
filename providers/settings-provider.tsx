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

// Shadow intensity types
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

// Header style types - New
export type HeaderStyle = "default" | "compact" | "elevated" | "transparent";

// Sidebar style types - New
export type SidebarStyle = "default" | "compact" | "minimal" | "floating";

// Button style types - New
export type ButtonStyle = "default" | "rounded" | "square" | "pill";

// Navigation style types - New
export type NavigationStyle = "default" | "pills" | "underline" | "background";

// Spacing types - New
export type SpacingSize = "compact" | "default" | "comfortable" | "spacious";

// Icon style types - New
export type IconStyle = "outline" | "filled" | "duotone" | "minimal";

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

  // Header style - New
  headerStyle: HeaderStyle;
  setHeaderStyle: (style: HeaderStyle) => void;

  // Sidebar style - New
  sidebarStyle: SidebarStyle;
  setSidebarStyle: (style: SidebarStyle) => void;

  // Button style - New
  buttonStyle: ButtonStyle;
  setButtonStyle: (style: ButtonStyle) => void;

  // Navigation style - New
  navigationStyle: NavigationStyle;
  setNavigationStyle: (style: NavigationStyle) => void;

  // Spacing size - New
  spacingSize: SpacingSize;
  setSpacingSize: (size: SpacingSize) => void;

  // Icon style - New
  iconStyle: IconStyle;
  setIconStyle: (style: IconStyle) => void;

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
  headerStyle: "default" as HeaderStyle,
  sidebarStyle: "default" as SidebarStyle,
  buttonStyle: "default" as ButtonStyle,
  navigationStyle: "default" as NavigationStyle,
  spacingSize: "default" as SpacingSize,
  iconStyle: "outline" as IconStyle,
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
  const [headerStyle, setHeaderStyle] = useState<HeaderStyle>(
    defaultSettings.headerStyle
  );
  const [sidebarStyle, setSidebarStyle] = useState<SidebarStyle>(
    defaultSettings.sidebarStyle
  );
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>(
    defaultSettings.buttonStyle
  );
  const [navigationStyle, setNavigationStyle] = useState<NavigationStyle>(
    defaultSettings.navigationStyle
  );
  const [spacingSize, setSpacingSize] = useState<SpacingSize>(
    defaultSettings.spacingSize
  );
  const [iconStyle, setIconStyle] = useState<IconStyle>(
    defaultSettings.iconStyle
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
        setHeaderStyle(
          parsedSettings.headerStyle || defaultSettings.headerStyle
        );
        setSidebarStyle(
          parsedSettings.sidebarStyle || defaultSettings.sidebarStyle
        );
        setButtonStyle(
          parsedSettings.buttonStyle || defaultSettings.buttonStyle
        );
        setNavigationStyle(
          parsedSettings.navigationStyle || defaultSettings.navigationStyle
        );
        setSpacingSize(
          parsedSettings.spacingSize || defaultSettings.spacingSize
        );
        setIconStyle(parsedSettings.iconStyle || defaultSettings.iconStyle);
      }
    } catch (error) {
      console.error("Failed to parse settings:", error);
    }
    setMounted(true);
  }, []);

  // Save settings to localStorage and apply CSS variables whenever they change
  useEffect(() => {
    if (!mounted) return;

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
      headerStyle,
      sidebarStyle,
      buttonStyle,
      navigationStyle,
      spacingSize,
      iconStyle,
    };
    localStorage.setItem("appSettings", JSON.stringify(settings));

    // Apply CSS variables for the selected themes
    const root = document.documentElement;

    // Apply all data attributes
    root.setAttribute("data-theme", colorTheme);
    root.setAttribute("data-light-bg-theme", lightBackgroundTheme);
    root.setAttribute("data-dark-bg-theme", darkBackgroundTheme);
    root.setAttribute("data-shadow", shadowIntensity);
    root.setAttribute("data-layout", layoutTemplate);
    root.setAttribute("data-card-style", cardStyle);
    root.setAttribute("data-animation", animationLevel);
    root.setAttribute("data-font-size", fontSize);
    root.setAttribute("data-radius", borderRadius);
    root.setAttribute("data-header-style", headerStyle);
    root.setAttribute("data-sidebar-style", sidebarStyle);
    root.setAttribute("data-button-style", buttonStyle);
    root.setAttribute("data-navigation-style", navigationStyle);
    root.setAttribute("data-spacing", spacingSize);
    root.setAttribute("data-icon-style", iconStyle);

    // Apply RTL/LTR based on sidebar position
    root.setAttribute("dir", sidebarPosition === "right" ? "rtl" : "ltr");

    // Force a repaint to ensure CSS variables are applied
    root.style.display = "none";
    root.offsetHeight; // Trigger reflow
    root.style.display = "";
  }, [
    mounted,
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
    headerStyle,
    sidebarStyle,
    buttonStyle,
    navigationStyle,
    spacingSize,
    iconStyle,
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
    setHeaderStyle(defaultSettings.headerStyle);
    setSidebarStyle(defaultSettings.sidebarStyle);
    setButtonStyle(defaultSettings.buttonStyle);
    setNavigationStyle(defaultSettings.navigationStyle);
    setSpacingSize(defaultSettings.spacingSize);
    setIconStyle(defaultSettings.iconStyle);
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
        headerStyle,
        setHeaderStyle,
        sidebarStyle,
        setSidebarStyle,
        buttonStyle,
        setButtonStyle,
        navigationStyle,
        setNavigationStyle,
        spacingSize,
        setSpacingSize,
        iconStyle,
        setIconStyle,
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
