"use client";

export function getTypographyOptions(t: (key: string) => string) {
  // Font size options with visual examples
  const fontSizes = [
    { value: "small", name: t("fontSize.small"), example: "text-sm", description: t("fontSize.smallDesc") },
    { value: "default", name: t("fontSize.default"), example: "text-base", description: t("fontSize.defaultDesc") },
    { value: "large", name: t("fontSize.large"), example: "text-lg", description: t("fontSize.largeDesc") },
  ];

  // Border radius options with visual examples
  const borderRadiusOptions = [
    { value: "none", name: t("radius.none"), class: "rounded-none", px: "0px" },
    { value: "small", name: t("radius.small"), class: "rounded-sm", px: "2px" },
    { value: "default", name: t("radius.default"), class: "rounded", px: "4px" },
    { value: "large", name: t("radius.large"), class: "rounded-lg", px: "8px" },
    { value: "full", name: t("radius.full"), class: "rounded-full", px: "9999px" },
  ];

  // Spacing options with visual examples
  const spacingOptions = [
    { value: "compact", name: t("settings.spacing.options.compact"), spacing: "p-2 gap-1" },
    { value: "default", name: t("settings.spacing.options.default"), spacing: "p-4 gap-2" },
    { value: "comfortable", name: t("settings.spacing.options.comfortable"), spacing: "p-6 gap-3" },
    { value: "spacious", name: t("settings.spacing.options.spacious"), spacing: "p-8 gap-4" },
  ];

  return {
    fontSizes,
    borderRadiusOptions,
    spacingOptions,
  };
}

export default getTypographyOptions;
