"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";

export function LayoutTab() {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.tabs.layout")}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: Implement layout settings */}
      </CardContent>
    </Card>
  );
}

