"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Circle,
  GitBranch,
} from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";

export type TreeVariant = "lines" | "cards" | "minimal" | "bubble";

export interface TreeAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "ghost";
}

export interface TreeViewProps<T> {
  data: T[];
  getId: (node: T) => string;
  getLabel: (node: T) => string;
  getChildren: (node: T) => T[] | undefined;
  search?: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  };
  actions?: (node: T) => TreeAction[];
  loading?: boolean;
  toolbar?: React.ReactNode;
  emptyMessage?: string;
  defaultExpanded?: boolean;
  onExpandChange?: (expandedIds: string[]) => void;
  className?: string;
  variant?: TreeVariant; // override; otherwise uses settings.treeStyle
}

export function TreeView<T>({
  data,
  getId,
  getLabel,
  getChildren,
  search,
  actions,
  loading,
  toolbar,
  emptyMessage,
  defaultExpanded = true,
  onExpandChange,
  className,
  variant,
}: TreeViewProps<T>) {
  const { direction } = useI18n();
  const settings = useSettings();

  const computedVariant: TreeVariant = useMemo(() => {
    if (variant) return variant;
    return settings.treeStyle;
  }, [variant, settings.treeStyle]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(defaultExpanded);

  // Initialize expand state whenever data changes
  useEffect(() => {
    const next: Record<string, boolean> = {};
    const walk = (nodes: T[]) => {
      nodes.forEach((n) => {
        const id = getId(n);
        next[id] = defaultExpanded;
        const children = getChildren(n) ?? [];
        if (children.length > 0) walk(children);
      });
    };
    walk(data);
    setExpanded(next);
    setIsAllExpanded(defaultExpanded);
  }, [data, defaultExpanded, getChildren, getId]);

  const handleToggleNode = (id: string) => {
    setExpanded((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      onExpandChange?.(Object.keys(next).filter((k) => next[k]));
      return next;
    });
  };

  const expandAll = () => {
    setExpanded((prev) => {
      const all: Record<string, boolean> = {};
      Object.keys(prev).forEach((k) => (all[k] = true));
      onExpandChange?.(Object.keys(all));
      return all;
    });
    setIsAllExpanded(true);
  };

  const collapseAll = () => {
    setExpanded((prev) => {
      const all: Record<string, boolean> = {};
      Object.keys(prev).forEach((k) => (all[k] = false));
      onExpandChange?.([]);
      return all;
    });
    setIsAllExpanded(false);
  };

  const density = useMemo(() => {
    switch (settings.spacingSize) {
      case "compact":
        return { pad: "p-2", childPad: "pl-4 rtl:pl-0 rtl:pr-4" };
      case "spacious":
        return { pad: "p-4", childPad: "pl-8 rtl:pl-0 rtl:pr-8" };
      case "comfortable":
        return { pad: "p-3", childPad: "pl-6 rtl:pl-0 rtl:pr-6" };
      default:
        return { pad: "p-3", childPad: "pl-6 rtl:pl-0 rtl:pr-6" };
    }
  }, [settings.spacingSize]);

  const radius = useMemo(() => {
    switch (settings.borderRadius) {
      case "none":
        return "rounded-none";
      case "small":
        return "rounded-sm";
      case "large":
        return "rounded-lg";
      case "full":
        return "rounded-full";
      default:
        return "rounded-md";
    }
  }, [settings.borderRadius]);

  const shadow = useMemo(() => {
    switch (settings.shadowIntensity) {
      case "none":
        return "";
      case "subtle":
        return "shadow-sm";
      case "strong":
        return "shadow-2xl";
      default:
        return "shadow-lg";
    }
  }, [settings.shadowIntensity]);

  const Toolbar = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        {search && (
          <Input
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder ?? "Search"}
            className="w-full"
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={isAllExpanded ? collapseAll : expandAll}
        >
          {isAllExpanded ? "Collapse all" : "Expand all"}
        </Button>
        {toolbar}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-9 w-56 bg-muted/50 animate-pulse rounded-md" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-muted/30 animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {Toolbar}
        <div className="text-center text-muted-foreground py-12">
          {emptyMessage ?? "No data"}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {Toolbar}
      <div
        className={cn(
          "relative",
          computedVariant === "cards" ? "space-y-2" : ""
        )}
      >
        <TreeList<T>
          nodes={data}
          variant={computedVariant}
          getId={getId}
          getLabel={getLabel}
          getChildren={getChildren}
          expanded={expanded}
          onToggle={handleToggleNode}
          direction={direction}
          actions={actions}
          density={density}
          radius={radius}
          shadow={shadow}
          cardStyle={settings.cardStyle}
        />
      </div>
    </div>
  );
}

function TreeList<T>({
  nodes,
  variant,
  getId,
  getLabel,
  getChildren,
  expanded,
  onToggle,
  direction,
  actions,
  level = 0,
  density,
  radius,
  shadow,
  cardStyle,
}: {
  nodes: T[];
  variant: TreeVariant;
  getId: (node: T) => string;
  getLabel: (node: T) => string;
  getChildren: (node: T) => T[] | undefined;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  direction: "ltr" | "rtl";
  actions?: (node: T) => TreeAction[];
  level?: number;
  density: { pad: string; childPad: string };
  radius: string;
  shadow: string;
  cardStyle: string;
}) {
  const connectorLine =
    "border-muted-foreground/20 " +
    (variant === "lines"
      ? "border-solid"
      : variant === "minimal"
      ? "border-dashed"
      : "border-solid");

  return (
    <ul
      className={cn(
        "list-none m-0 p-0",
        variant === "lines" && level > 0 ? "relative" : ""
      )}
    >
      {nodes.map((node) => {
        const id = getId(node);
        const label = getLabel(node);
        const children = getChildren(node) ?? [];
        const hasChildren = children.length > 0;
        const isOpen = expanded[id];

        const nodeBase =
          variant === "cards"
            ? cn(
                "bg-card border",
                density.pad,
                radius,
                shadow,
                "hover:bg-muted/50 transition-colors",
                cardStyle === "glass"
                  ? "bg-white/10 backdrop-blur border-white/20"
                  : "",
                cardStyle === "bordered" ? "border-2" : "",
                cardStyle === "elevated" ? "shadow-xl" : ""
              )
            : variant === "bubble"
            ? cn(
                "inline-flex items-center gap-2",
                "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
                "text-primary border border-primary/20",
                "px-3 py-2",
                "rounded-full",
                "hover:from-primary/15 hover:via-primary/10",
                "transition-colors"
              )
            : cn(
                "bg-card border hover:bg-muted/40 transition-colors",
                density.pad,
                radius,
                level === 0 ? "font-semibold" : "font-normal"
              );

        return (
          <li
            key={id}
            className={cn("group relative", variant === "cards" && "mb-2")}
          >
            {/* Node row */}
            <div
              className={cn(
                "flex items-center gap-2",
                variant === "bubble" ? "" : "rounded-md",
                nodeBase
              )}
            >
              {/* Toggle */}
              <button
                type="button"
                className={cn(
                  "h-7 w-7 flex items-center justify-center rounded hover:bg-muted",
                  !hasChildren && "opacity-60 cursor-default"
                )}
                onClick={() => hasChildren && onToggle(id)}
                aria-label={isOpen ? "Collapse" : "Expand"}
              >
                {hasChildren ? (
                  isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                ) : (
                  <Circle className="h-3 w-3 opacity-40" />
                )}
              </button>

              {/* Icon + Label */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {hasChildren ? (
                  isOpen ? (
                    <FolderOpen className="h-4 w-4 text-primary" />
                  ) : (
                    <Folder className="h-4 w-4 text-primary" />
                  )
                ) : (
                  <Folder className="h-4 w-4 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "truncate",
                    level === 0 ? "text-base" : "text-sm"
                  )}
                >
                  {label}
                </span>
                {level === 0 && hasChildren && (
                  <span className="ml-2 rtl:ml-0 rtl:mr-2 inline-flex items-center text-xs text-muted-foreground">
                    <GitBranch className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                    {children.length}
                  </span>
                )}
              </div>

              {/* Actions */}
              {actions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align={direction === "rtl" ? "start" : "end"}
                  >
                    {actions(node).map((a, idx) => (
                      <DropdownMenuItem
                        key={idx}
                        onClick={a.onClick}
                        className={cn(
                          a.variant === "destructive" &&
                            "text-destructive focus:text-destructive"
                        )}
                      >
                        {a.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Children */}
            {/* Lines variant with connectors */}
            {variant === "lines" && hasChildren && isOpen && (
              <div className={cn("relative", "mt-1")}>
                <div
                  className={cn(
                    "ml-6 rtl:ml-0 rtl:mr-6",
                    "border-l rtl:border-l-0 rtl:border-r",
                    connectorLine
                  )}
                >
                  <div
                    className={cn("pl-4 rtl:pl-0 rtl:pr-4", density.childPad)}
                  >
                    <TreeList<T>
                      nodes={children}
                      variant={variant}
                      getId={getId}
                      getLabel={getLabel}
                      getChildren={getChildren}
                      expanded={expanded}
                      onToggle={onToggle}
                      direction={direction}
                      actions={actions}
                      level={level + 1}
                      density={density}
                      radius={radius}
                      shadow={shadow}
                      cardStyle={cardStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cards variant: indented, stacked */}
            {variant === "cards" && hasChildren && isOpen && (
              <div className={cn("mt-2 space-y-2", "pl-8 rtl:pl-0 rtl:pr-8")}>
                <TreeList<T>
                  nodes={children}
                  variant={variant}
                  getId={getId}
                  getLabel={getLabel}
                  getChildren={getChildren}
                  expanded={expanded}
                  onToggle={onToggle}
                  direction={direction}
                  actions={actions}
                  level={level + 1}
                  density={density}
                  radius={radius}
                  shadow={shadow}
                  cardStyle={cardStyle}
                />
              </div>
            )}

            {/* Minimal: light indent, dashed connectors */}
            {variant === "minimal" && hasChildren && isOpen && (
              <div className={cn("mt-1", "pl-6 rtl:pl-0 rtl:pr-6")}>
                <TreeList<T>
                  nodes={children}
                  variant={variant}
                  getId={getId}
                  getLabel={getLabel}
                  getChildren={getChildren}
                  expanded={expanded}
                  onToggle={onToggle}
                  direction={direction}
                  actions={actions}
                  level={level + 1}
                  density={density}
                  radius={radius}
                  shadow={shadow}
                  cardStyle={cardStyle}
                />
              </div>
            )}

            {/* Bubble: inline chip-like children wrapping */}
            {variant === "bubble" && hasChildren && isOpen && (
              <div
                className={cn(
                  "mt-2 flex flex-wrap gap-2",
                  "pl-8 rtl:pl-0 rtl:pr-8"
                )}
              >
                <TreeList<T>
                  nodes={children}
                  variant={variant}
                  getId={getId}
                  getLabel={getLabel}
                  getChildren={getChildren}
                  expanded={expanded}
                  onToggle={onToggle}
                  direction={direction}
                  actions={actions}
                  level={level + 1}
                  density={density}
                  radius={radius}
                  shadow={shadow}
                  cardStyle={cardStyle}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
