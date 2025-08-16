"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Check, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";
import { getComponentsOptions } from "./options/components-options";
import type { SettingsContextType } from "@/providers/settings-provider";

interface ComponentsSettingsTabProps {
  t: (key: string) => string;
  settings: SettingsContextType;
}

export function ComponentsSettingsTab({ t, settings }: ComponentsSettingsTabProps) {
  const {
    buttonStyles,
    treeStyles,
    navigationStyles,
    datePickerStyles,
  } = useMemo(() => getComponentsOptions(t), [t]);

  return (
    <TabsContent value="components" className="space-y-6">
      {/* Button Styles */}
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
                onClick={() => settings.setButtonStyle(style.value as any)}
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
                    <p className="text-xs font-medium">{style.name}</p>
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

      {/* Tree Styles */}
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
                onClick={() => settings.setTreeStyle(style.value as any)}
              >
                <div className="space-y-2">
                  <h4 className="font-semibold">{style.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {style.description}
                  </p>
                  <div className="bg-muted/30 rounded">{style.preview}</div>
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
                onClick={() => settings.setNavigationStyle(style.value as any)}
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
                onClick={() => settings.setDatePickerStyle(style.value as any)}
              >
                <div className="space-y-3">
                  <h4 className="font-semibold">{style.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {style.description}
                  </p>
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
    </TabsContent>
  );
}

export default memo(ComponentsSettingsTab);
