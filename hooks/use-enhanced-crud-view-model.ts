"use client";

import { useState, useEffect, useCallback } from "react";
import { useEnhancedToast } from "./use-enhanced-toast";
import { useI18n } from "@/providers/i18n-provider";
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog";

export interface CrudService<T, CreateReq, UpdateReq> {
  list: () => Promise<T[]>;
  create: (data: CreateReq) => Promise<any>;
  update: (id: string, data: UpdateReq) => Promise<any>;
  delete: (id: string) => Promise<any>;
}

export interface EnhancedCrudOptions {
  itemTypeName?: string; // e.g., "User", "Contract", "Site"
  itemTypeNamePlural?: string; // e.g., "Users", "Contracts", "Sites"
  getItemDisplayName?: (item: any) => string; // Function to get display name for an item
}

export function useEnhancedCrudViewModel<T extends { id: string }, CreateReq, UpdateReq>(
  service: CrudService<T, CreateReq, UpdateReq>,
  options: EnhancedCrudOptions = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const { operationSuccess, operationError } = useEnhancedToast();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const { t } = useI18n();

  const {
    itemTypeName = "Item",
    itemTypeNamePlural = "Items",
    getItemDisplayName = (item: any) => item.name || item.title || `${itemTypeName} ${item.id}`,
  } = options;

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.list();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      operationError("Load", itemTypeNamePlural, err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [service.list, itemTypeNamePlural, operationError]);

  const createItem = async (data: CreateReq) => {
    try {
      await service.create(data);
      await loadItems();
      setIsCreateModalOpen(false);
      operationSuccess("Create", itemTypeName);
    } catch (err) {
      operationError("Create", itemTypeName, err instanceof Error ? err.message : "Failed to create item");
      throw err; // Re-throw to allow form handling
    }
  };

  const updateItem = async (id: string, data: UpdateReq) => {
    try {
      await service.update(id, data);
      await loadItems();
      setIsEditModalOpen(false);
      setEditingItem(null);
      operationSuccess("Update", itemTypeName);
    } catch (err) {
      operationError("Update", itemTypeName, err instanceof Error ? err.message : "Failed to update item");
      throw err; // Re-throw to allow form handling
    }
  };

  const deleteItem = async (item: T) => {
    const itemName = getItemDisplayName(item);
    
    showConfirmation({
      variant: "destructive",
      title: t("common.confirmDelete"),
      description: `${t("common.deleteConfirmation").replace("{itemType}", itemTypeName.toLowerCase())} "${itemName}". ${t("common.deleteWarning")}`,
      confirmText: t("common.delete"),
      cancelText: t("common.cancel"),
      onConfirm: async () => {
        try {
          await service.delete(item.id);
          await loadItems();
          operationSuccess("Delete", itemName);
        } catch (err) {
          operationError("Delete", itemName, err instanceof Error ? err.message : "Failed to delete item");
        }
      },
    });
  };

  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) return;

    const count = selectedItems.length;
    const itemsText = count === 1 ? itemTypeName : itemTypeNamePlural;
    
    showConfirmation({
      variant: "destructive",
      title: t("common.confirmDelete"),
      description: `${t("common.deleteConfirmation").replace("{itemType}", `${count} ${itemsText.toLowerCase()}`)}. ${t("common.deleteWarning")}`,
      confirmText: `${t("common.delete")} ${count} ${itemsText}`,
      cancelText: t("common.cancel"),
      onConfirm: async () => {
        try {
          // Delete items in parallel for better performance
          await Promise.all(selectedItems.map(id => service.delete(id)));
          setSelectedItems([]);
          await loadItems();
          operationSuccess("Delete", `${count} ${itemsText.toLowerCase()}`);
        } catch (err) {
          operationError("Delete", `${count} ${itemsText.toLowerCase()}`, err instanceof Error ? err.message : "Failed to delete items");
        }
      },
    });
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllItems = () => {
    setSelectedItems((prev) =>
      prev.length === items.length ? [] : items.map((i) => i.id)
    );
  };

  const openEditModal = (item: T) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return {
    items,
    loading,
    error,
    selectedItems,
    setSelectedItems,
    isCreateModalOpen,
    isEditModalOpen,
    editingItem,
    createItem,
    updateItem,
    deleteItem,
    deleteSelectedItems,
    toggleItemSelection,
    toggleAllItems,
    openEditModal,
    closeEditModal,
    setIsCreateModalOpen,
    refreshItems: loadItems,
    ConfirmationDialog, // Export the confirmation dialog component
  };
}
