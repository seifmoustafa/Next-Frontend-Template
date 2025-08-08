"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettings } from "@/providers/settings-provider";
import { Logo } from "@/components/ui/logo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useI18n } from "@/providers/i18n-provider";
import {
  Palette,
  Layout,
  SettingsIcon,
  Globe,
  Zap,
  Image,
  Download,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Type,
  Check,
  Home,
  Users,
  BarChart3,
  Settings,
  Square,
  Circle,
  User,
  Layers,
  MousePointer,
  Navigation,
  BracketsIcon as Spacing,
  Brush,
  Sliders,
  Monitor,
  Smartphone,
  Tablet,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { GenericTable } from "@/components/ui/generic-table";

export function SettingsView() {
  const settings = useSettings();
  const { toast } = useToast();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("appearance");

  const handleExportSettings = () => {
    const settingsJson = settings.exportSettings();
    const blob = new Blob([settingsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "app-settings.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: t("settings.exportSuccessTitle"),
      description: t("settings.exportSuccessDesc"),
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settingsJson = e.target?.result as string;
          const success = settings.importSettings(settingsJson);
          if (success) {
            toast({
              title: t("settings.importSuccessTitle"),
              description: t("settings.importSuccessDesc"),
            });
          } else {
            throw new Error("Invalid format");
          }
        } catch (error) {
          toast({
            title: t("settings.importFailedTitle"),
            description: t("settings.importFailedDesc"),
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetSettings = () => {
    settings.resetSettings();
    toast({
      title: t("settings.resetTitle"),
      description: t("settings.resetDesc"),
    });
  };

  // Color theme options with visual previews
  const colorThemes = [
    {
      value: "purple",
      name: t("color.purple"),
      color: "bg-purple-500",
      accent: "bg-purple-100",
    },
    {
      value: "blue",
      name: t("color.blue"),
      color: "bg-blue-500",
      accent: "bg-blue-100",
    },
    {
      value: "green",
      name: t("color.green"),
      color: "bg-green-500",
      accent: "bg-green-100",
    },
    {
      value: "orange",
      name: t("color.orange"),
      color: "bg-orange-500",
      accent: "bg-orange-100",
    },
    {
      value: "red",
      name: t("color.red"),
      color: "bg-red-500",
      accent: "bg-red-100",
    },
    {
      value: "teal",
      name: t("color.teal"),
      color: "bg-teal-500",
      accent: "bg-teal-100",
    },
    {
      value: "pink",
      name: t("color.pink"),
      color: "bg-pink-500",
      accent: "bg-pink-100",
    },
    {
      value: "indigo",
      name: t("color.indigo"),
      color: "bg-indigo-500",
      accent: "bg-indigo-100",
    },
    {
      value: "cyan",
      name: t("color.cyan"),
      color: "bg-cyan-500",
      accent: "bg-cyan-100",
    },
  ];

  // Light background themes
  const lightBackgroundThemes = [
    {
      value: "default",
      name: "Default",
      gradient: "bg-gradient-to-br from-white to-gray-50",
    },
    {
      value: "warm",
      name: "Warm",
      gradient: "bg-gradient-to-br from-orange-50 to-red-50",
    },
    {
      value: "cool",
      name: "Cool",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
    },
    {
      value: "neutral",
      name: "Neutral",
      gradient: "bg-gradient-to-br from-gray-50 to-slate-50",
    },
    {
      value: "soft",
      name: "Soft",
      gradient: "bg-gradient-to-br from-pink-50 to-purple-50",
    },
    {
      value: "cream",
      name: "Cream",
      gradient: "bg-gradient-to-br from-yellow-50 to-orange-50",
    },
    {
      value: "mint",
      name: "Mint",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50",
    },
    {
      value: "lavender",
      name: "Lavender",
      gradient: "bg-gradient-to-br from-purple-50 to-indigo-50",
    },
    {
      value: "rose",
      name: "Rose",
      gradient: "bg-gradient-to-br from-rose-50 to-pink-50",
    },
  ];

  // Dark background themes
  const darkBackgroundThemes = [
    {
      value: "default",
      name: "Default",
      gradient: "bg-gradient-to-br from-gray-900 to-gray-800",
    },
    {
      value: "darker",
      name: "Darker",
      gradient: "bg-gradient-to-br from-gray-950 to-gray-900",
    },
    {
      value: "pitch",
      name: "Pitch",
      gradient: "bg-gradient-to-br from-black to-gray-950",
    },
    {
      value: "slate",
      name: "Slate",
      gradient: "bg-gradient-to-br from-slate-900 to-slate-800",
    },
    {
      value: "warm-dark",
      name: "Warm Dark",
      gradient: "bg-gradient-to-br from-orange-950 to-red-950",
    },
    {
      value: "forest",
      name: "Forest",
      gradient: "bg-gradient-to-br from-green-950 to-emerald-950",
    },
    {
      value: "ocean",
      name: "Ocean",
      gradient: "bg-gradient-to-br from-blue-950 to-cyan-950",
    },
    {
      value: "purple-dark",
      name: "Purple Dark",
      gradient: "bg-gradient-to-br from-purple-950 to-indigo-950",
    },
    {
      value: "crimson",
      name: "Crimson",
      gradient: "bg-gradient-to-br from-red-950 to-rose-950",
    },
  ];

  // Layout template options with mini previews
  const layoutTemplates = [
    {
      value: "modern",
      name: "Modern",
      description: "Clean and contemporary",
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
      name: "Classic",
      description: "Traditional layout",
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
      name: "Compact",
      description: "Space-efficient",
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
      name: "Elegant",
      description: "Sophisticated design",
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
      name: "Minimal",
      description: "Clean and simple",
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
      name: "Floating",
      description: "Cards and overlays",
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
      name: "Navigation",
      description: "Dual sidebar system",
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

  // Font size options with visual examples
  const fontSizes = [
    {
      value: "small",
      name: "Small",
      example: "text-sm",
      description: "14px base size",
    },
    {
      value: "default",
      name: "Default",
      example: "text-base",
      description: "16px base size",
    },
    {
      value: "large",
      name: "Large",
      example: "text-lg",
      description: "18px base size",
    },
  ];

  // Border radius options with visual examples - UPDATED WITH MORE OPTIONS
  const borderRadiusOptions = [
    { value: "none", name: "None", class: "rounded-none", px: "0px" },
    { value: "small", name: "Small", class: "rounded-sm", px: "2px" },
    { value: "default", name: "Default", class: "rounded", px: "4px" },
    { value: "large", name: "Large", class: "rounded-lg", px: "8px" },
    { value: "full", name: "Full", class: "rounded-full", px: "9999px" },
  ];

  // Button style options - UPDATED WITH MORE GRANULAR RADIUS OPTIONS
  const buttonStyles = [
    {
      value: "default",
      name: "Default",
      class: "rounded-md",
      description: "6px radius",
    },
    {
      value: "small-round",
      name: "Small Round",
      class: "rounded",
      description: "4px radius",
    },
    {
      value: "medium-round",
      name: "Medium Round",
      class: "rounded-lg",
      description: "8px radius",
    },
    {
      value: "large-round",
      name: "Large Round",
      class: "rounded-xl",
      description: "12px radius",
    },
    {
      value: "extra-round",
      name: "Extra Round",
      class: "rounded-2xl",
      description: "16px radius",
    },
    {
      value: "super-round",
      name: "Super Round",
      class: "rounded-3xl",
      description: "24px radius",
    },
    {
      value: "rounded",
      name: "Full Round",
      class: "rounded-full",
      description: "Fully rounded",
    },
    {
      value: "sharp",
      name: "Sharp",
      class: "rounded-none",
      description: "No radius",
    },
  ];

  // Spacing options with visual examples
  const spacingOptions = [
    { value: "compact", name: "Compact", spacing: "p-2 gap-1" },
    { value: "default", name: "Default", spacing: "p-4 gap-2" },
    { value: "comfortable", name: "Comfortable", spacing: "p-6 gap-3" },
    { value: "spacious", name: "Spacious", spacing: "p-8 gap-4" },
  ];

  // Shadow intensity options
  const shadowOptions = [
    { value: "none", name: "None", class: "shadow-none" },
    { value: "subtle", name: "Subtle", class: "shadow-sm" },
    { value: "moderate", name: "Moderate", class: "shadow-md" },
    { value: "strong", name: "Strong", class: "shadow-lg" },
  ];

  // Animation level options
  const animationOptions = [
    { value: "none", name: "None", description: "No animations" },
    { value: "minimal", name: "Minimal", description: "Basic transitions" },
    { value: "moderate", name: "Moderate", description: "Smooth animations" },
    { value: "high", name: "High", description: "Rich animations" },
  ];

  // Card style options
  const cardStyles = [
    { value: "default", name: "Default", class: "border bg-card" },
    {
      value: "glass",
      name: "Glass",
      class: "bg-white/10 backdrop-blur border border-white/20",
    },
    { value: "solid", name: "Solid", class: "bg-gray-100 border-0" },
    { value: "bordered", name: "Bordered", class: "border-2 bg-card" },
    {
      value: "elevated",
      name: "Elevated",
      class: "shadow-lg bg-card border-0",
    },
  ];

  // Header style options
  const headerStyles = [
    { value: "default", name: "Default", description: "Standard header" },
    { value: "compact", name: "Compact", description: "Smaller height" },
    { value: "elevated", name: "Elevated", description: "With shadow" },
    {
      value: "transparent",
      name: "Transparent",
      description: "Transparent background",
    },
  ];

  // Sidebar style options
  const sidebarStyles = [
    { value: "default", name: "Default", description: "Standard sidebar" },
    { value: "compact", name: "Compact", description: "Narrower width" },
    {
      value: "floating",
      name: "Floating",
      description: "Floating with margin",
    },
    { value: "minimal", name: "Minimal", description: "Clean design" },
  ];

  // Navigation style options
  const navigationStyles = [
    { value: "default", name: "Default", description: "Standard navigation" },
    { value: "pills", name: "Pills", description: "Pill-shaped items" },
    {
      value: "underline",
      name: "Underline",
      description: "Underlined active items",
    },
    {
      value: "sidebar",
      name: "Sidebar",
      description: "Sidebar-style navigation",
    },
  ];

  // Icon style options
  const iconStyles = [
    { value: "outline", name: "Outline", description: "Outlined icons" },
    { value: "filled", name: "Filled", description: "Filled icons" },
    { value: "duotone", name: "Duotone", description: "Two-tone icons" },
    { value: "minimal", name: "Minimal", description: "Simple icons" },
  ];

  // Input style options
  const inputStyles = [
    { value: "default", name: "Default", class: "rounded-md border" },
    { value: "rounded", name: "Rounded", class: "rounded-full border px-4" },
    {
      value: "underlined",
      name: "Underlined",
      class: "rounded-none border-0 border-b-2 px-0",
    },
    { value: "filled", name: "Filled", class: "rounded-lg bg-muted border-0" },
  ];

  // Table style options
  const tableStyles = [
    { value: "default", name: "Default", description: "Clean table design" },
    {
      value: "striped",
      name: "Striped",
      description: "Alternating row colors",
    },
    { value: "bordered", name: "Bordered", description: "Full borders" },
    { value: "minimal", name: "Minimal", description: "No borders" },
  ];

  // Badge style options
  const badgeStyles = [
    { value: "default", name: "Default", class: "rounded-full" },
    { value: "rounded", name: "Rounded", class: "rounded-lg" },
    { value: "square", name: "Square", class: "rounded-none" },
    { value: "pill", name: "Pill", class: "rounded-full px-3" },
  ];

  // Avatar style options
  const avatarStyles = [
    { value: "default", name: "Default", class: "rounded-full" },
    { value: "rounded", name: "Rounded", class: "rounded-lg" },
    { value: "square", name: "Square", class: "rounded-none" },
    { value: "hexagon", name: "Hexagon", class: "rounded-full" },
  ];

  // Form style options
  const formStyles = [
    { value: "default", name: "Default", description: "Standard form layout" },
    { value: "compact", name: "Compact", description: "Tighter spacing" },
    { value: "spacious", name: "Spacious", description: "More breathing room" },
    { value: "inline", name: "Inline", description: "Horizontal layout" },
  ];

  // Loading style options - UPDATED WITH ACTUAL COMPONENTS
  const loadingStyles = [
    {
      value: "spinner",
      name: "Spinner",
      description: "Rotating spinner",
      component: (
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      ),
    },
    {
      value: "dots",
      name: "Dots",
      description: "Bouncing dots",
      component: (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
        </div>
      ),
    },
    {
      value: "bars",
      name: "Bars",
      description: "Loading bars",
      component: (
        <div className="flex space-x-1">
          <div className="w-1 h-6 bg-primary animate-pulse"></div>
          <div className="w-1 h-6 bg-primary animate-pulse delay-100"></div>
          <div className="w-1 h-6 bg-primary animate-pulse delay-200"></div>
        </div>
      ),
    },
    {
      value: "pulse",
      name: "Pulse",
      description: "Pulsing effect",
      component: (
        <div className="w-6 h-6 bg-primary rounded animate-pulse"></div>
      ),
    },
  ];

  // Tooltip style options - UPDATED WITH ACTUAL TOOLTIPS
  const tooltipStyles = [
    { value: "default", name: "Default", description: "Standard tooltip" },
    { value: "rounded", name: "Rounded", description: "Rounded corners" },
    { value: "sharp", name: "Sharp", description: "Sharp corners" },
    { value: "bubble", name: "Bubble", description: "Speech bubble style" },
  ];

  // Modal style options
  const modalStyles = [
    { value: "default", name: "Default", description: "Centered modal" },
    { value: "centered", name: "Centered", description: "Always centered" },
    {
      value: "fullscreen",
      name: "Fullscreen",
      description: "Full screen overlay",
    },
    { value: "drawer", name: "Drawer", description: "Side drawer style" },
  ];

  // Sample data for live preview
  const sampleTableData = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "Inactive",
    },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Active" },
  ];

  const sampleTableColumns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={value === "Active" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
            <p className="text-muted-foreground">
              Customize your application experience
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportSettings}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" asChild>
              <label htmlFor="import-settings" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </label>
            </Button>
            <input
              id="import-settings"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportSettings}
            />
            <Button variant="destructive" onClick={handleResetSettings}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="appearance">
                  <Palette className="h-4 w-4 mr-2" />
                  {t("settings.appearance")}
                </TabsTrigger>
                <TabsTrigger value="layout">
                  <Layout className="h-4 w-4 mr-2" />
                  {t("settings.layout")}
                </TabsTrigger>
                <TabsTrigger value="components">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  {t("settings.components")}
                </TabsTrigger>
                <TabsTrigger value="typography">
                  <Type className="h-4 w-4 mr-2" />
                  {t("settings.typography")}
                </TabsTrigger>
                <TabsTrigger value="behavior">
                  <Eye className="h-4 w-4 mr-2" />
                  {t("settings.behavior")}
                </TabsTrigger>
              </TabsList>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-6">
                {/* Color Themes */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.colorTheme")}</CardTitle>
                    <CardDescription>
                      {t("settings.colorThemeDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                      {colorThemes.map((theme) => (
                        <div
                          key={theme.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:scale-105",
                            settings.colorTheme === theme.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setColorTheme(theme.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <div
                              className={cn("h-8 w-full rounded", theme.color)}
                            ></div>
                            <div
                              className={cn("h-2 w-full rounded", theme.accent)}
                            ></div>
                          </div>
                          <p className="mt-2 text-xs font-medium text-center">
                            {theme.name}
                          </p>
                          {settings.colorTheme === theme.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Light Background Themes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Light Background Theme</CardTitle>
                    <CardDescription>
                      Choose the light mode background style
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                      {lightBackgroundThemes.map((theme) => (
                        <div
                          key={theme.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:scale-105",
                            settings.lightBackgroundTheme === theme.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setLightBackgroundTheme(theme.value as any)
                          }
                        >
                          <div
                            className={cn(
                              "h-12 w-full rounded",
                              theme.gradient
                            )}
                          ></div>
                          <p className="mt-2 text-xs font-medium text-center">
                            {theme.name}
                          </p>
                          {settings.lightBackgroundTheme === theme.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Dark Background Themes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dark Background Theme</CardTitle>
                    <CardDescription>
                      Choose the dark mode background style
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                      {darkBackgroundThemes.map((theme) => (
                        <div
                          key={theme.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:scale-105",
                            settings.darkBackgroundTheme === theme.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setDarkBackgroundTheme(theme.value as any)
                          }
                        >
                          <div
                            className={cn(
                              "h-12 w-full rounded",
                              theme.gradient
                            )}
                          ></div>
                          <p className="mt-2 text-xs font-medium text-center text-white">
                            {theme.name}
                          </p>
                          {settings.darkBackgroundTheme === theme.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Shadow Intensity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shadow Intensity</CardTitle>
                    <CardDescription>
                      Adjust the depth and intensity of shadows
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {shadowOptions.map((shadow) => (
                        <div
                          key={shadow.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.shadowIntensity === shadow.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setShadowIntensity(shadow.value as any)
                          }
                        >
                          <div
                            className={cn(
                              "h-12 bg-card rounded-lg",
                              shadow.class
                            )}
                          ></div>
                          <p className="mt-2 text-sm font-medium text-center">
                            {shadow.name}
                          </p>
                          {settings.shadowIntensity === shadow.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Animation Level */}
                <Card>
                  <CardHeader>
                    <CardTitle>Animation Level</CardTitle>
                    <CardDescription>
                      Control the amount of animations and transitions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {animationOptions.map((animation) => (
                        <div
                          key={animation.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.animationLevel === animation.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setAnimationLevel(animation.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{animation.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {animation.description}
                            </p>
                            <div
                              className={cn(
                                "h-2 bg-primary rounded",
                                animation.value === "high" && "animate-pulse",
                                animation.value === "moderate" &&
                                  "transition-all duration-300"
                              )}
                            ></div>
                          </div>
                          {settings.animationLevel === animation.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout" className="space-y-6">
                {/* Layout Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Layout Template</CardTitle>
                    <CardDescription>
                      Choose your preferred layout style
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {layoutTemplates.map((template) => (
                        <div
                          key={template.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.layoutTemplate === template.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setLayoutTemplate(template.value as any)
                          }
                        >
                          <div className="space-y-3">
                            {template.preview}
                            <div>
                              <h4 className="font-semibold">{template.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {template.description}
                              </p>
                            </div>
                          </div>
                          {settings.layoutTemplate === template.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Header Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Header Style</CardTitle>
                    <CardDescription>
                      Choose how the header should appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {headerStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.headerStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setHeaderStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {style.description}
                            </p>
                            <div
                              className={cn(
                                "h-8 bg-muted rounded",
                                style.value === "compact" && "h-6",
                                style.value === "elevated" && "shadow-md",
                                style.value === "transparent" &&
                                  "bg-transparent border border-muted"
                              )}
                            ></div>
                          </div>
                          {settings.headerStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sidebar Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sidebar Style</CardTitle>
                    <CardDescription>
                      Choose how the sidebar should appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {sidebarStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.sidebarStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setSidebarStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {style.description}
                            </p>
                            <div className="flex gap-1">
                              <div
                                className={cn(
                                  "bg-muted rounded h-8",
                                  style.value === "compact" && "w-8",
                                  style.value === "floating" &&
                                    "w-12 shadow-md rounded-lg",
                                  style.value === "minimal" &&
                                    "w-10 bg-transparent border border-muted",
                                  style.value === "default" && "w-12"
                                )}
                              ></div>
                              <div className="flex-1 bg-muted/50 rounded h-8"></div>
                            </div>
                          </div>
                          {settings.sidebarStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Card Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Card Style</CardTitle>
                    <CardDescription>
                      Choose how cards should appear throughout the app
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {cardStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.cardStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setCardStyle(style.value as any)
                          }
                        >
                          <div className="space-y-3">
                            <div
                              className={cn("h-12 rounded p-2", style.class)}
                            >
                              <div className="h-2 bg-current opacity-20 rounded mb-1"></div>
                              <div className="h-2 bg-current opacity-20 rounded w-2/3"></div>
                            </div>
                            <p className="text-sm font-medium text-center">
                              {style.name}
                            </p>
                          </div>
                          {settings.cardStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Components Tab */}
              <TabsContent value="components" className="space-y-6">
                {/* Button Styles - UPDATED WITH MORE OPTIONS */}
                <Card>
                  <CardHeader>
                    <CardTitle>Button Style</CardTitle>
                    <CardDescription>
                      Choose how buttons should appear throughout the app
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {buttonStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer border-2 p-4 transition-all hover:scale-105",
                            style.class,
                            settings.buttonStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setButtonStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <div
                              className={cn(
                                "h-8 bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium",
                                style.class
                              )}
                            >
                              {style.name}
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium">
                                {style.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {style.description}
                              </p>
                            </div>
                          </div>
                          {settings.buttonStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Navigation Style</CardTitle>
                    <CardDescription>
                      Choose how navigation should appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {navigationStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.navigationStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setNavigationStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {style.description}
                            </p>
                            <div className="flex gap-1">
                              {style.value === "pills" && (
                                <>
                                  <div className="h-6 w-12 bg-primary rounded-full"></div>
                                  <div className="h-6 w-12 bg-muted rounded-full"></div>
                                </>
                              )}
                              {style.value === "underline" && (
                                <>
                                  <div className="h-6 w-12 bg-muted border-b-2 border-primary"></div>
                                  <div className="h-6 w-12 bg-muted"></div>
                                </>
                              )}
                              {style.value === "sidebar" && (
                                <>
                                  <div className="h-6 w-2 bg-primary rounded"></div>
                                  <div className="h-6 w-16 bg-muted rounded"></div>
                                </>
                              )}
                              {style.value === "default" && (
                                <>
                                  <div className="h-6 w-12 bg-primary rounded"></div>
                                  <div className="h-6 w-12 bg-muted rounded"></div>
                                </>
                              )}
                            </div>
                          </div>
                          {settings.navigationStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Icon Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Icon Style</CardTitle>
                    <CardDescription>
                      Choose how icons should appear throughout the app
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {iconStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.iconStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setIconStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {style.description}
                            </p>
                            <div className="flex gap-2 justify-center">
                              <Home className="h-6 w-6" />
                              <Users className="h-6 w-6" />
                              <Settings className="h-6 w-6" />
                            </div>
                          </div>
                          {settings.iconStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Input Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Input Style</CardTitle>
                    <CardDescription>
                      Choose how input fields should appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {inputStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.inputStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setInputStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <div
                              className={cn(
                                "h-8 bg-background text-sm flex items-center px-3",
                                style.class
                              )}
                            >
                              Sample input
                            </div>
                          </div>
                          {settings.inputStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Table Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Table Style</CardTitle>
                    <CardDescription>
                      Choose how tables should appear throughout the app
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {tableStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.tableStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setTableStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {style.description}
                            </p>
                            <div className="space-y-1">
                              <div
                                className={cn(
                                  "h-2 bg-muted rounded",
                                  style.value === "striped" && "bg-muted/50",
                                  style.value === "bordered" &&
                                    "border border-border",
                                  style.value === "minimal" &&
                                    "bg-transparent border-b border-border"
                                )}
                              ></div>
                              <div
                                className={cn(
                                  "h-2 bg-muted rounded",
                                  style.value === "striped" && "bg-muted",
                                  style.value === "bordered" &&
                                    "border border-border",
                                  style.value === "minimal" &&
                                    "bg-transparent border-b border-border"
                                )}
                              ></div>
                              <div
                                className={cn(
                                  "h-2 bg-muted rounded",
                                  style.value === "striped" && "bg-muted/50",
                                  style.value === "bordered" &&
                                    "border border-border",
                                  style.value === "minimal" &&
                                    "bg-transparent border-b border-border"
                                )}
                              ></div>
                            </div>
                          </div>
                          {settings.tableStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Badge Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Badge Style</CardTitle>
                    <CardDescription>
                      Choose how badges should appear throughout the app
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {badgeStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.badgeStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setBadgeStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <div className="flex justify-center">
                              <div
                                className={cn(
                                  "bg-primary text-primary-foreground px-2 py-1 text-xs font-medium",
                                  style.class
                                )}
                              >
                                Sample
                              </div>
                            </div>
                          </div>
                          {settings.badgeStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Avatar Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Avatar Style</CardTitle>
                    <CardDescription>
                      Choose how avatars should appear throughout the app
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {avatarStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.avatarStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setAvatarStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <div className="flex justify-center">
                              <div
                                className={cn(
                                  "w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium",
                                  style.class
                                )}
                              >
                                <User className="h-5 w-5" />
                              </div>
                            </div>
                          </div>
                          {settings.avatarStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Typography Tab */}
              <TabsContent value="typography" className="space-y-6">
                {/* Font Sizes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Font Size</CardTitle>
                    <CardDescription>
                      Adjust the base font size for better readability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {fontSizes.map((size) => (
                        <div
                          key={size.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.fontSize === size.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setFontSize(size.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{size.name}</h4>
                            <p
                              className={cn(
                                "text-muted-foreground",
                                size.example
                              )}
                            >
                              Sample text in {size.name.toLowerCase()} size
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {size.description}
                            </p>
                          </div>
                          {settings.fontSize === size.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Border Radius */}
                <Card>
                  <CardHeader>
                    <CardTitle>Border Radius</CardTitle>
                    <CardDescription>
                      Choose how rounded corners should appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {borderRadiusOptions.map((radius) => (
                        <div
                          key={radius.value}
                          className={cn(
                            "relative cursor-pointer border-2 p-4 transition-all hover:scale-105",
                            radius.class,
                            settings.borderRadius === radius.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setBorderRadius(radius.value as any)
                          }
                        >
                          <div
                            className={cn("h-8 bg-muted", radius.class)}
                          ></div>
                          <p className="mt-2 text-sm font-medium text-center">
                            {radius.name}
                          </p>
                          <p className="text-xs text-muted-foreground text-center">
                            {radius.px}
                          </p>
                          {settings.borderRadius === radius.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Spacing */}
                <Card>
                  <CardHeader>
                    <CardTitle>Spacing</CardTitle>
                    <CardDescription>
                      Control the spacing between elements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {spacingOptions.map((spacing) => (
                        <div
                          key={spacing.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 transition-all hover:scale-105",
                            spacing.spacing,
                            settings.spacingSize === spacing.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setSpacingSize(spacing.value as any)
                          }
                        >
                          <div className="bg-muted rounded h-4"></div>
                          <div className="bg-muted rounded h-4"></div>
                          <p className="text-sm font-medium text-center">
                            {spacing.name}
                          </p>
                          {settings.spacingSize === spacing.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Form Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Form Style</CardTitle>
                    <CardDescription>
                      Choose how forms should be laid out
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {formStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.formStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setFormStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {style.description}
                            </p>
                            <div
                              className={cn(
                                "space-y-2",
                                style.value === "compact" && "space-y-1",
                                style.value === "spacious" && "space-y-3",
                                style.value === "inline" &&
                                  "flex space-y-0 space-x-2"
                              )}
                            >
                              <div className="h-2 bg-muted rounded w-1/3"></div>
                              <div className="h-4 bg-muted rounded"></div>
                            </div>
                          </div>
                          {settings.formStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Loading Styles - UPDATED WITH ACTUAL COMPONENTS */}
                <Card>
                  <CardHeader>
                    <CardTitle>Loading Style</CardTitle>
                    <CardDescription>
                      Choose how loading indicators should appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {loadingStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.loadingStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setLoadingStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {style.description}
                            </p>
                            <div className="flex justify-center">
                              {style.component}
                            </div>
                          </div>
                          {settings.loadingStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tooltip Styles - UPDATED WITH ACTUAL TOOLTIPS */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tooltip Style</CardTitle>
                    <CardDescription>
                      Choose how tooltips should appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {tooltipStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.tooltipStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setTooltipStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {style.description}
                            </p>
                            <div className="flex justify-center">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Sample tooltip with{" "}
                                    {style.name.toLowerCase()} style
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          {settings.tooltipStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Modal Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Modal Style</CardTitle>
                    <CardDescription>
                      Choose how modals should appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {modalStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.modalStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setModalStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {style.description}
                            </p>
                            <div className="relative h-12 bg-gray-100 rounded">
                              {style.value === "default" && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-6 bg-white border rounded shadow"></div>
                              )}
                              {style.value === "centered" && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-6 bg-white border rounded shadow"></div>
                              )}
                              {style.value === "fullscreen" && (
                                <div className="absolute inset-1 bg-white border rounded shadow"></div>
                              )}
                              {style.value === "drawer" && (
                                <div className="absolute right-1 top-1 bottom-1 w-6 bg-white border rounded shadow"></div>
                              )}
                            </div>
                          </div>
                          {settings.modalStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Logo Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.logoSettings")}</CardTitle>
                    <CardDescription>
                      {t("settings.logoDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Logo Type */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">{t("settings.logoType")}</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            value: "sparkles",
                            name: "Sparkles",
                            icon: Sparkles,
                          },
                          { value: "shield", name: "Shield", icon: Shield },
                          { value: "image", name: "Image", icon: Image },
                          { value: "custom", name: "Custom Text", icon: Type },
                        ].map((type) => (
                          <div
                            key={type.value}
                            className={cn(
                              "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                              settings.logoType === type.value
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-muted hover:border-muted-foreground/50"
                            )}
                            onClick={() =>
                              settings.setLogoType(type.value as any)
                            }
                          >
                            <div className="space-y-2">
                              <div className="flex justify-center">
                                <type.icon className="h-8 w-8" />
                              </div>
                              <p className="text-sm font-medium text-center">
                                {type.name}
                              </p>
                            </div>
                            {settings.logoType === type.value && (
                              <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Logo Size */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">{t("settings.logoSize")}</Label>
                      <div className="grid grid-cols-5 gap-4">
                        {[
                          { value: "xs", name: "XS", size: "h-4 w-4" },
                          { value: "sm", name: "SM", size: "h-5 w-5" },
                          { value: "md", name: "MD", size: "h-6 w-6" },
                          { value: "lg", name: "LG", size: "h-8 w-8" },
                          { value: "xl", name: "XL", size: "h-10 w-10" },
                        ].map((size) => (
                          <div
                            key={size.value}
                            className={cn(
                              "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                              settings.logoSize === size.value
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-muted hover:border-muted-foreground/50"
                            )}
                            onClick={() =>
                              settings.setLogoSize(size.value as any)
                            }
                          >
                            <div className="space-y-2">
                              <div className="flex justify-center">
                                <Sparkles className={cn(size.size)} />
                              </div>
                              <p className="text-xs font-medium text-center">
                                {size.name}
                              </p>
                            </div>
                            {settings.logoSize === size.value && (
                              <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Logo Animation */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        {t("settings.logoAnimation")}
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            value: "none",
                            name: "None",
                            description: "No animation",
                          },
                          {
                            value: "spin",
                            name: "Spin",
                            description: "Rotating animation",
                          },
                          {
                            value: "pulse",
                            name: "Pulse",
                            description: "Pulsing effect",
                          },
                          {
                            value: "fancy",
                            name: "Fancy",
                            description: "Hover effects",
                          },
                        ].map((animation) => (
                          <div
                            key={animation.value}
                            className={cn(
                              "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                              settings.logoAnimation === animation.value
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-muted hover:border-muted-foreground/50"
                            )}
                            onClick={() =>
                              settings.setLogoAnimation(animation.value as any)
                            }
                          >
                            <div className="space-y-2">
                              <div className="flex justify-center">
                                <Sparkles
                                  className={cn(
                                    "h-6 w-6",
                                    animation.value === "spin" &&
                                      "animate-spin",
                                    animation.value === "pulse" &&
                                      "animate-pulse",
                                    animation.value === "fancy" &&
                                      "hover:scale-110 hover:rotate-12 transition-transform duration-300"
                                  )}
                                />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium">
                                  {animation.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {animation.description}
                                </p>
                              </div>
                            </div>
                            {settings.logoAnimation === animation.value && (
                              <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Logo Text */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">{t("settings.logoText")}</Label>
                      <Input
                        value={settings.logoText}
                        onChange={(e) => settings.setLogoText(e.target.value)}
                        placeholder={t("settings.logoTextPlaceholder")}
                        className="max-w-xs"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("settings.logoTextDesc")}
                      </p>
                    </div>

                    <Separator />

                    {/* Logo Image Path */}
                    {settings.logoType === "image" && (
                      <>
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold">
                            {t("settings.logoImagePath")}
                          </Label>
                          <Input
                            value={settings.logoImagePath}
                            onChange={(e) =>
                              settings.setLogoImagePath(e.target.value)
                            }
                            placeholder="/path/to/your/logo.png"
                            className="max-w-xs"
                          />
                          <p className="text-xs text-muted-foreground">
                            {t("settings.logoImagePathDesc")}
                          </p>
                        </div>
                        <Separator />
                      </>
                    )}

                    {/* Logo Preview */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        {t("settings.logoPreview")}
                      </Label>
                      <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/20">
                        <Logo showText={true} />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {t("settings.logoPreviewDesc")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Behavior Tab */}
              <TabsContent value="behavior" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.uiBehavior")}</CardTitle>
                    <CardDescription>
                      {t("settings.uiBehaviorDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("settings.showBreadcrumbs")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.showBreadcrumbsDesc")}
                          </p>
                        </div>
                        <Switch
                          checked={settings.showBreadcrumbs}
                          onCheckedChange={settings.setShowBreadcrumbs}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("settings.showUserAvatar")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.showUserAvatarDesc")}
                          </p>
                        </div>
                        <Switch
                          checked={settings.showUserAvatar}
                          onCheckedChange={settings.setShowUserAvatar}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("settings.showNotifications")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.showNotificationsDesc")}
                          </p>
                        </div>
                        <Switch
                          checked={settings.showNotifications}
                          onCheckedChange={settings.setShowNotifications}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("settings.showLogo")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.showLogoDesc")}
                          </p>
                        </div>
                        <Switch
                          checked={settings.showLogo}
                          onCheckedChange={settings.setShowLogo}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Reduce spacing throughout the app
                          </p>
                        </div>
                        <Switch
                          checked={settings.compactMode}
                          onCheckedChange={settings.setCompactMode}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>High Contrast</Label>
                          <p className="text-sm text-muted-foreground">
                            Increase contrast for accessibility
                          </p>
                        </div>
                        <Switch
                          checked={settings.highContrast}
                          onCheckedChange={settings.setHighContrast}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Reduced Motion</Label>
                          <p className="text-sm text-muted-foreground">
                            Minimize animations and transitions
                          </p>
                        </div>
                        <Switch
                          checked={settings.reducedMotion}
                          onCheckedChange={settings.setReducedMotion}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sticky Header</Label>
                          <p className="text-sm text-muted-foreground">
                            Keep header fixed at top of page
                          </p>
                        </div>
                        <Switch
                          checked={settings.stickyHeader}
                          onCheckedChange={settings.setStickyHeader}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Collapsible Sidebar</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow sidebar to be collapsed
                          </p>
                        </div>
                        <Switch
                          checked={settings.collapsibleSidebar}
                          onCheckedChange={settings.setCollapsibleSidebar}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Footer</Label>
                          <p className="text-sm text-muted-foreground">
                            Display footer at bottom of pages
                          </p>
                        </div>
                        <Switch
                          checked={settings.showFooter}
                          onCheckedChange={settings.setShowFooter}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto Save</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically save settings changes
                          </p>
                        </div>
                        <Switch
                          checked={settings.autoSave}
                          onCheckedChange={settings.setAutoSave}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>See your changes in real-time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sample Components */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Buttons</Label>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full">
                      Small Button
                    </Button>
                    <Button className="w-full">Default Button</Button>
                    <Button variant="outline" className="w-full">
                      Outline Button
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Secondary
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Badges</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Error</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Avatars</Label>
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">SM</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>LG</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Input</Label>
                  <Input placeholder="Sample input field..." />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Loading Spinner
                  </Label>
                  <div className="flex justify-center py-4">
                    <div className="scale-50">
                      <LoadingSpinner />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Tooltip</Label>
                  <div className="flex justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          Hover me
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This is a sample tooltip</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Table Preview</Label>
                  <div className="text-xs">
                    <GenericTable
                      data={sampleTableData}
                      columns={sampleTableColumns}
                      loading={false}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Card Preview</Label>
                  <Card className="p-3">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-sm">Sample Card</CardTitle>
                      <CardDescription className="text-xs">
                        This shows how cards look
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-xs text-muted-foreground">
                        Card content goes here with current styling applied.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Typography</Label>
                  <div className="space-y-1">
                    <h4 className="font-semibold">Heading Sample</h4>
                    <p className="text-sm text-muted-foreground">
                      This is sample paragraph text showing current font size
                      and spacing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
