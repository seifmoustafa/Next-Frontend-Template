"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GenericTable } from "@/components/ui/generic-table";
import { GenericModal } from "@/components/ui/generic-modal";
import { GenericForm, FieldConfig } from "@/components/forms/generic-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useSettings } from "@/providers/settings-provider";
import { cn } from "@/lib/utils";
import type { PaginationInfo } from "@/lib/pagination";
import { useI18n } from "@/providers/i18n-provider";

export interface CrudColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface CrudAction<TItem> {
  label: string;
  onClick: (item: TItem) => void;
  variant?: "default" | "ghost" | "destructive";
  className?: string;
}

export interface SimpleCrudConfig<TItem> {
  // Page configuration
  titleKey: string; // Translation key for title
  subtitleKey: string; // Translation key for subtitle
  
  // Table configuration
  columns: CrudColumn[];
  createFields: FieldConfig[];
  editFields: FieldConfig[];
  
  // Actions configuration
  getActions: (vm: any, t: any) => CrudAction<TItem>[];
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
  config?: SimpleCrudConfig<T>;
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

  // Use config if provided, otherwise use direct props (backward compatibility)
  const title = config ? t(config.titleKey) : propTitle!;
  const subtitle = config ? t(config.subtitleKey) : propSubtitle;
  const columns = config ? config.columns : propColumns!;
  const actions = config ? config.getActions(viewModel, t) : propActions;
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
          {viewModel.selectedItems.length > 0 && (
            <Button
              onClick={viewModel.deleteSelectedItems}
              variant="destructive"
              size={getButtonSize()}
              className="flex-1 sm:flex-none"
            >
              {t("common.delete")} ({viewModel.selectedItems.length})
            </Button>
          )}
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
        </div>
      </div>

      <Card className={getCardClasses()}>
        <CardContent className="p-0">
          <GenericTable
            data={viewModel.items}
            columns={columns}
            actions={actions}
            loading={viewModel.loading}
            selectable
            selectedItems={viewModel.selectedItems}
            onSelectionChange={viewModel.setSelectedItems}
            pagination={pagination ? {
              ...pagination,
              currentPage: pagination.page, // Map page to currentPage for GenericTable
            } : undefined}
            onSearch={search?.onChange}
            searchValue={search?.value}
            searchInputRef={search?.inputRef}
          />
        </CardContent>
      </Card>

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

      <GenericModal
        open={viewModel.isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            viewModel.closeEditModal();
          }
        }}
        title={`${t("common.edit")} ${title}`}
      >
        <GenericForm
          fields={editFields || createFields}
          onSubmit={(data) =>
            viewModel.editingItem &&
            viewModel.updateItem(viewModel.editingItem.id, data)
          }
          initialValues={viewModel.editingItem || {}}
          onCancel={viewModel.closeEditModal}
        />
      </GenericModal>
    </div>
  );
}

