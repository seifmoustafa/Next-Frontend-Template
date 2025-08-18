"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";

export function AppearanceTab() {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.tabs.appearance")}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: Implement appearance settings */}
      </CardContent>
    </Card>
  );
}

