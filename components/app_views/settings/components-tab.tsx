"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GenericSelect from "@/components/ui/generic-select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GenericModal } from "@/components/ui/generic-modal";
import { Check, Home, Users, Settings, User, Info, CalendarDays, ChevronRight } from "lucide-react";
import { useSettings } from "@/providers/settings-provider";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";

export function ComponentsTab() {
  const { t } = useI18n();
  const settings = useSettings();
  const [multiSelectDemo, setMultiSelectDemo] = useState<string[]>([]);
  const [styleSelections, setStyleSelections] = useState<Record<string, string | string[]>>({});
  const [testModalOpen, setTestModalOpen] = useState<string | null>(null);
  
  const { setModalStyle } = settings;

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
  // Badge style options
  const badgeStyles = [
    {
      value: "default",
      name: t("settings.badgeStyle.options.default.name"),
      description: t("settings.badgeStyle.options.default.description"),
      class: "rounded-full border border-border bg-background/80 text-foreground"
    },
    {
      value: "modern",
      name: t("settings.badgeStyle.options.modern.name"),
      description: t("settings.badgeStyle.options.modern.description"),
      class: "rounded-lg border border-border/50 bg-muted/50 backdrop-blur-sm text-foreground"
    },
    {
      value: "glass",
      name: t("settings.badgeStyle.options.glass.name"),
      description: t("settings.badgeStyle.options.glass.description"),
      class: "rounded-xl border border-border/30 bg-background/20 backdrop-blur-md text-foreground"
    },
    {
      value: "neon",
      name: t("settings.badgeStyle.options.neon.name"),
      description: t("settings.badgeStyle.options.neon.description"),
      class: "rounded-md border border-primary/40 bg-primary/5 text-primary shadow-lg shadow-primary/20"
    },
    {
      value: "gradient",
      name: t("settings.badgeStyle.options.gradient.name"),
      description: t("settings.badgeStyle.options.gradient.description"),
      class: "rounded-full border-0 bg-gradient-to-r from-primary/70 to-primary/90 text-primary-foreground"
    },
    {
      value: "outlined",
      name: t("settings.badgeStyle.options.outlined.name"),
      description: t("settings.badgeStyle.options.outlined.description"),
      class: "rounded-lg border-2 border-primary/50 bg-transparent text-primary"
    },
    {
      value: "filled",
      name: t("settings.badgeStyle.options.filled.name"),
      description: t("settings.badgeStyle.options.filled.description"),
      class: "rounded-md border-0 bg-primary text-primary-foreground"
    },
    {
      value: "minimal",
      name: t("settings.badgeStyle.options.minimal.name"),
      description: t("settings.badgeStyle.options.minimal.description"),
      class: "rounded-none border-0 bg-transparent text-muted-foreground underline decoration-muted-foreground/50"
    },
    {
      value: "pill",
      name: t("settings.badgeStyle.options.pill.name"),
      description: t("settings.badgeStyle.options.pill.description"),
      class: "rounded-full border border-border bg-muted/30 text-foreground px-3"
    },
    {
      value: "square",
      name: t("settings.badgeStyle.options.square.name"),
      description: t("settings.badgeStyle.options.square.description"),
      class: "rounded-sm border border-border bg-muted/20 text-foreground"
    }
  ];
  const avatarStyles = [
    { value: "default", name: t("settings.avatarStyle.options.default"), class: "rounded-full" },
    { value: "rounded", name: t("settings.avatarStyle.options.rounded"), class: "rounded-lg" },
    { value: "square", name: t("settings.avatarStyle.options.square"), class: "rounded-none" },
    { value: "hexagon", name: t("settings.avatarStyle.options.hexagon"), class: "rounded-full" },
  ];
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
    {
      value: "wave",
      name: t("settings.loadingStyle.options.wave.name"),
      description: t("settings.loadingStyle.options.wave.description"),
      component: (
        <div className="flex space-x-1 items-end">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
          <div className="w-1 h-4 bg-primary rounded-full animate-pulse delay-75"></div>
          <div className="w-1 h-6 bg-primary rounded-full animate-pulse delay-150"></div>
          <div className="w-1 h-4 bg-primary rounded-full animate-pulse delay-225"></div>
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse delay-300"></div>
        </div>
      ),
    },
    {
      value: "orbit",
      name: t("settings.loadingStyle.options.orbit.name"),
      description: t("settings.loadingStyle.options.orbit.description"),
      component: (
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 border border-primary/20 rounded-full"></div>
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 -ml-0.75 -mt-0.75 bg-primary rounded-full animate-spin origin-[0_12px]"></div>
        </div>
      ),
    },
    {
      value: "ripple",
      name: t("settings.loadingStyle.options.ripple.name"),
      description: t("settings.loadingStyle.options.ripple.description"),
      component: (
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 border border-primary rounded-full animate-ping"></div>
          <div className="absolute inset-0 border border-primary rounded-full animate-ping delay-150"></div>
        </div>
      ),
    },
    {
      value: "gradient",
      name: t("settings.loadingStyle.options.gradient.name"),
      description: t("settings.loadingStyle.options.gradient.description"),
      component: (
        <div className="w-6 h-6 bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-full animate-spin"></div>
      ),
    },
    {
      value: "matrix",
      name: t("settings.loadingStyle.options.matrix.name"),
      description: t("settings.loadingStyle.options.matrix.description"),
      component: (
        <div className="grid grid-cols-4 gap-0.5">
          <div className="w-1 h-4 bg-primary animate-pulse opacity-100"></div>
          <div className="w-1 h-5 bg-primary animate-pulse delay-100 opacity-75"></div>
          <div className="w-1 h-3 bg-primary animate-pulse delay-200 opacity-50"></div>
          <div className="w-1 h-4 bg-primary animate-pulse delay-300 opacity-75"></div>
          <div className="w-1 h-3 bg-primary animate-pulse delay-75 opacity-60"></div>
          <div className="w-1 h-5 bg-primary animate-pulse delay-175 opacity-90"></div>
          <div className="w-1 h-4 bg-primary animate-pulse delay-250 opacity-70"></div>
          <div className="w-1 h-3 bg-primary animate-pulse delay-325 opacity-80"></div>
        </div>
      ),
    },
    {
      value: "helix",
      name: t("settings.loadingStyle.options.helix.name"),
      description: t("settings.loadingStyle.options.helix.description"),
      component: (
        <div className="relative w-6 h-6">
          <div className="absolute w-2 h-2 bg-primary rounded-full animate-spin" style={{
            animation: 'spin 1.5s linear infinite, helixMove 3s ease-in-out infinite',
            left: '50%', top: '50%', transform: 'translate(-50%, -50%)'
          }}></div>
          <div className="absolute w-1.5 h-1.5 bg-primary/70 rounded-full animate-spin" style={{
            animation: 'spin 1.5s linear infinite reverse, helixMove 3s ease-in-out infinite reverse',
            left: '50%', top: '50%', transform: 'translate(-50%, -50%)'
          }}></div>
        </div>
      ),
    },
    {
      value: "quantum",
      name: t("settings.loadingStyle.options.quantum.name"),
      description: t("settings.loadingStyle.options.quantum.description"),
      component: (
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 border border-primary/20 rounded-full animate-pulse"></div>
          <div className="absolute inset-1 border border-primary/40 rounded-full animate-pulse delay-200"></div>
          <div className="absolute inset-2 border border-primary/60 rounded-full animate-pulse delay-400"></div>
          <div className="absolute inset-3 bg-primary rounded-full animate-pulse delay-600"></div>
          <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-primary rounded-full animate-ping transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      ),
    },
    {
      value: "morphing",
      name: t("settings.loadingStyle.options.morphing.name"),
      description: t("settings.loadingStyle.options.morphing.description"),
      component: (
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 bg-primary animate-pulse" style={{
            animation: 'morphShape 3s ease-in-out infinite',
            borderRadius: '50%'
          }}></div>
          <div className="absolute inset-1 bg-primary/70 animate-pulse" style={{
            animation: 'morphShape 3s ease-in-out infinite reverse',
            borderRadius: '20%'
          }}></div>
        </div>
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
    {
      value: "glass",
      name: t("settings.tooltipStyle.options.glass.name"),
      description: t("settings.tooltipStyle.options.glass.description"),
    },
    {
      value: "neon",
      name: t("settings.tooltipStyle.options.neon.name"),
      description: t("settings.tooltipStyle.options.neon.description"),
    },
    {
      value: "minimal",
      name: t("settings.tooltipStyle.options.minimal.name"),
      description: t("settings.tooltipStyle.options.minimal.description"),
    },
    {
      value: "elegant",
      name: t("settings.tooltipStyle.options.elegant.name"),
      description: t("settings.tooltipStyle.options.elegant.description"),
    },
  ];
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
    {
      value: "glass",
      name: t("settings.modalStyle.options.glass.name"),
      description: t("settings.modalStyle.options.glass.description"),
    },
    {
      value: "floating",
      name: t("settings.modalStyle.options.floating.name"),
      description: t("settings.modalStyle.options.floating.description"),
    },
    {
      value: "card",
      name: t("settings.modalStyle.options.card.name"),
      description: t("settings.modalStyle.options.card.description"),
    },
    {
      value: "overlay",
      name: t("settings.modalStyle.options.overlay.name"),
      description: t("settings.modalStyle.options.overlay.description"),
    },
  ];
  return (
    <>
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
                                <span>{t("settings.datePickerStyle.previewDate")}</span>
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
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-0.5 h-4 w-4">
                          <div className="bg-primary/60 rounded-[1px]"></div>
                          <div className="bg-primary/60 rounded-[1px]"></div>
                          <div className="bg-primary/60 rounded-[1px]"></div>
                          <div className="bg-primary/40 rounded-[1px]"></div>
                          <div className="bg-primary/40 rounded-[1px]"></div>
                          <div className="bg-primary/40 rounded-[1px]"></div>
                          <div className="bg-primary/30 rounded-[1px]"></div>
                          <div className="bg-primary/30 rounded-[1px]"></div>
                          <div className="bg-primary/30 rounded-[1px]"></div>
                        </div>
                      </div>
                      {t("settings.tableStyle.title")}
                    </CardTitle>
                    <CardDescription>
                      {t("settings.tableStyle.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        {
                          value: "default",
                          name: t("settings.tableStyle.options.default.title"),
                          description: t("settings.tableStyle.options.default.description"),
                        },
                        {
                          value: "striped",
                          name: t("settings.tableStyle.options.striped.title"),
                          description: t("settings.tableStyle.options.striped.description"),
                        },
                        {
                          value: "bordered",
                          name: t("settings.tableStyle.options.bordered.title"),
                          description: t("settings.tableStyle.options.bordered.description"),
                        },
                        {
                          value: "minimal",
                          name: t("settings.tableStyle.options.minimal.title"),
                          description: t("settings.tableStyle.options.minimal.description"),
                        },
                        {
                          value: "glass",
                          name: t("settings.tableStyle.options.glass.title"),
                          description: t("settings.tableStyle.options.glass.description"),
                        },
                        {
                          value: "neon",
                          name: t("settings.tableStyle.options.neon.title"),
                          description: t("settings.tableStyle.options.neon.description"),
                        },
                        {
                          value: "gradient",
                          name: t("settings.tableStyle.options.gradient.title"),
                          description: t("settings.tableStyle.options.gradient.description"),
                        },
                        {
                          value: "neumorphism",
                          name: t("settings.tableStyle.options.neumorphism.title"),
                          description: t("settings.tableStyle.options.neumorphism.description"),
                        },
                        {
                          value: "cyberpunk",
                          name: t("settings.tableStyle.options.cyberpunk.title"),
                          description: t("settings.tableStyle.options.cyberpunk.description"),
                        },
                        {
                          value: "luxury",
                          name: t("settings.tableStyle.options.luxury.title"),
                          description: t("settings.tableStyle.options.luxury.description"),
                        },
                        {
                          value: "matrix",
                          name: t("settings.tableStyle.options.matrix.title"),
                          description: t("settings.tableStyle.options.matrix.description"),
                        },
                        {
                          value: "diamond",
                          name: t("settings.tableStyle.options.diamond.title"),
                          description: t("settings.tableStyle.options.diamond.description"),
                        },
                      ].map((style) => (
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
                          <div className="space-y-4">
                            <div className="text-center">
                              <h4 className="font-semibold">{style.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {style.description}
                              </p>
                            </div>

                            {/* Table Preview */}
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-full max-w-[200px] text-xs">
                                {/* Table Container Preview */}
                                <div className={cn(
                                  "overflow-hidden transition-all duration-300",
                                  style.value === "default" && "rounded-lg border bg-card shadow-sm",
                                  style.value === "striped" && "rounded-lg border bg-card",
                                  style.value === "bordered" && "rounded-lg border-2 border-border bg-card",
                                  style.value === "minimal" && "rounded-none border-0 bg-transparent",
                                  style.value === "glass" && "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl dark:bg-black/20 dark:border-white/10",
                                  style.value === "neon" && "rounded-xl border-2 border-primary/30 bg-black/90 shadow-[0_0_15px_rgba(var(--primary),0.3)] dark:bg-black/95",
                                  style.value === "gradient" && "rounded-2xl border-0 bg-gradient-to-br from-primary/20 via-background to-primary/10 shadow-2xl",
                                  style.value === "neumorphism" && "rounded-3xl border-0 bg-background shadow-[10px_10px_20px_rgba(0,0,0,0.1),-10px_-10px_20px_rgba(255,255,255,0.1)] dark:shadow-[10px_10px_20px_rgba(0,0,0,0.3),-10px_-10px_20px_rgba(255,255,255,0.05)]",
                                  style.value === "cyberpunk" && "rounded-none border-2 border-primary bg-black/95 shadow-[0_0_25px_rgba(var(--primary),0.4)]",
                                  style.value === "luxury" && "rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-50/50 to-amber-100/30 shadow-2xl dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-400/20",
                                  style.value === "matrix" && "rounded-none border-2 border-primary/30 bg-black/95 shadow-[0_0_30px_hsl(var(--primary)/0.4)] dark:bg-black/98 dark:border-primary/40",
                                  style.value === "diamond" && "rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/15 shadow-[0_0_40px_hsl(var(--primary)/0.3)] dark:from-primary/20 dark:via-primary/10 dark:to-primary/25 dark:border-primary/30"
                                )}>
                                  {/* Table Header */}
                                  <div className={cn(
                                    "font-semibold text-foreground transition-all duration-300 h-8 flex items-center px-2",
                                    style.value === "default" && "bg-muted/50 border-b",
                                    style.value === "striped" && "bg-muted/70 border-b-2",
                                    style.value === "bordered" && "bg-muted/50 border-b-2",
                                    style.value === "minimal" && "bg-transparent border-b",
                                    style.value === "glass" && "bg-white/20 border-b border-white/30 backdrop-blur-md text-foreground font-bold dark:bg-black/30 dark:border-white/20",
                                    style.value === "neon" && "bg-black/90 border-b-2 border-primary/50 text-primary font-bold shadow-[0_0_10px_rgba(var(--primary),0.3)] dark:bg-black/95",
                                    style.value === "gradient" && "bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 border-b border-primary/30 text-foreground font-bold shadow-lg",
                                    style.value === "neumorphism" && "bg-background border-b-0 font-bold shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.1)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.05)]",
                                    style.value === "cyberpunk" && "bg-black/95 border-b-2 border-primary text-primary font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(var(--primary),0.4)]",
                                    style.value === "luxury" && "bg-gradient-to-r from-amber-100/50 via-amber-50/30 to-amber-100/50 border-b border-amber-300/40 dark:from-amber-900/30 dark:via-amber-800/20 dark:to-amber-900/30 dark:border-amber-400/30 text-amber-900 dark:text-amber-100 font-bold shadow-lg shadow-amber-200/20",
                                    style.value === "matrix" && "bg-black/95 border-b-2 border-primary/60 text-primary font-bold uppercase tracking-widest shadow-[0_0_15px_hsl(var(--primary)/0.4)] font-mono dark:bg-black/98 dark:border-primary/70 dark:text-primary",
                                    style.value === "diamond" && "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/25 border-b-2 border-primary/50 text-primary font-bold shadow-lg shadow-primary/30 dark:from-primary/25 dark:via-primary/15 dark:to-primary/30 dark:border-primary/40"
                                  )}>
                                    <span className="text-[10px]">Name</span>
                                    <span className="ml-auto text-[10px]">Status</span>
                                  </div>

                                  {/* Table Rows */}
                                  {[0, 1, 2].map((index) => (
                                    <div key={index} className={cn(
                                      "transition-all duration-300 border-b h-6 flex items-center px-2",
                                      style.value === "default" && "hover:bg-muted/30 bg-card",
                                      style.value === "striped" && (index % 2 === 0 ? "bg-muted/30 hover:bg-muted/50" : "bg-card hover:bg-muted/30"),
                                      style.value === "bordered" && "border-b-2 hover:bg-muted/30 bg-card",
                                      style.value === "minimal" && "border-b-0 hover:bg-muted/20 bg-transparent",
                                      style.value === "glass" && cn(
                                        "border-b border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm dark:border-white/5 dark:bg-black/10 dark:hover:bg-black/20",
                                        index % 2 === 0 && "bg-white/10 dark:bg-black/20"
                                      ),
                                      style.value === "neon" && cn(
                                        "border-b border-primary/20 bg-black/50 hover:bg-primary/10 dark:bg-black/70 dark:hover:bg-primary/5",
                                        index % 2 === 0 && "bg-primary/5 dark:bg-primary/5"
                                      ),
                                      style.value === "gradient" && cn(
                                        "border-b border-primary/10 bg-gradient-to-r from-transparent via-primary/5 to-transparent hover:from-primary/10 hover:via-primary/15 hover:to-primary/10",
                                        index % 2 === 0 && "from-primary/5 via-primary/10 to-primary/5"
                                      ),
                                      style.value === "neumorphism" && cn(
                                        "border-b-0 bg-background",
                                        index % 2 === 0 && "shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.05)]"
                                      ),
                                      style.value === "luxury" && cn(
                                        "border-b border-amber-200/20 bg-gradient-to-r from-amber-50/20 to-transparent dark:border-amber-400/20 dark:from-amber-900/10",
                                        index % 2 === 0 && "from-amber-100/30 to-amber-50/10 dark:from-amber-900/20 dark:to-amber-800/10"
                                      ),
                                      style.value === "matrix" && cn(
                                        "border-b border-primary/30 bg-black/90 text-primary font-mono dark:bg-black/95",
                                        index % 2 === 0 && "bg-primary/5 border-primary/20"
                                      ),
                                      style.value === "diamond" && cn(
                                        "border-b border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/15 text-primary dark:from-primary/10 dark:via-primary/5 dark:to-primary/15 dark:text-primary dark:border-primary/20",
                                        index % 2 === 0 && "from-primary/15 via-primary/10 to-primary/20 dark:from-primary/15 dark:via-primary/10 dark:to-primary/20"
                                      )
                                    )}>
                                      <span className="text-[9px]">Item {index + 1}</span>
                                      <div className={cn(
                                        "ml-auto w-2 h-2 rounded-full",
                                        index === 0 ? "bg-green-500" : index === 1 ? "bg-yellow-500" : "bg-red-500"
                                      )} />
                                    </div>
                                  ))}
                                </div>
                              </div>
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

                {/* Loading Styles */}
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

                {/* Tooltip Styles */}
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
                                    Sample tooltip with {""}
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

                {/* Multi-Select Component Showcase */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('components.multiSelect.title')}</CardTitle>
                    <CardDescription>
                      {t('components.multiSelect.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Current Style Demo */}
                      <div className="space-y-3">
                        <h4 className="font-medium">{t('components.multiSelect.currentStyle')}: {settings.selectStyle}</h4>
                        <div className="max-w-md">
                          <GenericSelect
                            type="multi"
                            options={[
                              { value: "react", label: t('components.multiSelect.categories.webTech.react') },
                              { value: "vue", label: t('components.multiSelect.categories.webTech.vue') },
                              { value: "angular", label: t('components.multiSelect.categories.webTech.angular') },
                              { value: "svelte", label: t('components.multiSelect.categories.webTech.svelte') },
                              { value: "nextjs", label: t('components.multiSelect.categories.webTech.nextjs') },
                              { value: "typescript", label: t('components.multiSelect.categories.webTech.typescript') }
                            ]}
                            value={multiSelectDemo}
                            onValueChange={(value: string | string[]) => setMultiSelectDemo(Array.isArray(value) ? value : [value])}
                          // All text will be localized automatically by the component
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Selected: {multiSelectDemo.length > 0 ? multiSelectDemo.join(", ") : "None"}
                        </p>
                      </div>

                      {/* Style Variations Grid */}
                      <div className="space-y-3">
                        <h4 className="font-medium">{t('components.multiSelect.availableStyles')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            {
                              style: "default",
                              label: t('settings.selectStyle.options.default'),
                              options: [
                                { value: "html", label: t('components.multiSelect.categories.webTech.html') },
                                { value: "css", label: t('components.multiSelect.categories.webTech.css') },
                                { value: "javascript", label: t('components.multiSelect.categories.webTech.javascript') }
                              ]
                            },
                            {
                              style: "modern",
                              label: t('settings.selectStyle.options.modern'),
                              options: [
                                { value: "react", label: t('components.multiSelect.categories.webTech.react') },
                                { value: "vue", label: t('components.multiSelect.categories.webTech.vue') },
                                { value: "angular", label: t('components.multiSelect.categories.webTech.angular') }
                              ]
                            },
                            {
                              style: "glass",
                              label: t('settings.selectStyle.options.glass'),
                              options: [
                                { value: "figma", label: t('components.multiSelect.categories.design.figma') },
                                { value: "sketch", label: t('components.multiSelect.categories.design.sketch') },
                                { value: "adobe", label: t('components.multiSelect.categories.design.adobe') }
                              ]
                            },
                            {
                              style: "outlined",
                              label: t('settings.selectStyle.options.outlined'),
                              options: [
                                { value: "nodejs", label: t('components.multiSelect.categories.backend.nodejs') },
                                { value: "python", label: t('components.multiSelect.categories.backend.python') },
                                { value: "java", label: t('components.multiSelect.categories.backend.java') }
                              ]
                            },
                            {
                              style: "filled",
                              label: t('settings.selectStyle.options.filled'),
                              options: [
                                { value: "mysql", label: t('components.multiSelect.categories.database.mysql') },
                                { value: "postgres", label: t('components.multiSelect.categories.database.postgres') },
                                { value: "mongodb", label: t('components.multiSelect.categories.database.mongodb') }
                              ]
                            },
                            {
                              style: "minimal",
                              label: t('settings.selectStyle.options.minimal'),
                              options: [
                                { value: "git", label: t('components.multiSelect.categories.devops.git') },
                                { value: "github", label: t('components.multiSelect.categories.devops.github') },
                                { value: "gitlab", label: t('components.multiSelect.categories.devops.gitlab') }
                              ]
                            },
                            {
                              style: "elegant",
                              label: t('settings.selectStyle.options.elegant'),
                              options: [
                                { value: "aws", label: t('components.multiSelect.categories.cloud.aws') },
                                { value: "azure", label: t('components.multiSelect.categories.cloud.azure') },
                                { value: "gcp", label: t('components.multiSelect.categories.cloud.gcp') }
                              ]
                            },
                            {
                              style: "professional",
                              label: t('settings.selectStyle.options.professional'),
                              options: [
                                { value: "docker", label: t('components.multiSelect.categories.devops.docker') },
                                { value: "kubernetes", label: t('components.multiSelect.categories.devops.kubernetes') },
                                { value: "jenkins", label: t('components.multiSelect.categories.devops.jenkins') }
                              ]
                            },
                            {
                              style: "neon",
                              label: t('settings.selectStyle.options.neon'),
                              options: [
                                { value: "cybersecurity", label: t('components.multiSelect.categories.security.cybersecurity') },
                                { value: "ethicalHacking", label: t('components.multiSelect.categories.security.ethicalHacking') },
                                { value: "penetrationTesting", label: t('components.multiSelect.categories.security.penetrationTesting') }
                              ]
                            },
                            {
                              style: "gradient",
                              label: t('settings.selectStyle.options.gradient'),
                              options: [
                                { value: "uiDesign", label: t('components.multiSelect.categories.ux.uiDesign') },
                                { value: "uxResearch", label: t('components.multiSelect.categories.ux.uxResearch') },
                                { value: "userTesting", label: t('components.multiSelect.categories.ux.userTesting') }
                              ]
                            },
                            {
                              style: "neumorphism",
                              label: t('settings.selectStyle.options.neumorphism'),
                              options: [
                                { value: "ios", label: t('components.multiSelect.categories.mobile.ios') },
                                { value: "android", label: t('components.multiSelect.categories.mobile.android') },
                                { value: "reactNative", label: t('components.multiSelect.categories.mobile.reactNative') }
                              ]
                            },
                            {
                              style: "cyberpunk",
                              label: t('settings.selectStyle.options.cyberpunk'),
                              options: [
                                { value: "blockchain", label: t('components.multiSelect.categories.security.blockchain') },
                                { value: "crypto", label: t('components.multiSelect.categories.security.crypto') },
                                { value: "machineLearning", label: t('components.multiSelect.categories.ai.machineLearning') }
                              ]
                            },
                            {
                              style: "luxury",
                              label: t('settings.selectStyle.options.luxury'),
                              options: [
                                { value: "premium", label: t('components.multiSelect.categories.business.premium') },
                                { value: "enterprise", label: t('components.multiSelect.categories.business.enterprise') },
                                { value: "consulting", label: t('components.multiSelect.categories.business.consulting') }
                              ]
                            },
                            {
                              style: "quantum",
                              label: t('settings.selectStyle.options.quantum'),
                              options: [
                                { value: "quantumComputing", label: t('components.multiSelect.categories.ai.quantumComputing') },
                                { value: "neuralNetworks", label: t('components.multiSelect.categories.ai.neuralNetworks') },
                                { value: "deepLearning", label: t('components.multiSelect.categories.ai.deepLearning') }
                              ]
                            },
                            {
                              style: "nebula",
                              label: t('settings.selectStyle.options.nebula'),
                              options: [
                                { value: "spaceExploration", label: t('components.multiSelect.categories.science.spaceExploration') },
                                { value: "astronomy", label: t('components.multiSelect.categories.science.astronomy') },
                                { value: "astrophysics", label: t('components.multiSelect.categories.science.astrophysics') }
                              ]
                            },
                            {
                              style: "prism",
                              label: t('settings.selectStyle.options.prism'),
                              options: [
                                { value: "optics", label: t('components.multiSelect.categories.science.optics') },
                                { value: "photography", label: t('components.multiSelect.categories.creative.photography') },
                                { value: "visualEffects", label: t('components.multiSelect.categories.creative.visualEffects') }
                              ]
                            },
                            {
                              style: "stellar",
                              label: t('settings.selectStyle.options.stellar'),
                              options: [
                                { value: "solarEnergy", label: t('components.multiSelect.categories.energy.solarEnergy') },
                                { value: "renewableEnergy", label: t('components.multiSelect.categories.energy.renewableEnergy') },
                                { value: "sustainability", label: t('components.multiSelect.categories.energy.sustainability') }
                              ]
                            },
                            {
                              style: "vortex",
                              label: t('settings.selectStyle.options.vortex'),
                              options: [
                                { value: "fluidDynamics", label: t('components.multiSelect.categories.physics.fluidDynamics') },
                                { value: "aerodynamics", label: t('components.multiSelect.categories.physics.aerodynamics') },
                                { value: "turbulence", label: t('components.multiSelect.categories.physics.turbulence') }
                              ]
                            },
                            {
                              style: "phoenix",
                              label: t('settings.selectStyle.options.phoenix'),
                              options: [
                                { value: "gameDesign", label: t('components.multiSelect.categories.gaming.gameDesign') },
                                { value: "animation", label: t('components.multiSelect.categories.creative.animation') },
                                { value: "digitalArt", label: t('components.multiSelect.categories.creative.digitalArt') }
                              ]
                            }
                          ].map(({ style, label, options }) => (
                            <div key={style} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-medium">{label}</h5>
                                <button
                                  onClick={() => settings.setSelectStyle(style as any)}
                                  className={cn(
                                    "px-2 py-1 text-xs rounded transition-colors",
                                    settings.selectStyle === style
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted hover:bg-muted-foreground/20"
                                  )}
                                >
                                  {settings.selectStyle === style ? t('components.multiSelect.buttons.active') : t('components.multiSelect.buttons.apply')}
                                </button>
                              </div>
                              {/* Unified Select Preview - All Three Types */}
                              <div className="space-y-3">
                                {/* Single Select */}
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-muted-foreground">
                                    {t('components.unifiedSelect.types.single')}
                                  </label>
                                  <GenericSelect
                                    type="single"
                                    design={style as any}
                                    options={options.slice(0, 3)}
                                    value={styleSelections[`${style}-single`] || options[0]?.value || ""}
                                    onValueChange={(newValue: string | string[]) => setStyleSelections(prev => ({
                                      ...prev,
                                      [`${style}-single`]: typeof newValue === 'string' ? newValue : newValue[0]
                                    }))}
                                    placeholder={`${style} Single Select`}
                                  />
                                </div>

                                {/* Searchable Select */}
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-muted-foreground">
                                    {t('components.unifiedSelect.types.searchable')}
                                  </label>
                                  <GenericSelect
                                    type="searchable"
                                    design={style as any}
                                    options={options}
                                    value={styleSelections[`${style}-search`] || ""}
                                    onValueChange={(newValue: string | string[]) => setStyleSelections(prev => ({
                                      ...prev,
                                      [`${style}-search`]: typeof newValue === 'string' ? newValue : newValue[0]
                                    }))}
                                    placeholder={`Search ${style} options...`}
                                    searchPlaceholder="Type to search..."
                                  />
                                </div>

                                {/* Multi Select */}
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-muted-foreground">
                                    {t('components.unifiedSelect.types.multi')}
                                  </label>
                                  <GenericSelect
                                    type="multi"
                                    design={style as any}
                                    options={options}
                                    value={styleSelections[`${style}-multi`] || [options[0]?.value].filter(Boolean)}
                                    onValueChange={(newValue: string | string[]) => setStyleSelections(prev => ({
                                      ...prev,
                                      [`${style}-multi`]: Array.isArray(newValue) ? newValue : [newValue]
                                    }))}
                                    placeholder={`Multi-select ${style} items...`}
                                    searchPlaceholder="Search and select multiple..."
                                    maxSelectedDisplay={2}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Server-Side Search Demo */}
                      <div className="space-y-3">
                        <h4 className="font-medium">{t('components.multiSelect.serverSearchDemo')}</h4>
                        <div className="max-w-md">
                          <GenericSelect
                            type="multi"
                            searchType="server"
                            options={[]}
                            value={[]}
                            onValueChange={(value: string | string[]) => { }}
                            onServerSearch={async (query: string) => {
                              // Simulate server search
                              await new Promise(resolve => setTimeout(resolve, 500))
                              const mockResults = [
                                {
                                  value: `${query}-1`,
                                  label: `${query} ${t('components.multiSelect.serverSearchResult', { index: 1 })}`
                                },
                                {
                                  value: `${query}-2`,
                                  label: `${query} ${t('components.multiSelect.serverSearchResult', { index: 2 })}`
                                },
                                {
                                  value: `${query}-3`,
                                  label: `${query} ${t('components.multiSelect.serverSearchResult', { index: 3 })}`
                                },
                                {
                                  value: `${query}-api`,
                                  label: `${query} ${t('components.multiSelect.serverSearchApi')}`
                                },
                                {
                                  value: `${query}-sdk`,
                                  label: `${query} ${t('components.multiSelect.serverSearchSdk')}`
                                }
                              ]
                              return mockResults.slice(0, Math.floor(Math.random() * 5) + 1)
                            }}
                            placeholder={t('components.multiSelect.serverSearchPlaceholder')}
                            searchPlaceholder={t('components.multiSelect.serverSearchSearchPlaceholder')}
                            searchingText={t('components.multiSelect.serverSearchSearchingText')}
                            noResultsText={t('components.multiSelect.serverSearchNoResultsText')}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t('components.multiSelect.serverSearchDescription')}
                        </p>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          <strong>{t('components.multiSelect.features')}:</strong> {t('components.multiSelect.featuresDescription')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Modal Style Testing */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.modalStyle.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.modalStyle.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {modalStyles.map((style) => (
                        <div key={style.value} className="space-y-2">
                          <Button
                            variant={settings.modalStyle === style.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setModalStyle(style.value as any)}
                            className="w-full"
                          >
                            {style.name}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setTestModalOpen(style.value)}
                            className="w-full text-xs"
                          >
                            Test {style.name}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Click "Test" buttons to preview each modal style with sample content
                    </div>
                  </CardContent>
                </Card>

                {/* Test Modal for Preview */}
                <GenericModal
                  open={testModalOpen !== null}
                  onOpenChange={(open) => !open && setTestModalOpen(null)}
                  title={`${testModalOpen} Modal Style Preview`}
                >
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      This is a preview of the <strong>{testModalOpen}</strong> modal style.
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Sample Content</h4>
                        <p className="text-sm text-muted-foreground">
                          This modal demonstrates the visual appearance and behavior of the {testModalOpen} style.
                          Notice the unique styling, positioning, and visual effects.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setTestModalOpen(null)}>
                          Close Preview
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            if (testModalOpen) {
                              setModalStyle(testModalOpen as any);
                              setTestModalOpen(null);
                            }
                          }}
                        >
                          Apply This Style
                        </Button>
                      </div>
                    </div>
                  </div>
                </GenericModal>
    </>
  );
}
