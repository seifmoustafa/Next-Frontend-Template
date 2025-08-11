"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { PaginationInfo } from "@/lib/pagination";
import { useCrudViewModel } from "@/hooks/use-crud-view-model";

/* =========================
 * Types
 * ========================= */
export interface GenericCrudService<TItem, TCreate, TUpdate, TResponse> {
  getData(params: {
    page: number;
    pageSize: number;
    search?: string;
    PageSearch?: string;
  }): Promise<TResponse>;
  create(data: TCreate): Promise<TItem>;
  update(id: string, data: TUpdate): Promise<TItem>;
  delete(id: string): Promise<void>;
}

export interface GenericCrudConfig<TItem, TCreate, TUpdate> {
  itemTypeName: string;
  itemTypeNamePlural: string;
  getItemDisplayName: (item: TItem) => string;
  searchParamName: "search" | "PageSearch"; // Different APIs use different parameter names
}

export interface DropdownService<TDropdownItem> {
  getData(params: {
    page: number;
    pageSize: number;
    PageSearch?: string;
    search?: string;
  }): Promise<{ data: TDropdownItem[] }>;
  getLabel: (item: TDropdownItem) => string;
  getValue: (item: TDropdownItem) => string;
}

export interface GenericCrudConfigWithDropdowns<
  TItem,
  TCreate,
  TUpdate,
  TDropdownItem = any
> extends GenericCrudConfig<TItem, TCreate, TUpdate> {
  dropdownService?: DropdownService<TDropdownItem>;
  dropdownSearchParamName?: "search" | "PageSearch";
}

/* =========================
 * Hook
 * ========================= */
export function useGenericCrudViewModel<
  TItem extends { id: string },
  TCreate,
  TUpdate,
  TResponse extends { data: TItem[]; pagination: PaginationInfo },
  TDropdownItem = any
