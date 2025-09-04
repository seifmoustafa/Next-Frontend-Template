"use client"

import React from "react"
import { ChevronDown, X, Search, Check, Loader2, ChevronRight } from "lucide-react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { useSettings } from "@/providers/settings-provider"
import { useI18n } from "@/providers/i18n-provider"
import { getGenericSelectStyles as getGenericSelectStyles, ResponsiveChip } from "./generic-select-base"
import type { SelectStyle } from "@/providers/settings-provider"

export interface GenericSelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
  description?: string
  children?: GenericSelectOption[]
  level?: number
  parentId?: string | null
}

export interface GenericSelectProps {
  // Core props
  options: GenericSelectOption[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  design?: SelectStyle

  // Select type configuration
  type?: "single" | "searchable" | "multi" | "tree"

  // Search configuration (for searchable and multi types)
  searchable?: boolean
  searchPlaceholder?: string
  searchType?: "client" | "server"
  onServerSearch?: (query: string) => Promise<GenericSelectOption[]>
  searchEndpoint?: string
  debounceMs?: number
  noResultsText?: string
  searchingText?: string

  // Multi-select specific
  maxSelectedDisplay?: number
  selectAllText?: string
  clearAllText?: string
  selectedText?: string
  allowClear?: boolean

  // Loading state
  loading?: boolean

  // Tree-select specific
  treeData?: GenericSelectOption[]
  onTreeDataLoad?: () => Promise<GenericSelectOption[]>
  expandedKeys?: string[]
  onExpandedKeysChange?: (keys: string[]) => void
  showFullPath?: boolean

  // Additional props
  [key: string]: any
}

export const GenericSelect = React.forwardRef<HTMLDivElement, GenericSelectProps>(({
  options,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  className,
  design,
  type = "single",
  searchable = false,
  searchPlaceholder,
  searchType = "client",
  onServerSearch,
  searchEndpoint,
  debounceMs = 300,
  noResultsText,
  searchingText,
  maxSelectedDisplay = 3,
  selectAllText,
  clearAllText,
  selectedText,
  allowClear = true,
  loading = false,
  treeData,
  onTreeDataLoad,
  expandedKeys = [],
  onExpandedKeysChange,
  showFullPath = false,
  ...props
}, ref) => {
  const { selectStyle } = useSettings()
  const { direction, t } = useI18n()

  // Use the design prop if provided, otherwise fall back to global selectStyle
  const effectiveDesign = design || selectStyle

  // Determine if this is a multi-select based on type or value array
  const isMultiSelect = type === "multi" || Array.isArray(value)
  const isSearchable = type === "searchable" || searchable || type === "multi" || type === "tree"
  const isTreeSelect = type === "tree"

  // Default localized text values
  const defaultPlaceholder = placeholder || (isMultiSelect
    ? t('components.multiSelect.placeholders.selectTechnologies')
    : t('components.select.placeholder'))
  const defaultSearchPlaceholder = searchPlaceholder || (isMultiSelect
    ? t('components.multiSelect.placeholders.searchTechnologies')
    : t('components.searchableSelect.placeholder'))
  const defaultNoResultsText = noResultsText || t('components.multiSelect.searchStates.noResults')
  const defaultSearchingText = searchingText || t('components.multiSelect.searchStates.searching')
  const defaultSelectAllText = selectAllText || t('components.multiSelect.buttons.selectAll')
  const defaultClearAllText = clearAllText || t('components.multiSelect.buttons.clearAll')
  const defaultSelectedText = selectedText || t('components.multiSelect.searchStates.selected')

  // State management
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filteredOptions, setFilteredOptions] = React.useState<GenericSelectOption[]>(options || [])
  const [isSearching, setIsSearching] = React.useState(false)
  const [serverOptions, setServerOptions] = React.useState<GenericSelectOption[]>([])
  const [dropdownPosition, setDropdownPosition] = React.useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 240
  })
  const [internalExpandedKeys, setInternalExpandedKeys] = React.useState<string[]>(expandedKeys)
  const [flattenedTreeOptions, setFlattenedTreeOptions] = React.useState<GenericSelectOption[]>([])


  // Refs
  const containerRef = React.useRef<HTMLDivElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const debounceRef = React.useRef<NodeJS.Timeout>()

  // Tree-specific functions
  const flattenTreeData = React.useCallback((treeNodes: GenericSelectOption[], level = 0): GenericSelectOption[] => {
    const flattened: GenericSelectOption[] = []

    treeNodes.forEach(node => {
      const flatNode = { ...node, level }
      flattened.push(flatNode)

      if (node.children && internalExpandedKeys.includes(node.value)) {
        flattened.push(...flattenTreeData(node.children, level + 1))
      }
    })

    return flattened
  }, [internalExpandedKeys])

  const getNodePath = React.useCallback((nodeValue: string, treeNodes: GenericSelectOption[]): string[] => {
    const findPath = (nodes: GenericSelectOption[], targetValue: string, currentPath: string[] = []): string[] | null => {
      for (const node of nodes) {
        const newPath = [...currentPath, node.label]
        if (node.value === targetValue) {
          return newPath
        }
        if (node.children) {
          const childPath = findPath(node.children, targetValue, newPath)
          if (childPath) return childPath
        }
      }
      return null
    }

    return findPath(treeNodes, nodeValue) || [nodeValue]
  }, [])

  // Get parent node values for auto-expansion
  const getParentNodeValues = React.useCallback((nodeValue: string, treeNodes: GenericSelectOption[]): string[] => {
    const findParents = (nodes: GenericSelectOption[], targetValue: string, currentPath: string[] = []): string[] | null => {
      for (const node of nodes) {
        const newPath = [...currentPath, node.value]
        if (node.value === targetValue) {
          return currentPath // Return path without the target node itself
        }
        if (node.children) {
          const childPath = findParents(node.children, targetValue, newPath)
          if (childPath) return childPath
        }
      }
      return null
    }

    return findParents(treeNodes, nodeValue) || []
  }, [])

  const toggleExpanded = (nodeValue: string) => {
    const newExpandedKeys = internalExpandedKeys.includes(nodeValue)
      ? internalExpandedKeys.filter(key => key !== nodeValue)
      : [...internalExpandedKeys, nodeValue]

    setInternalExpandedKeys(newExpandedKeys)
    onExpandedKeysChange?.(newExpandedKeys)
  }

  // Get current values
  const currentValues = Array.isArray(value) ? value : (value ? [value] : [])
  
  // For tree select, we need to search all nodes (not just expanded ones) to find selected options
  const getAllTreeNodes = React.useCallback((treeNodes: GenericSelectOption[]): GenericSelectOption[] => {
    const allNodes: GenericSelectOption[] = []
    
    const traverse = (nodes: GenericSelectOption[], level = 0) => {
      nodes.forEach(node => {
        allNodes.push({ ...node, level })
        if (node.children) {
          traverse(node.children, level + 1)
        }
      })
    }
    
    traverse(treeNodes)
    return allNodes
  }, [])
  
  const sourceOptions = isTreeSelect ? flattenedTreeOptions : options
  const allTreeNodes = isTreeSelect ? getAllTreeNodes(treeData || options) : []
  const selectedOptions = isTreeSelect 
    ? allTreeNodes.filter((option: GenericSelectOption) => currentValues.includes(option.value))
    : sourceOptions.filter((option: GenericSelectOption) => currentValues.includes(option.value))

  // Get display options based on search type
  const displayOptions = (isTreeSelect
    ? (searchType === "server" ? serverOptions : filteredOptions)
    : (searchType === "server" ? serverOptions : filteredOptions)) || []
  const showLoading = loading || isSearching

  // Fixed positioning that stays attached to field with 5px gap
  const calculateDropdownPosition = React.useCallback(() => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight

    // Calculate available space above and below
    const spaceBelow = viewportHeight - rect.bottom - 5 // 5px gap
    const spaceAbove = rect.top - 6 // 6px gap for above positioning

    // Estimate content height based on current state and select type
    const itemHeight = isTreeSelect ? 50 : 40 // Tree items are taller due to enhanced design
    const searchHeight = isSearchable ? 45 : 0
    const paddingHeight = 16
    // Dynamic height approach for better positioning
    const maxDropdownHeight = isTreeSelect ? 320 : 280 // Maximum heights for scrolling
    const minDropdownHeight = 120 // Minimum height

    // Prefer showing below unless there's very little space
    const shouldShowAbove = spaceBelow < minDropdownHeight && spaceAbove > spaceBelow + 50

    let top: number
    let maxHeight: number

    if (shouldShowAbove) {
      // Position above the field with 6px gap
      const availableAbove = spaceAbove - 10 // 10px margin from viewport top
      maxHeight = Math.min(maxDropdownHeight, availableAbove)
      // Ensure minimum height first, then calculate position
      maxHeight = Math.max(maxHeight, minDropdownHeight)
      top = rect.top - maxHeight - 6 // 6px gap above field
    } else {
      // Position below the field with 5px gap
      const availableBelow = spaceBelow - 10 // 10px margin from viewport bottom
      maxHeight = Math.min(maxDropdownHeight, availableBelow)
      maxHeight = Math.max(maxHeight, minDropdownHeight)
      top = rect.bottom + 5 // 5px gap below field
    }

    setDropdownPosition({
      top: Math.max(top, 1), // Minimum 10px from viewport top
      left: rect.left,
      width: rect.width,
      maxHeight: Math.floor(maxHeight)
    })
  }, [displayOptions?.length, showLoading, isSearchable, isTreeSelect])

  // Initialize tree data
  React.useEffect(() => {
    if (isTreeSelect) {
      const dataToUse = treeData || options
      if (onTreeDataLoad && dataToUse.length === 0) {
        onTreeDataLoad().then((data: GenericSelectOption[]) => {
          setFlattenedTreeOptions(flattenTreeData(data))
        })
      } else {
        setFlattenedTreeOptions(flattenTreeData(dataToUse))
      }
    }
  }, [isTreeSelect, treeData, options, flattenTreeData, onTreeDataLoad])

  // Auto-expand parent nodes to show path to selected option when dropdown opens
  React.useEffect(() => {
    if (isTreeSelect && isOpen && currentValues.length > 0) {
      const dataToUse = treeData || options
      if (dataToUse.length > 0) {
        const selectedValue = currentValues[0] // Get first selected value
        const parentNodes = getParentNodeValues(selectedValue, dataToUse)
        
        if (parentNodes.length > 0) {
          // Merge existing expanded keys with parent nodes (avoid duplicates)
          const newExpandedKeys = Array.from(new Set([...internalExpandedKeys, ...parentNodes]))
          setInternalExpandedKeys(newExpandedKeys)
          onExpandedKeysChange?.(newExpandedKeys)
        }
      }
    }
  }, [isTreeSelect, isOpen, currentValues, treeData, options, getParentNodeValues, onExpandedKeysChange])

  // Update flattened tree when expanded keys change
  React.useEffect(() => {
    if (isTreeSelect) {
      const dataToUse = treeData || options
      setFlattenedTreeOptions(flattenTreeData(dataToUse))
    }
  }, [isTreeSelect, internalExpandedKeys, treeData, options, flattenTreeData])

  // Client-side filtering with position recalculation
  React.useEffect(() => {
    if (searchType === "client" && searchQuery) {
      const sourceData = isTreeSelect ? flattenedTreeOptions : options
      const filtered = sourceData.filter((option: GenericSelectOption) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredOptions(filtered)
    } else {
      const sourceData = isTreeSelect ? flattenedTreeOptions : options
      setFilteredOptions(sourceData)
    }

    // Recalculate position when content changes
    if (isOpen) {
      setTimeout(() => calculateDropdownPosition(), 10)
    }
  }, [searchQuery, options, flattenedTreeOptions, searchType, isTreeSelect, isOpen, calculateDropdownPosition])

  // Server-side search with debouncing
  React.useEffect(() => {
    if (searchType === "server" && searchQuery.trim()) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(async () => {
        setIsSearching(true)
        try {
          if (onServerSearch) {
            const results = await onServerSearch(searchQuery)
            setServerOptions(results)
          } else if (searchEndpoint) {
            const response = await fetch(`${searchEndpoint}?q=${encodeURIComponent(searchQuery)}`)
            const results = await response.json()
            setServerOptions(results)
          }
        } catch (error) {
          console.error("Server search error:", error)
          setServerOptions([])
        } finally {
          setIsSearching(false)
        }
      }, debounceMs)
    } else if (searchType === "server" && !searchQuery.trim()) {
      setServerOptions(options)
      setIsSearching(false)
    }
  }, [searchQuery, searchType, onServerSearch, searchEndpoint, debounceMs, options])

  // Initialize server options and load initial data
  React.useEffect(() => {
    if (searchType === "server") {
      setServerOptions(options)
      // Load initial data when component mounts if onServerSearch is available
      if (onServerSearch && options.length === 0) {
        setIsSearching(true)
        onServerSearch("").then((results: GenericSelectOption[]) => {
          setServerOptions(results)
          setIsSearching(false)
        }).catch((error: any) => {
          console.error("Failed to load initial server options:", error)
          setServerOptions([])
          setIsSearching(false)
        })
      }
    }
  }, [options, searchType, onServerSearch])

  // Recalculate position when server options change
  React.useEffect(() => {
    if (searchType === "server" && isOpen) {
      setTimeout(() => calculateDropdownPosition(), 10)
    }
  }, [serverOptions, searchType, isOpen, calculateDropdownPosition])

  // Get Generic styling
  const styles = getGenericSelectStyles(effectiveDesign, direction, disabled, className)

  // Handle selection
  const handleSelect = (optionValue: string) => {
    if (!onValueChange) return

    if (isMultiSelect) {
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue]
      onValueChange(newValues)
    } else {
      onValueChange(optionValue)
      setIsOpen(false)
      setSearchQuery("")
    }
  }

  // Handle toggle
  const handleToggle = () => {
    if (disabled) return

    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)

    if (newIsOpen) {
      // Calculate position immediately and after a small delay for accuracy
      calculateDropdownPosition()
      setTimeout(() => calculateDropdownPosition(), 10)

      // Focus search input if searchable
      if (isSearchable) {
        setTimeout(() => searchInputRef.current?.focus(), 50)
      }
    }

    if (!newIsOpen) {
      setSearchQuery("")
      if (searchType === "server") {
        setServerOptions(options)
      }
    }
  }

  // Handle select all (multi-select only)
  const handleSelectAll = () => {
    if (!onValueChange || !isMultiSelect) return
    const allValues = displayOptions.filter(opt => !opt.disabled).map(opt => opt.value)
    onValueChange(allValues)
  }

  // Handle clear all (multi-select only)
  const handleClearAll = () => {
    if (!onValueChange || !isMultiSelect) return
    onValueChange([])
  }

  // Generate display text with hierarchical breadcrumb for tree select
  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return defaultPlaceholder
    }

    if (!isMultiSelect) {
      const selectedOption = selectedOptions[0]
      if (!selectedOption) return defaultPlaceholder

      // For tree select, show full hierarchical path with RTL support
      if (isTreeSelect) {
        const path = getNodePath(selectedOption.value, treeData || options)

        if (direction === "rtl") {
          const reversedPath = [...path].reverse()
          const selectedItem = reversedPath[0] // Selected item (WE)
          const parentPath = reversedPath.slice(1) // Parent path (R2, R1, WH1)

          return (
            <div className="flex items-center gap-1 text-sm overflow-hidden">
              {parentPath.length > 0 && (
                <>
                  <span className="text-muted-foreground text-xs truncate">{parentPath.join(' ‹ ')}</span>

                  <span className="text-muted-foreground text-xs flex-shrink-0">›</span>
                </>
              )}
              <span className="font-medium truncate">{selectedItem}</span>

            </div>
          )
        } else {
          return (
            <div className="flex items-center gap-1 text-sm overflow-hidden">
              <span className="text-muted-foreground text-xs truncate">{path.slice(0, -1).join(' › ')}</span>
              {path.length > 1 && <span className="text-muted-foreground text-xs flex-shrink-0">›</span>}
              <span className="font-medium truncate">{path[path.length - 1]}</span>
            </div>
          )
        }
      }

      return selectedOption.label
    }

    if (selectedOptions.length <= maxSelectedDisplay) {
      // For small selections, show truncated labels to prevent overflow
      const labels = selectedOptions.map((opt: GenericSelectOption) =>
        opt.label.length > 15 ? opt.label.substring(0, 15) + '...' : opt.label
      )
      return labels.join(", ")
    }

    // For large selections, show count with localized text
    return `${selectedOptions.length} ${defaultSelectedText}`
  }

  // Click outside handler and window events for portal dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isClickInTrigger = containerRef.current && containerRef.current.contains(target)
      const isClickInDropdown = dropdownRef.current && dropdownRef.current.contains(target)

      if (!isClickInTrigger && !isClickInDropdown) {
        setIsOpen(false)
        setSearchQuery("")
        if (searchType === "server") {
          setServerOptions(options)
        }
      }
    }

    const handleWindowResize = () => {
      if (isOpen) {
        calculateDropdownPosition()
      }
    }

    const handleWindowScroll = () => {
      if (isOpen && containerRef.current) {
        // Check if field is starting to hide (more sensitive detection)
        const rect = containerRef.current.getBoundingClientRect()
        const threshold = 10 // Close when field is 10px from edge
        const isFieldStartingToHide = rect.top < threshold ||
          rect.bottom > (window.innerHeight - threshold) ||
          rect.left < threshold ||
          rect.right > (window.innerWidth - threshold)

        if (isFieldStartingToHide) {
          // Field is starting to hide, close dropdown
          setIsOpen(false)
          setSearchQuery("")
          if (searchType === "server") {
            setServerOptions(options)
          }
        } else {
          // Field is still fully visible, update position
          requestAnimationFrame(() => {
            calculateDropdownPosition()
          })
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('resize', handleWindowResize)
      window.addEventListener('scroll', handleWindowScroll, true)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        window.removeEventListener('resize', handleWindowResize)
        window.removeEventListener('scroll', handleWindowScroll, true)
      }
    }
  }, [isOpen, searchType, options, calculateDropdownPosition])

  return (
    <div ref={containerRef} className="relative w-full" {...props}>
      <div
        ref={ref}
        className={styles.trigger}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
      >
        <div className="flex-1 flex flex-wrap gap-1 items-center min-h-[1.5rem] overflow-hidden">
          {isMultiSelect && selectedOptions.length > 0 ? (
            selectedOptions.length <= maxSelectedDisplay ? (
              // Show individual chips for small selections
              selectedOptions.map((option: GenericSelectOption) => {
                // For tree select, show hierarchical path with RTL support
                let displayLabel = option.label
                if (isTreeSelect) {
                  const path = getNodePath(option.value, treeData || options)
                  if (direction === "rtl") {
                    // RTL: Show selected item on left, parents on right (WE ‹ R2 ‹ R1 ‹ WH1)
                    const reversedPath = [...path].reverse()
                    displayLabel = reversedPath.join(' ‹ ')
                  } else {
                    // LTR: Show parents on left, selected on right (WH1 › R1 › R2 › WE)
                    displayLabel = path.join(' › ')
                  }
                }

                return (
                  <ResponsiveChip
                    key={option.value}
                    label={displayLabel}
                    onRemove={() => {
                      if (!onValueChange) return
                      onValueChange(currentValues.filter(v => v !== option.value))
                    }}
                    className={styles.chip}
                    direction={direction}
                  />
                )
              })
            ) : (
              // Show summary text for large selections with responsive handling
              <span className="text-sm text-muted-foreground truncate max-w-full">
                {`${selectedOptions.length} ${defaultSelectedText}`}
              </span>
            )
          ) : (
            <span className={cn(
              "text-sm truncate max-w-full",
              selectedOptions.length === 0 ? "text-muted-foreground" : "text-foreground"
            )}>
              {getDisplayText()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {allowClear && selectedOptions.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (isMultiSelect) {
                  handleClearAll()
                } else {
                  onValueChange?.("")
                }
              }}
              className="h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} />
        </div>
      </div>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          data-dropdown-portal="true"
          data-searchable-select="true"
          className={cn(
            "fixed z-[9999] min-w-[8rem] overflow-hidden shadow-lg pointer-events-auto",
            styles.dropdown
          )}
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxHeight: dropdownPosition.maxHeight,
            transform: 'translateZ(0)', // Force hardware acceleration for smoother positioning
            willChange: 'transform', // Optimize for frequent position changes
          }}
        >
          {/* Search input for searchable types */}
          {isSearchable && (
            <div className="p-2 border-b border-border/50">
              <div className="relative">
                <Search className={cn(
                  "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                  direction === "rtl" ? "right-3" : "left-3"
                )} />
                {showLoading && (
                  <Loader2 className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin",
                    direction === "rtl" ? "left-3" : "right-3"
                  )} />
                )}
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={defaultSearchPlaceholder}
                  className={cn(
                    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    direction === "rtl" ? "pr-10 pl-3 text-right" : "pl-10 pr-3 text-left"
                  )}
                  dir={direction}
                />
              </div>
            </div>
          )}

          {/* Multi-select batch operations */}
          {isMultiSelect && displayOptions.length > 0 && (
            <div className="p-2 border-b border-border/50 flex gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-primary hover:text-primary/80 font-medium"
              >
                {defaultSelectAllText}
              </button>
              <span className="text-xs text-muted-foreground">|</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                {defaultClearAllText}
              </button>
            </div>
          )}

          {/* Options list with dynamic scrollable height */}
          <div
            className="overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
            style={{ 
              maxHeight: `calc(${dropdownPosition.maxHeight}px - ${isSearchable ? '84px' : '40px'})`
            }}
          >
            {showLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">{defaultSearchingText}</span>
              </div>
            ) : displayOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {defaultNoResultsText}
              </div>
            ) : (
              displayOptions.map((option) => {
                const isSelected = currentValues.includes(option.value)
                const hasChildren = option.children && option.children.length > 0
                const isExpanded = internalExpandedKeys.includes(option.value)
                const level = option.level || 0

                return (
                  <div
                    key={option.value}
                    className={cn(
                      "group relative flex cursor-pointer select-none items-center rounded-lg my-0.5 py-2.5 text-sm outline-none transition-all duration-200",
                      isTreeSelect ? (
                        level === 0
                          ? "bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 hover:from-primary/10 hover:to-primary/15 hover:border-primary/30 shadow-sm"
                          : level === 1
                            ? "bg-gradient-to-r from-blue-500/5 to-blue-500/10 border border-blue-500/20 hover:from-blue-500/10 hover:to-blue-500/15 hover:border-blue-500/30"
                            : "bg-gradient-to-r from-muted/30 to-muted/50 border border-border/50 hover:from-muted/50 hover:to-muted/70 hover:border-border/70"
                      ) : "hover:bg-accent hover:text-accent-foreground",
                      isSelected && (isTreeSelect
                        ? "ring-2 ring-primary/50 bg-primary/10 border-primary/40 shadow-md"
                        : "bg-accent text-accent-foreground"),
                      option.disabled && "pointer-events-none opacity-50",
                      direction === "rtl" ? "text-right" : "text-left"
                    )}
                    style={{
                      paddingLeft: isTreeSelect ? `${12 + level * 20}px` : '12px',
                      paddingRight: isTreeSelect ? '12px' : '12px',
                      marginLeft: isTreeSelect ? `${level * 4}px` : '0px'
                    }}
                  >
                    {/* Tree expand/collapse button with enhanced design */}
                    {isTreeSelect && (
                      <button
                        type="button"
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200",
                          hasChildren
                            ? "hover:bg-primary/20 hover:shadow-sm border border-transparent hover:border-primary/30"
                            : "opacity-30",
                          direction === "rtl" ? "ml-2" : "mr-2"
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpanded(option.value)
                        }}
                      >
                        {hasChildren ? (
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-all duration-300 text-primary",
                            isExpanded && "rotate-90 text-primary/80"
                          )} />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-muted/50" />
                        )}
                      </button>
                    )}

                    {/* Option content */}
                    <div
                      className="flex-1 flex items-center"
                      onClick={() => !option.disabled && handleSelect(option.value)}
                    >
                      {option.icon && (
                        <span className={cn(
                          "flex h-4 w-4 items-center justify-center",
                          direction === "rtl" ? "ml-2" : "mr-2"
                        )}>
                          {option.icon}
                        </span>
                      )}
                      <div className="flex-1">
                        <div className={cn(
                          "font-medium transition-colors",
                          isTreeSelect && level === 0 && "text-primary font-semibold",
                          isTreeSelect && level === 1 && "text-blue-600 font-medium",
                          isTreeSelect && level > 1 && "text-foreground"
                        )}>
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">{option.description}</div>
                        )}
                        {/* Show breadcrumb path for tree items on hover with RTL support */}
                        {isTreeSelect && level > 0 && (
                          <div className="text-xs text-muted-foreground/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {direction === "rtl"
                              ? getNodePath(option.value, treeData || options).reverse().join(' ‹ ')
                              : getNodePath(option.value, treeData || options).join(' › ')
                            }
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <div className={cn(
                          "flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground shadow-sm",
                          direction === "rtl" ? "mr-2" : "ml-2"
                        )}>
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
})

GenericSelect.displayName = "GenericSelect"

export default GenericSelect
