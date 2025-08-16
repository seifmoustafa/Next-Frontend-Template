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
import { getTypographyOptions } from "./options/typography-options";
import type { SettingsContextType } from "@/providers/settings-provider";

interface TypographySettingsTabProps {
  t: (key: string) => string;
  settings: SettingsContextType;
}

export function TypographySettingsTab({ t, settings }: TypographySettingsTabProps) {
  const {
    fontSizes,
    borderRadiusOptions,
    spacingOptions,
  } = useMemo(() => getTypographyOptions(t), [t]);

  return (
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
                onClick={() => settings.setFontSize(size.value as any)}
              >
                <div className="space-y-2">
                  <h4 className="font-semibold">{size.name}</h4>
                  <p className={cn("text-muted-foreground", size.example)}>
                    Sample text
                  </p>
                  <p className="text-xs text-muted-foreground">{size.description}</p>
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
                <p className="text-sm font-medium text-center">{spacing.name}</p>
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
    </TabsContent>
  );
}

export default memo(TypographySettingsTab);
