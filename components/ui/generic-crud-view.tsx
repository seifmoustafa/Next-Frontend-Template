/**
 * GenericCrudView - A fully generic, reusable CRUD component
 * 
 * This component provides a complete CRUD interface with the following features:
 * - Automatic table generation with sorting and pagination
 * - Generic form handling for create/edit operations
 * - Flexible action system (individual, bulk, and custom actions)
 * - Confirmation dialogs with localization support
 * - Error handling and loading states
 * - Responsive design with mobile support
 * - Full accessibility compliance
 * 
 * @author Contract Management System Team
 * @version 2.0.0
 * @since 1.0.0
 */
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
import { useCallback, useMemo } from "react";

/* ========================================
 * TYPE DEFINITIONS & INTERFACES
 * ======================================== */

/**
 * Configuration for table columns
 * @template TItem - The type of items being displayed
 */
export interface CrudColumn<TItem = any> {
  /** Unique key for the column (must match item property) */
  key: string;
  /** Display label for the column header */
  label: string;
  /** Whether the column supports sorting */
  sortable?: boolean;
  /** Custom render function for the column content */
  render?: (value: any, item: TItem, index: number) => React.ReactNode;
  /** CSS classes for the column */
  className?: string;
  /** Whether the column is hidden on mobile */
  hideOnMobile?: boolean;
}

/**
 * Configuration for individual row actions
 * @template TItem - The type of items the action operates on
 */
export interface CrudAction<TItem = any> {
  /** Display label for the action */
  label: string;
  /** Action handler function */
  onClick?: (item: TItem) => void | Promise<void>;
  /** Button variant styling */
  variant?: "default" | "ghost" | "destructive" | "outline" | "secondary";
  /** Additional CSS classes */
  className?: string;
  /** Icon to display with the action */
  icon?: React.ReactNode;
  /** Conditional display logic */
  show?: (item: TItem) => boolean;
  /** Confirmation dialog title (if confirmation needed) */
  confirmTitle?: string;
  /** Confirmation dialog description (supports {name} placeholder) */
  confirmDescription?: string;
  /** Whether the action is disabled */
  disabled?: (item: TItem) => boolean;
  /** Tooltip text for the action */
  tooltip?: string;
  /** Loading state for async actions */
  loading?: boolean;
}

/**
 * Configuration for bulk actions (operate on multiple selected items)
 */
export interface BulkAction {
  /** Display label for the bulk action */
  label: string;
  /** Bulk action handler function */
  onClick: (selectedIds: string[]) => Promise<void>;
  /** Button variant styling */
  variant?: "default" | "outline" | "destructive" | "secondary";
  /** Additional CSS classes */
  className?: string;
  /** Confirmation dialog title */
  confirmTitle?: string;
  /** Confirmation dialog description (supports {count} placeholder) */
  confirmDescription?: string;
  /** Icon to display with the action */
  icon?: React.ReactNode;
  /** Minimum number of items required for the action */
  minItems?: number;
  /** Maximum number of items allowed for the action */
  maxItems?: number;
  /** Whether the action requires confirmation */
  requiresConfirmation?: boolean;
}

/**
 * Configuration for custom actions (always visible, operate on all items)
 */
export interface CustomAction {
  /** Display label for the custom action */
  label: string;
  /** Custom action handler function */
  onClick: () => Promise<void>;
  /** Button variant styling */
  variant?: "default" | "outline" | "destructive" | "secondary";
  /** Additional CSS classes */
  className?: string;
  /** Confirmation dialog title */
  confirmTitle?: string;
  /** Confirmation dialog description */
  confirmDescription?: string;
  /** Icon to display with the action */
  icon?: React.ReactNode;
  /** Whether the action is disabled */
  disabled?: boolean;
  /** Tooltip text for the action */
  tooltip?: string;
  /** Loading state for async actions */
  loading?: boolean;
}

/**
 * Search configuration for the CRUD view
 */
export interface SearchConfig {
  /** Whether search is enabled */
  enabled?: boolean;
  /** Placeholder text for search input */
  placeholder?: string;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Custom search handler */
  onSearch?: (term: string) => void;
}

/**
 * Pagination configuration for the CRUD view
 */
