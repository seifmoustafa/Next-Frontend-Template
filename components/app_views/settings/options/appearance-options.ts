"use client";

export function getAppearanceOptions(t: (key: string) => string) {
  // Color theme options with visual previews
  const colorThemes = [
    { value: "purple", name: t("settings.colors.purple"), color: "bg-purple-500", accent: "bg-purple-100" },
    { value: "blue", name: t("settings.colors.blue"), color: "bg-blue-500", accent: "bg-blue-100" },
    { value: "green", name: t("settings.colors.green"), color: "bg-green-500", accent: "bg-green-100" },
    { value: "orange", name: t("settings.colors.orange"), color: "bg-orange-500", accent: "bg-orange-100" },
    { value: "red", name: t("settings.colors.red"), color: "bg-red-500", accent: "bg-red-100" },
    { value: "teal", name: t("settings.colors.teal"), color: "bg-teal-500", accent: "bg-teal-100" },
    { value: "pink", name: t("settings.colors.pink"), color: "bg-pink-500", accent: "bg-pink-100" },
    { value: "indigo", name: t("settings.colors.indigo"), color: "bg-indigo-500", accent: "bg-indigo-100" },
    { value: "cyan", name: t("settings.colors.cyan"), color: "bg-cyan-500", accent: "bg-cyan-100" },
  ];

  // Light background themes
  const lightBackgroundThemes = [
    { value: "default", name: t("settings.lightBg.default"), gradient: "bg-gradient-to-br from-white to-gray-50" },
    { value: "warm", name: t("settings.lightBg.warm"), gradient: "bg-gradient-to-br from-orange-50 to-red-50" },
    { value: "cool", name: t("settings.lightBg.cool"), gradient: "bg-gradient-to-br from-blue-50 to-cyan-50" },
    { value: "neutral", name: t("settings.lightBg.neutral"), gradient: "bg-gradient-to-br from-gray-50 to-slate-50" },
    { value: "soft", name: t("settings.lightBg.soft"), gradient: "bg-gradient-to-br from-pink-50 to-purple-50" },
    { value: "cream", name: t("settings.lightBg.cream"), gradient: "bg-gradient-to-br from-yellow-50 to-orange-50" },
    { value: "mint", name: t("settings.lightBg.mint"), gradient: "bg-gradient-to-br from-green-50 to-emerald-50" },
    { value: "lavender", name: t("settings.lightBg.lavender"), gradient: "bg-gradient-to-br from-purple-50 to-indigo-50" },
    { value: "rose", name: t("settings.lightBg.rose"), gradient: "bg-gradient-to-br from-rose-50 to-pink-50" },
  ];

  // Dark background themes
  const darkBackgroundThemes = [
    { value: "default", name: t("settings.darkBg.default"), gradient: "bg-gradient-to-br from-gray-900 to-gray-800" },
    { value: "darker", name: t("settings.darkBg.darker"), gradient: "bg-gradient-to-br from-gray-950 to-gray-900" },
    { value: "pitch", name: t("settings.darkBg.pitch"), gradient: "bg-gradient-to-br from-black to-gray-950" },
    { value: "slate", name: t("settings.darkBg.slate"), gradient: "bg-gradient-to-br from-slate-900 to-slate-800" },
    { value: "warm-dark", name: t("settings.darkBg.warmDark"), gradient: "bg-gradient-to-br from-orange-950 to-red-950" },
    { value: "forest", name: t("settings.darkBg.forest"), gradient: "bg-gradient-to-br from-green-950 to-emerald-950" },
    { value: "ocean", name: t("settings.darkBg.ocean"), gradient: "bg-gradient-to-br from-blue-950 to-cyan-950" },
    { value: "purple-dark", name: t("settings.darkBg.purpleDark"), gradient: "bg-gradient-to-br from-purple-950 to-indigo-950" },
    { value: "crimson", name: t("settings.darkBg.crimson"), gradient: "bg-gradient-to-br from-red-950 to-rose-950" },
  ];

  // Shadow intensity options
  const shadowOptions = [
    { value: "none", name: t("settings.shadow.none"), class: "shadow-none" },
    { value: "subtle", name: t("settings.shadow.subtle"), class: "shadow-sm" },
    { value: "moderate", name: t("settings.shadow.moderate"), class: "shadow-md" },
    { value: "strong", name: t("settings.shadow.strong"), class: "shadow-lg" },
  ];

  // Animation level options
  const animationOptions = [
    { value: "none", name: t("settings.animation.none"), description: t("settings.animation.noneDesc") },
    { value: "minimal", name: t("settings.animation.minimal"), description: t("settings.animation.minimalDesc") },
    { value: "moderate", name: t("settings.animation.moderate"), description: t("settings.animation.moderateDesc") },
    { value: "high", name: t("settings.animation.high"), description: t("settings.animation.highDesc") },
  ];

  return {
    colorThemes,
    lightBackgroundThemes,
    darkBackgroundThemes,
    shadowOptions,
    animationOptions,
  };
}

export default getAppearanceOptions;
