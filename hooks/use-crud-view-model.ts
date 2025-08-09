"use client";

import { useState, useEffect, useCallback } from "react";

export interface CrudService<T, CreateReq, UpdateReq> {
  list: () => Promise<T[]>;
  create: (data: CreateReq) => Promise<any>;
  update: (id: string, data: UpdateReq) => Promise<any>;
  delete: (id: string) => Promise<any>;
}

export function useCrudViewModel<T extends { id: string }, CreateReq, UpdateReq>(
  service: CrudService<T, CreateReq, UpdateReq>
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.list();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [service.list]);

  const createItem = async (data: CreateReq) => {
    await service.create(data);
    await loadItems();
    setIsCreateModalOpen(false);
  };

  const updateItem = async (id: string, data: UpdateReq) => {
    await service.update(id, data);
    await loadItems();
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const deleteItem = async (id: string) => {
    await service.delete(id);
    await loadItems();
  };

  const deleteSelectedItems = async () => {
    for (const id of selectedItems) {
      await service.delete(id);
    }
    setSelectedItems([]);
    await loadItems();
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
  };
}

