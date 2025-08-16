"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { memo } from "react";
import type { SettingsContextType } from "@/providers/settings-provider";

interface BehaviorSettingsTabProps {
  t: (key: string) => string;
  settings: SettingsContextType;
}

export function BehaviorSettingsTab({ t, settings }: BehaviorSettingsTabProps) {
  return (
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
            {/* Breadcrumbs */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("settings.behavior.breadcrumbs.label")}</Label>
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

            {/* User Avatar */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("settings.behavior.userAvatar.label")}</Label>
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

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("settings.behavior.notifications.label")}</Label>
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

            {/* Logo */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("settings.behavior.logo.label")}</Label>
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

            {/* Reduced Motion */}
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

            {/* Sticky Header */}
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

            {/* Collapsible Sidebar */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("settings.behavior.sidebar.label")}</Label>
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

            {/* Footer */}
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

            {/* Auto Save */}
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
  );
}

export default memo(BehaviorSettingsTab);
