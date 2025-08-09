"use client";

import { useEffect, useMemo, useState } from "react";
import { useSitesTreeViewModel } from "@/viewmodels/site-tree.viewmodel";
import { useServices } from "@/providers/service-provider";
import { useI18n } from "@/providers/i18n-provider";
import { TreeView } from "@/components/ui/tree-view";
import type { Site } from "@/services/site.service";
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

export function SitesView() {
  const { siteService } = useServices();
  const { t } = useI18n();
  const vm = useSitesTreeViewModel(siteService);

  // Fetch on first mount
  useEffect(() => {
    vm.listTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch when pagination or search changes
  useEffect(() => {
    vm.listTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vm.pagination.currentPage, vm.pagination.pageSize, vm.searchTerm]);

  // Parent options for forms (flatten current tree)
  const parentOptions = useMemo(() => {
    const result: { id: string; name: string }[] = [];
    const walk = (nodes: Site[]) => {
      nodes.forEach((n) => {
        result.push({ id: n.id, name: n.siteName });
        if (n.children && n.children.length) walk(n.children);
      });
    };
    walk(vm.tree);
    return result;
  }, [vm.tree]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Site | null>(null);
  const [parentForNew, setParentForNew] = useState<Site | null>(null);
  const [formValues, setFormValues] = useState<{
    siteName: string;
    parentSiteId: string | null;
  }>({
    siteName: "",
    parentSiteId: null,
  });

  const resetForm = () => {
    setEditing(null);
    setParentForNew(null);
    setFormValues({ siteName: "", parentSiteId: null });
  };

  const openAddChild = (parent: Site | null) => {
    setEditing(null);
    setParentForNew(parent);
    setFormValues({
      siteName: "",
      parentSiteId: parent ? parent.id : null,
    });
    setModalOpen(true);
  };

  const openEdit = (site: Site) => {
    setEditing(site);
    setParentForNew(null);
    setFormValues({
      siteName: site.siteName,
      parentSiteId: site.parentSiteId,
    });
    setModalOpen(true);
  };

  const onSubmit = async () => {
    if (editing) {
      await vm.updateSite(editing.id, {
        id: editing.id,
        siteName: formValues.siteName,
        parentSiteId: formValues.parentSiteId,
      });
    } else {
      await vm.createSite({
        siteName: formValues.siteName,
        parentSiteId: formValues.parentSiteId,
      });
    }
    setModalOpen(false);
    resetForm();
  };

  const onDelete = async (site: Site) => {
    await vm.deleteSite(site);
  };

  const toolbar = (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={() => openAddChild(null)}>
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
                    vm.changePage(Math.max(1, vm.pagination.currentPage - 1));
                  }}
                  className={
                    vm.pagination.currentPage === 1
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
                    isActive={page === vm.pagination.currentPage}
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
                        vm.pagination.currentPage + 1
                      )
                    );
                  }}
                  className={
                    vm.pagination.currentPage === vm.pagination.pagesCount
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
    <main className={cn("space-y-4")}>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{t("Sites.title")}</h1>
        <p className="text-muted-foreground">{t("Sites.subtitle")}</p>
      </header>

      <TreeView<Site>
        data={vm.tree}
        getId={(n) => n.id}
        getLabel={(n) => n.siteName}
        getChildren={(n) => n.children ?? []}
        search={{
          value: vm.searchTerm,
          onChange: vm.searchSites,
          placeholder: t("common.search"),
        }}
        toolbar={toolbar}
        loading={vm.loading}
        emptyMessage={t("common.noData")}
        actions={(n) => [
          {
            label: t("common.add_child") ?? "Add child",
            onClick: () => openAddChild(n),
          },
          { label: t("common.edit"), onClick: () => openEdit(n) },
          {
            label: t("common.delete"),
            onClick: () => onDelete(n),
            variant: "destructive",
          },
        ]}
      />

      {/* Create/Edit Modal */}
      <Dialog
        open={modalOpen}
        onOpenChange={(o) => {
          setModalOpen(o);
          if (!o) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing
                ? t("common.edit") + " " + t("Sites.SiteName")
                : t("common.add") + " " + t("Sites.SiteName")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="siteName">{t("Sites.SiteName")}</Label>
              <Input
                id="siteName"
                value={formValues.siteName}
                onChange={(e) =>
                  setFormValues((p) => ({ ...p, siteName: e.target.value }))
                }
                placeholder={t("Sites.form.SiteNamePlaceholder")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parentSite">{t("Sites.parentSiteId")}</Label>
              <Select
                value={formValues.parentSiteId ?? "root"}
                onValueChange={(v) =>
                  setFormValues((p) => ({
                    ...p,
                    parentSiteId: v === "root" ? null : v,
                  }))
                }
              >
                <SelectTrigger id="parentSite">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">{t("Sites.form.root")}</SelectItem>
                  {parentOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {parentForNew && !editing && (
                <p className="text-xs text-muted-foreground">
                  {(t("common.will_add_under") as string) ??
                    "Will be added under"}
                  : {parentForNew.siteName}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={onSubmit}>
              {editing ? t("common.save") : t("common.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Confirmation Dialog */}
      <ConfirmationDialog
        open={vm.showConfirmation}
        onOpenChange={(open) => !open && vm.cancelDelete()}
        title={t("common.confirmDelete")}
        description={`${t("common.deleteConfirmation").replace("{itemType}", vm.deleteOptions.itemType || t("common.item"))} "${vm.deleteOptions.itemName}". ${t("common.deleteWarning")}`}
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
