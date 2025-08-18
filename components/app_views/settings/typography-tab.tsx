"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";

export function TypographyTab() {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.tabs.typography")}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: Implement typography settings */}
      </CardContent>
    </Card>
  );
}

