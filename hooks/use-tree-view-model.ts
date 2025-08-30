"use client";

import { useCallback, useMemo, useState, useRef, useEffect } from "react";
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

// Create a generic mock service for selectable mode
export function createMockTreeService<T extends TreeNode>(
  mockData: T[],
  searchFields: (keyof T)[] = []
): TreeService<T, any, any> {
  return {
    getWithChildren: async (params) => {
      // Apply search filter if provided
      let filteredData = mockData;
      if (params.PageSearch && searchFields.length > 0) {
        const searchTerm = params.PageSearch.toLowerCase();
        filteredData = mockData.filter((item: any) =>
          searchFields.some((field) =>
            item[field]?.toString().toLowerCase().includes(searchTerm)
          )
        );
      }

      // Apply pagination
      const startIndex = (params.page - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        pagination: {
          itemsCount: filteredData.length,
          pageSize: params.pageSize,
          page: params.page,
          pagesCount: Math.ceil(filteredData.length / params.pageSize),
        },
      };
    },
    create: async () => {
      throw new Error("Not implemented for mock service");
    },
    update: async () => {
      throw new Error("Not implemented for mock service");
    },
    delete: async () => {
      throw new Error("Not implemented for mock service");
    },
  };
}

export interface TreeViewModelConfig<T extends TreeNode> {
  // Core configuration - make everything optional for maximum flexibility
  itemTypeName?: string;
  itemTypeNamePlural?: string;
  getItemDisplayName?: (item: T) => string;
  getFormFieldName?: (item: T) => string;
  createFormData?: (values: any) => any;
  updateFormData?: (values: any, item: T) => any;
  getInitialFormValues?: (item?: T, parent?: T) => any;

  // Selectable mode configuration
  selectable?: boolean;
  disabled?: boolean; // Disable selection interactions while maintaining visual state
  getValueToSend?: (item: T) => string;
  initialSelectedValues?: string[];
  onSelectionChange?: (selectedValues: string[]) => void;
  autoSelectParents?: boolean; // Auto-select parent nodes when child is selected

  // Control behavior
  autoLoad?: boolean; // Whether to automatically load data on mount
  staticData?: T[]; // Provide static data instead of using service
  disableOperations?: boolean; // Disable CRUD operations for read-only mode
}

export function useTreeViewModel<
  T extends TreeNode,
  TCreate = any,
  TUpdate = any