export interface PaginationConfig extends PaginationInfo {
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Page size change handler */
  onPageSizeChange?: (pageSize: number) => void;
  /** Available page size options */
  pageSizeOptions?: number[];
}

/**
 * Main configuration interface for the GenericCrudView
 * @template TItem - The type of items being managed
 */
export interface CrudConfig<TItem = any> {
  /* ========================================
   * PAGE CONFIGURATION
   * ======================================== */
  /** Translation key for the page title */
  titleKey: string;
  /** Translation key for the page subtitle */
  subtitleKey: string;
  /** Custom subtitle text (overrides subtitleKey) */
  customSubtitle?: string;

  /* ========================================
   * TABLE & FORM CONFIGURATION
   * ======================================== */
  /** Column definitions for the table */
  columns: CrudColumn<TItem>[];
  /** Field definitions for create form */
  createFields: FieldConfig[];
  /** Field definitions for edit form */
  editFields: FieldConfig[];
  /** Initial values for create form */
  createInitialValues?: Record<string, any>;
  /** Function to get initial values for edit form */
  editInitialValues?: (item: TItem) => Record<string, any>;

  /* ========================================
   * ACTION CONFIGURATION
   * ======================================== */
  /** Function to generate individual row actions */
  getActions?: (vm: any, t: any, handleDelete?: (item: TItem) => void) => CrudAction<TItem>[];
  /** Generic bulk actions for selected items */
  bulkActions?: BulkAction[];
  /** Always-visible custom actions */
  customActions?: CustomAction[];

  /* ========================================
   * DELETE CONFIGURATION
   * ======================================== */
  /** Function to get display name for delete confirmations */
  getItemDisplayName?: (item: TItem) => string;
  /** Translation key for item type */
  itemTypeKey?: string;
  /** Direct delete service function */
  deleteService?: (id: string) => Promise<void>;

  /* ========================================
   * FEATURE TOGGLES
   * ======================================== */
  /** Enable/disable bulk selection */
  enableBulkActions?: boolean;
  /** Hide default refresh/add buttons */
  hideDefaultActions?: boolean;

