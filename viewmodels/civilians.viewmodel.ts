"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type {
  Civilian,
  ICivilianService,
  CreateCivilianRequest,
  UpdateCivilianRequest,
  CiviliansResponse,
} from "@/services/civilian.service";
import type { ISiteService } from "@/services/site.service";
import type { PaginationInfo } from "@/lib/pagination";
import { useCrudViewModel } from "@/hooks/use-crud-view-model";

type Option = { value: string; label: string };

export function useCiviliansViewModel(
  civilianService: ICivilianService,
  siteService: ISiteService
) {
  // table/search/pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    itemsCount: 0,
    pageSize: 10,
    page: 1,
    pagesCount: 1,
  });
  // Search state - separate display value from search term (like tree pages)
  const [searchValue, setSearchValue] = useState<string>(""); // What user types (immediate)
  const [searchTerm, setSearchTerm] = useState<string>(""); // What triggers API (debounced)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Use ref to access current pagination values without causing infinite loops
  const paginationRef = useRef(pagination);
  paginationRef.current = pagination;

  // list handler
  const list = useCallback(async () => {
    const currentPagination = paginationRef.current;
    const wasSearchFocused = searchInputRef.current === document.activeElement;
    
    // Maintain focus during the entire API request process (like tree pages)
    const maintainFocus = () => {
      if (wasSearchFocused && searchInputRef.current && document.activeElement !== searchInputRef.current) {
        searchInputRef.current.focus();
      }
    };
    
    try {
      const res: CiviliansResponse = await civilianService.getCivilians({
        page: currentPagination.page,
        pageSize: currentPagination.pageSize,
        search: searchTerm, // VM is API-agnostic
      });
      
      // Maintain focus immediately after getting response
      maintainFocus();
      
      // Update pagination but preserve user-selected page and pageSize
      setPagination(prev => ({
        ...res.pagination,
        page: prev.page,
        pageSize: prev.pageSize,
      }));
      
      // Maintain focus after state updates
      setTimeout(() => maintainFocus(), 10);
      
      return res.data;
    } finally {
      // Final focus restoration (like tree pages)
      setTimeout(() => maintainFocus(), 50);
      setTimeout(() => maintainFocus(), 100);
    }
  }, [civilianService, searchTerm]); // Stable dependencies prevent infinite loop

  // CRUD service binding
  const service = useMemo(
    () => ({
      list,
      create: (data: CreateCivilianRequest) =>
        civilianService.createCivilian(data),
      update: (id: string, data: UpdateCivilianRequest) =>
        civilianService.updateCivilian(id, data),
      delete: (id: string) => civilianService.deleteCivilian(id),
    }),
    [civilianService, list]
  );

  // Enhanced CRUD VM (provides modals + confirmation)
  const crud = useCrudViewModel<
    Civilian,
    CreateCivilianRequest,
    UpdateCivilianRequest
  >(service, {
    itemTypeName: "Civilian",
    itemTypeNamePlural: "Civilians",
    getItemDisplayName: (c) => `${c.civilianName} (${c.nationalityNumber})`,
  });

  // search & pagination commands
  // Handle immediate input change (what user types) - exactly like tree pages
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value); // Update display immediately
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced API call
    searchTimeoutRef.current = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }));
      setSearchTerm(value); // This triggers the API call
    }, 300); // 300ms debounce
  }, []);

  // Legacy method for backward compatibility
  const searchCivilians = useCallback((term: string) => {
    handleSearchChange(term);
  }, [handleSearchChange]);

  const changePage = useCallback((page: number) => {
    setPagination((p) => ({ ...p, page: page }));
    // Trigger a new request after pagination change
    setTimeout(() => crud.refreshItems(), 10);
  }, [crud]);

  const changePageSize = useCallback((size: number) => {
    setPagination((p) => ({ ...p, pageSize: size, page: 1 }));
    // Trigger a new request after pagination change
    setTimeout(() => crud.refreshItems(), 10);
  }, [crud]);

  // ---------- Sites state lives here ----------
  const [siteOptions, setSiteOptions] = useState<Option[]>([]);
  const [sitesLoaded, setSitesLoaded] = useState(false);

  // initial sites preload (for dropdown open UX)
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await siteService.getSites({ page: 1, pageSize: 100 });
        if (ignore) return;
        setSiteOptions(
          (res.data ?? []).map((s) => ({ value: s.id, label: s.siteName }))
        );
        setSitesLoaded(true);
      } catch {
        setSitesLoaded(true);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [siteService]);

  // server search for sites (used by searchable-select)
  const searchSites = useCallback(
    async (query: string) => {
      try {
        const res = await siteService.getSites({
          page: 1,
          pageSize: 50,
          PageSearch: query,
        });
        return (res.data ?? []).map((s) => ({
          value: s.id,
          label: s.siteName,
        })) as Option[];
      } catch {
        return [] as Option[];
      }
    },
    [siteService]
  );

  return {
    ...crud,
    pagination,
    searchValue, // What user types (immediate display) - like tree pages
    searchTerm, // What triggers API (debounced)
    searchInputRef, // Export search input ref for focus management
    handleSearchChange, // Tree-page style search handler
    searchCivilians, // Legacy compatibility
    changePage,
    changePageSize,
    siteOptions,
    sitesLoaded,
    searchSites,
  };
}
