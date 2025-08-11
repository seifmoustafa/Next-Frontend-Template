"use client";

import { useServices } from "@/providers/service-provider";
import { useI18n } from "@/providers/i18n-provider";
import { GenericTreeView } from "@/components/ui/generic-tree-view";
import type { Site, CreateSiteRequest, UpdateSiteRequest } from "@/services/site.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTreeViewModel, type TreeService, type TreeViewModelConfig } from "@/hooks/use-tree-view-model";
import { useMemo } from "react";

export function SitesView() {
  const { siteService } = useServices();
  const { t } = useI18n();

  // Create service adapter for generic tree view model
  const service: TreeService<Site, CreateSiteRequest, UpdateSiteRequest> = useMemo(() => ({
    getWithChildren: (params) => siteService.getSitesWithChildren(params),
    create: (data) => siteService.createSite(data),
    update: (id, data) => siteService.updateSite(id, data),
    delete: (id) => siteService.deleteSite(id),
  }), [siteService]);

  // Configuration for the generic tree view model
  const config: TreeViewModelConfig<Site> = useMemo(() => ({
    itemTypeName: "Site",
    itemTypeNamePlural: "Sites",
    getItemDisplayName: (item: Site) => item.siteName,
    getFormFieldName: (item: Site) => item.siteName,
    createFormData: (values: any) => ({
      siteName: values.siteName,
      parentSiteId: values.parentSiteId,
    }),
    updateFormData: (values: any, item: Site) => ({
      id: item.id,
      siteName: values.siteName,
      parentSiteId: item.parentSiteId, // Keep the original parent site ID when editing
    }),
    getInitialFormValues: (item?: Site, parent?: Site) => ({
      siteName: item?.siteName || "",
      parentSiteId: parent?.id || item?.parentSiteId || null,
    }),
  }), []);

  // Use the generic tree view model directly
  const vm = useTreeViewModel(service, config);

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
