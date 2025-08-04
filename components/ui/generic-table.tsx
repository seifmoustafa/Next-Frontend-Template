"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { useI18n } from "@/providers/i18n-provider"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: T) => React.ReactNode
}

interface Action<T> {
  label: string
  onClick: (row: T) => void
  variant?: "default" | "destructive"
}

interface Pagination {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

interface GenericTableProps<T> {
  data: T[]
  columns: Column<T>[]
  actions?: Action<T>[]
  loading?: boolean
  pagination?: Pagination
}

export function GenericTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  loading,
  pagination,
}: GenericTableProps<T>) {
  const { t, direction } = useI18n()
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {sortedData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">{t("common.noData")}</div>
        ) : (
          sortedData.map((row, index) => (
            <div key={index} className="bg-card border rounded-lg p-4 space-y-3">
              {columns.map((column) => (
                <div key={String(column.key)} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{column.label}:</span>
                  <span className="text-sm">
                    {column.render ? column.render(row[column.key], row) : String(row[column.key])}
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
                          className={action.variant === "destructive" ? "text-destructive focus:text-destructive" : ""}
                        >
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={cn(
                      "font-semibold text-foreground h-12",
                      direction === "rtl" ? "text-right" : "text-left",
                      column.width && `w-${column.width}`,
                    )}
                  >
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(column.key)}
                        className={cn(
                          "h-auto p-0 font-semibold hover:bg-transparent",
                          direction === "rtl" ? "justify-end" : "justify-start",
                        )}
                      >
                        {column.label}
                        <ArrowUpDown className={cn("h-4 w-4", direction === "rtl" ? "mr-2" : "ml-2")} />
                      </Button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
                {actions && actions.length > 0 && (
                  <TableHead className={cn("w-16", direction === "rtl" ? "text-right" : "text-left")}>
                    {t("users.actions")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {t("common.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={cn("py-4 align-middle", direction === "rtl" ? "text-right" : "text-left")}
                      >
                        {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                      </TableCell>
                    ))}
                    {actions && actions.length > 0 && (
                      <TableCell className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={direction === "rtl" ? "start" : "end"}>
                            {actions.map((action, actionIndex) => (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={() => action.onClick(row)}
                                className={
                                  action.variant === "destructive" ? "text-destructive focus:text-destructive" : ""
                                }
                              >
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            صفحة {pagination.currentPage} من {pagination.totalPages}
          </p>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="hover-lift"
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="hover-lift"
            >
              التالي
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
