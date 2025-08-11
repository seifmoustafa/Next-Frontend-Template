"use client";

import React, { useState, useCallback } from "react";
import { GenericCrudView, CrudConfig } from "@/components/ui/generic-crud-view";
import { useGenericCrudViewModel } from "@/hooks/use-generic-crud-viewmodel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Package, TrendingUp, AlertTriangle, Download, Upload, FileText } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";

// Mock Product interface
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "discontinued";
  supplier: string;
  createdAt: string;
  lastUpdated: string;
  isUrgent?: boolean;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 99.99,
    stock: 150,
    status: "active",
    supplier: "TechCorp Ltd",
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-20",
  },
  {
    id: "2",
    name: "Office Chair",
    category: "Furniture",
    price: 299.99,
    stock: 5,
    status: "active",
    supplier: "FurniMax Inc",
    createdAt: "2024-01-10",
    lastUpdated: "2024-01-18",
    isUrgent: true, // Low stock
  },
  {
    id: "3",
    name: "Coffee Maker",
    category: "Appliances",
    price: 149.99,
    stock: 75,
    status: "active",
    supplier: "KitchenPro",
    createdAt: "2024-01-12",
    lastUpdated: "2024-01-19",
  },
  {
    id: "4",
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 79.99,
    stock: 0,
    status: "inactive",
    supplier: "TechCorp Ltd",
    createdAt: "2024-01-08",
    lastUpdated: "2024-01-16",
    isUrgent: true, // Out of stock
  },
  {
    id: "5",
    name: "Desk Lamp",
    category: "Furniture",
    price: 45.99,
    stock: 200,
    status: "active",
    supplier: "LightMax Co",
    createdAt: "2024-01-14",
    lastUpdated: "2024-01-21",
  },
];

// Mock service functions
const mockProductService = {
  getData: async (params: {
    page: number;
    pageSize: number;
    search?: string;
    PageSearch?: string;
  }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const searchTerm = params.search || params.PageSearch || "";
    let filtered = mockProducts;
    if (searchTerm) {
      filtered = mockProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const startIndex = (params.page - 1) * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      pagination: {
        itemsCount: filtered.length,
        pageSize: params.pageSize,
        page: params.page,
        pagesCount: Math.ceil(filtered.length / params.pageSize),
      },
    };
  },
  
  create: async (data: Omit<Product, "id">) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newProduct: Product = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    mockProducts.push(newProduct);
    return newProduct;
  },
  
  update: async (id: string, data: Partial<Product>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts[index] = { 
        ...mockProducts[index], 
        ...data, 
        lastUpdated: new Date().toISOString().split('T')[0] 
      };
      return mockProducts[index];
    }
    throw new Error("Product not found");
  },
  
  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts.splice(index, 1);
    }
  },
};

