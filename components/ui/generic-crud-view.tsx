"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GenericTable } from "@/components/ui/generic-table";
import { GenericModal } from "@/components/ui/generic-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GenericForm, FieldConfig } from "@/components/forms/generic-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useEnhancedDelete } from "@/hooks/use-enhanced-delete";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import { useSettings } from "@/providers/settings-provider";
import { cn } from "@/lib/utils";
import type { PaginationInfo } from "@/lib/pagination";
import { useI18n } from "@/providers/i18n-provider";
import { useCallback } from "react";

export interface CrudColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item?: any) => React.ReactNode;
}

export interface CrudAction<TItem> {
  label: string;
  onClick?: (item: TItem) => void;
  variant?: "default" | "ghost" | "destructive";
  className?: string;
}

export interface CrudConfig<TItem> {
  // Page configuration
  titleKey: string; // Translation key for title
  subtitleKey: string; // Translation key for subtitle
  customSubtitle?: string; // Custom subtitle text (overrides subtitleKey)

  // Table configuration
  columns: CrudColumn[];
  createFields: FieldConfig[];
  editFields: FieldConfig[];

  // Actions
  getActions?: (vm: any, t: any, handleDelete?: (item: TItem) => void) => CrudAction<TItem>[];

  // Delete configuration
  getItemDisplayName?: (item: TItem) => string; // For delete confirmation messages
  itemTypeKey?: string; // Translation key for item type (e.g., "vendors.itemType")
  deleteService?: (id: string) => Promise<void>; // Direct delete service function

  // Customization options
  customHeaderContent?: React.ReactNode; // Custom content above the table
  customFooterContent?: React.ReactNode; // Custom content below the table
  customToolbarActions?: React.ReactNode; // Custom buttons in the toolbar
  hideDefaultActions?: boolean; // Hide refresh/add buttons
  customTableProps?: any; // Pass custom props to GenericTable
  customModalProps?: any; // Pass custom props to modals
  renderCustomRow?: (item: TItem, index: number) => React.ReactNode; // Custom row rendering
  enableBulkActions?: boolean; // Enable/disable bulk selection
  customBulkActions?: React.ReactNode; // Custom bulk action buttons
}

