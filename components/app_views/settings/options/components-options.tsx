"use client";

import type { ReactNode } from "react";

interface ButtonStyle {
  value: string;
  name: string;
  class: string;
  description: string;
}

interface NavigationStyle {
  value: string;
  name: string;
  description: string;
}

interface TreeStyle {
  value: string;
  name: string;
  description: string;
  preview: ReactNode;
}

interface DatePickerStyle {
  value: string;
  name: string;
  description: string;
  preview: string;
}

export interface ComponentsOptions {
  buttonStyles: ButtonStyle[];
  navigationStyles: NavigationStyle[];
  treeStyles: TreeStyle[];
  datePickerStyles: DatePickerStyle[];
}

export function getComponentsOptions(t: (key: string) => string): ComponentsOptions {
  // Button style options
  const buttonStyles: ButtonStyle[] = [
    { value: "default", name: t("settings.buttonStyle.options.default.name"), class: "rounded-md", description: t("settings.buttonStyle.options.default.description") },
    { value: "small-round", name: t("settings.buttonStyle.options.smallRound.name"), class: "rounded", description: t("settings.buttonStyle.options.smallRound.description") },
    { value: "medium-round", name: t("settings.buttonStyle.options.mediumRound.name"), class: "rounded-lg", description: t("settings.buttonStyle.options.mediumRound.description") },
    { value: "large-round", name: t("settings.buttonStyle.options.largeRound.name"), class: "rounded-xl", description: t("settings.buttonStyle.options.largeRound.description") },
    { value: "extra-round", name: t("settings.buttonStyle.options.extraRound.name"), class: "rounded-2xl", description: t("settings.buttonStyle.options.extraRound.description") },
    { value: "super-round", name: t("settings.buttonStyle.options.superRound.name"), class: "rounded-3xl", description: t("settings.buttonStyle.options.superRound.description") },
    { value: "rounded", name: t("settings.buttonStyle.options.rounded.name"), class: "rounded-full", description: t("settings.buttonStyle.options.rounded.description") },
    { value: "sharp", name: t("settings.buttonStyle.options.sharp.name"), class: "rounded-none", description: t("settings.buttonStyle.options.sharp.description") },
  ];

  // Navigation style options
  const navigationStyles: NavigationStyle[] = [
    { value: "default", name: t("settings.navigationStyle.options.default.name"), description: t("settings.navigationStyle.options.default.description") },
    { value: "pills", name: t("settings.navigationStyle.options.pills.name"), description: t("settings.navigationStyle.options.pills.description") },
    { value: "underline", name: t("settings.navigationStyle.options.underline.name"), description: t("settings.navigationStyle.options.underline.description") },
    { value: "sidebar", name: t("settings.navigationStyle.options.sidebar.name"), description: t("settings.navigationStyle.options.sidebar.description") },
  ];

  // Tree style options
  const treeStyles: TreeStyle[] = [
    {
      value: "lines",
      name: t("settings.treeStyle.options.lines.name"),
      description: t("settings.treeStyle.options.lines.description"),
      preview: (
        <div className="p-3">
          <div className="h-2 w-24 bg-muted rounded mb-2" />
          <div className="border-l border-muted-foreground/30 ml-4 pl-3 space-y-2">
            <div className="h-2 w-20 bg-muted rounded" />
            <div className="h-2 w-16 bg-muted rounded" />
          </div>
        </div>
      ),
    },
    {
      value: "cards",
      name: t("settings.treeStyle.options.cards.name"),
      description: t("settings.treeStyle.options.cards.description"),
      preview: (
        <div className="p-3 space-y-2">
          <div className="h-6 w-28 bg-card border rounded shadow-sm" />
          <div className="pl-6 space-y-2">
            <div className="h-6 w-24 bg-card border rounded shadow-sm" />
            <div className="h-6 w-20 bg-card border rounded shadow-sm" />
          </div>
        </div>
      ),
    },
    {
      value: "minimal",
      name: t("settings.treeStyle.options.minimal.name"),
      description: t("settings.treeStyle.options.minimal.description"),
      preview: (
        <div className="p-3">
          <div className="h-2 w-24 bg-muted rounded mb-2" />
          <div className="border-l border-dashed border-muted-foreground/30 ml-4 pl-3 space-y-2">
            <div className="h-2 w-20 bg-muted rounded" />
            <div className="h-2 w-16 bg-muted rounded" />
          </div>
        </div>
      ),
    },
    {
      value: "bubble",
      name: t("settings.treeStyle.options.bubble.name"),
      description: t("settings.treeStyle.options.bubble.description"),
      preview: (
        <div className="p-3">
          <div className="inline-flex gap-2 flex-wrap">
            <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px]">
              {t("settings.treeStyle.sample.parent")}
            </div>
            <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px]">
              {t("settings.treeStyle.sample.child1")}
            </div>
            <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px]">
              {t("settings.treeStyle.sample.child2")}
            </div>
          </div>
        </div>
      ),
    },
  ];

  // DatePicker style options
  const datePickerStyles: DatePickerStyle[] = [
    {
      value: "default",
      name: t("settings.datePickerStyle.options.default.name"),
      description: t("settings.datePickerStyle.options.default.description"),
      preview: "bg-background border border-border rounded-md",
    },
    {
      value: "modern",
      name: t("settings.datePickerStyle.options.modern.name"),
      description: t("settings.datePickerStyle.options.modern.description"),
      preview: "bg-gradient-to-r from-background to-muted/20 border border-border/50 rounded-md shadow-sm",
    },
    {
      value: "glass",
      name: t("settings.datePickerStyle.options.glass.name"),
      description: t("settings.datePickerStyle.options.glass.description"),
      preview: "bg-background/60 backdrop-blur-sm border border-white/20 rounded-md shadow-lg",
    },
    {
      value: "outlined",
      name: t("settings.datePickerStyle.options.outlined.name"),
      description: t("settings.datePickerStyle.options.outlined.description"),
      preview: "bg-transparent border-2 border-border rounded-md",
    },
    {
      value: "filled",
      name: t("settings.datePickerStyle.options.filled.name"),
      description: t("settings.datePickerStyle.options.filled.description"),
      preview: "bg-muted/50 border border-transparent rounded-md",
    },
    {
      value: "minimal",
      name: t("settings.datePickerStyle.options.minimal.name"),
      description: t("settings.datePickerStyle.options.minimal.description"),
      preview: "bg-transparent border-b-2 border-border rounded-none",
    },
    {
      value: "elegant",
      name: t("settings.datePickerStyle.options.elegant.name"),
      description: t("settings.datePickerStyle.options.elegant.description"),
      preview: "bg-gradient-to-br from-background via-background to-muted/10 border border-border/30 rounded-md shadow-sm",
    },
  ];

  return {
    buttonStyles,
    navigationStyles,
    treeStyles,
    datePickerStyles,
  };
}

export default getComponentsOptions;
