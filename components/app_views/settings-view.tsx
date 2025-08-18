"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useI18n } from "@/providers/i18n-provider";
import {
  AppearanceTab,
  LayoutTab,
  ComponentsTab,
  TypographyTab,
  BehaviorTab,
} from "./settings";

export function SettingsView() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("appearance");

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appearance">
              {t("settings.tabs.appearance")}
            </TabsTrigger>
            <TabsTrigger value="layout">
              {t("settings.tabs.layout")}
            </TabsTrigger>
            <TabsTrigger value="components">
              {t("settings.tabs.components")}
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
          <TabsContent value="typography">
            <TypographyTab />
          </TabsContent>
          <TabsContent value="behavior">
            <BehaviorTab />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