>(
  service?: TreeService<T, TCreate, TUpdate> | null,
  config: TreeViewModelConfig<T> = {}
) {
  const [pagination, setPagination] = useState<PaginationInfo>({
    itemsCount: 0,
    pageSize: 10,
    page: 1,
    pagesCount: 1,
  });

  // Initialize with static data if provided
  const [tree, setTree] = useState<T[]>(config.staticData || []);
  const [loading, setLoading] = useState<boolean>(false);

  // Selectable mode state
  const [selectedValues, setSelectedValues] = useState<string[]>(
    config.initialSelectedValues || []
  );

  // Update selected values when config changes (for initial permissions)
  useEffect(() => {
    if (config.initialSelectedValues) {
      setSelectedValues(config.initialSelectedValues);
    }
  }, [config.initialSelectedValues]);

  // Update tree data when staticData changes
  useEffect(() => {
    if (config.staticData) {
      setTree(config.staticData);
    }
  }, [config.staticData]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [parentForNew, setParentForNew] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<any>(
    config.getInitialFormValues?.() || {}
  );

  // Search state - separate display value from search term
  const [searchValue, setSearchValue] = useState<string>(""); // What user types (immediate)
  const [searchTerm, setSearchTerm] = useState<string>(""); // What triggers API (debounced)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useEnhancedToast();
  const { t } = useI18n();
  const deleteHook = useEnhancedDelete();

  // Helper function to find all parent IDs for a given item
  const findAllParents = useCallback(
    (itemId: string, treeData: T[]): string[] => {
      const parents: string[] = [];

      const findParent = (
        nodes: T[],
        targetId: string,
        currentParents: string[] = []
      ): boolean => {
        for (const node of nodes) {
          if (node.id === targetId) {
            parents.push(...currentParents);
            return true;
          }
          if (node.children && node.children.length > 0) {
            if (
              findParent(node.children as T[], targetId, [
                ...currentParents,
                node.id,
              ])
            ) {
              return true;
            }
          }
        }
        return false;
      };

      findParent(treeData, itemId);
      return parents;
    },
    []
  );

  // Selection handlers for selectable mode
  const handleSelectionChange = useCallback(
    (newSelectedValues: string[]) => {
      // Don't allow changes if disabled
      if (config.disabled) {
        return;
      }

      let finalSelectedValues = [...newSelectedValues];

      // Auto-select parents if enabled
      if (config.autoSelectParents) {
        const allParentsToAdd = new Set<string>();

        newSelectedValues.forEach((selectedId) => {
          const parents = findAllParents(selectedId, tree);
          parents.forEach((parentId) => allParentsToAdd.add(parentId));
        });

        // Add all parent IDs to the selection
        allParentsToAdd.forEach((parentId) => {
          if (!finalSelectedValues.includes(parentId)) {
            finalSelectedValues.push(parentId);
          }
        });
      }

      setSelectedValues(finalSelectedValues);
      if (config.onSelectionChange) {
        config.onSelectionChange(finalSelectedValues);
      }
    },
    [config, tree, findAllParents]
  );

  const clearSelection = useCallback(() => {
    setSelectedValues([]);
    if (config.onSelectionChange) {
      config.onSelectionChange([]);
    }
  }, [config]);

  const selectAll = useCallback(() => {
    const allValues: string[] = [];
    const walk = (nodes: T[]) => {
      nodes.forEach((node) => {
        if (config.getValueToSend) {
          allValues.push(config.getValueToSend(node));
        } else {
          allValues.push(node.id);
        }
        if (node.children && node.children.length > 0) {
          walk(node.children as T[]);
        }
      });
    };
    walk(tree);

    // When selecting all, we don't need to apply auto-parent logic since everything is selected
    setSelectedValues(allValues);
    if (config.onSelectionChange) {
      config.onSelectionChange(allValues);
    }
  }, [tree, config]);

  const listTree = useCallback(async () => {
    // Skip if no service provided or using static data
    if (!service || config.staticData) {
      return;
    }

    setLoading(true);
    const wasSearchFocused = searchInputRef.current === document.activeElement;

    // Maintain focus during the entire API request process
    const maintainFocus = () => {
      if (
        wasSearchFocused &&
        searchInputRef.current &&
        document.activeElement !== searchInputRef.current
      ) {
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
      setPagination((prev) => ({
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
  }, [
    service,
    pagination.page,
    pagination.pageSize,
    searchTerm,
    config.staticData,
  ]);

  const createItem = useCallback(
    async (data: TCreate) => {
      if (!service || config.disableOperations) {
        throw new Error("Create operation not available");
      }

      try {
        await service.create(data);
        await listTree();
        toast({
          title: t("toast.created").replace(
            "{itemType}",
            t(`${config.itemTypeNamePlural || "items"}`)
          ),
          description: t("toast.createSuccess").replace(
            "{itemName}",
            config.getItemDisplayName?.(data as any) || "Item"
          ),
          variant: "success",
        });
      } catch (error) {
        toast({
          title: t("toast.createError").replace(
            "{itemType}",
            t(`${config.itemTypeNamePlural || "items"}`)
          ),
          description: t("toast.createError").replace(
            "{itemType}",
            t(`${config.itemTypeNamePlural || "items"}`)
          ),
          variant: "destructive",
        });
        throw error;
      }
    },
    [service, listTree, toast, t, config]
  );

  const updateItem = useCallback(
    async (id: string, data: TUpdate) => {
      if (!service || config.disableOperations) {
        throw new Error("Update operation not available");
      }

      try {
        await service.update(id, data);
        await listTree();
        toast({
          title: t("toast.updated").replace(
            "{itemType}",
            t(`${config.itemTypeNamePlural || "items"}`)
          ),
          description: t("toast.updateSuccess").replace(
            "{itemName}",
            config.getItemDisplayName?.(data as any) || "Item"
          ),
          variant: "success",
        });
      } catch (error) {
        toast({
          title: t("toast.updateError").replace(
            "{itemType}",
            t(`${config.itemTypeNamePlural || "items"}`)
          ),
          description: t("toast.updateError").replace(
            "{itemType}",
            t(`${config.itemTypeNamePlural || "items"}`)
          ),
          variant: "destructive",
        });
        throw error;
      }
    },
    [service, listTree, toast, t, config]
  );

  const deleteItem = useCallback(
    async (item: T) => {
      if (!service || config.disableOperations) {
        throw new Error("Delete operation not available");
      }

      await deleteHook.confirmDelete(
        async () => {
          await service.delete(item.id);
          await listTree();
        },
        {
          itemType: t(`${config.itemTypeNamePlural || "items"}`),
          itemName: config.getItemDisplayName?.(item) || "Item",
          successMessage: t("toast.deleteSuccess").replace(
            "{itemName}",
            config.getItemDisplayName?.(item) || "Item"
          ),
          errorMessage: t("toast.deleteError").replace(
            "{itemType}",
            t(`${config.itemTypeNamePlural || "items"}`)
          ),
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
      if (
        searchInputRef.current &&
        document.activeElement !== searchInputRef.current
      ) {
        searchInputRef.current.focus();
      }

      setPagination((prev) => ({ ...prev, page: 1 }));
      setSearchTerm(value); // This triggers the API call
    }, 300); // 300ms debounce
  }, []);

  // Legacy method for backward compatibility
  const searchItems = useCallback(
    (term: string) => {
      handleSearchChange(term);
    },
    [handleSearchChange]
  );

  // Form handling
  const resetForm = useCallback(() => {
    setEditing(null);
    setParentForNew(null);
    setFormValues(config.getInitialFormValues?.() || {});
  }, [config]);

  const openAddChild = useCallback(
    (parent: T | null) => {
      setEditing(null);
      setParentForNew(parent);
      setFormValues(
        config.getInitialFormValues?.(undefined, parent || undefined) || {}
      );
      setModalOpen(true);
    },
    [config]
  );

  const openEdit = useCallback(
    (item: T) => {
      setEditing(item);
      setParentForNew(null);
      setFormValues(config.getInitialFormValues?.(item) || {});
      setModalOpen(true);
    },
    [config]
  );

  const onSubmit = useCallback(async () => {
    if (config.disableOperations) {
      return;
    }

    if (editing) {
      await updateItem(
        editing.id,
        config.updateFormData?.(formValues, editing) || formValues
      );
    } else {
      await createItem(config.createFormData?.(formValues) || formValues);
    }
    setModalOpen(false);
    resetForm();
  }, [editing, formValues, createItem, updateItem, config, resetForm]);

  // Parent options for forms (flatten current tree)
  const parentOptions = useMemo(() => {
    const result: { id: string; name: string }[] = [];
    const walk = (nodes: T[]) => {
      nodes.forEach((n) => {
        result.push({ id: n.id, name: config.getItemDisplayName?.(n) || n.id });
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

    // Selectable mode properties
    selectedValues,
    handleSelectionChange,
    clearSelection,
    selectAll,
    disabled: config.disabled,

    // Config
    config,
  };
}

export type TreeViewModel<T extends TreeNode, TCreate, TUpdate> = ReturnType<
  typeof useTreeViewModel<T, TCreate, TUpdate>
>;
