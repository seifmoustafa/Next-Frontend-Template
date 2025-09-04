"use client";

import { GenericCrudView } from "@/components/ui/generic-crud-view";
import { useGenericCrudViewModel } from "@/hooks/use-generic-crud-viewmodel";
import { useServices } from "@/providers/service-provider";
import { useI18n } from "@/providers/i18n-provider";
import type { 
  Civilian, 
  CreateCivilianRequest, 
  UpdateCivilianRequest,
  CiviliansResponse 
} from "@/services/civilian.service";
import type { Site } from "@/services/site.service";
import type { CrudConfig } from "@/components/ui/generic-crud-view";
import { useMemo, useCallback } from "react";

export function CiviliansView() {
  const { civilianService, siteService } = useServices();
  const { t } = useI18n();

  // Use generic CRUD view model with stable service references
  const vm = useGenericCrudViewModel<Civilian, CreateCivilianRequest, UpdateCivilianRequest, CiviliansResponse, Site>(
    {
      getData: civilianService.getCivilians.bind(civilianService),
      create: civilianService.createCivilian.bind(civilianService),
      update: civilianService.updateCivilian.bind(civilianService),
      delete: civilianService.deleteCivilian.bind(civilianService),
    },
    {
      itemTypeName: "Civilian",
      itemTypeNamePlural: "Civilians",
      getItemDisplayName: (civilian: Civilian) => `${civilian.civilianName} (${civilian.nationalityNumber})`,
      searchParamName: "PageSearch", // Civilians API uses PageSearch
      dropdownService: {
        getData: siteService.getSites.bind(siteService),
        getLabel: (site: Site) => site.siteName,
        getValue: (site: Site) => site.id,
      },
      dropdownSearchParamName: "PageSearch",
    }
  );

  // Site search handler that returns proper format
  const searchSites = useCallback(async (query: string): Promise<{ label: string; value: string }[]> => {
    try {
      const res = await siteService.getSites({
        page: 1,
        pageSize: 50,
        PageSearch: query,
      });
      return res.data.map(site => ({
        label: site.siteName,
        value: site.id,
      }));
    } catch (error) {
      console.error('Error searching sites:', error);
      return [];
    }
  }, [siteService]);

  const config: CrudConfig<Civilian> = useMemo(() => ({
    titleKey: "civilians.title",
    subtitleKey: "civilians.subtitle",
    columns: [
      { key: "civilianName", label: t("civilians.name"), sortable: true },
      { key: "nationalityNumber", label: t("civilians.nationalityNumber"), sortable: true },
      { key: "phoneNumber", label: t("civilians.phoneNumber"), sortable: true },
      { key: "address", label: t("civilians.address"), sortable: true },
      { key: "siteName", label: t("civilians.site"), sortable: true },
    ],
    createFields: [
      { name: "civilianName", label: t("civilians.form.name"), type: "text", placeholder: t("civilians.form.namePlaceholder"), required: true },
      { name: "nationalityNumber", label: t("civilians.form.nationalityNumber"), type: "text", placeholder: t("civilians.form.nationalityNumberPlaceholder"), required: true },
      { name: "phoneNumber", label: t("civilians.form.phoneNumber"), type: "text", placeholder: t("civilians.form.phoneNumberPlaceholder"), required: true },
      { name: "address", label: t("civilians.form.address"), type: "text", placeholder: t("civilians.form.addressPlaceholder"), required: true },
      {
        name: "siteId",
        label: t("civilians.form.site"),
        type: "searchable-select",
        options: vm.dropdownOptions,
        placeholder: t("civilians.form.sitePlaceholder"),
        searchPlaceholder: t("civilians.form.searchSites"),
        searchType: "server",
        onServerSearch: searchSites,
        debounceMs: 300,
        allowClear: true,
        required: true,
      },
    ],
    editFields: [
      { name: "civilianName", label: t("civilians.form.name"), type: "text", placeholder: t("civilians.form.namePlaceholder"), required: true },
      { name: "nationalityNumber", label: t("civilians.form.nationalityNumber"), type: "text", placeholder: t("civilians.form.nationalityNumberPlaceholder"), required: true },
      { name: "phoneNumber", label: t("civilians.form.phoneNumber"), type: "text", placeholder: t("civilians.form.phoneNumberPlaceholder"), required: true },
      { name: "address", label: t("civilians.form.address"), type: "text", placeholder: t("civilians.form.addressPlaceholder"), required: true },
      {
        name: "siteId",
        label: t("civilians.form.site"),
        type: "searchable-select",
        options: vm.dropdownOptions,
        placeholder: t("civilians.form.sitePlaceholder"),
        searchPlaceholder: t("civilians.form.searchSites"),
        searchType: "server",
        onServerSearch: searchSites,
        debounceMs: 300,
        allowClear: true,
        required: true,
      },
      { name: "id", type: "hidden", required: true },
    ],
    getActions: (vm, t, handleDelete) => [
      { label: t("common.view"), onClick: (item: Civilian) => vm.openViewModal(item), variant: "ghost" },
      { label: t("common.edit"), onClick: (item: Civilian) => vm.openEditModal(item), variant: "ghost" },
      { label: t("common.delete"), onClick: (item: Civilian) => handleDelete?.(item), variant: "ghost", className: "text-red-600 hover:text-red-700" },
    ],
    // Enhanced delete configuration
    getItemDisplayName: (item: Civilian) => `${item.civilianName} (${item.nationalityNumber})`,
    itemTypeKey: "civilians.itemType",
    deleteService: civilianService.deleteCivilian.bind(civilianService),
  }), [t, vm.dropdownOptions, searchSites, vm.openEditModal, civilianService]);

  return <GenericCrudView config={config} viewModel={vm} />;
}
