"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";

export function ComponentsTab() {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.tabs.components")}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: Implement components settings */}
      </CardContent>
    </Card>
  );
}