>(
  service: GenericCrudService<TItem, TCreate, TUpdate, TResponse>,
  config: GenericCrudConfigWithDropdowns<TItem, TCreate, TUpdate, TDropdownItem>
) {
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    itemsCount: 0,
    pageSize: 10,
    page: 1,
    pagesCount: 1,
  });

  // Search state
  const [searchValue, setSearchValue] = useState<string>(""); // what user types
  const [searchTerm, setSearchTerm] = useState<string>(""); // debounced, used for API
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dropdown state
  const [dropdownOptions, setDropdownOptions] = useState<TDropdownItem[]>([]);
  const [dropdownSearchTerm, setDropdownSearchTerm] = useState("");

  // Data state
  const [data, setData] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for stable list()
  const paginationRef = useRef(pagination);
  const searchTermRef = useRef(searchTerm);
  const mountedRef = useRef(true);
  paginationRef.current = pagination;
  searchTermRef.current = searchTerm;

  // Keep service fns in refs
  const getDataRef = useRef(service.getData);
  const createRef = useRef(service.create);
  const updateRef = useRef(service.update);
  const deleteRef = useRef(service.delete);

  useEffect(() => { getDataRef.current = service.getData; }, [service.getData]);
  useEffect(() => { createRef.current  = service.create;   }, [service.create]);
  useEffect(() => { updateRef.current  = service.update;   }, [service.update]);
  useEffect(() => { deleteRef.current  = service.delete;   }, [service.delete]);

  // Keep config bits in refs
  const searchParamNameRef = useRef(config.searchParamName);
  const getItemDisplayNameRef = useRef(config.getItemDisplayName);
  useEffect(() => { searchParamNameRef.current = config.searchParamName; }, [config.searchParamName]);
  useEffect(() => { getItemDisplayNameRef.current = config.getItemDisplayName; }, [config.getItemDisplayName]);

  // Dropdown service refs
  const dropdownServiceRef = useRef(config.dropdownService);
  const dropdownSearchParamNameRef = useRef(config.dropdownSearchParamName);
  useEffect(() => { dropdownServiceRef.current = config.dropdownService; }, [config.dropdownService]);
  useEffect(() => { dropdownSearchParamNameRef.current = config.dropdownSearchParamName; }, [config.dropdownSearchParamName]);

  // Core list function — ALWAYS returns TItem[]
  const list = useCallback(async (): Promise<TItem[]> => {
    const currentPagination = paginationRef.current;
    const currentSearchTerm = searchTermRef.current;
    const wasSearchFocused = searchInputRef.current === document.activeElement;

    const maintainFocus = () => {
      if (wasSearchFocused && searchInputRef.current && document.activeElement !== searchInputRef.current) {
        searchInputRef.current.focus();
      }
    };

    try {
      setLoading(true);
      setError(null);

      const paramName = searchParamNameRef.current;
      const apiParams =
        paramName === "search"
          ? { page: currentPagination.page, pageSize: currentPagination.pageSize, search: currentSearchTerm }
          : { page: currentPagination.page, pageSize: currentPagination.pageSize, PageSearch: currentSearchTerm };

      const res = await getDataRef.current(apiParams);

      if (!mountedRef.current) {
        // don’t update state after unmount; still return a valid array
        return [];
      }

      maintainFocus();

      // Update pagination but preserve user-selected page & pageSize
      setPagination(prev => {
        const next: PaginationInfo = { ...res.pagination, page: prev.page, pageSize: prev.pageSize };
        const same =
          prev.itemsCount === next.itemsCount &&
          prev.pageSize   === next.pageSize &&
          prev.page       === next.page &&
          prev.pagesCount === next.pagesCount;
        return same ? prev : next;
      });

      setData(res.data ?? []);
      setTimeout(maintainFocus, 10);

      // Always return array
      return res.data ?? [];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      return []; // return empty array on error
    } finally {
      if (!mountedRef.current) return[];
      setLoading(false);
      // focus restoration
      setTimeout(() => {
        const wasFocused = searchInputRef.current === document.activeElement;
        if (wasFocused && searchInputRef.current) searchInputRef.current.focus();
      }, 50);
      setTimeout(() => {
        const wasFocused = searchInputRef.current === document.activeElement;
        if (wasFocused && searchInputRef.current) searchInputRef.current.focus();
      }, 100);
    }
  }, []); // stable

  // Debounce search input -> term
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchValue);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Debounced dropdown search
  useEffect(() => {
    const svc = dropdownServiceRef.current;
    if (!svc) return;

    const timer = setTimeout(async () => {
      try {
        const paramName = dropdownSearchParamNameRef.current ?? "PageSearch";
        const params =
          paramName === "search"
            ? { page: 1, pageSize: 50, search: dropdownSearchTerm }
            : { page: 1, pageSize: 50, PageSearch: dropdownSearchTerm };

        const res = await svc.getData(params);
        if (!mountedRef.current) return;
        setDropdownOptions(res.data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error loading dropdown options:", e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [dropdownSearchTerm]);

  // CRUD service binding with stable references
  const crudService = useMemo(
    () => ({
      list,
      create: (d: TCreate) => createRef.current(d),
      update: (id: string, d: TUpdate) => updateRef.current(id, d),
      delete: (id: string) => deleteRef.current(id),
    }),
    [list]
  );

  // Enhanced CRUD VM (modals + confirmation)
  const crud = useCrudViewModel<TItem, TCreate, TUpdate>(crudService, {
    itemTypeName: config.itemTypeName,
    itemTypeNamePlural: config.itemTypeNamePlural,
    getItemDisplayName: (item: TItem) => getItemDisplayNameRef.current(item),
  });

  // Handle input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  // Mount / unmount
  useEffect(() => {
    mountedRef.current = true;
    list(); // initial load
    return () => {
      mountedRef.current = false;
    };
  }, [list]);

  // Re-run on debounced search term
  useEffect(() => {
    list();
  }, [searchTerm, list]);

  // Pagination handlers
  const changePage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
    setTimeout(() => { list(); }, 0);
  }, [list]);

  const changePageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
    setTimeout(() => { list(); }, 0);
  }, [list]);

  // Legacy compatibility
  const searchItems = useCallback((term: string) => {
    handleSearchChange(term);
  }, [handleSearchChange]);

  const dropdownOptionsMapped = useMemo(() => {
    const svc = dropdownServiceRef.current;
    if (!svc) return [];
    return dropdownOptions.map(item => ({
      label: svc.getLabel(item),
      value: svc.getValue(item),
    }));
  }, [dropdownOptions]);

  return {
    // Enhanced CRUD functionality (modals, confirmations, etc.)
    ...crud,

    // Managed state
    data,
    loading,
    error,
    items: data, // legacy alias

    // Pagination
    pagination,

    // Search
    searchValue,
    searchTerm,
    searchInputRef,
    handleSearchChange,
    searchItems, // legacy

    // Pagination handlers
    changePage,
    changePageSize,

    // Manual refresh
    refresh: list,

    // Dropdowns
    dropdownOptions: dropdownOptionsMapped,
    searchDropdown: setDropdownSearchTerm,
  };
}
