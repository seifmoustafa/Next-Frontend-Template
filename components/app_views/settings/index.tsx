"use client";

import { memo } from "react";
import { SettingsHeader } from "./header";
import { SettingsTabs } from "./tabs";
import { SettingsPreview } from "./preview";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";

function SettingsViewComponent() {
  const { t } = useI18n();
  const settings = useSettings();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <SettingsHeader t={t} settings={settings} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SettingsTabs t={t} settings={settings} />
        </div>
        <div className="lg:col-span-2">
          <SettingsPreview t={t} />
        </div>
      </div>
    </div>
  );
}

export const SettingsView = memo(SettingsViewComponent);
export default SettingsView;