interface GenericCrudViewProps<T> {
  // Original props (for backward compatibility)
  title?: string;
  subtitle?: string;
  columns?: any[];
  actions?: any[];
  createFields?: FieldConfig[];
  editFields?: FieldConfig[];
  viewModel: any;
  pagination?: PaginationInfo & {
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  search?: {
    value: string;
    onChange: (term: string) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
  };

  // New configuration-based props
  config?: CrudConfig<T>;
}

export function GenericCrudView<T>(props: GenericCrudViewProps<T>) {
  const {
    title: propTitle,
    subtitle: propSubtitle,
    columns: propColumns,
    actions: propActions,
    createFields: propCreateFields,
    editFields: propEditFields,
    viewModel,
    pagination: propPagination,
    search: propSearch,
    config,
  } = props;
  const settings = useSettings();
  const { t } = useI18n();

  // Enhanced delete system for professional confirmation dialogs
  const deleteSystem = useEnhancedDelete();
  const { operationSuccess, operationError } = useEnhancedToast();

  // Enhanced delete handler with professional confirmation dialog
  const handleDelete = useCallback(async (item: T) => {
    const itemDisplayName = config?.getItemDisplayName ? config.getItemDisplayName(item) : (item as any).name || 'Item';
    const itemType = config?.itemTypeKey ? t(config.itemTypeKey) : 'Item';
    const id = typeof item === "string" ? item : (item as any).id;

    await deleteSystem.confirmDelete(
      async () => {
        // Use the direct delete service from config
        if (config?.deleteService) {
          await config.deleteService(id);
          // Refresh the data after successful delete
          await viewModel.refreshItems();
          // Success message will be shown by the enhanced delete system
        } else {
          throw new Error("Delete service not configured");
        }
      }
    );
  }, [deleteSystem, viewModel, config, t, operationSuccess, operationError]);

  // Use config if provided, otherwise use direct props (backward compatibility)
  const title = config ? t(config.titleKey) : propTitle!;
  const subtitle = config ? (config.customSubtitle || t(config.subtitleKey)) : propSubtitle;
  const columns = config ? config.columns : propColumns!;
  const actions = config?.getActions ? config.getActions(viewModel, t, handleDelete) : propActions;
  const createFields = config ? config.createFields : propCreateFields!;
  const editFields = config ? config.editFields : (propEditFields || propCreateFields!);

  // Auto-generate pagination and search for config-based usage
  const pagination = propPagination || (config ? {
    ...viewModel.pagination,
    onPageChange: viewModel.changePage,
    onPageSizeChange: viewModel.changePageSize,
  } : undefined);

  const search = propSearch || (config ? {
    value: viewModel.searchValue,
    onChange: viewModel.handleSearchChange,
    inputRef: viewModel.searchInputRef,
  } : undefined);
  const getSpacingClasses = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "space-y-3";
      case "comfortable":
        return "space-y-8";
      case "spacious":
        return "space-y-12";
      default:
        return "space-y-6";
    }
  };

  const getCardClasses = () => {
    const base = "hover-lift transition-all duration-200";
    switch (settings.cardStyle) {
      case "glass":
        return cn(base, "bg-white/10 backdrop-blur border-white/20");
      case "solid":
        return cn(base, "bg-muted border-0");
      case "bordered":
        return cn(base, "border-2");
      case "elevated":
        return cn(base, "shadow-lg border-0");
      default:
        return cn(base, "border-0");
    }
  };

  const getButtonSize = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "sm";
      case "comfortable":
      case "spacious":
        return "lg";
      default:
        return "default";
    }
  };

  if (viewModel.loading && viewModel.items.length === 0) {
    return <LoadingSpinner />;
  }

  if (viewModel.error && viewModel.items.length === 0) {
    return (
      <ErrorMessage message={viewModel.error} onRetry={viewModel.refreshItems} />
    );
  }

  return (
    <div className={getSpacingClasses()}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1
            className={cn(
              "font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent",
              settings.fontSize === "small"
                ? "text-2xl sm:text-3xl"
                : settings.fontSize === "large"
                  ? "text-4xl sm:text-5xl"
                  : "text-3xl sm:text-4xl"
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "text-muted-foreground",
                settings.fontSize === "small"
                  ? "text-sm sm:text-base"
                  : settings.fontSize === "large"
                    ? "text-lg sm:text-xl"
                    : "text-base sm:text-lg"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Custom bulk actions */}
          {config?.customBulkActions && viewModel.selectedItems.length > 0 && config.customBulkActions}

          {/* Default bulk delete */}
          {viewModel.selectedItems.length > 0 && !config?.customBulkActions && (config?.enableBulkActions !== false) && (
            <Button
              onClick={viewModel.deleteSelectedItems}
              variant="destructive"
              size={getButtonSize()}
              className="flex-1 sm:flex-none"
            >
              {t("common.delete")} ({viewModel.selectedItems.length})
            </Button>
          )}

          {/* Custom toolbar actions */}
          {config?.customToolbarActions && config.customToolbarActions}

          {/* Default actions (unless hidden) */}
          {!config?.hideDefaultActions && (
            <>
              <Button
                onClick={viewModel.refreshItems}
                variant="outline"
                size={getButtonSize()}
                className="hover-lift bg-transparent flex-1 sm:flex-none"
              >
                {t("common.refresh")}
              </Button>
              <Button
                onClick={() => viewModel.setIsCreateModalOpen(true)}
                className="gradient-primary hover-lift flex-1 sm:flex-none"
                size={getButtonSize()}
              >
                {t("common.add")}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Custom header content */}
      {config?.customHeaderContent && (
        <div className="mb-6">
          {config.customHeaderContent}
        </div>
      )}

      <Card className={getCardClasses()}>
        <CardContent className="p-0">
          <GenericTable
            data={viewModel.items}
            columns={columns}
            actions={actions}
            loading={viewModel.loading}
            selectable={config?.enableBulkActions !== false}
            selectedItems={viewModel.selectedItems}
            onSelectionChange={viewModel.setSelectedItems}
            pagination={pagination ? {
              ...pagination,
              currentPage: pagination.page, // Map page to currentPage for GenericTable
            } : undefined}
            onSearch={search?.onChange}
            searchValue={search?.value}
            searchInputRef={search?.inputRef}
            {...(config?.customTableProps || {})}
          />
        </CardContent>
      </Card>

      {/* Custom footer content */}
      {config?.customFooterContent && (
        <div className="mt-6">
          {config.customFooterContent}
        </div>
      )}

      <GenericModal
        open={viewModel.isCreateModalOpen}
        onOpenChange={viewModel.setIsCreateModalOpen}
        title={`${t("common.add")} ${title}`}
      >
        <GenericForm
          fields={createFields}
          onSubmit={viewModel.createItem}
          onCancel={() => viewModel.setIsCreateModalOpen(false)}
        />
      </GenericModal>

      <Dialog
        open={viewModel.isEditModalOpen}
        onOpenChange={(open) => {
          console.log('Edit modal onOpenChange:', open, 'editingItem:', viewModel.editingItem);
          // Exact same approach as tree view
          if (!open) {
            viewModel.closeEditModal();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`${t("common.edit")} ${title}`}</DialogTitle>
          </DialogHeader>
          <GenericForm
            fields={editFields || createFields}
            onSubmit={(data) => {
              if (viewModel.editingItem) {
                return viewModel.updateItem(viewModel.editingItem.id, data);
              }
            }}
            initialValues={viewModel.editingItem || {}}
            onCancel={viewModel.closeEditModal}
          />
        </DialogContent>
      </Dialog>

      {/* Professional confirmation dialog for delete operations */}
      <ConfirmationDialog
        open={deleteSystem.showConfirmation}
        onOpenChange={deleteSystem.cancelDelete}
        title={deleteSystem.deleteOptions.confirmTitle || t("common.confirmDelete")}
        description={deleteSystem.deleteOptions.confirmDescription || t("common.deleteWarning")}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        onConfirm={deleteSystem.executeDelete}
        onCancel={deleteSystem.cancelDelete}
        variant="destructive"
        isLoading={deleteSystem.isDeleting}
      />
    </div>
  );
}

