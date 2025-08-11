"use client";

import { GenericCrudView } from "@/components/views/generic-crud-view";
import { useGenericCrudViewModel } from "@/hooks/use-generic-crud-viewmodel";
import { useServices } from "@/providers/service-provider";
import { useI18n } from "@/providers/i18n-provider";
import type { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  CategoriesResponse 
} from "@/services/category.service";
import type { SimpleCrudConfig } from "@/components/views/generic-crud-view";

export function CategoriesView() {
  const { categoryService } = useServices();
  const { t } = useI18n();
  
  // Use generic CRUD view model with stable service references
  const vm = useGenericCrudViewModel<Category, CreateCategoryRequest, UpdateCategoryRequest, CategoriesResponse>(
    {
      getData: categoryService.getCategories.bind(categoryService),
      create: categoryService.createCategory.bind(categoryService),
      update: categoryService.updateCategory.bind(categoryService),
      delete: categoryService.deleteCategory.bind(categoryService),
    },
    {
      itemTypeName: "Category",
      itemTypeNamePlural: "Categories",
      getItemDisplayName: (category: Category) => category.categoryName,
      searchParamName: "search", // Categories API uses search
    }
  );

  // Configuration for the generic view
  const config: SimpleCrudConfig<Category> = {
    titleKey: "categories.title",
    subtitleKey: "categories.subtitle",
    columns: [
      { key: "categoryName", label: t("categories.name"), sortable: true },
      { key: "categoryDescription", label: t("categories.description"), sortable: true },
    ],
    createFields: [
      { name: "categoryName", label: t("categories.form.name"), type: "text", placeholder: t("categories.form.namePlaceholder"), required: true },
      { name: "categoryDescription", label: t("categories.form.description"), type: "text", placeholder: t("categories.form.descriptionPlaceholder"), required: true },
    ],
    editFields: [
      { name: "categoryName", label: t("categories.form.name"), type: "text", placeholder: t("categories.form.namePlaceholder"), required: true },
      { name: "categoryDescription", label: t("categories.form.description"), type: "text", placeholder: t("categories.form.descriptionPlaceholder"), required: true },
      { name: "id", type: "hidden", required: true },
    ],
    getActions: (vm, t) => [
      { label: t("common.edit"), onClick: (item: Category) => vm.openEditModal(item), variant: "ghost" },
      { label: t("common.delete"), onClick: (item: Category) => vm.deleteItem(item), variant: "ghost", className: "text-red-600 hover:text-red-700" },
    ],
  };

  return (
    <>
      <GenericCrudView config={config} viewModel={vm} />
      <vm.ConfirmationDialog />
    </>
  );
}
