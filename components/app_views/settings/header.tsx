"use client";

import { useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, RotateCcw, Save } from "lucide-react";
import type { SettingsContextType } from "@/providers/settings-provider";

interface SettingsHeaderProps {
  t: (key: string) => string;
  settings: SettingsContextType;
}

function SettingsHeaderComponent({ t, settings }: SettingsHeaderProps) {
  const { toast } = useToast();

  const handleExportSettings = useCallback(() => {
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
  }, [settings, t, toast]);

  const handleImportSettings = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settingsJson = e.target?.result as string;
          const success = settings.importSettings(settingsJson);
          if (!success) throw new Error();
          toast({
            title: t("settings.importSuccess"),
            description: t("settings.importSuccessDesc"),
          });
        } catch {
          toast({
            title: t("settings.importFailed"),
            description: t("settings.importFailedDesc"),
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    },
    [settings, t, toast]
  );

  const handleResetSettings = useCallback(() => {
    settings.resetSettings();
    toast({
      title: t("settings.resetSuccess"),
      description: t("settings.resetSuccessDesc"),
    });
  }, [settings, t, toast]);

  const handleSaveSettings = useCallback(() => {
    try {
      localStorage.setItem("dashboard-settings", settings.exportSettings());
      toast({
        title: t("settings.saveSuccess"),
        description: t("settings.saveSuccessDesc"),
      });
    } catch {
      toast({
        title: t("settings.saveFailed"),
        description: t("settings.saveFailedDesc"),
        variant: "destructive",
      });
    }
  }, [settings, t, toast]);

  return (
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
  );
}

export const SettingsHeader = memo(SettingsHeaderComponent);
export default SettingsHeader;

