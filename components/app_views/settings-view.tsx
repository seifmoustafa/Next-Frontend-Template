"use client";

import type React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Upload,
  Save,
  RotateCcw,
} from "lucide-react";
import {
  AppearanceTab,
  LayoutTab,
  ComponentsTab,
  TypographyTab,
  BehaviorTab,
  PreviewPanel,
} from "./settings";
import { ChartsTab } from "./settings/charts-tab";

export function SettingsView() {
  const { t } = useI18n();
  const settings = useSettings();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("appearance");

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

  const handleImportSettings = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("settings.pageTitle")}</h1>
            <p className="text-muted-foreground">{t("settings.pageSubtitle")}</p>
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
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="appearance">
                  {t("settings.tabs.appearance")}
                </TabsTrigger>
                <TabsTrigger value="layout">
                  {t("settings.tabs.layout")}
                </TabsTrigger>
                <TabsTrigger value="components">
                  {t("settings.tabs.components")}
                </TabsTrigger>
                <TabsTrigger value="charts">
                  {t("settings.tabs.charts")}
                </TabsTrigger>
                <TabsTrigger value="typography">
                  {t("settings.tabs.typography")}
                </TabsTrigger>
                <TabsTrigger value="behavior">
                  {t("settings.tabs.behavior")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="appearance">
                <AppearanceTab />
              </TabsContent>
              <TabsContent value="layout">
                <LayoutTab />
              </TabsContent>
              <TabsContent value="components">
                <ComponentsTab />
              </TabsContent>
              <TabsContent value="charts">
                <ChartsTab />
              </TabsContent>
              <TabsContent value="typography">
                <TypographyTab />
              </TabsContent>
              <TabsContent value="behavior">
                <BehaviorTab />
              </TabsContent>
            </Tabs>
          </div>

          <PreviewPanel />
        </div>
      </div>
    </TooltipProvider>
  );
}

