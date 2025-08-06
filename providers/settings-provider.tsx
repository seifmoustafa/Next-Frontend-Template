"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Define all possible setting types
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
export type ShadowIntensity = "none" | "subtle" | "moderate" | "strong";
export type LayoutTemplate =
  | "modern"
  | "minimal"
  | "classic"
  | "compact"
  | "floating"
  | "elegant"
  | "navigation";
export type CardStyle = "default" | "glass" | "solid" | "bordered" | "elevated";
export type AnimationLevel = "none" | "minimal" | "moderate" | "high";
export type FontSize = "small" | "default" | "large";
export type BorderRadius = "none" | "small" | "default" | "large" | "full";
export type SidebarPosition = "left" | "right";

// New setting types
export type HeaderStyle = "default" | "compact" | "elevated" | "transparent";
export type SidebarStyle = "default" | "compact" | "floating" | "minimal";
export type ButtonStyle = "default" | "rounded" | "sharp" | "modern";
export type NavigationStyle = "default" | "pills" | "underline" | "sidebar";
export type SpacingSize = "compact" | "default" | "comfortable" | "spacious";
export type IconStyle = "outline" | "filled" | "duotone" | "minimal";

interface SettingsContextType {
  // Existing settings
  colorTheme: ColorTheme;
  lightBackgroundTheme: LightBackgroundTheme;
  darkBackgroundTheme: DarkBackgroundTheme;
  shadowIntensity: ShadowIntensity;
  layoutTemplate: LayoutTemplate;
  cardStyle: CardStyle;
  animationLevel: AnimationLevel;
  fontSize: FontSize;
  borderRadius: BorderRadius;
  sidebarPosition: SidebarPosition;

  // New settings
  headerStyle: HeaderStyle;
  sidebarStyle: SidebarStyle;
  buttonStyle: ButtonStyle;
  navigationStyle: NavigationStyle;
  spacingSize: SpacingSize;
  iconStyle: IconStyle;

  // Setters
  setColorTheme: (theme: ColorTheme) => void;
  setLightBackgroundTheme: (theme: LightBackgroundTheme) => void;
  setDarkBackgroundTheme: (theme: DarkBackgroundTheme) => void;
  setShadowIntensity: (intensity: ShadowIntensity) => void;
  setLayoutTemplate: (template: LayoutTemplate) => void;
  setCardStyle: (style: CardStyle) => void;
  setAnimationLevel: (level: AnimationLevel) => void;
  setFontSize: (size: FontSize) => void;
  setBorderRadius: (radius: BorderRadius) => void;
  setSidebarPosition: (position: SidebarPosition) => void;
  setHeaderStyle: (style: HeaderStyle) => void;
  setSidebarStyle: (style: SidebarStyle) => void;
  setButtonStyle: (style: ButtonStyle) => void;
  setNavigationStyle: (style: NavigationStyle) => void;
  setSpacingSize: (size: SpacingSize) => void;
  setIconStyle: (style: IconStyle) => void;

  // Utility functions
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (settings: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const defaultSettings = {
  colorTheme: "purple" as ColorTheme,
  lightBackgroundTheme: "default" as LightBackgroundTheme,
  darkBackgroundTheme: "default" as DarkBackgroundTheme,
  shadowIntensity: "moderate" as ShadowIntensity,
  layoutTemplate: "navigation" as LayoutTemplate,
  cardStyle: "default" as CardStyle,
  animationLevel: "moderate" as AnimationLevel,
  fontSize: "default" as FontSize,
  borderRadius: "default" as BorderRadius,
  sidebarPosition: "left" as SidebarPosition,
  headerStyle: "default" as HeaderStyle,
  sidebarStyle: "default" as SidebarStyle,
  buttonStyle: "default" as ButtonStyle,
  navigationStyle: "default" as NavigationStyle,
  spacingSize: "default" as SpacingSize,
  iconStyle: "outline" as IconStyle,
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("dashboard-settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("dashboard-settings", JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings:", error);
      }
    }
  }, [settings, isHydrated]);

  // Apply settings to document root
  useEffect(() => {
    if (isHydrated && typeof document !== "undefined") {
      const root = document.documentElement;

      // Apply all data attributes
      root.setAttribute("data-theme", settings.colorTheme);
      root.setAttribute("data-light-bg-theme", settings.lightBackgroundTheme);
      root.setAttribute("data-dark-bg-theme", settings.darkBackgroundTheme);
      root.setAttribute("data-shadow", settings.shadowIntensity);
      root.setAttribute("data-layout", settings.layoutTemplate);
      root.setAttribute("data-card-style", settings.cardStyle);
      root.setAttribute("data-animation", settings.animationLevel);
      root.setAttribute("data-font-size", settings.fontSize);
      root.setAttribute("data-radius", settings.borderRadius);
      root.setAttribute("data-sidebar-position", settings.sidebarPosition);
      root.setAttribute("data-header-style", settings.headerStyle);
      root.setAttribute("data-sidebar-style", settings.sidebarStyle);
      root.setAttribute("data-button-style", settings.buttonStyle);
      root.setAttribute("data-navigation-style", settings.navigationStyle);
      root.setAttribute("data-spacing", settings.spacingSize);
      root.setAttribute("data-icon-style", settings.iconStyle);
    }
  }, [settings, isHydrated]);

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  const exportSettings = () => {
    return JSON.stringify(settings, null, 2);
  };

  const importSettings = (settingsString: string): boolean => {
    try {
      const parsed = JSON.parse(settingsString);
      setSettings({ ...defaultSettings, ...parsed });
      return true;
    } catch {
      return false;
    }
  };

  const contextValue: SettingsContextType = {
    ...settings,
    setColorTheme: (theme) => updateSetting("colorTheme", theme),
    setLightBackgroundTheme: (theme) =>
      updateSetting("lightBackgroundTheme", theme),
    setDarkBackgroundTheme: (theme) =>
      updateSetting("darkBackgroundTheme", theme),
    setShadowIntensity: (intensity) =>
      updateSetting("shadowIntensity", intensity),
    setLayoutTemplate: (template) => updateSetting("layoutTemplate", template),
    setCardStyle: (style) => updateSetting("cardStyle", style),
    setAnimationLevel: (level) => updateSetting("animationLevel", level),
    setFontSize: (size) => updateSetting("fontSize", size),
    setBorderRadius: (radius) => updateSetting("borderRadius", radius),
    setSidebarPosition: (position) =>
      updateSetting("sidebarPosition", position),
    setHeaderStyle: (style) => updateSetting("headerStyle", style),
    setSidebarStyle: (style) => updateSetting("sidebarStyle", style),
    setButtonStyle: (style) => updateSetting("buttonStyle", style),
    setNavigationStyle: (style) => updateSetting("navigationStyle", style),
    setSpacingSize: (size) => updateSetting("spacingSize", size),
    setIconStyle: (style) => updateSetting("iconStyle", style),
    resetToDefaults,
    exportSettings,
    importSettings,
  };

  // Don't render until hydrated to prevent hydration mismatches
  if (!isHydrated) {
    return null;
  }

  return (
    <SettingsContext.Provider value={contextValue}>
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
