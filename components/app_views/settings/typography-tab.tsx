"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Sparkles, Shield, ImageIcon, Type } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useSettings } from "@/providers/settings-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import { cn } from "@/lib/utils";

export function TypographyTab() {
  const { t } = useI18n();
  const settings = useSettings();
  const { toast: enhancedToast } = useEnhancedToast();

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

  const borderRadiusOptions = [
    { value: "none", name: t("radius.none"), class: "rounded-none", px: "0px" },
    { value: "small", name: t("radius.small"), class: "rounded-sm", px: "2px" },
    { value: "default", name: t("radius.default"), class: "rounded", px: "4px" },
    { value: "large", name: t("radius.large"), class: "rounded-lg", px: "8px" },
    { value: "full", name: t("radius.full"), class: "rounded-full", px: "9999px" },
  ];

  const spacingOptions = [
    {
      value: "compact",
      name: t("settings.spacing.options.compact"),
      spacing: "p-2 gap-1",
    },
    {
      value: "default",
      name: t("settings.spacing.options.default"),
      spacing: "p-4 gap-2",
    },
    {
      value: "comfortable",
      name: t("settings.spacing.options.comfortable"),
      spacing: "p-6 gap-3",
    },
    {
      value: "spacious",
      name: t("settings.spacing.options.spacious"),
      spacing: "p-8 gap-4",
    },
  ];

  return (
    <>
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
                onClick={() => settings.setFontSize(size.value as any)}
              >
                <div className="space-y-2">
                  <h4 className="font-semibold">{size.name}</h4>
                  <p className={cn("text-muted-foreground", size.example)}>
                    {t(`settings.fontSizeSection.sampleTexts.${size.value}`)}
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
                onClick={() => settings.setBorderRadius(radius.value as any)}
              >
                <div className={cn("h-8 bg-muted", radius.class)}></div>
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
                onClick={() => settings.setSpacingSize(spacing.value as any)}
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

      {/* Logo Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.logo.title")}</CardTitle>
          <CardDescription>{t("settings.logo.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Type */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              {t("settings.logo.typeLabel")}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "sparkles", name: t("logoType.sparkles"), icon: Sparkles },
                { value: "shield", name: t("logoType.shield"), icon: Shield },
                { value: "image", name: t("logoType.image"), icon: ImageIcon },
                { value: "custom", name: t("logoType.customText"), icon: Type },
              ].map((type) => (
                <div
                  key={type.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                    settings.logoType === type.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setLogoType(type.value as any)}
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
                { value: "xs", name: t("settings.logo.sizeOptions.xs"), size: "h-4 w-4" },
                { value: "sm", name: t("settings.logo.sizeOptions.sm"), size: "h-5 w-5" },
                { value: "md", name: t("settings.logo.sizeOptions.md"), size: "h-6 w-6" },
                { value: "lg", name: t("settings.logo.sizeOptions.lg"), size: "h-8 w-8" },
                { value: "xl", name: t("settings.logo.sizeOptions.xl"), size: "h-10 w-10" },
              ].map((size) => (
                <div
                  key={size.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                    settings.logoSize === size.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setLogoSize(size.value as any)}
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
              {t("settings.logo.animationLabel")}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  value: "none",
                  name: t("settings.logo.animationOptions.none.name"),
                  description: t(
                    "settings.logo.animationOptions.none.description",
                  ),
                },
                {
                  value: "spin",
                  name: t("settings.logo.animationOptions.spin.name"),
                  description: t(
                    "settings.logo.animationOptions.spin.description",
                  ),
                },
                {
                  value: "pulse",
                  name: t("settings.logo.animationOptions.pulse.name"),
                  description: t(
                    "settings.logo.animationOptions.pulse.description",
                  ),
                },
                {
                  value: "fancy",
                  name: t("settings.logo.animationOptions.fancy.name"),
                  description: t(
                    "settings.logo.animationOptions.fancy.description",
                  ),
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
                  onClick={() => settings.setLogoAnimation(animation.value as any)}
                >
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <Sparkles
                        className={cn(
                          "h-6 w-6",
                          animation.value === "spin" && "animate-spin",
                          animation.value === "pulse" && "animate-pulse",
                          animation.value === "fancy" && "transition-transform hover:rotate-12"
                        )}
                      />
                    </div>
                    <p className="text-sm font-medium text-center">
                      {animation.name}
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                      {animation.description}
                    </p>
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
                  onChange={(e) => settings.setLogoText(e.target.value)}
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
          <CardDescription>{t("settings.toast.description")}</CardDescription>
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
                  name: t("settings.toast.designOptions.minimal.name"),
                  description: t("settings.toast.designOptions.minimal.description"),
                  preview: "border bg-background",
                },
                {
                  value: "modern",
                  name: t("settings.toast.designOptions.modern.name"),
                  description: t("settings.toast.designOptions.modern.description"),
                  preview: "backdrop-blur-sm bg-opacity-90 border",
                },
                {
                  value: "gradient",
                  name: t("settings.toast.designOptions.gradient.name"),
                  description: t("settings.toast.designOptions.gradient.description"),
                  preview: "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0",
                },
                {
                  value: "outlined",
                  name: t("settings.toast.designOptions.outlined.name"),
                  description: t("settings.toast.designOptions.outlined.description"),
                  preview: "border-2 bg-transparent backdrop-blur-sm",
                },
                {
                  value: "filled",
                  name: t("settings.toast.designOptions.filled.name"),
                  description: t("settings.toast.designOptions.filled.description"),
                  preview: "border-0 shadow-xl bg-primary text-primary-foreground",
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
                  onClick={() => settings.setToastDesign?.(design.value as any)}
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
            <div className="space-y-3">
              <Label className="text-sm font-semibold">
                {t("settings.toast.durationLabel")}
              </Label>
              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    value: 1000,
                    name: t("settings.toast.durationOptions.quick.name"),
                    description: t(
                      "settings.toast.durationOptions.quick.description"
                    ),
                  },
                  {
                    value: 3000,
                    name: t("settings.toast.durationOptions.normal.name"),
                    description: t(
                      "settings.toast.durationOptions.normal.description"
                    ),
                  },
                  {
                    value: 5000,
                    name: t("settings.toast.durationOptions.long.name"),
                    description: t(
                      "settings.toast.durationOptions.long.description"
                    ),
                  },
                  {
                    value: 10000,
                    name: t("settings.toast.durationOptions.extended.name"),
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
                    onClick={() => settings.setToastDuration?.(duration.value)}
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
                    title: t("settings.toast.messages.success.title"),
                    description: t("settings.toast.messages.success.description"),
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
                    description: t("settings.toast.messages.error.description"),
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
                    description: t("settings.toast.messages.warning.description"),
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
                    description: t("settings.toast.messages.info.description"),
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

      {/* Switch Styles */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.switchStyle.title")}</CardTitle>
          <CardDescription>{t("settings.switchStyle.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                value: "default",
                name: t("settings.switchStyle.options.default.title"),
                description: t("settings.switchStyle.options.default.description"),
              },
              {
                value: "modern",
                name: t("settings.switchStyle.options.modern.title"),
                description: t("settings.switchStyle.options.modern.description"),
              },
              {
                value: "ios",
                name: t("settings.switchStyle.options.ios.title"),
                description: t("settings.switchStyle.options.ios.description"),
              },
              {
                value: "android",
                name: t("settings.switchStyle.options.android.title"),
                description: t("settings.switchStyle.options.android.description"),
              },
              {
                value: "toggle",
                name: t("settings.switchStyle.options.toggle.title"),
                description: t("settings.switchStyle.options.toggle.description"),
              },
              {
                value: "slider",
                name: t("settings.switchStyle.options.slider.title"),
                description: t("settings.switchStyle.options.slider.description"),
              },
              {
                value: "neon",
                name: t("settings.switchStyle.options.neon.title"),
                description: t("settings.switchStyle.options.neon.description"),
              },
              {
                value: "neumorphism",
                name: t("settings.switchStyle.options.neumorphism.title"),
                description: t("settings.switchStyle.options.neumorphism.description"),
              },
              {
                value: "liquid",
                name: t("settings.switchStyle.options.liquid.title"),
                description: t("settings.switchStyle.options.liquid.description"),
              },
              {
                value: "cyberpunk",
                name: t("settings.switchStyle.options.cyberpunk.title"),
                description: t("settings.switchStyle.options.cyberpunk.description"),
              },
            ].map((style) => (
              <div
                key={style.value}
                className={cn(
                  "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                  settings.switchStyle === style.value
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted hover:border-muted-foreground/50"
                )}
                onClick={() => settings.setSwitchStyle(style.value as any)}
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="font-semibold">{style.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {style.description}
                    </p>
                  </div>

                  {/* Switch Preview */}
                  <div className="flex flex-col items-center space-y-3">
                    {/* ON State Preview */}
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-muted-foreground">
                        {t("settings.switchStyle.labels.off")}
                      </span>
                      <div className="relative">
                        {style.value === "default" && (
                          <div className="w-9 h-5 rounded-full bg-gray-200 dark:bg-gray-800 p-0.5 flex items-center transition-colors">
                            <div className="h-4 w-4 rounded-full bg-white shadow-md transition-transform translate-x-0" />
                          </div>
                        )}
                        {style.value === "modern" && (
                          <div className="w-10 h-5 rounded-full bg-muted p-0.5 flex items-center transition-colors">
                            <div className="h-4 w-4 rounded-full bg-background shadow-sm transition-transform translate-x-0" />
                          </div>
                        )}
                        {style.value === "ios" && (
                          <div className="w-10 h-6 rounded-full bg-gray-300 dark:bg-gray-700 p-0.5 flex items-center transition-all">
                            <div className="h-5 w-5 rounded-full bg-white shadow-md transition-transform translate-x-0" />
                          </div>
                        )}
                        {style.value === "android" && (
                          <div className="w-10 h-4 rounded-sm bg-gray-300 dark:bg-gray-700 flex items-center transition-colors">
                            <div className="h-4 w-4 bg-white shadow-sm transition-transform translate-x-0" />
                          </div>
                        )}
                        {style.value === "toggle" && (
                          <div className="w-10 h-6 rounded-md bg-gray-200 dark:bg-gray-800 p-0.5 flex items-center transition-colors">
                            <div className="h-5 w-5 rounded bg-white shadow-md transition-transform translate-x-0" />
                          </div>
                        )}
                        {style.value === "slider" && (
                          <div className="w-12 h-5 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center">
                            <div className="h-5 w-5 rounded-full bg-white shadow-md transition-transform translate-x-0" />
                          </div>
                        )}
                        {style.value === "neon" && (
                          <div className="w-10 h-5 rounded-full bg-gray-700 p-0.5 flex items-center shadow-inner shadow-purple-500/50">
                            <div className="h-4 w-4 rounded-full bg-gray-900 shadow-[0_0_4px_rgba(168,85,247,0.8)] transition-transform translate-x-0" />
                          </div>
                        )}
                        {style.value === "neumorphism" && (
                          <div className="h-8 w-16 rounded-2xl bg-gray-200 dark:bg-gray-800 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.1)] flex items-center">
                            <div className="h-6 w-6 rounded-xl bg-gray-300 shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.4),-2px_-2px_4px_rgba(255,255,255,0.1)] transform translate-x-0 my-1 mx-1 transition-all" />
                          </div>
                        )}
                        {style.value === "liquid" && (
                          <div className="h-8 w-16 rounded-full bg-gradient-to-r from-gray-200/80 to-gray-300/80 dark:from-gray-700/80 dark:to-gray-600/80 relative overflow-hidden flex items-center">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-pulse" />
                            <div className="absolute top-0 left-0 h-full w-full rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-300 dark:to-gray-400 shadow-2xl transform translate-x-0.5 my-0.5 transition-all duration-500" />
                          </div>
                        )}
                        {style.value === "cyberpunk" && (
                          <div className="h-6 w-14 rounded-sm border-2 border-gray-500/50 bg-gray-900/50 dark:bg-gray-800/50 relative overflow-hidden flex items-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/10 to-transparent pointer-events-none" />
                            <div className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-gray-500/30 to-transparent pointer-events-none" />
                            <div className="h-4 w-4 rounded-sm bg-gray-400 shadow-gray-400/50 transform translate-x-0 my-0.5 mx-0.5 transition-all" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {t("settings.switchStyle.labels.on")}
                      </span>
                    </div>
                  </div>
                </div>
                {settings.switchStyle === style.value && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

