"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/providers/settings-provider";
import { useI18n } from "@/providers/i18n-provider";

export function BehaviorTab() {
  const { t } = useI18n();
  const settings = useSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.behavior.title")}</CardTitle>
        <CardDescription>{t("settings.behavior.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("settings.behavior.compact.label")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.behavior.compact.description")}
              </p>
            </div>
            <Switch
              checked={settings.compactMode}
              onCheckedChange={settings.setCompactMode}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("settings.behavior.contrast.label")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.behavior.contrast.description")}
              </p>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={settings.setHighContrast}
            />
          </div>

          <Separator />

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
  );
}

