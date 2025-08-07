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
export type InputStyle = "default" | "rounded" | "underlined" | "filled";
export type TableStyle = "default" | "striped" | "bordered" | "minimal";
export type BadgeStyle = "default" | "rounded" | "square" | "pill";
export type AvatarStyle = "default" | "rounded" | "square" | "hexagon";

export type LogoType = "sparkles" | "shield" | "image" | "custom";
export type LogoAnimation = "none" | "spin" | "pulse" | "fancy";
export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

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
  inputStyle: InputStyle;
  tableStyle: TableStyle;
  badgeStyle: BadgeStyle;
  avatarStyle: AvatarStyle;

  // Logo settings
  logoType: LogoType;
  logoAnimation: LogoAnimation;
  logoSize: LogoSize;
  logoText: string;
  logoImagePath: string;

  // Additional app control settings
  showBreadcrumbs: boolean;
  showUserAvatar: boolean;
  showNotifications: boolean;
  compactMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  stickyHeader: boolean;
  collapsibleSidebar: boolean;
  showFooter: boolean;
  autoSave: boolean;
  showLogo: boolean;

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
  setInputStyle: (style: InputStyle) => void;
  setTableStyle: (style: TableStyle) => void;
  setBadgeStyle: (style: BadgeStyle) => void;
  setAvatarStyle: (style: AvatarStyle) => void;

  setLogoType: (type: LogoType) => void;
  setLogoAnimation: (animation: LogoAnimation) => void;
  setLogoSize: (size: LogoSize) => void;
  setLogoText: (text: string) => void;
  setLogoImagePath: (path: string) => void;
  setShowBreadcrumbs: (show: boolean) => void;
  setShowUserAvatar: (show: boolean) => void;
  setShowNotifications: (show: boolean) => void;
  setCompactMode: (compact: boolean) => void;
  setHighContrast: (contrast: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setStickyHeader: (sticky: boolean) => void;
  setCollapsibleSidebar: (collapsible: boolean) => void;
  setShowFooter: (show: boolean) => void;
  setAutoSave: (autoSave: boolean) => void;
  setShowLogo: (show: boolean) => void;

  // Utility functions
  resetSettings: () => void;
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
  inputStyle: "default" as InputStyle,
  tableStyle: "default" as TableStyle,
  badgeStyle: "default" as BadgeStyle,
  avatarStyle: "default" as AvatarStyle,
  logoType: "sparkles" as LogoType,
  logoAnimation: "none" as LogoAnimation,
  logoSize: "md" as LogoSize,
  logoText: "SA",
  logoImagePath: "/placeholder-logo.png",
  showBreadcrumbs: true,
  showUserAvatar: true,
  showNotifications: true,
  compactMode: false,
  highContrast: false,
  reducedMotion: false,
  stickyHeader: true,
  collapsibleSidebar: true,
  showFooter: true,
  autoSave: true,
  showLogo: true,
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
      root.setAttribute("data-input-style", settings.inputStyle);
      root.setAttribute("data-table-style", settings.tableStyle);
      root.setAttribute("data-badge-style", settings.badgeStyle);
      root.setAttribute("data-avatar-style", settings.avatarStyle);
      root.setAttribute("data-logo-type", settings.logoType);
      root.setAttribute("data-logo-animation", settings.logoAnimation);
      root.setAttribute("data-logo-size", settings.logoSize);
      root.setAttribute("data-compact-mode", settings.compactMode.toString());
      root.setAttribute("data-high-contrast", settings.highContrast.toString());
      root.setAttribute("data-reduced-motion", settings.reducedMotion.toString());
      root.setAttribute("data-sticky-header", settings.stickyHeader.toString());

      // Apply CSS custom properties for responsive design
      root.style.setProperty('--font-size-base', 
        settings.fontSize === 'small' ? '14px' : 
        settings.fontSize === 'large' ? '18px' : '16px'
      );
      
      root.style.setProperty('--spacing-unit', 
        settings.spacingSize === 'compact' ? '0.5rem' : 
        settings.spacingSize === 'comfortable' ? '1.5rem' :
        settings.spacingSize === 'spacious' ? '2rem' : '1rem'
      );

      root.style.setProperty('--border-radius', 
        settings.borderRadius === 'none' ? '0' : 
        settings.borderRadius === 'small' ? '0.25rem' :
        settings.borderRadius === 'large' ? '0.75rem' :
        settings.borderRadius === 'full' ? '9999px' : '0.5rem'
      );

      root.style.setProperty('--shadow-intensity', 
        settings.shadowIntensity === 'none' ? 'none' : 
        settings.shadowIntensity === 'subtle' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' :
        settings.shadowIntensity === 'strong' ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : 
        '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      );
    }
  }, [settings, isHydrated]);

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
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
    setInputStyle: (style) => updateSetting("inputStyle", style),
    setTableStyle: (style) => updateSetting("tableStyle", style),
    setBadgeStyle: (style) => updateSetting("badgeStyle", style),
    setAvatarStyle: (style) => updateSetting("avatarStyle", style),
    setLogoType: (type) => updateSetting("logoType", type),
    setLogoAnimation: (animation) => updateSetting("logoAnimation", animation),
    setLogoSize: (size) => updateSetting("logoSize", size),
    setLogoText: (text) => updateSetting("logoText", text),
    setLogoImagePath: (path) => updateSetting("logoImagePath", path),
    setShowBreadcrumbs: (show) => updateSetting("showBreadcrumbs", show),
    setShowUserAvatar: (show) => updateSetting("showUserAvatar", show),
    setShowNotifications: (show) => updateSetting("showNotifications", show),
    setCompactMode: (compact) => updateSetting("compactMode", compact),
    setHighContrast: (contrast) => updateSetting("highContrast", contrast),
    setReducedMotion: (reduced) => updateSetting("reducedMotion", reduced),
    setStickyHeader: (sticky) => updateSetting("stickyHeader", sticky),
    setCollapsibleSidebar: (collapsible) => updateSetting("collapsibleSidebar", collapsible),
    setShowFooter: (show) => updateSetting("showFooter", show),
    setAutoSave: (autoSave) => updateSetting("autoSave", autoSave),
    setShowLogo: (show) => updateSetting("showLogo", show),
    resetSettings,
    exportSettings,
    importSettings,
  };

  // Don't render until hydrated to prevent hydration mismatches
  if (!isHydrated) {
    return <div className="min-h-screen bg-background animate-pulse" />;
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
