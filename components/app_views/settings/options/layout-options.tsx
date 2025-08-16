"use client";

import type { ReactNode } from "react";

interface LayoutTemplate {
  value: string;
  name: string;
  description: string;
  preview: ReactNode;
}

interface SimpleOption {
  value: string;
  name: string;
  description: string;
}

interface CardStyle {
  value: string;
  name: string;
  class: string;
}

export interface LayoutOptions {
  layoutTemplates: LayoutTemplate[];
  headerStyles: SimpleOption[];
  sidebarStyles: SimpleOption[];
  cardStyles: CardStyle[];
}

export function getLayoutOptions(t: (key: string) => string): LayoutOptions {
  // Layout template options with mini previews
  const layoutTemplates: LayoutTemplate[] = [
    {
      value: "modern",
      name: t("settings.layoutTemplate.options.modern.name"),
      description: t("settings.layoutTemplate.options.modern.description"),
      preview: (
        <div className="w-full h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded flex">
          <div className="w-12 bg-gray-300 rounded-l"></div>
          <div className="flex-1 p-2">
            <div className="h-2 bg-gray-400 rounded mb-1"></div>
            <div className="h-2 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      ),
    },
    {
      value: "classic",
      name: t("settings.layoutTemplate.options.classic.name"),
      description: t("settings.layoutTemplate.options.classic.description"),
      preview: (
        <div className="w-full h-16 bg-white border rounded flex">
          <div className="w-12 bg-gray-100 border-r"></div>
          <div className="flex-1 p-2">
            <div className="h-2 bg-gray-600 rounded mb-1"></div>
            <div className="h-2 bg-gray-400 rounded w-2/3"></div>
          </div>
        </div>
      ),
    },
    {
      value: "compact",
      name: t("settings.layoutTemplate.options.compact.name"),
      description: t("settings.layoutTemplate.options.compact.description"),
      preview: (
        <div className="w-full h-16 bg-gray-50 rounded flex">
          <div className="w-8 bg-gray-200"></div>
          <div className="flex-1 p-1">
            <div className="h-1.5 bg-gray-500 rounded mb-1"></div>
            <div className="h-1.5 bg-gray-400 rounded w-3/4 mb-1"></div>
            <div className="h-1.5 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ),
    },
    {
      value: "elegant",
      name: t("settings.layoutTemplate.options.elegant.name"),
      description: t("settings.layoutTemplate.options.elegant.description"),
      preview: (
        <div className="w-full h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded shadow-sm flex">
          <div className="w-12 bg-gradient-to-b from-gray-200 to-gray-300 rounded-l"></div>
          <div className="flex-1 p-2">
            <div className="h-2 bg-gradient-to-r from-gray-500 to-gray-400 rounded mb-1"></div>
            <div className="h-2 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      ),
    },
    {
      value: "minimal",
      name: t("settings.layoutTemplate.options.minimal.name"),
      description: t("settings.layoutTemplate.options.minimal.description"),
      preview: (
        <div className="w-full h-16 bg-white rounded border-l-2 border-gray-300 flex">
          <div className="w-10 bg-gray-50"></div>
          <div className="flex-1 p-2">
            <div className="h-2 bg-gray-800 rounded mb-2"></div>
            <div className="h-1 bg-gray-400 rounded w-1/2"></div>
          </div>
        </div>
      ),
    },
    {
      value: "floating",
      name: t("settings.layoutTemplate.options.floating.name"),
      description: t("settings.layoutTemplate.options.floating.description"),
      preview: (
        <div className="w-full h-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded relative">
          <div className="absolute top-1 left-1 w-8 h-6 bg-white rounded shadow"></div>
          <div className="absolute top-2 right-2 w-16 h-4 bg-white rounded shadow"></div>
          <div className="absolute bottom-1 left-2 w-12 h-4 bg-white rounded shadow"></div>
        </div>
      ),
    },
    {
      value: "navigation",
      name: t("settings.layoutTemplate.options.navigation.name"),
      description: t("settings.layoutTemplate.options.navigation.description"),
      preview: (
        <div className="w-full h-16 bg-gray-100 rounded flex">
          <div className="w-6 bg-gray-300"></div>
          <div className="w-8 bg-gray-200"></div>
          <div className="flex-1 p-2">
            <div className="h-2 bg-gray-500 rounded mb-1"></div>
            <div className="h-2 bg-gray-400 rounded w-2/3"></div>
          </div>
        </div>
      ),
    },
  ];

  // Header style options
  const headerStyles: SimpleOption[] = [
    {
      value: "default",
      name: t("settings.headerStyle.options.default.name"),
      description: t("settings.headerStyle.options.default.description"),
    },
    {
      value: "compact",
      name: t("settings.headerStyle.options.compact.name"),
      description: t("settings.headerStyle.options.compact.description"),
    },
    {
      value: "elevated",
      name: t("settings.headerStyle.options.elevated.name"),
      description: t("settings.headerStyle.options.elevated.description"),
    },
    {
      value: "transparent",
      name: t("settings.headerStyle.options.transparent.name"),
      description: t("settings.headerStyle.options.transparent.description"),
    },
  ];

  // Sidebar style options
  const sidebarStyles: SimpleOption[] = [
    {
      value: "default",
      name: t("settings.sidebarStyle.options.default.name"),
      description: t("settings.sidebarStyle.options.default.description"),
    },
    {
      value: "compact",
      name: t("settings.sidebarStyle.options.compact.name"),
      description: t("settings.sidebarStyle.options.compact.description"),
    },
    {
      value: "floating",
      name: t("settings.sidebarStyle.options.floating.name"),
      description: t("settings.sidebarStyle.options.floating.description"),
    },
    {
      value: "minimal",
      name: t("settings.sidebarStyle.options.minimal.name"),
      description: t("settings.sidebarStyle.options.minimal.description"),
    },
  ];

  // Card style options
  const cardStyles: CardStyle[] = [
    { value: "default", name: t("cardStyle.default"), class: "border bg-card" },
    { value: "glass", name: t("cardStyle.glass"), class: "bg-white/10 backdrop-blur border border-white/20" },
    { value: "solid", name: t("cardStyle.solid"), class: "bg-gray-100 border-0" },
    { value: "bordered", name: t("cardStyle.bordered"), class: "border-2 bg-card" },
    { value: "elevated", name: t("settings.cardStyleOptions.elevated"), class: "shadow-lg bg-card border-0" },
  ];

  return {
    layoutTemplates,
    headerStyles,
    sidebarStyles,
    cardStyles,
  };
}

export default getLayoutOptions;
