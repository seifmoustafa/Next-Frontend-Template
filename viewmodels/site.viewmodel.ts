"use client";

import { useMemo } from "react";
import type {
  Site,
  ISiteService,
  CreateSiteRequest,
  UpdateSiteRequest,
} from "@/services/site.service";
import { useTreeViewModel, type TreeService, type TreeViewModelConfig } from "@/hooks/use-tree-view-model";

export function useSitesViewModel(siteService: ISiteService) {
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

  // Use the generic tree view model
  const treeViewModel = useTreeViewModel(service, config);

  return {
    ...treeViewModel,
    // Keep original method names for backward compatibility
    searchSites: treeViewModel.searchItems,
    deleteSite: treeViewModel.deleteItem,
    // Add openAddRoot method for sites
    openAddRoot: () => treeViewModel.openAddChild(null),
  };
}

