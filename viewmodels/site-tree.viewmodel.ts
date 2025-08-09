"use client";

import { useCallback, useState } from "react";
import type {
  ISiteService,
  Site,
  CreateSiteRequest,
  UpdateSiteRequest,
  SitesResponse,
} from "@/services/site.service";
import type { PaginationInfo } from "@/lib/pagination";
import { useEnhancedDelete } from "@/hooks/use-enhanced-delete";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import { useI18n } from "@/providers/i18n-provider";

export function useSitesTreeViewModel(siteService: ISiteService) {
  const [tree, setTree] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    itemsCount: 0,
    pageSize: 10,
    currentPage: 1,
    pagesCount: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  
  const { toast } = useEnhancedToast();
  const { t } = useI18n();

  const listTree = useCallback(async () => {
    setLoading(true);
    try {
      const response: SitesResponse = await siteService.getSitesWithChildren({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        search: searchTerm,
      });
      setTree(response.data ?? []);
      setPagination(response.pagination);
    } finally {
      setLoading(false);
    }
  }, [siteService, pagination.currentPage, pagination.pageSize, searchTerm]);

  const createSite = useCallback(
    async (data: CreateSiteRequest) => {
      try {
        await siteService.createSite(data);
        await listTree();
        toast({
          title: t("toast.created").replace("{itemType}", t("Sites.title")),
          description: t("toast.createSuccess").replace("{itemName}", data.siteName),
          variant: "success",
        });
      } catch (error) {
        toast({
          title: t("toast.createError").replace("{itemType}", t("Sites.title")),
          description: t("toast.createError").replace("{itemType}", t("Sites.title")),
          variant: "destructive",
        });
        throw error;
      }
    },
    [siteService, listTree, toast]
  );

  const updateSite = useCallback(
    async (id: string, data: UpdateSiteRequest) => {
      try {
        await siteService.updateSite(id, data);
        await listTree();
        toast({
          title: t("toast.updated").replace("{itemType}", t("Sites.title")),
          description: t("toast.updateSuccess").replace("{itemName}", data.siteName),
          variant: "success",
        });
      } catch (error) {
        toast({
          title: t("toast.updateError").replace("{itemType}", t("Sites.title")),
          description: t("toast.updateError").replace("{itemType}", t("Sites.title")),
          variant: "destructive",
        });
        throw error;
      }
    },
    [siteService, listTree, toast]
  );

  const deleteHook = useEnhancedDelete();

  const deleteSite = useCallback(
    async (site: Site) => {
      await deleteHook.confirmDelete(
        async () => {
          await siteService.deleteSite(site.id);
          await listTree();
        },
        {
          itemType: t("Sites.title"),
          itemName: site.siteName,
          successMessage: t("toast.deleteSuccess").replace("{itemName}", site.siteName),
          errorMessage: t("toast.deleteError").replace("{itemType}", t("Sites.title")),
        }
      );
    },
    [siteService, listTree, deleteHook]
  );

  const changePage = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const changePageSize = (size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, currentPage: 1 }));
  };

  const searchSites = (term: string) => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setSearchTerm(term);
  };

  return {
    tree,
    loading,
    pagination,
    searchTerm,
    listTree,
    createSite,
    updateSite,
    deleteSite,
    changePage,
    changePageSize,
    searchSites,
    // Enhanced delete properties
    isDeleting: deleteHook.isDeleting,
    showConfirmation: deleteHook.showConfirmation,
    deleteOptions: deleteHook.deleteOptions,
    executeDelete: deleteHook.executeDelete,
    cancelDelete: deleteHook.cancelDelete,
  };
}

export type SitesTreeVM = ReturnType<typeof useSitesTreeViewModel>;
