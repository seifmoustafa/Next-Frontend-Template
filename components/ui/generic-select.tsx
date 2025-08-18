"use client"

import React from "react"
import { ChevronDown, X, Search, Check, Loader2 } from "lucide-react"
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
  type?: "single" | "searchable" | "multi"
  
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
  ...props
}, ref) => {
  const { selectStyle } = useSettings()
  const { direction, t } = useI18n()
  
  // Use the design prop if provided, otherwise fall back to global selectStyle
  const effectiveDesign = design || selectStyle
  
  // Determine if this is a multi-select based on type or value array
  const isMultiSelect = type === "multi" || Array.isArray(value)
  const isSearchable = type === "searchable" || searchable || type === "multi"
  
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
  const [filteredOptions, setFilteredOptions] = React.useState<GenericSelectOption[]>(options)
  const [isSearching, setIsSearching] = React.useState(false)
  const [serverOptions, setServerOptions] = React.useState<GenericSelectOption[]>([])
  const [dropdownPosition, setDropdownPosition] = React.useState({ 
    top: 0, 
    left: 0, 
    width: 0, 
    maxHeight: 240
  })


  // Refs
  const containerRef = React.useRef<HTMLDivElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const debounceRef = React.useRef<NodeJS.Timeout>()

  // Get current values
  const currentValues = Array.isArray(value) ? value : (value ? [value] : [])
  const selectedOptions = options.filter((option: GenericSelectOption) => currentValues.includes(option.value))
  
  // Get display options based on search type
  const displayOptions = searchType === "server" ? serverOptions : filteredOptions
  const showLoading = loading || isSearching

  // Fixed positioning that stays attached to field with 5px gap
  const calculateDropdownPosition = React.useCallback(() => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    
    // Calculate available space above and below
    const spaceBelow = viewportHeight - rect.bottom - 5 // 5px gap
    const spaceAbove = rect.top - 5 // 5px gap
    
    // Estimate content height based on current state
    const itemHeight = 40 // Approximate height per item
    const searchHeight = isSearchable ? 45 : 0
    const paddingHeight = 16
    const maxItemsToShow = Math.min(displayOptions.length, 8) // Show max 8 items
    
    let estimatedContentHeight = searchHeight + paddingHeight
    if (showLoading) {
      estimatedContentHeight += 60 // Loading state height
    } else if (displayOptions.length === 0) {
      estimatedContentHeight += 50 // "No results" height
    } else {
      estimatedContentHeight += maxItemsToShow * itemHeight
    }
    
    // Determine optimal placement with 5px gap
    const preferredHeight = Math.min(estimatedContentHeight, 320) // Max 320px
    const shouldShowAbove = spaceBelow < preferredHeight && spaceAbove > spaceBelow
    
    let top: number
    let maxHeight: number
    
    if (shouldShowAbove) {
      // Position above the field with exactly 5px gap
      const availableAbove = spaceAbove - 10 // 10px margin from viewport top
      maxHeight = Math.min(preferredHeight, availableAbove)
      // Ensure minimum height first, then calculate position
      maxHeight = Math.max(maxHeight, 120)
      top = rect.top - maxHeight + 5 // 5px gap above field
    } else {
      // Position below the field with exactly 5px gap
      const availableBelow = spaceBelow - 10 // 10px margin from viewport bottom
      maxHeight = Math.min(preferredHeight, availableBelow)
      maxHeight = Math.max(maxHeight, 120)
      top = rect.bottom + 5 // 5px gap below field
    }
    
    setDropdownPosition({
      top: Math.max(top, 1), // Minimum 10px from viewport top
      left: rect.left,
      width: rect.width,
      maxHeight: Math.floor(maxHeight)
    })
  }, [displayOptions.length, showLoading, isSearchable])

  // Client-side filtering with position recalculation
  React.useEffect(() => {
    if (searchType === "client" && searchQuery) {
      const filtered = options.filter((option: GenericSelectOption) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(options)
    }
    
    // Recalculate position when content changes
    if (isOpen) {
      setTimeout(() => calculateDropdownPosition(), 10)
    }
  }, [searchQuery, options, searchType, isOpen, calculateDropdownPosition])

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

  // Initialize server options
  React.useEffect(() => {
    if (searchType === "server") {
      setServerOptions(options)
    }
  }, [options, searchType])

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

  // Generate display text
  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return defaultPlaceholder
    }
    
    if (!isMultiSelect) {
      return selectedOptions[0]?.label || defaultPlaceholder
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
              selectedOptions.map((option: GenericSelectOption) => (
                <ResponsiveChip
                  key={option.value}
                  label={option.label}
                  onRemove={() => {
                    if (!onValueChange) return
                    onValueChange(currentValues.filter(v => v !== option.value))
                  }}
                  className={styles.chip}
                  direction={direction}
                />
              ))
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
          className={cn(
            "fixed z-[9999] min-w-[8rem] overflow-hidden shadow-lg",
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

          {/* Options list */}
          <div className="max-h-60 overflow-auto p-1">
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
                return (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent text-accent-foreground",
                      option.disabled && "pointer-events-none opacity-50",
                      direction === "rtl" ? "text-right" : "text-left"
                    )}
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
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className={cn(
                        "h-4 w-4",
                        direction === "rtl" ? "mr-2" : "ml-2"
                      )} />
                    )}
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
