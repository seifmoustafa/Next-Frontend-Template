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
import { getLayoutOptions } from "./options/layout-options";
import type { SettingsContextType } from "@/providers/settings-provider";

interface LayoutSettingsTabProps {
  t: (key: string) => string;
  settings: SettingsContextType;
}

export function LayoutSettingsTab({ t, settings }: LayoutSettingsTabProps) {
  const {
    layoutTemplates,
    headerStyles,
    sidebarStyles,
    cardStyles,
  } = useMemo(() => getLayoutOptions(t), [t]);

  return (
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
                onClick={() => settings.setLayoutTemplate(template.value as any)}
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
                onClick={() => settings.setHeaderStyle(style.value as any)}
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
                onClick={() => settings.setSidebarStyle(style.value as any)}
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
                        style.value === "floating" && "w-12 shadow-md rounded-lg",
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
                onClick={() => settings.setCardStyle(style.value as any)}
              >
                <div className="space-y-3">
                  <div className={cn("h-12 rounded p-2", style.class)}>
                    <div className="h-2 bg-current opacity-20 rounded mb-1"></div>
                    <div className="h-2 bg-current opacity-20 rounded w-2/3"></div>
                  </div>
                  <p className="text-sm font-medium text-center">{style.name}</p>
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
  );
}

export default memo(LayoutSettingsTab);
