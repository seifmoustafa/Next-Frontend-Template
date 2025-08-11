"use client";

import React, { useState, useEffect, useCallback, Fragment } from "react";

/** ------ Core Types ------ */
export interface CrudService<T, CreateReq, UpdateReq> {
  list: () => Promise<T[]>;
  create: (data: CreateReq) => Promise<any>;
  update: (id: string, data: UpdateReq) => Promise<any>;
  delete: (id: string) => Promise<any>;
}

/** Optional adapters to “enhance” UX without hard deps */
export interface NotificationsAdapter {
  operationSuccess: (op: "Load" | "Create" | "Update" | "Delete", subject: string) => void;
  operationError: (op: "Load" | "Create" | "Update" | "Delete", subject: string, message: string) => void;
}

export interface ConfirmationRequest {
  variant?: "default" | "destructive";
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
}

export interface ConfirmationAdapter {
  /** Call to request a confirmation dialog */
  showConfirmation: (req: ConfirmationRequest) => void;
  /** Component you mount once where you render (can be a no-op) */
  ConfirmationDialog: React.ComponentType;
}

export interface I18nAdapter {
  t: (key: string) => string;
}

/** ------ Options ------ */
export interface CrudViewModelOptions<T> {
  /** UX labels */
  itemTypeName?: string;        // "User"
  itemTypeNamePlural?: string;  // "Users"
  /** Display formatter for items */
  getItemDisplayName?: (item: T) => string;

  /** Adapters (optional) */
  notifications?: NotificationsAdapter;
  confirmation?: ConfirmationAdapter;
  i18n?: I18nAdapter;

  /** Behavior */
  autoLoad?: boolean; // default true
}

/** ------ Default no-op adapters ------ */
const noopNotifications: NotificationsAdapter = {
  operationSuccess: () => {},
  operationError: () => {},
};

const noopConfirmation: ConfirmationAdapter = {
  showConfirmation: (r) => {
    // If no dialog system is wired, execute immediately for non-destructive or ask via window.confirm
    const ok =
      r.variant === "destructive"
        ? typeof window !== "undefined"
          ? window.confirm(`${r.title}\n\n${r.description ?? ""}`)
          : true
        : true;
    if (ok) void r.onConfirm();
  },
  ConfirmationDialog: () => null,
};

const noopI18n: I18nAdapter = {
  t: (k) => k,
};

/** ------ Unified Hook ------ */
export function useCrudViewModel<
  T extends { id: string },
  CreateReq,
  UpdateReq
>(service: CrudService<T, CreateReq, UpdateReq>, options: CrudViewModelOptions<T> = {}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const {
    itemTypeName = "Item",
    itemTypeNamePlural = "Items",
    getItemDisplayName = (item: any) => item?.name || item?.title || `${itemTypeName} ${item?.id}`,
    notifications = noopNotifications,
    confirmation = noopConfirmation,
    i18n = noopI18n,
    autoLoad = true,
  } = options;

  const { operationSuccess, operationError } = notifications;
  const { showConfirmation, ConfirmationDialog } = confirmation;
  const { t } = i18n;

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.list();
      setItems(data);
      operationSuccess("Load", itemTypeNamePlural);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      operationError("Load", itemTypeNamePlural, message);
    } finally {
      setLoading(false);
    }
  }, [service, itemTypeNamePlural, operationSuccess, operationError]);

  const createItem = async (data: CreateReq) => {
    try {
      await service.create(data);
      await loadItems();
      setIsCreateModalOpen(false);
      operationSuccess("Create", itemTypeName);
    } catch (err) {
      operationError("Create", itemTypeName, err instanceof Error ? err.message : "Failed to create");
      throw err;
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
      operationError("Update", itemTypeName, err instanceof Error ? err.message : "Failed to update");
      throw err;
    }
  };

  /** Accept either an id or the full item */
  const deleteItem = async (itemOrId: string | T) => {
    const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
    const name = typeof itemOrId === "string"
      ? `${itemTypeName} ${id}`
      : getItemDisplayName(itemOrId);

    showConfirmation({
      variant: "destructive",
      title: t("common.confirmDelete"),
      description: `${(t("common.deleteConfirmation") || "Are you sure you want to delete this {itemType}?")
        .replace("{itemType}", itemTypeName.toLowerCase())} "${name}". ${(t("common.deleteWarning") || "This action cannot be undone.")}`,
      confirmText: t("common.delete") || "Delete",
      cancelText: t("common.cancel") || "Cancel",
      onConfirm: async () => {
        try {
          await service.delete(id);
          await loadItems();
          operationSuccess("Delete", name);
        } catch (err) {
          operationError("Delete", name, err instanceof Error ? err.message : "Failed to delete");
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
      description: `${(t("common.deleteConfirmation") || "Are you sure you want to delete this {itemType}?")
        .replace("{itemType}", `${count} ${itemsText.toLowerCase()}`)}. ${(t("common.deleteWarning") || "This action cannot be undone.")}`,
      confirmText: `${t("common.delete") || "Delete"} ${count} ${itemsText}`,
      cancelText: t("common.cancel") || "Cancel",
      onConfirm: async () => {
        try {
          await Promise.all(selectedItems.map((id) => service.delete(id)));
          setSelectedItems([]);
          await loadItems();
          operationSuccess("Delete", `${count} ${itemsText.toLowerCase()}`);
        } catch (err) {
          operationError(
            "Delete",
            `${count} ${itemsText.toLowerCase()}`,
            err instanceof Error ? err.message : "Failed to delete items"
          );
        }
      },
    });
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllItems = () => {
    setSelectedItems((prev) => (prev.length === items.length ? [] : items.map((i) => i.id)));
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
    if (autoLoad) loadItems();
  }, [autoLoad, loadItems]);

  return {
    // state
    items,
    loading,
    error,
    selectedItems,
    setSelectedItems,

    // modals
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    editingItem,
    openEditModal,
    closeEditModal,

    // crud ops
    createItem,
    updateItem,
    deleteItem,
    deleteSelectedItems,
    refreshItems: loadItems,

    // selection helpers
    toggleItemSelection,
    toggleAllItems,

    // mount this where you render (no-op if no adapter)
    ConfirmationDialog: ConfirmationDialog ?? Fragment,
  };
}
