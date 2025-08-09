"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown, Search } from "lucide-react";
import {
  Pagination as Pager,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface Action<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: "default" | "destructive" | "ghost";
  className?: string;
}

interface Pagination {
  itemsCount: number;
  pageSize: number;
  currentPage: number;
  pagesCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  loading?: boolean;
  pagination?: Pagination;
  selectable?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selected: string[]) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onSearch?: (term: string) => void;
  searchValue?: string;
}

export function GenericTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  loading,
  pagination,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  searchPlaceholder,
  emptyMessage,
  onSearch,
  searchValue,
}: GenericTableProps<T>) {
  const { t, direction } = useI18n();
  const settings = useSettings();
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState(searchValue ?? "");

  useEffect(() => {
    setSearchTerm(searchValue ?? "");
  }, [searchValue]);

  useEffect(() => {
    if (!onSearch) return;
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  const placeholder = searchPlaceholder ?? t("common.search");
  const empty = emptyMessage ?? t("common.noData");

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredData = onSearch
    ? data
    : data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Get table style classes based on settings
  const getTableContainerClasses = () => {
    const baseClasses = "overflow-hidden transition-all duration-200";

    switch (settings.tableStyle) {
      case "striped":
        return cn(baseClasses, "rounded-lg border bg-card");
      case "bordered":
        return cn(baseClasses, "rounded-lg border-2 border-border bg-card");
      case "minimal":
        return cn(baseClasses, "rounded-none border-0 bg-transparent");
      default:
        return cn(baseClasses, "rounded-lg border bg-card shadow-sm");
    }
  };

  const getRowClasses = (index: number, isSelected: boolean = false) => {
    const baseClasses = "transition-all duration-200 border-b";

    let styleClasses = "";
    switch (settings.tableStyle) {
      case "striped":
        styleClasses =
          index % 2 === 0
            ? "bg-muted/30 hover:bg-muted/50"
            : "bg-card hover:bg-muted/30";
        break;
      case "bordered":
        styleClasses = "border-b-2 hover:bg-muted/30 bg-card";
        break;
      case "minimal":
        styleClasses = "border-b-0 hover:bg-muted/20 bg-transparent";
        break;
      default:
        styleClasses = "hover:bg-muted/30 bg-card";
    }

    if (isSelected) {
      styleClasses += " bg-primary/10 border-primary/20";
    }

    return cn(baseClasses, styleClasses);
  };

  const getHeaderClasses = () => {
    const baseClasses = "font-semibold text-foreground transition-colors";

    let heightClass = "";
    switch (settings.spacingSize) {
      case "compact":
        heightClass = "h-10";
        break;
      case "comfortable":
        heightClass = "h-14";
        break;
      case "spacious":
        heightClass = "h-16";
        break;
      default:
        heightClass = "h-12";
    }

    switch (settings.tableStyle) {
      case "striped":
        return cn(baseClasses, heightClass, "bg-muted/70 border-b-2");
      case "bordered":
        return cn(baseClasses, heightClass, "bg-muted/50 border-b-2");
      case "minimal":
        return cn(baseClasses, heightClass, "bg-transparent border-b");
      default:
        return cn(baseClasses, heightClass, "bg-muted/50 border-b");
    }
  };

  const getCellPadding = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "px-3 py-2";
      case "comfortable":
        return "px-6 py-4";
      case "spacious":
        return "px-8 py-6";
      default:
        return "px-4 py-3";
    }
  };

  const getCardClasses = () => {
    const baseClasses =
      "border rounded-lg p-4 space-y-3 transition-all duration-200";

    switch (settings.cardStyle) {
      case "glass":
        return cn(baseClasses, "bg-white/10 backdrop-blur border-white/20");
      case "solid":
        return cn(baseClasses, "bg-muted border-0");
      case "bordered":
        return cn(baseClasses, "border-2");
      case "elevated":
        return cn(baseClasses, "shadow-lg border-0 bg-card");
      default:
        return cn(baseClasses, "bg-card");
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-10 rtl:pl-4 rtl:pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {sortedData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">{empty}</div>
        ) : (
          sortedData.map((row, index) => {
            const isSelected = selectable && selectedItems.includes(row.id);
            return (
              <div
                key={index}
                className={cn(
                  getCardClasses(),
                  isSelected && "ring-2 ring-primary"
                )}
              >
                {selectable && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse pb-2 border-b">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (onSelectionChange) {
                          const newSelected = checked
                            ? [...selectedItems, row.id]
                            : selectedItems.filter((id) => id !== row.id);
                          onSelectionChange(newSelected);
                        }
                      }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {t("table.select")}
                    </span>
                  </div>
                )}
                {columns.map((column) => (
                  <div
                    key={String(column.key)}
                    className="flex justify-between items-center"
                  >
                    <span
                      className={cn(
                        "font-medium text-muted-foreground",
                        settings.fontSize === "small"
                          ? "text-xs"
                          : settings.fontSize === "large"
                          ? "text-base"
                          : "text-sm"
                      )}
                    >
                      {column.label}:
                    </span>
                    <span
                      className={cn(
                        settings.fontSize === "small"
                          ? "text-xs"
                          : settings.fontSize === "large"
                          ? "text-base"
                          : "text-sm"
                      )}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key])}
                    </span>
                  </div>
                ))}
                {actions && actions.length > 0 && (
                  <div className="flex justify-end pt-2 border-t">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.map((action, actionIndex) => (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={
                              action.variant === "destructive"
                                ? "text-destructive focus:text-destructive"
                                : ""
                            }
                          >
                            {action.icon && (
                              <action.icon className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            )}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className={cn("hidden md:block", getTableContainerClasses())}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className={getHeaderClasses()}>
                {selectable && (
                  <TableHead className={cn(
                    "w-12", 
                    getCellPadding(),
                    "relative"
                  )}>
                    <div className={cn(
                      "absolute inset-0 flex items-center",
                      direction === "rtl" ? "right-4" : "left-4"
                    )}>
                      <Checkbox
                        checked={
                          selectedItems.length === sortedData.length &&
                          sortedData.length > 0
                        }
                        onCheckedChange={(checked) => {
                          if (onSelectionChange) {
                            const newSelected = checked
                              ? sortedData.map((row) => row.id)
                              : [];
                            onSelectionChange(newSelected);
                          }
                        }}
                      />
                    </div>
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={cn(
                      "font-semibold text-foreground",
                      getCellPadding(),
                      direction === "rtl" ? "text-right" : "text-left",
                      column.width && `w-${column.width}`,
                      settings.fontSize === "small"
                        ? "text-xs"
                        : settings.fontSize === "large"
                        ? "text-base"
                        : "text-sm"
                    )}
                  >
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(column.key)}
                        className={cn(
                          "h-auto p-0 font-semibold hover:bg-transparent",
                          direction === "rtl" ? "justify-end" : "justify-start"
                        )}
                      >
                        {column.label}
                        <ArrowUpDown
                          className={cn(
                            "h-4 w-4",
                            direction === "rtl" ? "mr-2" : "ml-2"
                          )}
                        />
                      </Button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
                {actions && actions.length > 0 && (
                  <TableHead
                    className={cn(
                      "w-16",
                      getCellPadding(),
                      direction === "rtl" ? "text-right" : "text-left"
                    )}
                  >
                    {t("table.actions")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)
                    }
                    className="h-32 text-center text-muted-foreground"
                  >
                    {empty}
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row, index) => {
                  const isSelected =
                    selectable && selectedItems.includes(row.id);
                  return (
                    <TableRow
                      key={index}
                      className={getRowClasses(index, isSelected)}
                    >
                      {selectable && (
                        <TableCell className={cn(
                          getCellPadding(),
                          "relative"
                        )}>
                          <div className={cn(
                            "absolute inset-0 flex items-center",
                            direction === "rtl" ? "right-4" : "left-4"
                          )}>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (onSelectionChange) {
                                  const newSelected = checked
                                    ? [...selectedItems, row.id]
                                    : selectedItems.filter((id) => id !== row.id);
                                  onSelectionChange(newSelected);
                                }
                              }}
                            />
                          </div>
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell
                          key={String(column.key)}
                          className={cn(
                            "align-middle",
                            getCellPadding(),
                            direction === "rtl" ? "text-right" : "text-left",
                            settings.fontSize === "small"
                              ? "text-xs"
                              : settings.fontSize === "large"
                              ? "text-base"
                              : "text-sm"
                          )}
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : String(row[column.key])}
                        </TableCell>
                      ))}
                      {actions && actions.length > 0 && (
                        <TableCell className={getCellPadding()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align={direction === "rtl" ? "start" : "end"}
                            >
                              {actions.map((action, actionIndex) => (
                                <DropdownMenuItem
                                  key={actionIndex}
                                  onClick={() => action.onClick(row)}
                                  className={cn(
                                    action.variant === "destructive"
                                      ? "text-destructive focus:text-destructive"
                                      : "",
                                    action.className
                                  )}
                                >
                                  {action.icon && (
                                    <action.icon className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                                  )}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Professional Pagination */}
      {pagination && (
        <div className="border-t bg-background/50 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 gap-4">
            {/* Results Info */}
            <div className="flex items-center gap-4">
              <p
                className={cn(
                  "text-muted-foreground font-medium",
                  settings.fontSize === "small"
                    ? "text-xs"
                    : settings.fontSize === "large"
                    ? "text-base"
                    : "text-sm"
                )}
              >
                {(() => {
                  const start =
                    (pagination.currentPage - 1) * pagination.pageSize + 1;
                  const end = Math.min(
                    pagination.currentPage * pagination.pageSize,
                    pagination.itemsCount
                  );
                  return `${t("table.showing")} ${start}-${end} ${t("table.of")} ${pagination.itemsCount} ${t("table.results")}`;
                })()}
              </p>
              
              {/* Page Size Selector */}
              {pagination.onPageSizeChange && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("table.show")}:
                  </span>
                  <Select
                    value={String(pagination.pageSize)}
                    onValueChange={(v) => pagination.onPageSizeChange?.(Number(v))}
                  >
                    <SelectTrigger className="w-[80px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 25, 50, 100].map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">
                    {t("table.perPage")}
                  </span>
                </div>
              )}
            </div>

            {/* Advanced Pagination Controls */}
            {pagination.pagesCount > 1 && (
              <div className="flex items-center gap-2">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className={cn(
                    "h-8 w-8 p-0",
                    direction === "rtl" && "rotate-180"
                  )}
                  title={t("table.firstPage")}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </Button>

                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={cn(
                    "h-8 w-8 p-0",
                    direction === "rtl" && "rotate-180"
                  )}
                  title={t("table.previousPage")}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>

                {/* Page Numbers with Smart Truncation */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const current = pagination.currentPage;
                    const total = pagination.pagesCount;
                    const pages: (number | string)[] = [];

                    if (total <= 7) {
                      // Show all pages if 7 or fewer
                      for (let i = 1; i <= total; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Smart truncation for many pages
                      if (current <= 4) {
                        // Near beginning: 1 2 3 4 5 ... 10
                        for (let i = 1; i <= 5; i++) pages.push(i);
                        pages.push("...");
                        pages.push(total);
                      } else if (current >= total - 3) {
                        // Near end: 1 ... 6 7 8 9 10
                        pages.push(1);
                        pages.push("...");
                        for (let i = total - 4; i <= total; i++) pages.push(i);
                      } else {
                        // Middle: 1 ... 4 5 6 ... 10
                        pages.push(1);
                        pages.push("...");
                        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
                        pages.push("...");
                        pages.push(total);
                      }
                    }

                    return pages.map((page, index) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-2 py-1 text-muted-foreground"
                          >
                            ...
                          </span>
                        );
                      }

                      const pageNum = page as number;
                      const isActive = pageNum === current;

                      return (
                        <Button
                          key={pageNum}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => pagination.onPageChange(pageNum)}
                          className={cn(
                            "h-8 w-8 p-0",
                            isActive && "bg-primary text-primary-foreground shadow-sm"
                          )}
                        >
                          {pageNum}
                        </Button>
                      );
                    });
                  })()}
                </div>

                {/* Next Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.pagesCount}
                  className={cn(
                    "h-8 w-8 p-0",
                    direction === "rtl" && "rotate-180"
                  )}
                  title={t("table.nextPage")}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>

                {/* Last Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.pagesCount)}
                  disabled={pagination.currentPage === pagination.pagesCount}
                  className={cn(
                    "h-8 w-8 p-0",
                    direction === "rtl" && "rotate-180"
                  )}
                  title={t("table.lastPage")}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </Button>

                {/* Page Jump Input */}
                <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {t("table.goToPage")}:
                  </span>
                  <Input
                    type="number"
                    min={1}
                    max={pagination.pagesCount}
                    className="w-16 h-8 text-center"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const value = parseInt((e.target as HTMLInputElement).value);
                        if (value >= 1 && value <= pagination.pagesCount) {
                          pagination.onPageChange(value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                    placeholder={String(pagination.currentPage)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
