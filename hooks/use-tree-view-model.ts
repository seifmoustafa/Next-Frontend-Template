"use client";

import { useCallback, useMemo, useState, useRef } from "react";
import type { PaginationInfo } from "@/lib/pagination";
import { useEnhancedDelete } from "@/hooks/use-enhanced-delete";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import { useI18n } from "@/providers/i18n-provider";

export interface TreeNode {
  id: string;
  children?: TreeNode[];
}

export interface TreeService<T extends TreeNode, TCreate, TUpdate> {
  getWithChildren: (params: {
    page: number;
    pageSize: number;
    PageSearch: string;
  }) => Promise<{
    data: T[];
    pagination: PaginationInfo;
  }>;
  create: (data: TCreate) => Promise<T>;
  update: (id: string, data: TUpdate) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

export interface TreeViewModelConfig<T extends TreeNode> {
  itemTypeName: string;
  itemTypeNamePlural: string;
  getItemDisplayName: (item: T) => string;
  getFormFieldName: (item: T) => string;
  createFormData: (values: any) => any;
  updateFormData: (values: any, item: T) => any;
  getInitialFormValues: (item?: T, parent?: T) => any;
}

export function useTreeViewModel<T extends TreeNode, TCreate, TUpdate>(
  service: TreeService<T, TCreate, TUpdate>,
  config: TreeViewModelConfig<T>
) {
  // Tree-specific state
  const [tree, setTree] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    itemsCount: 0,
    pageSize: 10,
    page: 1,
    pagesCount: 1,
  });
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [parentForNew, setParentForNew] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<any>(config.getInitialFormValues());
  
  // Search state - separate display value from search term
  const [searchValue, setSearchValue] = useState<string>(""); // What user types (immediate)
  const [searchTerm, setSearchTerm] = useState<string>(""); // What triggers API (debounced)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useEnhancedToast();
  const { t } = useI18n();
  const deleteHook = useEnhancedDelete();

  const listTree = useCallback(async () => {
    setLoading(true);
    const wasSearchFocused = searchInputRef.current === document.activeElement;
    
    // Maintain focus during the entire API request process
    const maintainFocus = () => {
      if (wasSearchFocused && searchInputRef.current && document.activeElement !== searchInputRef.current) {
        searchInputRef.current.focus();
      }
    };
    
    try {
      const response = await service.getWithChildren({
        page: pagination.page,
        pageSize: pagination.pageSize,
        PageSearch: searchTerm,
      });
      
      // Maintain focus immediately after getting response
      maintainFocus();
      
      setTree(response.data ?? []);
      // Only update pagination data, preserve user-selected pageSize
      setPagination(prev => ({
        ...response.pagination,
        pageSize: prev.pageSize, // Keep the user-selected page size
      }));
      
      // Maintain focus after state updates
      setTimeout(() => maintainFocus(), 10);
    } finally {
      setLoading(false);
      
      // Final focus restoration
      setTimeout(() => maintainFocus(), 50);
      setTimeout(() => maintainFocus(), 100);
    }
  }, [service, pagination.page, pagination.pageSize, searchTerm]);

  const createItem = useCallback(
    async (data: TCreate) => {
      try {
        await service.create(data);
        await listTree();
        toast({
          title: t("toast.created").replace("{itemType}", t(`${config.itemTypeNamePlural}.title`)),
          description: t("toast.createSuccess").replace("{itemName}", config.getItemDisplayName(data as any)),
          variant: "success",
        });
      } catch (error) {
        toast({
          title: t("toast.createError").replace("{itemType}", t(`${config.itemTypeNamePlural}.title`)),
          description: t("toast.createError").replace("{itemType}", t(`${config.itemTypeNamePlural}.title`)),
          variant: "destructive",
        });
        throw error;
      }
    },
    [service, listTree, toast, t, config]
  );

  const updateItem = useCallback(
    async (id: string, data: TUpdate) => {
      try {
        await service.update(id, data);
        await listTree();
        toast({
          title: t("toast.updated").replace("{itemType}", t(`${config.itemTypeNamePlural}.title`)),
          description: t("toast.updateSuccess").replace("{itemName}", config.getItemDisplayName(data as any)),
          variant: "success",
        });
      } catch (error) {
        toast({
          title: t("toast.updateError").replace("{itemType}", t(`${config.itemTypeNamePlural}.title`)),
          description: t("toast.updateError").replace("{itemType}", t(`${config.itemTypeNamePlural}.title`)),
          variant: "destructive",
        });
        throw error;
      }
    },
    [service, listTree, toast, t, config]
  );

  const deleteItem = useCallback(
    async (item: T) => {
      await deleteHook.confirmDelete(
        async () => {
          await service.delete(item.id);
          await listTree();
        },
        {
          itemType: t(`${config.itemTypeNamePlural}.title`),
          itemName: config.getItemDisplayName(item),
          successMessage: t("toast.deleteSuccess").replace("{itemName}", config.getItemDisplayName(item)),
          errorMessage: t("toast.deleteError").replace("{itemType}", t(`${config.itemTypeNamePlural}.title`)),
        }
      );
    },
    [service, listTree, deleteHook, t, config]
  );

  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page: page }));
  }, []);

  const changePageSize = useCallback((size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, page: 1 }));
  }, []);

  // Handle immediate input change (what user types)
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value); // Update display immediately
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced API call
    searchTimeoutRef.current = setTimeout(() => {
      // Ensure focus is maintained before making the API call
      if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
        searchInputRef.current.focus();
      }
      
      setPagination((prev) => ({ ...prev, page: 1 }));
      setSearchTerm(value); // This triggers the API call
    }, 300); // 300ms debounce
  }, []);

  // Legacy method for backward compatibility
  const searchItems = useCallback((term: string) => {
    handleSearchChange(term);
  }, [handleSearchChange]);

  // Form handling
  const resetForm = useCallback(() => {
    setEditing(null);
    setParentForNew(null);
    setFormValues(config.getInitialFormValues());
  }, [config]);

  const openAddChild = useCallback((parent: T | null) => {
    setEditing(null);
    setParentForNew(parent);
    setFormValues(config.getInitialFormValues(undefined, parent || undefined));
    setModalOpen(true);
  }, [config]);

  const openEdit = useCallback((item: T) => {
    setEditing(item);
    setParentForNew(null);
    setFormValues(config.getInitialFormValues(item));
    setModalOpen(true);
  }, [config]);

  const onSubmit = useCallback(async () => {
    if (editing) {
      await updateItem(editing.id, config.updateFormData(formValues, editing));
    } else {
      await createItem(config.createFormData(formValues));
    }
    setModalOpen(false);
    resetForm();
  }, [editing, formValues, createItem, updateItem, config, resetForm]);

  // Parent options for forms (flatten current tree)
  const parentOptions = useMemo(() => {
    const result: { id: string; name: string }[] = [];
    const walk = (nodes: T[]) => {
      nodes.forEach((n) => {
        result.push({ id: n.id, name: config.getItemDisplayName(n) });
        if (n.children && n.children.length) walk(n.children as T[]);
      });
    };
    walk(tree);
    return result;
  }, [tree, config]);

  return {
    // Tree data
    tree,
    loading,
    pagination,
    searchValue, // What user types (immediate display)
    searchTerm, // What triggers API (debounced)
    searchInputRef,
    
    // Tree operations
    listTree,
    createItem,
    updateItem,
    deleteItem,
    changePage,
    changePageSize,
    handleSearchChange, // New controlled input handler
    searchItems, // Legacy compatibility
    
    // Modal and form
    modalOpen,
    setModalOpen,
    editing,
    parentForNew,
    formValues,
    setFormValues,
    parentOptions,
    resetForm,
    openAddChild,
    openEdit,
    onSubmit,
    
    // Enhanced delete properties
    isDeleting: deleteHook.isDeleting,
    showConfirmation: deleteHook.showConfirmation,
    deleteOptions: deleteHook.deleteOptions,
    executeDelete: deleteHook.executeDelete,
    cancelDelete: deleteHook.cancelDelete,
    
    // Config
    config,
  };
}

export type TreeViewModel<T extends TreeNode, TCreate, TUpdate> = ReturnType<typeof useTreeViewModel<T, TCreate, TUpdate>>;
