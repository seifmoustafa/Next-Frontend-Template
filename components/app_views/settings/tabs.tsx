"use client";

import { memo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Layout, Settings as SettingsIcon, Type, Eye } from "lucide-react";
import dynamic from "next/dynamic";
import type { SettingsContextType } from "@/providers/settings-provider";

const AppearanceSettingsTab = dynamic(() => import("./appearance-tab"));
const LayoutSettingsTab = dynamic(() => import("./layout-tab"));
const ComponentsSettingsTab = dynamic(() => import("./components-tab"));
const TypographySettingsTab = dynamic(() => import("./typography-tab"));
const BehaviorSettingsTab = dynamic(() => import("./behavior-tab"));

interface SettingsTabsProps {
  t: (key: string) => string;
  settings: SettingsContextType;
}

function SettingsTabsComponent({ t, settings }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="appearance" className="space-y-6">
      <TabsList className="w-full overflow-x-auto flex md:grid md:grid-cols-5">
        <TabsTrigger value="appearance" className="flex-1 whitespace-nowrap">
          <Palette className="h-4 w-4 mr-2" />
          {t("settings.tabs.appearance")}
        </TabsTrigger>
        <TabsTrigger value="layout" className="flex-1 whitespace-nowrap">
          <Layout className="h-4 w-4 mr-2" />
          {t("settings.tabs.layout")}
        </TabsTrigger>
        <TabsTrigger value="components" className="flex-1 whitespace-nowrap">
          <SettingsIcon className="h-4 w-4 mr-2" />
          {t("settings.tabs.components")}
        </TabsTrigger>
        <TabsTrigger value="typography" className="flex-1 whitespace-nowrap">
          <Type className="h-4 w-4 mr-2" />
          {t("settings.tabs.typography")}
        </TabsTrigger>
        <TabsTrigger value="behavior" className="flex-1 whitespace-nowrap">
          <Eye className="h-4 w-4 mr-2" />
          {t("settings.tabs.behavior")}
        </TabsTrigger>
      </TabsList>

      <AppearanceSettingsTab t={t} settings={settings} />
      <LayoutSettingsTab t={t} settings={settings} />
      <ComponentsSettingsTab t={t} settings={settings} />
      <TypographySettingsTab t={t} settings={settings} />
      <BehaviorSettingsTab t={t} settings={settings} />
    </Tabs>
  );
}

export const SettingsTabs = memo(SettingsTabsComponent);
export default SettingsTabs;

