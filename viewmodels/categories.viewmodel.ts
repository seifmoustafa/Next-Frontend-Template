"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type {
  Category,
  ICategoryService,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoriesResponse,
} from "@/services/category.service";
import type { PaginationInfo } from "@/lib/pagination";
import { useCrudViewModel } from "@/hooks/use-crud-view-model";

export function useCategoriesViewModel(categoryService: ICategoryService) {
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
      const res: CategoriesResponse = await categoryService.getCategories({
        page: currentPagination.page,
        pageSize: currentPagination.pageSize,
        PageSearch: searchTerm,
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
  }, [categoryService, searchTerm]); // Stable dependencies prevent infinite loop

  const service = useMemo(
    () => ({
      list,
      create: (data: CreateCategoryRequest) => categoryService.createCategory(data),
      update: (id: string, data: UpdateCategoryRequest) =>
        categoryService.updateCategory(id, data),
      delete: (id: string) => categoryService.deleteCategory(id),
    }),
    [categoryService, list]
  );

  const crud = useCrudViewModel<
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest
  >(service, {
    itemTypeName: "Category",
    itemTypeNamePlural: "Categories",
    getItemDisplayName: (category: Category) => category.categoryName,
  });

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
  const searchCategories = useCallback((term: string) => {
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

  return {
    ...crud,
    pagination,
    searchValue, // What user types (immediate display) - like tree pages
    searchTerm, // What triggers API (debounced)
    searchInputRef, // Export search input ref for focus management
    handleSearchChange, // Tree-page style search handler
    searchCategories, // Legacy compatibility
    changePage,
    changePageSize,
  };
}
