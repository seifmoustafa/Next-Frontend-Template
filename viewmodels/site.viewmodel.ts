"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  Site,
  ISiteService,
  CreateSiteRequest,
  UpdateSiteRequest,
  SitesResponse,
} from "@/services/site.service";
import type { PaginationInfo } from "@/lib/pagination";
import { useEnhancedCrudViewModel } from "@/hooks/use-enhanced-crud-view-model";

export function useSitesViewModel(SiteService: ISiteService) {
  const [pagination, setPagination] = useState<PaginationInfo>({
    itemsCount: 0,
    pageSize: 10,
    currentPage: 1,
    pagesCount: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const list = useCallback(async () => {
    const response: SitesResponse = await SiteService.getSites({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      search: searchTerm,
    });
    setPagination(response.pagination);
    return response.data;
  }, [SiteService, pagination.currentPage, pagination.pageSize, searchTerm]);

  const service = useMemo(
    () => ({
      list,
      create: (data: CreateSiteRequest) => SiteService.createSite(data),
      update: (id: string, data: UpdateSiteRequest) => SiteService.updateSite(id, data),
      delete: (id: string) => SiteService.deleteSite(id),
    }),
    [SiteService, list]
  );

  const crud = useEnhancedCrudViewModel<Site, CreateSiteRequest, UpdateSiteRequest>(service, {
    itemTypeName: "Site",
    itemTypeNamePlural: "Sites",
    getItemDisplayName: (site: Site) => site.siteName,
  });

  const searchSites = (term: string) => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setSearchTerm(term);
  };

  const changePage = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const changePageSize = (size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, currentPage: 1 }));
  };

  return {
    ...crud,
    pagination,
    searchTerm,
    searchSites,
    changePage,
    changePageSize,
  };
}