// Analytics Dashboard Component
function ProductAnalyticsDashboard() {
  const activeProducts = mockProducts.filter(p => p.status === "active").length;
  const lowStockProducts = mockProducts.filter(p => p.stock < 10).length;
  const totalValue = mockProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const avgPrice = mockProducts.reduce((sum, p) => sum + p.price, 0) / mockProducts.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
          <p className="text-xs text-muted-foreground">
            +2 from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{lowStockProducts}</div>
          <p className="text-xs text-muted-foreground">
            Requires attention
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">${totalValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Price</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">${avgPrice.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Across all categories
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Product Statistics Component
function ProductStatistics() {
  const categoryStats = mockProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Product Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryStats).map(([category, count]) => (
            <Badge key={category} variant="secondary">
              {category}: {count}
            </Badge>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()} | Total products: {mockProducts.length}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductsExamplePage() {
  const { t } = useI18n();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Custom action handlers
  const handleExportExcel = useCallback(() => {
    console.log("Exporting to Excel...");
    alert("Excel export functionality would be implemented here!");
  }, []);

  const handleImportCSV = useCallback(() => {
    console.log("Importing from CSV...");
    alert("CSV import functionality would be implemented here!");
  }, []);

  const handleGenerateReport = useCallback(() => {
    console.log("Generating inventory report...");
    alert("Report generation functionality would be implemented here!");
  }, []);

  const handleBulkActivate = useCallback(() => {
    console.log("Bulk activating products:", selectedProducts);
    alert(`Activating ${selectedProducts.length} products!`);
  }, [selectedProducts]);

  const handleBulkDeactivate = useCallback(() => {
    console.log("Bulk deactivating products:", selectedProducts);
    alert(`Deactivating ${selectedProducts.length} products!`);
  }, [selectedProducts]);

  const handleBulkUpdatePrice = useCallback(() => {
    console.log("Bulk updating prices:", selectedProducts);
    alert(`Updating prices for ${selectedProducts.length} products!`);
  }, [selectedProducts]);

  const handleViewAnalytics = useCallback((product: Product) => {
    console.log("Viewing analytics for:", product);
    alert(`Analytics for ${product.name} would open here!`);
  }, []);

  const handleDuplicateProduct = useCallback((product: Product) => {
    console.log("Duplicating product:", product);
    alert(`Duplicating ${product.name}!`);
  }, []);

  const handleViewSupplier = useCallback((product: Product) => {
    console.log("Viewing supplier for:", product);
    alert(`Supplier details for ${product.supplier} would open here!`);
  }, []);

  // Product configuration with all customization features
  const productConfig: CrudConfig<Product> = {
    titleKey: "products.title",
    subtitleKey: "products.subtitle",
    
    // Custom columns with status rendering
    columns: [
      { key: "name", label: "Product Name", sortable: true },
      { key: "category", label: "Category", sortable: true },
      { 
        key: "price", 
        label: "Price", 
        sortable: true,
        render: (value: number) => `$${value.toFixed(2)}`
      },
      { 
        key: "stock", 
        label: "Stock", 
        sortable: true,
        render: (value: number, row: Product) => (
          <div className="flex items-center gap-2">
            <span className={value < 10 ? "text-red-600 font-semibold" : ""}>{value}</span>
            {value < 10 && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
        )
      },
      { 
        key: "status", 
        label: "Status", 
        sortable: true,
        render: (value: string) => (
          <Badge variant={value === "active" ? "default" : value === "inactive" ? "secondary" : "destructive"}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        )
      },
      { key: "supplier", label: "Supplier", sortable: true },
    ],
    
    // Form fields for create/edit
    createFields: [
      { name: "name", label: "Product Name", type: "text", required: true },
      { 
        name: "category", 
        label: "Category", 
        type: "select", 
        options: [
          { value: "Electronics", label: "Electronics" },
          { value: "Furniture", label: "Furniture" },
          { value: "Appliances", label: "Appliances" },
          { value: "Office Supplies", label: "Office Supplies" },
        ],
        required: true 
      },
      { name: "price", label: "Price ($)", type: "text", required: true },
      { name: "stock", label: "Stock Quantity", type: "text", required: true },
      { 
        name: "status", 
        label: "Status", 
        type: "select", 
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "discontinued", label: "Discontinued" },
        ],
        required: true 
      },
      { name: "supplier", label: "Supplier", type: "text", required: true },
    ],
    
    editFields: [
      { name: "name", label: "Product Name", type: "text", required: true },
      { 
        name: "category", 
        label: "Category", 
        type: "select", 
        options: [
          { value: "Electronics", label: "Electronics" },
          { value: "Furniture", label: "Furniture" },
          { value: "Appliances", label: "Appliances" },
          { value: "Office Supplies", label: "Office Supplies" },
        ],
        required: true 
      },
      { name: "price", label: "Price ($)", type: "text", required: true },
      { name: "stock", label: "Stock Quantity", type: "text", required: true },
      { 
        name: "status", 
        label: "Status", 
        type: "select", 
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "discontinued", label: "Discontinued" },
        ],
        required: true 
      },
      { name: "supplier", label: "Supplier", type: "text", required: true },
    ],
    
    // Custom actions for each product
    getActions: (vm, t, handleDelete) => [
      { label: "Edit", onClick: vm.openEditModal },
      { label: "Analytics", onClick: handleViewAnalytics, variant: "ghost" },
      { label: "Duplicate", onClick: handleDuplicateProduct, variant: "ghost" },
      { label: "Supplier", onClick: handleViewSupplier, variant: "ghost" },
      { label: "Delete", onClick: handleDelete, variant: "destructive" },
    ],
    
    // Delete configuration
    getItemDisplayName: (product) => product.name,
    itemTypeKey: "products.itemType",
    deleteService: mockProductService.delete,
    
    // CUSTOMIZATION FEATURES
    
    // Custom analytics dashboard above the table
    customHeaderContent: <ProductAnalyticsDashboard />,
    
    // Custom toolbar actions
    customToolbarActions: (
      <>
        <Button onClick={handleExportExcel} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Excel
        </Button>
        <Button onClick={handleImportCSV} variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
        <Button onClick={handleGenerateReport} variant="secondary" className="gap-2">
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
      </>
    ),
    
    // Custom bulk actions
    customBulkActions: (
      <div className="flex gap-2">
        <Button onClick={handleBulkActivate} variant="default" size="sm">
          Activate Selected
        </Button>
        <Button onClick={handleBulkDeactivate} variant="secondary" size="sm">
          Deactivate Selected
        </Button>
        <Button onClick={handleBulkUpdatePrice} variant="outline" size="sm">
          Update Prices
        </Button>
      </div>
    ),
    
    // Custom footer with statistics
    customFooterContent: <ProductStatistics />,
    
    // Enable bulk actions
    enableBulkActions: true,
    
    // Custom table props for row styling
    customTableProps: {
      rowClassName: (item: Product) => item.isUrgent ? "bg-red-50 dark:bg-red-950/20" : "",
    },
  };

  // Use the generic view model with mock service and config
  const viewModel = useGenericCrudViewModel(
    mockProductService,
    {
      itemTypeName: "Product",
      itemTypeNamePlural: "Products",
      getItemDisplayName: (product: Product) => product.name,
      searchParamName: "search",
    }
  );

  return (
    <div className="container mx-auto py-6">
      <GenericCrudView 
        config={productConfig} 
        viewModel={viewModel}
      />
    </div>
  );
}
