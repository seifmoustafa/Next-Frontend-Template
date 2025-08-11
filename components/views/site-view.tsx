"use client";

import { useSitesViewModel } from "@/viewmodels/site.viewmodel";
import { useServices } from "@/providers/service-provider";
import { useI18n } from "@/providers/i18n-provider";
import { GenericTreeView } from "@/components/ui/generic-tree-view";
import type { Site } from "@/services/site.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SitesView() {
  const { siteService } = useServices();
  const { t } = useI18n();
  const vm = useSitesViewModel(siteService);

  const renderFormFields = (formValues: any, setFormValues: (values: any) => void, editing: Site | null, parentForNew: Site | null) => (
    <>
      <div className="grid gap-2">
        <Label htmlFor="siteName">{t("Sites.SiteName")}</Label>
        <Input
          id="siteName"
          value={formValues.siteName}
          onChange={(e) =>
            setFormValues((p: any) => ({ ...p, siteName: e.target.value }))
          }
          placeholder={t("Sites.form.SiteNamePlaceholder")}
          ref={vm.searchInputRef}
        />
      </div>

      {editing && (
        <div className="grid gap-2">
          <p className="text-xs text-muted-foreground">
            {t("Sites.parentSiteId")}:{" "}
            {formValues.parentSiteId
              ? vm.parentOptions.find(
                  (opt) => opt.id === formValues.parentSiteId
                )?.name || t("Sites.form.root")
              : t("Sites.form.root")}
          </p>
        </div>
      )}
    </>
  );

  return (
    <GenericTreeView
      viewModel={vm}
      title={t("Sites.title")}
      subtitle={t("Sites.subtitle")}
      getId={(n) => n.id}
      getLabel={(n) => n.siteName}
      getChildren={(n) => n.children ?? []}
      renderFormFields={renderFormFields}
    />
  );
}
