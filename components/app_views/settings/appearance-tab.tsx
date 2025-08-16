"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";
import { getAppearanceOptions } from "./options/appearance-options";
import type { SettingsContextType } from "@/providers/settings-provider";

interface AppearanceSettingsTabProps {
  t: (key: string) => string;
  settings: SettingsContextType;
}

export function AppearanceSettingsTab({ t, settings }: AppearanceSettingsTabProps) {
  const {
    colorThemes,
    lightBackgroundThemes,
    darkBackgroundThemes,
    shadowOptions,
    animationOptions,
  } = useMemo(() => getAppearanceOptions(t), [t]);

  return (
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
                onClick={() => settings.setColorTheme(theme.value as any)}
              >
                <div className="space-y-2">
                  <div className={cn("h-8 w-full rounded", theme.color)}></div>
                  <div className={cn("h-2 w-full rounded", theme.accent)}></div>
                </div>
                <p className="mt-2 text-xs font-medium text-center">{theme.name}</p>
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
                onClick={() => settings.setLightBackgroundTheme(theme.value as any)}
              >
                <div className={cn("h-12 w-full rounded", theme.gradient)}></div>
                <p className="mt-2 text-xs font-medium text-center">{theme.name}</p>
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
                onClick={() => settings.setDarkBackgroundTheme(theme.value as any)}
              >
                <div className={cn("h-12 w-full rounded", theme.gradient)}></div>
                <p className="mt-2 text-xs font-medium text-center text-white">{theme.name}</p>
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
                onClick={() => settings.setShadowIntensity(shadow.value as any)}
              >
                <div className={cn("h-12 bg-card rounded-lg", shadow.class)}></div>
                <p className="mt-2 text-sm font-medium text-center">{shadow.name}</p>
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
                onClick={() => settings.setAnimationLevel(animation.value as any)}
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
                      animation.value === "moderate" && "transition-all duration-300"
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
  );
}

export default memo(AppearanceSettingsTab);