  /* ========================================
   * CUSTOMIZATION OPTIONS
   * ======================================== */
  /** Custom content above the table */
  customHeaderContent?: React.ReactNode;
  /** Custom content below the table */
  customFooterContent?: React.ReactNode;
  /** Custom props to pass to GenericTable */
  customTableProps?: any;
  /** Custom props to pass to modals */
  customModalProps?: any;
  /** Form key to force re-render when form fields change */
  formKey?: number;
  /** @deprecated Use customActions instead */
  customToolbarActions?: React.ReactNode;
  /** @deprecated Use bulkActions instead */
  customBulkActions?: React.ReactNode;
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
      },
      {
        itemName: itemDisplayName,
        itemType: itemType,
        confirmTitle: t("common.confirmDelete"),
        confirmDescription: t("common.deleteConfirmation").replace("{name}", itemDisplayName),
      }
    );
  }, [deleteSystem, viewModel, config, t]);

  // Generic bulk action handler
  const handleBulkAction = useCallback(async (action: BulkAction, selectedIds: string[]) => {
    await deleteSystem.confirmDelete(
      async () => {
        await action.onClick(selectedIds);
        await viewModel.refreshItems();
      },
      {
        itemName: `${selectedIds.length} items`,
        itemType: config?.itemTypeKey ? t(config.itemTypeKey) : 'Items',
        confirmTitle: action.confirmTitle || action.label,
        confirmDescription: action.confirmDescription || `Are you sure you want to ${action.label.toLowerCase()} ${selectedIds.length} items?`,
      }
    );
  }, [deleteSystem, viewModel, config, t]);

  // Generic custom action handler
  const handleCustomAction = useCallback(async (action: CustomAction) => {
    await deleteSystem.confirmDelete(
      async () => {
        await action.onClick();
        await viewModel.refreshItems();
      },
      {
        itemName: "all items",
        itemType: config?.itemTypeKey ? t(config.itemTypeKey) : 'Items',
        confirmTitle: action.confirmTitle || action.label,
        confirmDescription: action.confirmDescription || `Are you sure you want to ${action.label.toLowerCase()}?`,
      }
    );
  }, [deleteSystem, viewModel, config, t]);

  // Generic individual action handler
  const handleIndividualAction = useCallback(async (action: any, item: any) => {
    // If action has confirmTitle, it needs confirmation
    if (action.confirmTitle || action.confirmDescription) {
      const itemDisplayName = config?.getItemDisplayName ? config.getItemDisplayName(item) : item.name || item.id;
      await deleteSystem.confirmDelete(
        async () => {
          await action.onClick(item);
          await viewModel.refreshItems();
        },
        {
          itemName: itemDisplayName,
          itemType: config?.itemTypeKey ? t(config.itemTypeKey) : 'Item',
          confirmTitle: action.confirmTitle || action.label,
          confirmDescription: action.confirmDescription?.replace('{name}', itemDisplayName) || `Are you sure you want to ${action.label.toLowerCase()} ${itemDisplayName}?`,
        }
      );
    } else {
      // No confirmation needed, just execute and refresh
      await action.onClick(item);
      await viewModel.refreshItems();
    }
  }, [deleteSystem, viewModel, config, t]);

  // Use config if provided, otherwise use direct props (backward compatibility)
  const title = config ? t(config.titleKey) : propTitle!;
  const subtitle = config ? (config.customSubtitle || t(config.subtitleKey)) : propSubtitle;
  const columns = config ? config.columns : propColumns!;
  
  // Wrap actions to use the generic individual action handler
  const rawActions = config?.getActions ? config.getActions(viewModel, t, handleDelete) : propActions;
  const actions = rawActions?.map(action => ({
    ...action,
    onClick: action.onClick === handleDelete ? handleDelete : (item: any) => handleIndividualAction(action, item)
  }));
  
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
          {/* Always-visible custom actions */}
          {config?.customActions?.map((action, index) => (
            <Button
              key={index}
              onClick={() => handleCustomAction(action)}
              variant={action.variant || "outline"}
              size={getButtonSize()}
              className={cn("flex-1 sm:flex-none", action.className)}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}

          {/* Generic bulk actions */}
          {config?.bulkActions && viewModel.selectedItems.length > 0 && 
            config.bulkActions.map((action, index) => (
              <Button
                key={index}
                onClick={() => handleBulkAction(action, viewModel.selectedItems)}
                variant={action.variant || "outline"}
                size={getButtonSize()}
                className={cn("flex-1 sm:flex-none", action.className)}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label} ({viewModel.selectedItems.length})
              </Button>
            ))
          }

          {/* Legacy custom bulk actions (deprecated) */}
          {config?.customBulkActions && viewModel.selectedItems.length > 0 && config.customBulkActions}

          {/* Default bulk delete */}
          {viewModel.selectedItems.length > 0 && !config?.customBulkActions && !config?.bulkActions && (config?.enableBulkActions !== false) && (
            <Button
              onClick={viewModel.deleteSelectedItems}
              variant="destructive"
              size={getButtonSize()}
              className="flex-1 sm:flex-none"
            >
              {t("common.delete")} ({viewModel.selectedItems.length})
            </Button>
          )}

          {/* Legacy custom toolbar actions (deprecated) */}
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
          initialValues={config?.createInitialValues || {}}
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
        modal={false}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`${t("common.edit")} ${title}`}</DialogTitle>
          </DialogHeader>
          <GenericForm
            key={`edit-form-${viewModel.editingItem?.id || 'new'}-${JSON.stringify(editFields?.map(f => f.name).sort())}-${config?.formKey || 0}`}
            fields={editFields || createFields}
            onSubmit={(data) => {
              if (viewModel.editingItem) {
                return viewModel.updateItem(viewModel.editingItem.id, data);
              }
              return Promise.resolve();
            }}
            initialValues={config?.editInitialValues && viewModel.editingItem ? config.editInitialValues(viewModel.editingItem) : (viewModel.editingItem || {})}
            onCancel={() => viewModel.closeEditModal()}
          />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog
        open={viewModel.viewModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            viewModel.closeViewModal();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`${t("common.view")} ${title}`}</DialogTitle>
          </DialogHeader>
          <GenericForm
            fields={editFields || createFields}
            initialValues={viewModel.viewItem || {}}
            onSubmit={async () => {}} // No-op for read-only
            onCancel={viewModel.closeViewModal}
            readOnly={true}
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

