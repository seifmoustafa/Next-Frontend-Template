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
  searchInputRef?: React.RefObject<HTMLInputElement>;
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
  searchInputRef,
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
    const baseClasses = "overflow-hidden transition-all duration-300";

    switch (settings.tableStyle) {
      case "striped":
        return cn(baseClasses, "rounded-lg border bg-card");
      case "bordered":
        return cn(baseClasses, "rounded-lg border-2 border-border bg-card");
      case "minimal":
        return cn(baseClasses, "rounded-none border-0 bg-transparent");
      case "glass":
        return cn(
          baseClasses,
          "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl",
          "dark:bg-black/20 dark:border-white/10",
          "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none",
          "relative"
        );
      case "neon":
        return cn(
          baseClasses,
          "rounded-xl border-2 border-primary/30 bg-black/90 shadow-[0_0_30px_rgba(var(--primary),0.3)]",
          "dark:bg-black/95",
          "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-primary/10 before:to-transparent before:pointer-events-none",
          "after:absolute after:inset-0 after:rounded-xl after:shadow-[inset_0_0_20px_rgba(var(--primary),0.1)] after:pointer-events-none",
          "relative animate-pulse"
        );
      case "gradient":
        return cn(
          baseClasses,
          "rounded-2xl border-0 bg-gradient-to-br from-primary/20 via-background to-primary/10 shadow-2xl",
          "before:absolute before:inset-[1px] before:rounded-2xl before:bg-gradient-to-br before:from-background/95 before:to-background/90 before:backdrop-blur-sm",
          "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br after:from-white/10 after:to-transparent after:pointer-events-none",
          "relative"
        );
      case "neumorphism":
        return cn(
          baseClasses,
          "rounded-3xl border-0 bg-background",
          "shadow-[20px_20px_40px_rgba(0,0,0,0.1),-20px_-20px_40px_rgba(255,255,255,0.1)]",
          "dark:shadow-[20px_20px_40px_rgba(0,0,0,0.3),-20px_-20px_40px_rgba(255,255,255,0.05)]",
          "before:absolute before:inset-[2px] before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none"
        );
      case "cyberpunk":
        return cn(
          baseClasses,
          "rounded-none border-2 border-primary bg-black/95 shadow-[0_0_50px_rgba(var(--primary),0.4)]",
          "before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-gradient-to-r before:from-transparent before:via-primary before:to-transparent before:animate-pulse",
          "after:absolute after:bottom-0 after:right-0 after:h-full after:w-0.5 after:bg-gradient-to-t after:from-transparent after:via-primary after:to-transparent after:animate-pulse",
          "relative"
        );
      case "luxury":
        return cn(
          baseClasses,
          "rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-50/50 to-amber-100/30 shadow-2xl",
          "dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-400/20",
          "hover:shadow-3xl hover:scale-[1.02] transition-all duration-300"
        );
      case "matrix":
        return cn(
          baseClasses,
          "rounded-none border-2 border-primary/30 bg-black/95 shadow-[0_0_30px_hsl(var(--primary)/0.4)]",
          "backdrop-blur-sm relative overflow-hidden",
          "before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent_0%,hsl(var(--primary)/0.1)_50%,transparent_100%)] before:animate-pulse",
          "dark:bg-black/98 dark:border-primary/40"
        );
      case "diamond":
        return cn(
          baseClasses,
          "rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/15",
          "shadow-[0_0_40px_hsl(var(--primary)/0.3)] backdrop-blur-xl relative overflow-hidden",
          "before:absolute before:inset-0 before:bg-[conic-gradient(from_0deg,transparent_0%,hsl(var(--primary)/0.1)_25%,hsl(var(--primary)/0.15)_50%,hsl(var(--primary)/0.1)_75%,transparent_100%)] before:animate-spin before:duration-[8s]",
          "dark:from-primary/20 dark:via-primary/10 dark:to-primary/25 dark:border-primary/30"
        );
      default:
        return cn(baseClasses, "rounded-lg border bg-card shadow-sm");
    }
  };

  const getRowClasses = (index: number, isSelected: boolean = false) => {
    const baseClasses = "transition-all duration-300 border-b";

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
      case "glass":
        styleClasses = cn(
          "border-b border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm",
          "dark:border-white/5 dark:bg-black/10 dark:hover:bg-black/20",
          index % 2 === 0 && "bg-white/10 dark:bg-black/20"
        );
        break;
      case "neon":
        styleClasses = cn(
          "border-b border-primary/20 bg-black/50 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(var(--primary),0.2)]",
          "dark:bg-black/70 dark:hover:bg-primary/5",
          index % 2 === 0 && "bg-primary/5 dark:bg-primary/5"
        );
        break;
      case "gradient":
        styleClasses = cn(
          "border-b border-primary/10 bg-gradient-to-r from-transparent via-primary/5 to-transparent",
          "hover:from-primary/10 hover:via-primary/15 hover:to-primary/10 hover:shadow-lg",
          index % 2 === 0 && "from-primary/5 via-primary/10 to-primary/5"
        );
        break;
      case "neumorphism":
        styleClasses = cn(
          "border-b-0 bg-background hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.1),inset_-5px_-5px_10px_rgba(255,255,255,0.1)]",
          "dark:hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.2),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]",
          index % 2 === 0 &&
            "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]"
        );
        break;
      case "cyberpunk":
        styleClasses = cn(
          "border-b border-primary/30 bg-black/80 hover:bg-primary/10 hover:border-primary/50",
          "hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:text-primary",
          "dark:bg-black/90",
          index % 2 === 0 && "bg-primary/5 border-primary/20"
        );
        break;
      case "luxury":
        styleClasses = cn(
          "border-b border-amber-200/20 bg-gradient-to-r from-amber-50/20 to-transparent",
          "hover:from-amber-100/30 hover:to-amber-50/20 hover:shadow-lg hover:shadow-amber-200/20",
          "dark:border-amber-400/20 dark:from-amber-900/10 dark:hover:from-amber-800/20",
          index % 2 === 0 &&
            "from-amber-100/30 to-amber-50/10 dark:from-amber-900/20 dark:to-amber-800/10"
        );
        break;
      case "matrix":
        styleClasses = cn(
          "border-b border-primary/30 bg-black/90 hover:bg-primary/10 hover:border-primary/50",
          "text-primary font-mono text-sm dark:bg-black/95",
          index % 2 === 0 && "bg-primary/5 border-primary/20"
        );
        break;
      case "diamond":
        styleClasses = cn(
          "border-b border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/15",
          "hover:from-primary/20 hover:via-primary/15 hover:to-primary/25 text-primary",
          "dark:from-primary/10 dark:via-primary/5 dark:to-primary/15 dark:text-primary dark:border-primary/20",
          index % 2 === 0 &&
            "from-primary/15 via-primary/10 to-primary/20 dark:from-primary/15 dark:via-primary/10 dark:to-primary/20"
        );
        break;
      default:
        styleClasses = "hover:bg-muted/30 bg-card";
    }

    if (isSelected) {
      switch (settings.tableStyle) {
        case "glass":
          styleClasses += " bg-primary/20 border-primary/30 backdrop-blur-md";
          break;
        case "neon":
          styleClasses +=
            " bg-primary/20 border-primary/50 shadow-[0_0_25px_rgba(var(--primary),0.4)]";
          break;
        case "gradient":
          styleClasses +=
            " from-primary/20 via-primary/30 to-primary/20 shadow-lg shadow-primary/20";
          break;
        case "neumorphism":
          styleClasses +=
            " shadow-[inset_8px_8px_16px_rgba(var(--primary),0.1),inset_-8px_-8px_16px_rgba(var(--primary),0.05)]";
          break;
        case "cyberpunk":
          styleClasses +=
            " bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]";
          break;
        case "luxury":
          styleClasses +=
            " from-amber-200/40 to-amber-100/30 border-amber-300/40 shadow-lg shadow-amber-200/30";
          break;
        case "matrix":
          styleClasses +=
            " bg-primary/20 border-primary/50 text-primary shadow-[0_0_20px_hsl(var(--primary)/0.4)]";
          break;
        case "diamond":
          styleClasses +=
            " from-primary/25 via-primary/20 to-primary/30 border-primary/40 shadow-lg shadow-primary/30";
          break;
        default:
          styleClasses += " bg-primary/10 border-primary/20";
      }
    }

    return cn(baseClasses, styleClasses);
  };

  const getHeaderClasses = () => {
    const baseClasses =
      "font-semibold text-foreground transition-all duration-300";

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
      case "glass":
        return cn(
          baseClasses,
          heightClass,
          "bg-white/20 border-b border-white/30 backdrop-blur-md text-foreground font-bold",
          "dark:bg-black/30 dark:border-white/20",
          "hover:bg-white/30 dark:hover:bg-black/40"
        );
      case "neon":
        return cn(
          baseClasses,
          heightClass,
          "bg-black/90 border-b-2 border-primary/50 text-primary font-bold",
          "shadow-[0_0_15px_rgba(var(--primary),0.3)]",
          "dark:bg-black/95",
          "hover:border-primary hover:shadow-[0_0_25px_rgba(var(--primary),0.4)]"
        );
      case "gradient":
        return cn(
          baseClasses,
          heightClass,
          "bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 border-b border-primary/30",
          "text-foreground font-bold shadow-lg",
          "hover:from-primary/40 hover:via-primary/30 hover:to-primary/40"
        );
      case "neumorphism":
        return cn(
          baseClasses,
          heightClass,
          "bg-background border-b-0 font-bold",
          "shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.1)]",
          "dark:shadow-[8px_8px_16px_rgba(0,0,0,0.2),-8px_-8px_16px_rgba(255,255,255,0.05)]",
          "hover:shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.15)]"
        );
      case "cyberpunk":
        return cn(
          baseClasses,
          heightClass,
          "bg-black/95 border-b-2 border-primary text-primary font-bold uppercase tracking-wider",
          "shadow-[0_0_20px_rgba(var(--primary),0.4)] text-center",
          "hover:bg-primary/10 hover:shadow-[0_0_30px_rgba(var(--primary),0.6)]"
        );
      case "luxury":
        return cn(
          baseClasses,
          heightClass,
          "bg-gradient-to-r from-amber-100/50 via-amber-50/30 to-amber-100/50 border-b border-amber-300/40",
          "dark:from-amber-900/30 dark:via-amber-800/20 dark:to-amber-900/30 dark:border-amber-400/30",
          "text-amber-900 dark:text-amber-100 font-bold shadow-lg shadow-amber-200/20",
          "hover:from-amber-200/60 hover:via-amber-100/40 hover:to-amber-200/60",
          "dark:hover:from-amber-800/40 dark:hover:via-amber-700/30 dark:hover:to-amber-800/40"
        );
      case "matrix":
        return cn(
          baseClasses,
          heightClass,
          "bg-black/95 border-b-2 border-primary/60 text-primary font-bold uppercase tracking-widest",
          "shadow-[0_0_15px_hsl(var(--primary)/0.4)] font-mono text-sm",
          "dark:bg-black/98 dark:border-primary/70 dark:text-primary"
        );
      case "diamond":
        return cn(
          baseClasses,
          heightClass,
          "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/25 border-b-2 border-primary/50",
          "text-primary font-bold shadow-lg shadow-primary/30",
          "dark:from-primary/25 dark:via-primary/15 dark:to-primary/30 dark:border-primary/40"
        );
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
      "border rounded-lg p-4 space-y-3 transition-all duration-300 hover:scale-[1.02]";

    switch (settings.tableStyle) {
      case "glass":
        return cn(
          baseClasses,
          "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl",
          "dark:bg-black/20 dark:border-white/10",
          "hover:bg-white/15 dark:hover:bg-black/30 hover:shadow-3xl"
        );
      case "neon":
        return cn(
          baseClasses,
          "bg-black/90 border-2 border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.3)] rounded-xl",
          "dark:bg-black/95",
          "hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:bg-primary/5"
        );
      case "gradient":
        return cn(
          baseClasses,
          "bg-gradient-to-br from-primary/20 via-background to-primary/10 border-0 shadow-2xl rounded-2xl",
          "hover:from-primary/30 hover:via-background hover:to-primary/20 hover:shadow-3xl"
        );
      case "neumorphism":
        return cn(
          baseClasses,
          "bg-background border-0 rounded-3xl",
          "shadow-[15px_15px_30px_rgba(0,0,0,0.1),-15px_-15px_30px_rgba(255,255,255,0.1)]",
          "dark:shadow-[15px_15px_30px_rgba(0,0,0,0.3),-15px_-15px_30px_rgba(255,255,255,0.05)]",
          "hover:shadow-[20px_20px_40px_rgba(0,0,0,0.15),-20px_-20px_40px_rgba(255,255,255,0.15)]"
        );
      case "cyberpunk":
        return cn(
          baseClasses,
          "bg-black/95 border-2 border-primary rounded-none shadow-[0_0_25px_rgba(var(--primary),0.4)]",
          "before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-gradient-to-r before:from-transparent before:via-primary before:to-transparent",
          "relative",
          "hover:bg-primary/10 hover:shadow-[0_0_40px_rgba(var(--primary),0.6)]"
        );
      case "luxury":
        return cn(
          baseClasses,
          "bg-gradient-to-br from-amber-50/50 to-amber-100/30 border border-amber-200/30 shadow-2xl rounded-2xl",
          "dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-400/20",
          "hover:from-amber-100/60 hover:to-amber-50/40 hover:shadow-3xl hover:shadow-amber-200/30",
          "dark:hover:from-amber-800/30 dark:hover:to-amber-700/20"
        );
      case "matrix":
        return cn(
          baseClasses,
          "bg-black/95 border-2 border-green-400/40 shadow-[0_0_20px_rgba(34,197,94,0.4)] rounded-lg",
          "dark:bg-black/98 dark:border-green-400/50",
          "hover:border-green-400/60 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:bg-green-400/5"
        );
      case "diamond":
        return cn(
          baseClasses,
          "bg-gradient-to-br from-violet-50/40 via-pink-50/30 to-blue-50/40 border-2 border-violet-300/50 shadow-[0_0_25px_rgba(139,92,246,0.4)] rounded-2xl",
          "dark:from-violet-900/30 dark:via-pink-900/20 dark:to-blue-900/30 dark:border-violet-400/40",
          "hover:from-violet-100/50 hover:via-pink-100/40 hover:to-blue-100/50 hover:shadow-[0_0_35px_rgba(139,92,246,0.6)]"
        );
      case "striped":
        return cn(baseClasses, "bg-card border hover:shadow-lg");
      case "bordered":
        return cn(baseClasses, "bg-card border-2 hover:shadow-lg");
      case "minimal":
        return cn(baseClasses, "bg-transparent border-0 hover:bg-muted/20");
      default:
        return cn(baseClasses, "bg-card hover:shadow-lg");
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
          ref={searchInputRef}
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
                  <TableHead
                    className={cn("w-12", getCellPadding(), "relative")}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center",
                        direction === "rtl" ? "right-4" : "left-4"
                      )}
                    >
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
                        <TableCell className={cn(getCellPadding(), "relative")}>
                          <div
                            className={cn(
                              "absolute inset-0 flex items-center",
                              direction === "rtl" ? "right-4" : "left-4"
                            )}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (onSelectionChange) {
                                  const newSelected = checked
                                    ? [...selectedItems, row.id]
                                    : selectedItems.filter(
                                        (id) => id !== row.id
                                      );
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
                  return `${t("table.showing")} ${start}-${end} ${t(
                    "table.of"
                  )} ${pagination.itemsCount} ${t("table.results")}`;
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
                    onValueChange={(v) =>
                      pagination.onPageSizeChange?.(Number(v))
                    }
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
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                </Button>

                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    pagination.onPageChange(pagination.currentPage - 1)
                  }
                  disabled={pagination.currentPage === 1}
                  className={cn(
                    "h-8 w-8 p-0",
                    direction === "rtl" && "rotate-180"
                  )}
                  title={t("table.previousPage")}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
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
                        for (let i = current - 1; i <= current + 1; i++)
                          pages.push(i);
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
                            isActive &&
                              "bg-primary text-primary-foreground shadow-sm"
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
                  onClick={() =>
                    pagination.onPageChange(pagination.currentPage + 1)
                  }
                  disabled={pagination.currentPage === pagination.pagesCount}
                  className={cn(
                    "h-8 w-8 p-0",
                    direction === "rtl" && "rotate-180"
                  )}
                  title={t("table.nextPage")}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
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
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
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
                        const value = parseInt(
                          (e.target as HTMLInputElement).value
                        );
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
