"use client";

import { useEffect } from "react";
import { TreeView } from "@/components/ui/tree-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination as Pager,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useI18n } from "@/providers/i18n-provider";
import type { TreeViewModel, TreeNode } from "@/hooks/use-tree-view-model";

export interface GenericTreeViewProps<T extends TreeNode, TCreate, TUpdate> {
  viewModel: TreeViewModel<T, TCreate, TUpdate>;
  title: string;
  subtitle: string;
  getId: (node: T) => string;
  getLabel: (node: T) => string;
  getChildren: (node: T) => T[] | undefined;
  renderFormFields: (formValues: any, setFormValues: (values: any) => void, editing: T | null, parentForNew: T | null) => React.ReactNode;
  className?: string;
  showAddRoot?: boolean;
}

export function GenericTreeView<T extends TreeNode, TCreate, TUpdate>({
  viewModel: vm,
  title,
  subtitle,
  getId,
  getLabel,
  getChildren,
  renderFormFields,
  className,
  showAddRoot = true,
}: GenericTreeViewProps<T, TCreate, TUpdate>) {
  const { t } = useI18n();

  // Fetch on mount and when pagination or search changes
  useEffect(() => {
    vm.listTree();
  }, [vm.listTree]);

  // Remove interfering focus management - let natural input behavior work

  const toolbar = (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={() => vm.openAddChild(null)}>
        <Plus className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
        {t("common.add")}
      </Button>
      {/* Pagination controls */}
      <div className="hidden md:flex items-center gap-2">
        <Select
          value={String(vm.pagination.pageSize)}
          onValueChange={(v) => vm.changePageSize(Number(v))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {vm.pagination.pagesCount > 1 && (
          <Pager>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    vm.changePage(Math.max(1, vm.pagination.page - 1));
                  }}
                  className={
                    vm.pagination.page === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              {Array.from(
                { length: vm.pagination.pagesCount },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === vm.pagination.page}
                    onClick={(e) => {
                      e.preventDefault();
                      vm.changePage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    vm.changePage(
                      Math.min(
                        vm.pagination.pagesCount,
                        vm.pagination.page + 1
                      )
                    );
                  }}
                  className={
                    vm.pagination.page === vm.pagination.pagesCount
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pager>
        )}
      </div>
    </div>
  );

  return (
    <main className={cn("space-y-4", className)}>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </header>

      <TreeView<T>
        data={vm.tree}
        getId={getId}
        getLabel={getLabel}
        getChildren={getChildren}
        search={{
          value: vm.searchValue, // Use immediate display value
          onChange: vm.handleSearchChange, // Use new controlled handler
          placeholder: t("common.search"),
          inputRef: vm.searchInputRef,
        }}
        toolbar={toolbar}
        loading={vm.loading}
        emptyMessage={t("common.noData")}
        actions={(n) => [
          {
            label: t("common.add_child") ?? "Add child",
            onClick: () => vm.openAddChild(n),
          },
          { label: t("common.edit"), onClick: () => vm.openEdit(n) },
          {
            label: t("common.delete"),
            onClick: () => vm.deleteItem(n),
            variant: "destructive",
          },
        ]}
      />

      {/* Create/Edit Modal */}
      <Dialog
        open={vm.modalOpen}
        onOpenChange={(o) => {
          vm.setModalOpen(o);
          if (!o) vm.resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {vm.editing
                ? `${t("common.edit")} ${vm.config.itemTypeName}`
                : `${t("common.add")} ${vm.config.itemTypeName}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {renderFormFields(vm.formValues, vm.setFormValues, vm.editing, vm.parentForNew)}
            
            <div className="grid gap-2">
              {vm.parentForNew && !vm.editing && (
                <p className="text-xs text-muted-foreground">
                  {(t("common.will_add_under") as string) ??
                    "Will be added under"}
                  : {getLabel(vm.parentForNew)}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                vm.setModalOpen(false);
                vm.resetForm();
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={vm.onSubmit}>
              {vm.editing ? t("common.save") : t("common.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Confirmation Dialog */}
      <ConfirmationDialog
        open={vm.showConfirmation}
        onOpenChange={(open) => !open && vm.cancelDelete()}
        title={t("common.confirmDelete")}
        description={`${t("common.deleteConfirmation").replace(
          "{itemType}",
          vm.deleteOptions.itemType || t("common.item")
        )} "${vm.deleteOptions.itemName}". ${t("common.deleteWarning")}`}
        confirmText={vm.isDeleting ? t("common.deleting") : t("common.delete")}
        cancelText={t("common.cancel")}
        variant="destructive"
        isLoading={vm.isDeleting}
        onConfirm={vm.executeDelete}
        onCancel={vm.cancelDelete}
      />
    </main>
  );
}
