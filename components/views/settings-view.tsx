"use client";

import type React from "react";
import { useState } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettings } from "@/providers/settings-provider";
import { Logo } from "@/components/ui/logo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Palette,
  Layout,
  SettingsIcon,
  ImageIcon,
  Download,
  Upload,
  RotateCcw,
  Eye,
  Sparkles,
  Shield,
  Type,
  Check,
  Home,
  Users,
  Settings,
  User,
  Info,
  Save,
  CalendarDays,
  ChevronRight,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { GenericTable } from "@/components/ui/generic-table";

export function SettingsView() {
  const settings = useSettings();
  const { toast } = useToast();
  const { toast: enhancedToast } = useEnhancedToast();
  const [activeTab, setActiveTab] = useState("appearance");
  const { t } = useI18n();

  const handleExportSettings = () => {
    const settingsJson = settings.exportSettings();
    const blob = new Blob([settingsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = t("settings.exportFileName");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: t("settings.exportSuccess"),
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
              title: t("settings.importSuccess"),
              description: t("settings.importSuccessDesc"),
            });
          } else {
            throw new Error(t("settings.invalidFormat"));
          }
        } catch (error) {
          toast({
            title: t("settings.importFailed"),
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
      title: t("settings.resetSuccess"),
      description: t("settings.resetSuccessDesc"),
    });
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem("dashboard-settings", settings.exportSettings());
      toast({
        title: t("settings.saveSuccess"),
        description: t("settings.saveSuccessDesc"),
      });
    } catch (error) {
      toast({
        title: t("settings.saveFailed"),
        description: t("settings.saveFailedDesc"),
        variant: "destructive",
      });
    }
  };

  // Color theme options with visual previews
  const colorThemes = [
    {
      value: "purple",
      name: t("settings.colors.purple"),
      color: "bg-purple-500",
      accent: "bg-purple-100",
    },
    {
      value: "blue",
      name: t("settings.colors.blue"),
      color: "bg-blue-500",
      accent: "bg-blue-100",
    },
    {
      value: "green",
      name: t("settings.colors.green"),
      color: "bg-green-500",
      accent: "bg-green-100",
    },
    {
      value: "orange",
      name: t("settings.colors.orange"),
      color: "bg-orange-500",
      accent: "bg-orange-100",
    },
    {
      value: "red",
      name: t("settings.colors.red"),
      color: "bg-red-500",
      accent: "bg-red-100",
    },
    {
      value: "teal",
      name: t("settings.colors.teal"),
      color: "bg-teal-500",
      accent: "bg-teal-100",
    },
    {
      value: "pink",
      name: t("settings.colors.pink"),
      color: "bg-pink-500",
      accent: "bg-pink-100",
    },
    {
      value: "indigo",
      name: t("settings.colors.indigo"),
      color: "bg-indigo-500",
      accent: "bg-indigo-100",
    },
    {
      value: "cyan",
      name: t("settings.colors.cyan"),
      color: "bg-cyan-500",
      accent: "bg-cyan-100",
    },
  ];

  // Light background themes
  const lightBackgroundThemes = [
    {
      value: "default",
      name: t("settings.lightBg.default"),
      gradient: "bg-gradient-to-br from-white to-gray-50",
    },
    {
      value: "warm",
      name: t("settings.lightBg.warm"),
      gradient: "bg-gradient-to-br from-orange-50 to-red-50",
    },
    {
      value: "cool",
      name: t("settings.lightBg.cool"),
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
    },
    {
      value: "neutral",
      name: t("settings.lightBg.neutral"),
      gradient: "bg-gradient-to-br from-gray-50 to-slate-50",
    },
    {
      value: "soft",
      name: t("settings.lightBg.soft"),
      gradient: "bg-gradient-to-br from-pink-50 to-purple-50",
    },
    {
      value: "cream",
      name: t("settings.lightBg.cream"),
      gradient: "bg-gradient-to-br from-yellow-50 to-orange-50",
    },
    {
      value: "mint",
      name: t("settings.lightBg.mint"),
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50",
    },
    {
      value: "lavender",
      name: t("settings.lightBg.lavender"),
      gradient: "bg-gradient-to-br from-purple-50 to-indigo-50",
    },
    {
      value: "rose",
      name: t("settings.lightBg.rose"),
      gradient: "bg-gradient-to-br from-rose-50 to-pink-50",
    },
  ];

  // Dark background themes
  const darkBackgroundThemes = [
    {
      value: "default",
      name: t("settings.darkBg.default"),
      gradient: "bg-gradient-to-br from-gray-900 to-gray-800",
    },
    {
      value: "darker",
      name: t("settings.darkBg.darker"),
      gradient: "bg-gradient-to-br from-gray-950 to-gray-900",
    },
    {
      value: "pitch",
      name: t("settings.darkBg.pitch"),
      gradient: "bg-gradient-to-br from-black to-gray-950",
    },
    {
      value: "slate",
      name: t("settings.darkBg.slate"),
      gradient: "bg-gradient-to-br from-slate-900 to-slate-800",
    },
    {
      value: "warm-dark",
      name: t("settings.darkBg.warmDark"),
      gradient: "bg-gradient-to-br from-orange-950 to-red-950",
    },
    {
      value: "forest",
      name: t("settings.darkBg.forest"),
      gradient: "bg-gradient-to-br from-green-950 to-emerald-950",
    },
    {
      value: "ocean",
      name: t("settings.darkBg.ocean"),
      gradient: "bg-gradient-to-br from-blue-950 to-cyan-950",
    },
    {
      value: "purple-dark",
      name: t("settings.darkBg.purpleDark"),
      gradient: "bg-gradient-to-br from-purple-950 to-indigo-950",
    },
    {
      value: "crimson",
      name: t("settings.darkBg.crimson"),
      gradient: "bg-gradient-to-br from-red-950 to-rose-950",
    },
  ];

  // Layout template options with mini previews
  const layoutTemplates = [
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

  // Font size options with visual examples
  const fontSizes = [
    {
      value: "small",
      name: t("fontSize.small"),
      example: "text-sm",
      description: t("fontSize.smallDesc"),
    },
    {
      value: "default",
      name: t("fontSize.default"),
      example: "text-base",
      description: t("fontSize.defaultDesc"),
    },
    {
      value: "large",
      name: t("fontSize.large"),
      example: "text-lg",
      description: t("fontSize.largeDesc"),
    },
  ];

  // Border radius options with visual examples - UPDATED WITH MORE OPTIONS
  const borderRadiusOptions = [
    { value: "none", name: t("radius.none"), class: "rounded-none", px: "0px" },
    { value: "small", name: t("radius.small"), class: "rounded-sm", px: "2px" },
    { value: "default", name: t("radius.default"), class: "rounded", px: "4px" },
    { value: "large", name: t("radius.large"), class: "rounded-lg", px: "8px" },
    { value: "full", name: t("radius.full"), class: "rounded-full", px: "9999px" },
  ];

  // Button style options - UPDATED WITH MORE GRANULAR RADIUS OPTIONS
  const buttonStyles = [
    {
      value: "default",
      name: t("settings.buttonStyle.options.default.name"),
      class: "rounded-md",
      description: t("settings.buttonStyle.options.default.description"),
    },
    {
      value: "small-round",
      name: t("settings.buttonStyle.options.smallRound.name"),
      class: "rounded",
      description: t("settings.buttonStyle.options.smallRound.description"),
    },
    {
      value: "medium-round",
      name: t("settings.buttonStyle.options.mediumRound.name"),
      class: "rounded-lg",
      description: t("settings.buttonStyle.options.mediumRound.description"),
    },
    {
      value: "large-round",
      name: t("settings.buttonStyle.options.largeRound.name"),
      class: "rounded-xl",
      description: t("settings.buttonStyle.options.largeRound.description"),
    },
    {
      value: "extra-round",
      name: t("settings.buttonStyle.options.extraRound.name"),
      class: "rounded-2xl",
      description: t("settings.buttonStyle.options.extraRound.description"),
    },
    {
      value: "super-round",
      name: t("settings.buttonStyle.options.superRound.name"),
      class: "rounded-3xl",
      description: t("settings.buttonStyle.options.superRound.description"),
    },
    {
      value: "rounded",
      name: t("settings.buttonStyle.options.rounded.name"),
      class: "rounded-full",
      description: t("settings.buttonStyle.options.rounded.description"),
    },
    {
      value: "sharp",
      name: t("settings.buttonStyle.options.sharp.name"),
      class: "rounded-none",
      description: t("settings.buttonStyle.options.sharp.description"),
    },
  ];

  // Spacing options with visual examples
  const spacingOptions = [
    { value: "compact", name: t("settings.spacing.options.compact"), spacing: "p-2 gap-1" },
    { value: "default", name: t("settings.spacing.options.default"), spacing: "p-4 gap-2" },
    { value: "comfortable", name: t("settings.spacing.options.comfortable"), spacing: "p-6 gap-3" },
    { value: "spacious", name: t("settings.spacing.options.spacious"), spacing: "p-8 gap-4" },
  ];

  // Shadow intensity options
  const shadowOptions = [
    { value: "none", name: t("settings.shadow.none"), class: "shadow-none" },
    { value: "subtle", name: t("settings.shadow.subtle"), class: "shadow-sm" },
    {
      value: "moderate",
      name: t("settings.shadow.moderate"),
      class: "shadow-md",
    },
    { value: "strong", name: t("settings.shadow.strong"), class: "shadow-lg" },
  ];

  // Animation level options
  const animationOptions = [
    {
      value: "none",
      name: t("settings.animation.none"),
      description: t("settings.animation.noneDesc"),
    },
    {
      value: "minimal",
      name: t("settings.animation.minimal"),
      description: t("settings.animation.minimalDesc"),
    },
    {
      value: "moderate",
      name: t("settings.animation.moderate"),
      description: t("settings.animation.moderateDesc"),
    },
    {
      value: "high",
      name: t("settings.animation.high"),
      description: t("settings.animation.highDesc"),
    },
  ];

  // Card style options
  const cardStyles = [
    { value: "default", name: t("cardStyle.default"), class: "border bg-card" },
    {
      value: "glass",
      name: t("cardStyle.glass"),
      class: "bg-white/10 backdrop-blur border border-white/20",
    },
    { value: "solid", name: t("cardStyle.solid"), class: "bg-gray-100 border-0" },
    { value: "bordered", name: t("cardStyle.bordered"), class: "border-2 bg-card" },
    {
      value: "elevated",
      name: t("settings.cardStyleOptions.elevated"),
      class: "shadow-lg bg-card border-0",
    },
  ];

  // Header style options
  const headerStyles = [
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
  const sidebarStyles = [
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

  // Navigation style options
  const navigationStyles = [
    {
      value: "default",
      name: t("settings.navigationStyle.options.default.name"),
      description: t("settings.navigationStyle.options.default.description"),
    },
    {
      value: "pills",
      name: t("settings.navigationStyle.options.pills.name"),
      description: t("settings.navigationStyle.options.pills.description"),
    },
    {
      value: "underline",
      name: t("settings.navigationStyle.options.underline.name"),
      description: t("settings.navigationStyle.options.underline.description"),
    },
    {
      value: "sidebar",
      name: t("settings.navigationStyle.options.sidebar.name"),
      description: t("settings.navigationStyle.options.sidebar.description"),
    },
  ];

  const treeStyles = [
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
    {
      value: "modern",
      name: t("settings.treeStyle.options.modern.name"),
      description: t("settings.treeStyle.options.modern.description"),
      preview: (
        <div className="p-3 space-y-1">
          <div className="h-6 w-28 bg-gradient-to-r from-background via-background/95 to-background/90 border border-border/50 rounded shadow-sm" />
          <div className="pl-8 space-y-1">
            <div className="h-6 w-24 bg-gradient-to-r from-background via-background/95 to-background/90 border border-border/50 rounded shadow-sm" />
            <div className="h-6 w-20 bg-gradient-to-r from-background via-background/95 to-background/90 border border-border/50 rounded shadow-sm" />
          </div>
        </div>
      ),
    },
    {
      value: "glass",
      name: t("settings.treeStyle.options.glass.name"),
      description: t("settings.treeStyle.options.glass.description"),
      preview: (
        <div className="p-3 space-y-3">
          <div className="h-6 w-28 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg" />
          <div className="pl-6 space-y-3">
            <div className="h-6 w-24 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg" />
            <div className="h-6 w-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg" />
          </div>
        </div>
      ),
    },
    {
      value: "elegant",
      name: t("settings.treeStyle.options.elegant.name"),
      description: t("settings.treeStyle.options.elegant.description"),
      preview: (
        <div className="p-3 space-y-1">
          <div className="h-6 w-28 bg-gradient-to-br from-background via-background/98 to-muted/30 border-l-4 border-l-primary/60 border-y border-r border-border/30 rounded-r-lg shadow-sm" />
          <div className="pl-6 space-y-1">
            <div className="h-6 w-24 bg-gradient-to-br from-background via-background/98 to-muted/30 border-l-4 border-l-primary/60 border-y border-r border-border/30 rounded-r-lg shadow-sm" />
            <div className="h-6 w-20 bg-gradient-to-br from-background via-background/98 to-muted/30 border-l-4 border-l-primary/60 border-y border-r border-border/30 rounded-r-lg shadow-sm" />
          </div>
        </div>
      ),
    },
    {
      value: "professional",
      name: t("settings.treeStyle.options.professional.name"),
      description: t("settings.treeStyle.options.professional.description"),
      preview: (
        <div className="p-3 space-y-1">
          <div className="h-6 w-28 bg-card border border-border border-l-4 border-l-primary/60 rounded-md shadow-sm relative overflow-hidden" />
          <div className="pl-8 space-y-1">
            <div className="h-6 w-24 bg-card border border-border rounded-md shadow-sm" />
            <div className="h-6 w-20 bg-card border border-border rounded-md shadow-sm" />
          </div>
        </div>
      ),
    },
    {
      value: "gradient",
      name: t("settings.treeStyle.options.gradient.name"),
      description: t("settings.treeStyle.options.gradient.description"),
      preview: (
        <div className="p-3 space-y-2">
          <div className="h-6 w-28 bg-gradient-to-r from-primary/20 via-background to-secondary/20 border border-transparent rounded shadow-md" />
          <div className="pl-8 space-y-2">
            <div className="h-6 w-24 bg-gradient-to-r from-primary/10 via-background to-secondary/10 border border-transparent rounded shadow-md" />
            <div className="h-6 w-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10 border border-transparent rounded shadow-md" />
          </div>
        </div>
      ),
    },
    {
      value: "neon",
      name: t("settings.treeStyle.options.neon.name"),
      description: t("settings.treeStyle.options.neon.description"),
      preview: (
        <div className="p-3 space-y-2">
          <div className="h-6 w-28 bg-background/90 border border-primary/50 rounded-lg shadow-lg shadow-primary/20 text-primary font-bold" />
          <div className="pl-8 space-y-2">
            <div className="h-6 w-24 bg-background/90 border border-primary/30 rounded-lg shadow-md shadow-primary/10" />
            <div className="h-6 w-20 bg-background/90 border border-primary/30 rounded-lg shadow-md shadow-primary/10" />
          </div>
        </div>
      ),
    },
    {
      value: "organic",
      name: t("settings.treeStyle.options.organic.name"),
      description: t("settings.treeStyle.options.organic.description"),
      preview: (
        <div className="p-3 space-y-3">
          <div className="h-6 w-28 bg-gradient-to-br from-green-50/50 via-background to-blue-50/50 border border-green-200/30 rounded-2xl shadow-sm transform rotate-1" />
          <div className="pl-10 space-y-3">
            <div className="h-6 w-24 bg-gradient-to-br from-green-50/50 via-background to-blue-50/50 border border-green-200/30 rounded-2xl shadow-sm" />
            <div className="h-6 w-20 bg-gradient-to-br from-green-50/50 via-background to-blue-50/50 border border-green-200/30 rounded-2xl shadow-sm" />
          </div>
        </div>
      ),
    },
    {
      value: "corporate",
      name: t("settings.treeStyle.options.corporate.name"),
      description: t("settings.treeStyle.options.corporate.description"),
      preview: (
        <div className="p-3 space-y-1">
          <div className="h-6 w-28 bg-slate-50/50 border-l-8 border-l-blue-600 border-y border-r border-slate-200 rounded-r-md font-bold text-slate-900" />
          <div className="pl-6 space-y-1">
            <div className="h-6 w-24 bg-slate-50/50 border-l-4 border-l-blue-600 border-y border-r border-slate-200 rounded-r-md text-slate-700" />
            <div className="h-6 w-20 bg-slate-50/50 border-l-4 border-l-blue-600 border-y border-r border-slate-200 rounded-r-md text-slate-700" />
          </div>
        </div>
      ),
    },
  ] as const;

  // Icon style options
  const iconStyles = [
    {
      value: "outline",
      name: t("settings.iconStyle.options.outline.name"),
      description: t("settings.iconStyle.options.outline.description"),
    },
    {
      value: "filled",
      name: t("settings.iconStyle.options.filled.name"),
      description: t("settings.iconStyle.options.filled.description"),
    },
    {
      value: "duotone",
      name: t("settings.iconStyle.options.duotone.name"),
      description: t("settings.iconStyle.options.duotone.description"),
    },
    {
      value: "minimal",
      name: t("settings.iconStyle.options.minimal.name"),
      description: t("settings.iconStyle.options.minimal.description"),
    },
  ];

  // Input style options
  const inputStyles = [
    { value: "default", name: t("settings.inputStyle.options.default"), class: "rounded-md border" },
    { value: "rounded", name: t("settings.inputStyle.options.rounded"), class: "rounded-full border px-4" },
    {
      value: "underlined",
      name: t("settings.inputStyle.options.underlined"),
      class: "rounded-none border-0 border-b-2 px-0",
    },
    { value: "filled", name: t("settings.inputStyle.options.filled"), class: "rounded-lg bg-muted border-0" },
  ];

  // DatePicker style options
  const datePickerStyles = [
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

  // Calendar style options
  const calendarStyles = [
    {
      value: "default",
      name: t("settings.calendarStyle.options.default.name"),
      description: t("settings.calendarStyle.options.default.description"),
    },
    {
      value: "modern",
      name: t("settings.calendarStyle.options.modern.name"),
      description: t("settings.calendarStyle.options.modern.description"),
    },
    {
      value: "glass",
      name: t("settings.calendarStyle.options.glass.name"),
      description: t("settings.calendarStyle.options.glass.description"),
    },
    {
      value: "elegant",
      name: t("settings.calendarStyle.options.elegant.name"),
      description: t("settings.calendarStyle.options.elegant.description"),
    },
    {
      value: "minimal",
      name: t("settings.calendarStyle.options.minimal.name"),
      description: t("settings.calendarStyle.options.minimal.description"),
    },
    {
      value: "dark",
      name: t("settings.calendarStyle.options.dark.name"),
      description: t("settings.calendarStyle.options.dark.description"),
    },
  ];

  // Table style options
  const tableStyles = [
    {
      value: "default",
      name: t("settings.tableStyle.options.default.name"),
      description: t("settings.tableStyle.options.default.description"),
    },
    {
      value: "striped",
      name: t("settings.tableStyle.options.striped.name"),
      description: t("settings.tableStyle.options.striped.description"),
    },
    {
      value: "bordered",
      name: t("settings.tableStyle.options.bordered.name"),
      description: t("settings.tableStyle.options.bordered.description"),
    },
    {
      value: "minimal",
      name: t("settings.tableStyle.options.minimal.name"),
      description: t("settings.tableStyle.options.minimal.description"),
    },
  ];

  // Badge style options
  const badgeStyles = [
    { value: "default", name: t("settings.badgeStyle.options.default"), class: "rounded-full" },
    { value: "rounded", name: t("settings.badgeStyle.options.rounded"), class: "rounded-lg" },
    { value: "square", name: t("settings.badgeStyle.options.square"), class: "rounded-none" },
    { value: "pill", name: t("settings.badgeStyle.options.pill"), class: "rounded-full px-3" },
  ];

  // Avatar style options
  const avatarStyles = [
    { value: "default", name: t("settings.avatarStyle.options.default"), class: "rounded-full" },
    { value: "rounded", name: t("settings.avatarStyle.options.rounded"), class: "rounded-lg" },
    { value: "square", name: t("settings.avatarStyle.options.square"), class: "rounded-none" },
    { value: "hexagon", name: t("settings.avatarStyle.options.hexagon"), class: "rounded-full" },
  ];

  // Select style options
  const selectStyles = [
    {
      value: "default",
      name: t("settings.selectStyle.options.default.name"),
      description: t("settings.selectStyle.options.default.description"),
    },
    {
      value: "modern",
      name: t("settings.selectStyle.options.modern.name"),
      description: t("settings.selectStyle.options.modern.description"),
    },
    {
      value: "glass",
      name: t("settings.selectStyle.options.glass.name"),
      description: t("settings.selectStyle.options.glass.description"),
    },
    {
      value: "outlined",
      name: t("settings.selectStyle.options.outlined.name"),
      description: t("settings.selectStyle.options.outlined.description"),
    },
    {
      value: "filled",
      name: t("settings.selectStyle.options.filled.name"),
      description: t("settings.selectStyle.options.filled.description"),
    },
    {
      value: "minimal",
      name: t("settings.selectStyle.options.minimal.name"),
      description: t("settings.selectStyle.options.minimal.description"),
    },
    {
      value: "elegant",
      name: t("settings.selectStyle.options.elegant.name"),
      description: t("settings.selectStyle.options.elegant.description"),
    },
    {
      value: "professional",
      name: t("settings.selectStyle.options.professional.name"),
      description: t("settings.selectStyle.options.professional.description"),
    },
  ];

  // Form style options
  const formStyles = [
    {
      value: "default",
      name: t("settings.formStyle.options.default.name"),
      description: t("settings.formStyle.options.default.description"),
    },
    {
      value: "compact",
      name: t("settings.formStyle.options.compact.name"),
      description: t("settings.formStyle.options.compact.description"),
    },
    {
      value: "spacious",
      name: t("settings.formStyle.options.spacious.name"),
      description: t("settings.formStyle.options.spacious.description"),
    },
    {
      value: "inline",
      name: t("settings.formStyle.options.inline.name"),
      description: t("settings.formStyle.options.inline.description"),
    },
  ];

  // Loading style options - UPDATED WITH ACTUAL COMPONENTS
  const loadingStyles = [
    {
      value: "spinner",
      name: t("settings.loadingStyle.options.spinner.name"),
      description: t("settings.loadingStyle.options.spinner.description"),
      component: (
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      ),
    },
    {
      value: "dots",
      name: t("settings.loadingStyle.options.dots.name"),
      description: t("settings.loadingStyle.options.dots.description"),
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
      name: t("settings.loadingStyle.options.bars.name"),
      description: t("settings.loadingStyle.options.bars.description"),
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
      name: t("settings.loadingStyle.options.pulse.name"),
      description: t("settings.loadingStyle.options.pulse.description"),
      component: (
        <div className="w-6 h-6 bg-primary rounded animate-pulse"></div>
      ),
    },
  ];

  // Tooltip style options - UPDATED WITH ACTUAL TOOLTIPS
  const tooltipStyles = [
    {
      value: "default",
      name: t("settings.tooltipStyle.options.default.name"),
      description: t("settings.tooltipStyle.options.default.description"),
    },
    {
      value: "rounded",
      name: t("settings.tooltipStyle.options.rounded.name"),
      description: t("settings.tooltipStyle.options.rounded.description"),
    },
    {
      value: "sharp",
      name: t("settings.tooltipStyle.options.sharp.name"),
      description: t("settings.tooltipStyle.options.sharp.description"),
    },
    {
      value: "bubble",
      name: t("settings.tooltipStyle.options.bubble.name"),
      description: t("settings.tooltipStyle.options.bubble.description"),
    },
  ];

  // Modal style options
  const modalStyles = [
    {
      value: "default",
      name: t("settings.modalStyle.options.default.name"),
      description: t("settings.modalStyle.options.default.description"),
    },
    {
      value: "centered",
      name: t("settings.modalStyle.options.centered.name"),
      description: t("settings.modalStyle.options.centered.description"),
    },
    {
      value: "fullscreen",
      name: t("settings.modalStyle.options.fullscreen.name"),
      description: t("settings.modalStyle.options.fullscreen.description"),
    },
    {
      value: "drawer",
      name: t("settings.modalStyle.options.drawer.name"),
      description: t("settings.modalStyle.options.drawer.description"),
    },
  ];

  // Sample data for live preview
  const sampleTableData = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "inactive",
    },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "active" },
  ];

  const sampleTableColumns = [
    { key: "name" as const, label: t("settings.sampleTable.name"), sortable: true },
    { key: "email" as const, label: t("settings.sampleTable.email"), sortable: true },
    {
      key: "status" as const,
      label: t("settings.sampleTable.status"),
      render: (value: string) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {t(`settings.sampleTable.${value}`)}
        </Badge>
      ),
    },
  ];

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("settings.pageTitle")}</h1>
            <p className="text-muted-foreground">
              {t("settings.pageSubtitle")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportSettings}>
              <Download className="h-4 w-4 mr-2" />
              {t("common.export")}
            </Button>
            <Button variant="outline" asChild>
              <label htmlFor="import-settings" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                {t("common.import")}
              </label>
            </Button>
            <input
              id="import-settings"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportSettings}
            />
            <Button
              variant="secondary"
              onClick={handleSaveSettings}
              disabled={settings.autoSave}
            >
              <Save className="h-4 w-4 mr-2" />
              {t("common.save")}
            </Button>
            <Button variant="destructive" onClick={handleResetSettings}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {t("settings.resetAll")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="appearance">
                  <Palette className="h-4 w-4 mr-2" />
                  {t("settings.tabs.appearance")}
                </TabsTrigger>
                <TabsTrigger value="layout">
                  <Layout className="h-4 w-4 mr-2" />
                  {t("settings.tabs.layout")}
                </TabsTrigger>
                <TabsTrigger value="components">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  {t("settings.tabs.components")}
                </TabsTrigger>
                <TabsTrigger value="typography">
                  <Type className="h-4 w-4 mr-2" />
                  {t("settings.tabs.typography")}
                </TabsTrigger>
                <TabsTrigger value="behavior">
                  <Eye className="h-4 w-4 mr-2" />
                  {t("settings.tabs.behavior")}
                </TabsTrigger>
              </TabsList>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-6">
                {/* Color Themes */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.colorTheme.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.colorTheme.description")}
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
                    <CardTitle>{t("settings.lightBackground.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.lightBackground.description")}
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
                    <CardTitle>{t("settings.darkBackground.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.darkBackground.description")}
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
                    <CardTitle>{t("settings.shadowIntensity.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.shadowIntensity.description")}
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
                    <CardTitle>{t("settings.animationLevel.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.animationLevel.description")}
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
                    <CardTitle>{t("settings.layoutTemplate.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.layoutTemplate.description")}
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
                    <CardTitle>{t("settings.headerStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.headerStyle.description")}
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
                    <CardTitle>{t("settings.sidebarStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.sidebarStyle.description")}
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
                    <CardTitle>{t("settings.cardStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.cardStyle.description")}
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
                    <CardTitle>{t("settings.buttonStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.buttonStyle.description")}
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

                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.treeStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.treeStyle.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {treeStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.treeStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setTreeStyle(style.value as any)
                          }
                        >
                          <div className="space-y-2">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {style.description}
                            </p>
                            <div className="bg-muted/30 rounded">
                              {style.preview}
                            </div>
                          </div>
                          {settings.treeStyle === style.value && (
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
                    <CardTitle>{t("settings.navigationStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.navigationStyle.description")}
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

                {/* DatePicker Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.datePickerStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.datePickerStyle.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {datePickerStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.datePickerStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setDatePickerStyle(style.value as any)
                          }
                        >
                          <div className="space-y-3">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {style.description}
                            </p>
                            {/* DatePicker Preview */}
                            <div className="space-y-2">
                              <div
                                className={cn(
                                  "h-10 w-full px-3 flex items-center justify-between text-xs text-muted-foreground",
                                  style.preview
                                )}
                              >
                                <span>DD/MM/YYYY</span>
                                <CalendarDays className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                          {settings.datePickerStyle === style.value && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Calendar Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.calendarStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.calendarStyle.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {calendarStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.calendarStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setCalendarStyle(style.value as any)
                          }
                        >
                          <div className="space-y-3">
                            <h4 className="font-semibold">{style.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {style.description}
                            </p>
                            {/* Calendar Preview */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <CalendarDays className="h-3 w-3" />
                                <span>Jan 2024</span>
                                <ChevronRight className="h-3 w-3" />
                              </div>
                              <div className="grid grid-cols-7 gap-0.5 text-xs">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                  <div key={i} className="h-4 w-4 flex items-center justify-center text-muted-foreground">
                                    {day}
                                  </div>
                                ))}
                                {Array.from({ length: 7 }, (_, i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "h-4 w-4 flex items-center justify-center rounded-sm text-xs",
                                      i === 3 ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                    )}
                                  >
                                    {i + 1}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {settings.calendarStyle === style.value && (
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
                    <CardTitle>{t("settings.iconStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.iconStyle.description")}
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
                    <CardTitle>{t("settings.inputStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.inputStyle.description")}
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
                    <CardTitle>{t("settings.tableStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.tableStyle.description")}
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
                    <CardTitle>{t("settings.badgeStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.badgeStyle.description")}
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
                    <CardTitle>{t("settings.avatarStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.avatarStyle.description")}
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
                    <CardTitle>{t("settings.fontSizeSection.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.fontSizeSection.description")}
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
                    <CardTitle>{t("settings.borderRadius.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.borderRadius.description")}
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
                    <CardTitle>{t("settings.spacing.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.spacing.description")}
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
                    <CardTitle>{t("settings.formStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.formStyle.description")}
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
                    <CardTitle>{t("settings.loadingStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.loadingStyle.description")}
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
                    <CardTitle>{t("settings.tooltipStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.tooltipStyle.description")}
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
                    <CardTitle>{t("settings.modalStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.modalStyle.description")}
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
                    <CardTitle>{t("settings.logo.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.logo.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Logo Type */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        {t("settings.logo.typeLabel")}
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            value: "sparkles",
                            name: t("logoType.sparkles"),
                            icon: Sparkles,
                          },
                          {
                            value: "shield",
                            name: t("logoType.shield"),
                            icon: Shield,
                          },
                          {
                            value: "image",
                            name: t("logoType.image"),
                            icon: ImageIcon,
                          },
                          {
                            value: "custom",
                            name: t("logoType.customText"),
                            icon: Type,
                          },
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
                      <Label className="text-sm font-semibold">
                        {t("settings.logo.sizeLabel")}
                      </Label>
                      <div className="grid grid-cols-5 gap-4">
                        {[
                          {
                            value: "xs",
                            name: t("settings.logo.sizeOptions.xs"),
                            size: "h-4 w-4",
                          },
                          {
                            value: "sm",
                            name: t("settings.logo.sizeOptions.sm"),
                            size: "h-5 w-5",
                          },
                          {
                            value: "md",
                            name: t("settings.logo.sizeOptions.md"),
                            size: "h-6 w-6",
                          },
                          {
                            value: "lg",
                            name: t("settings.logo.sizeOptions.lg"),
                            size: "h-8 w-8",
                          },
                          {
                            value: "xl",
                            name: t("settings.logo.sizeOptions.xl"),
                            size: "h-10 w-10",
                          },
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
                        Logo Animation
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
                    {settings.logoType === "custom" && (
                      <>
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold">
                            {t("settings.logo.textLabel")}
                          </Label>
                          <Input
                            value={settings.logoText}
                            onChange={(e) =>
                              settings.setLogoText(e.target.value)
                            }
                            placeholder={t("settings.logo.textPlaceholder")}
                            className="max-w-xs"
                          />
                          <p className="text-xs text-muted-foreground">
                            {t("settings.logo.textHelp")}
                          </p>
                        </div>
                        <Separator />
                      </>
                    )}

                    {settings.logoType === "image" && (
                      <>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {t("settings.logo.imageInfo")}
                          </p>
                        </div>
                        <Separator />
                      </>
                    )}

                    {/* Logo Preview */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        {t("settings.logo.previewLabel")}
                      </Label>
                      <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/20">
                        <Logo showText={true} />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {t("settings.logo.previewHelp")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Toast Design Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.toast.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.toast.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Toast Design */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        {t("settings.toast.designLabel")}
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                          {
                            value: "minimal",
                            name: t(
                              "settings.toast.designOptions.minimal.name"
                            ),
                            description: t(
                              "settings.toast.designOptions.minimal.description"
                            ),
                            preview: "border bg-background",
                          },
                          {
                            value: "modern",
                            name: t(
                              "settings.toast.designOptions.modern.name"
                            ),
                            description: t(
                              "settings.toast.designOptions.modern.description"
                            ),
                            preview: "backdrop-blur-sm bg-opacity-90 border",
                          },
                          {
                            value: "gradient",
                            name: t(
                              "settings.toast.designOptions.gradient.name"
                            ),
                            description: t(
                              "settings.toast.designOptions.gradient.description"
                            ),
                            preview:
                              "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0",
                          },
                          {
                            value: "outlined",
                            name: t(
                              "settings.toast.designOptions.outlined.name"
                            ),
                            description: t(
                              "settings.toast.designOptions.outlined.description"
                            ),
                            preview: "border-2 bg-transparent backdrop-blur-sm",
                          },
                          {
                            value: "filled",
                            name: t(
                              "settings.toast.designOptions.filled.name"
                            ),
                            description: t(
                              "settings.toast.designOptions.filled.description"
                            ),
                            preview:
                              "border-0 shadow-xl bg-primary text-primary-foreground",
                          },
                        ].map((design) => (
                          <div
                            key={design.value}
                            className={cn(
                              "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                              settings.toastDesign === design.value
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-muted hover:border-muted-foreground/50"
                            )}
                            onClick={() =>
                              settings.setToastDesign?.(design.value as any)
                            }
                          >
                            <div className="space-y-3">
                              <div
                                className={cn(
                                  "h-12 rounded p-2 text-xs flex items-center justify-center",
                                  design.preview
                                )}
                              >
                                {t("settings.toast.preview")}
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium">{design.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {design.description}
                                </p>
                              </div>
                            </div>
                            {settings.toastDesign === design.value && (
                              <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Toast Options */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("settings.toast.showIconsLabel")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.toast.showIconsDesc")}
                          </p>
                        </div>
                        <Switch
                          checked={settings.showToastIcons ?? true}
                          onCheckedChange={settings.setShowToastIcons}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">
                          {t("settings.toast.durationLabel")}
                        </Label>
                        <div className="grid grid-cols-4 gap-4">
                          {[
                            {
                              value: 1000,
                              name: t(
                                "settings.toast.durationOptions.quick.name"
                              ),
                              description: t(
                                "settings.toast.durationOptions.quick.description"
                              ),
                            },
                            {
                              value: 3000,
                              name: t(
                                "settings.toast.durationOptions.normal.name"
                              ),
                              description: t(
                                "settings.toast.durationOptions.normal.description"
                              ),
                            },
                            {
                              value: 5000,
                              name: t(
                                "settings.toast.durationOptions.long.name"
                              ),
                              description: t(
                                "settings.toast.durationOptions.long.description"
                              ),
                            },
                            {
                              value: 10000,
                              name: t(
                                "settings.toast.durationOptions.extended.name"
                              ),
                              description: t(
                                "settings.toast.durationOptions.extended.description"
                              ),
                            },
                          ].map((duration) => (
                            <div
                              key={duration.value}
                              className={cn(
                                "relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:scale-105",
                                settings.toastDuration === duration.value
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-muted hover:border-muted-foreground/50"
                              )}
                              onClick={() =>
                                settings.setToastDuration?.(duration.value)
                              }
                            >
                              <div className="text-center space-y-1">
                                <p className="text-lg font-bold">{duration.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {duration.description}
                                </p>
                              </div>
                              {settings.toastDuration === duration.value && (
                                <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Toast Preview */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        {t("settings.toast.testLabel")}
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            enhancedToast({
                              title: t(
                                "settings.toast.messages.success.title"
                              ),
                              description: t(
                                "settings.toast.messages.success.description"
                              ),
                              variant: "success",
                              design: settings.toastDesign,
                              showIcon: settings.showToastIcons,
                              duration: settings.toastDuration,
                            });
                          }}
                        >
                          {t("settings.toast.testButtons.success")}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            enhancedToast({
                              title: t("settings.toast.messages.error.title"),
                              description: t(
                                "settings.toast.messages.error.description"
                              ),
                              variant: "destructive",
                              design: settings.toastDesign,
                              showIcon: settings.showToastIcons,
                              duration: settings.toastDuration,
                            });
                          }}
                        >
                          {t("settings.toast.testButtons.error")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            enhancedToast({
                              title: t("settings.toast.messages.warning.title"),
                              description: t(
                                "settings.toast.messages.warning.description"
                              ),
                              variant: "warning",
                              design: settings.toastDesign,
                              showIcon: settings.showToastIcons,
                              duration: settings.toastDuration,
                            });
                          }}
                        >
                          {t("settings.toast.testButtons.warning")}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            enhancedToast({
                              title: t("settings.toast.messages.info.title"),
                              description: t(
                                "settings.toast.messages.info.description"
                              ),
                              variant: "info",
                              design: settings.toastDesign,
                              showIcon: settings.showToastIcons,
                              duration: settings.toastDuration,
                            });
                          }}
                        >
                          {t("settings.toast.testButtons.info")}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("settings.toast.testHint")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Select Styles */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.selectStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.selectStyle.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {selectStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                            settings.selectStyle === style.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() =>
                            settings.setSelectStyle(style.value as any)
                          }
                        >
                          <div className="space-y-3">
                            <div className="text-center">
                              <h4 className="font-semibold">{style.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {style.description}
                              </p>
                            </div>
                            
                            {/* Select Preview with Proper Spacing */}
                            <div className="space-y-4 pb-24">
                              {/* Regular Select */}
                              <div className="space-y-2">
                                <div className="text-xs font-medium text-muted-foreground">
                                  {t("settings.selectStyle.regularSelect")}
                                </div>
                                <div className={cn(
                                  "h-8 w-full flex items-center justify-between px-3 text-xs border rounded transition-all",
                                  // Theme-aware styling
                                  style.value === "modern" && "border-2 border-primary/30 rounded-xl bg-background shadow-sm",
                                  style.value === "glass" && "border border-border/30 bg-background/20 backdrop-blur-sm rounded-lg",
                                  style.value === "outlined" && "border-2 border-primary/40 bg-transparent rounded-md",
                                  style.value === "filled" && "border-0 bg-muted/50 rounded-md",
                                  style.value === "minimal" && "border-0 border-b-2 border-primary/40 bg-transparent rounded-none",
                                  style.value === "elegant" && "border border-primary/30 bg-gradient-to-r from-background to-muted/30 rounded-lg shadow-sm",
                                  style.value === "professional" && "border border-border bg-background shadow-sm rounded-md",
                                  style.value === "default" && "border border-input bg-background rounded-md"
                                )}>
                                  <span className="text-muted-foreground rtl:text-right ltr:text-left">
                                    {t("settings.selectStyle.selectPlaceholder")}
                                  </span>
                                  <ChevronRight className={cn(
                                    "h-3 w-3 opacity-50 transition-transform",
                                    "rtl:rotate-180"
                                  )} />
                                </div>
                                
                                {/* Static Dropdown Preview */}
                                <div className={cn(
                                  "border rounded text-xs shadow-lg",
                                  // Theme-aware dropdown styling
                                  style.value === "modern" && "border-primary/30 rounded-xl shadow-xl bg-popover text-popover-foreground",
                                  style.value === "glass" && "border-border/30 bg-popover/90 backdrop-blur-md rounded-lg shadow-xl text-popover-foreground",
                                  style.value === "outlined" && "border-2 border-primary/40 rounded-md shadow-lg bg-popover text-popover-foreground",
                                  style.value === "filled" && "border-0 rounded-md shadow-xl bg-popover text-popover-foreground",
                                  style.value === "minimal" && "border border-border rounded-sm shadow-md bg-popover text-popover-foreground",
                                  style.value === "elegant" && "border border-primary/30 bg-popover rounded-lg shadow-xl text-popover-foreground",
                                  style.value === "professional" && "border border-border rounded-md shadow-lg bg-popover text-popover-foreground",
                                  style.value === "default" && "border border-border bg-popover rounded-md shadow-md text-popover-foreground"
                                )}>
                                  <div className="p-1 space-y-1">
                                    <div className="px-2 py-1 hover:bg-accent rounded text-accent-foreground rtl:text-right ltr:text-left">
                                      {t("settings.selectStyle.option1")}
                                    </div>
                                    <div className="px-2 py-1 hover:bg-accent rounded text-accent-foreground rtl:text-right ltr:text-left">
                                      {t("settings.selectStyle.option2")}
                                    </div>
                                    <div className="px-2 py-1 hover:bg-accent rounded text-accent-foreground rtl:text-right ltr:text-left">
                                      {t("settings.selectStyle.option3")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Searchable Select */}
                              <div className="space-y-2">
                                <div className="text-xs font-medium text-muted-foreground">
                                  {t("settings.selectStyle.searchableSelect")}
                                </div>
                                <div className={cn(
                                  "h-8 w-full flex items-center justify-between px-3 text-xs border rounded transition-all",
                                  // Theme-aware styling with accent colors
                                  style.value === "modern" && "border-2 border-green-500/30 rounded-xl bg-background shadow-sm",
                                  style.value === "glass" && "border border-border/30 bg-background/20 backdrop-blur-sm rounded-lg",
                                  style.value === "outlined" && "border-2 border-green-500/40 bg-transparent rounded-md",
                                  style.value === "filled" && "border-0 bg-green-50 dark:bg-green-950/20 rounded-md",
                                  style.value === "minimal" && "border-0 border-b-2 border-green-500/40 bg-transparent rounded-none",
                                  style.value === "elegant" && "border border-green-500/30 bg-gradient-to-r from-background to-green-50 dark:to-green-950/20 rounded-lg shadow-sm",
                                  style.value === "professional" && "border border-border bg-background shadow-sm rounded-md",
                                  style.value === "default" && "border border-input bg-background rounded-md"
                                )}>
                                  <span className="text-muted-foreground rtl:text-right ltr:text-left">
                                    {t("settings.selectStyle.searchPlaceholder")}
                                  </span>
                                  <div className={cn(
                                    "flex items-center gap-1",
                                    "rtl:flex-row-reverse"
                                  )}>
                                    <Search className="h-3 w-3 opacity-50" />
                                    <ChevronRight className={cn(
                                      "h-3 w-3 opacity-50 transition-transform",
                                      "rtl:rotate-180"
                                    )} />
                                  </div>
                                </div>
                                
                                {/* Static Searchable Dropdown Preview */}
                                <div className={cn(
                                  "border rounded text-xs shadow-lg",
                                  // Theme-aware dropdown styling with accent
                                  style.value === "modern" && "border-green-500/30 rounded-xl shadow-xl bg-popover text-popover-foreground",
                                  style.value === "glass" && "border-border/30 bg-popover/90 backdrop-blur-md rounded-lg shadow-xl text-popover-foreground",
                                  style.value === "outlined" && "border-2 border-green-500/40 rounded-md shadow-lg bg-popover text-popover-foreground",
                                  style.value === "filled" && "border-0 rounded-md shadow-xl bg-popover text-popover-foreground",
                                  style.value === "minimal" && "border border-border rounded-sm shadow-md bg-popover text-popover-foreground",
                                  style.value === "elegant" && "border border-green-500/30 bg-popover rounded-lg shadow-xl text-popover-foreground",
                                  style.value === "professional" && "border border-border rounded-md shadow-lg bg-popover text-popover-foreground",
                                  style.value === "default" && "border border-border bg-popover rounded-md shadow-md text-popover-foreground"
                                )}>
                                  <div className="p-2 border-b border-border">
                                    <div className={cn(
                                      "flex items-center gap-2 px-2 py-1 bg-muted/50 rounded",
                                      "rtl:flex-row-reverse"
                                    )}>
                                      <Search className="h-3 w-3 opacity-50" />
                                      <span className="text-muted-foreground rtl:text-right ltr:text-left">
                                        {t("settings.selectStyle.typeToSearch")}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="p-1 space-y-1">
                                    <div className="px-2 py-1 hover:bg-accent rounded text-accent-foreground rtl:text-right ltr:text-left">
                                      {t("settings.selectStyle.searchResult1")}
                                    </div>
                                    <div className="px-2 py-1 hover:bg-accent rounded text-accent-foreground rtl:text-right ltr:text-left">
                                      {t("settings.selectStyle.searchResult2")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {settings.selectStyle === style.value && (
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

              {/* Behavior Tab */}
              <TabsContent value="behavior" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.behavior.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.behavior.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>
                            {t("settings.behavior.breadcrumbs.label")}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.behavior.breadcrumbs.description")}
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
                          <Label>
                            {t("settings.behavior.userAvatar.label")}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.behavior.userAvatar.description")}
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
                          <Label>
                            {t("settings.behavior.notifications.label")}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.behavior.notifications.description")}
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
                          <Label>
                            {t("settings.behavior.logo.label")}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.behavior.logo.description")}
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
                          <Label>{t("settings.behavior.compact.label")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.behavior.compact.description")}
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
                          <Label>{t("settings.behavior.contrast.label")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.behavior.contrast.description")}
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
                          <Label>{t("settings.behavior.motion.label")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.behavior.motion.description")}
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
                          <Label>{t("settings.behavior.sticky.label")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.behavior.sticky.description")}
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
                          <Label>
                            {t("settings.behavior.sidebar.label")}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.behavior.sidebar.description")}
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
                          <Label>{t("settings.behavior.footer.label")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.behavior.footer.description")}
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
                          <Label>{t("settings.behavior.autoSave.label")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.behavior.autoSave.description")}
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
          <div className="lg:col-span-2">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {t("settings.preview.title")}
                </CardTitle>
                <CardDescription>
                  {t("settings.preview.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sample Components */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("settings.preview.buttons.label")}
                  </Label>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full">
                      {t("settings.preview.buttons.small")}
                    </Button>
                    <Button className="w-full">
                      {t("settings.preview.buttons.default")}
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      {t("settings.preview.buttons.outline")}
                    </Button>
                    <Button variant="secondary" className="w-full">
                      {t("settings.preview.buttons.secondary")}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("settings.preview.badges.label")}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{t("settings.preview.badges.default")}</Badge>
                    <Badge variant="secondary">
                      {t("settings.preview.badges.secondary")}
                    </Badge>
                    <Badge variant="outline">
                      {t("settings.preview.badges.outline")}
                    </Badge>
                    <Badge variant="destructive">
                      {t("settings.preview.badges.error")}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("settings.preview.avatars.label")}
                  </Label>
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {t("settings.preview.avatars.sm")}
                      </AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>
                        {t("settings.preview.avatars.md")}
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {t("settings.preview.avatars.lg")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("settings.preview.input.label")}
                  </Label>
                  <Input placeholder={t("settings.preview.input.placeholder")} />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("settings.preview.loading.label")}
                  </Label>
                  <div className="flex justify-center py-4">
                    <div className="scale-50">
                      <LoadingSpinner />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("settings.preview.tooltip.label")}
                  </Label>
                  <div className="flex justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          {t("settings.preview.tooltip.trigger")}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("settings.preview.tooltip.content")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("settings.preview.table.label")}
                  </Label>
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
                  <Label className="text-sm font-semibold">
                    {t("settings.preview.card.label")}
                  </Label>
                  <Card className="p-3">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-sm">
                        {t("settings.preview.card.title")}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {t("settings.preview.card.description")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-xs text-muted-foreground">
                        {t("settings.preview.card.content")}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("settings.preview.typography.label")}
                  </Label>
                  <div className="space-y-1">
                    <h4 className="font-semibold">
                      {t("settings.preview.typography.heading")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.preview.typography.paragraph")}
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
