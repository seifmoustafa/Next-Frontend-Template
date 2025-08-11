"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown, Search, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSettings } from "@/providers/settings-provider"
import { useI18n } from "@/providers/i18n-provider"
import { calculateDropdownPosition, scrollIntoViewIfNeeded, type DropdownPosition } from "@/lib/dropdown-positioning"



// Types for the searchable select
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SearchableSelectProps {
  options?: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  searchType?: "client" | "server"
  onServerSearch?: (query: string) => Promise<SelectOption[]>
  searchEndpoint?: string
  debounceMs?: number
  allowClear?: boolean
  loading?: boolean
  noResultsText?: string
  searchingText?: string
}

export const SearchableSelect = React.forwardRef<
  HTMLDivElement,
  SearchableSelectProps
>(({
  options = [],
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  disabled = false,
  className,
  searchType = "client",
  onServerSearch,
  searchEndpoint,
  debounceMs = 300,
  allowClear = true,
  loading = false,
  noResultsText = "No results found",
  searchingText = "Searching...",
  ...props
}, ref) => {
  const { selectStyle, colorTheme, borderRadius } = useSettings()
  const { direction } = useI18n()
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filteredOptions, setFilteredOptions] = React.useState<SelectOption[]>(options)
  const [isSearching, setIsSearching] = React.useState(false)
  const [serverOptions, setServerOptions] = React.useState<SelectOption[]>([])
  const [dropdownPosition, setDropdownPosition] = React.useState<DropdownPosition>({ 
    top: 0, 
    left: 0, 
    width: 0, 
    maxHeight: 240,
    placement: 'bottom-start'
  })
  
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const debounceRef = React.useRef<NodeJS.Timeout>()

  // Get selected option
  const selectedOption = React.useMemo(() => {
    const allOptions = searchType === "server" ? serverOptions : options
    return allOptions.find(option => option.value === value)
  }, [value, options, serverOptions, searchType])

  // Handle client-side filtering
  React.useEffect(() => {
    if (searchType === "client") {
      if (!searchQuery.trim()) {
        setFilteredOptions(options)
      } else {
        const filtered = options.filter(option =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.value.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredOptions(filtered)
      }
    }
  }, [searchQuery, options, searchType])

  // Handle server-side search with debouncing
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
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery, searchType, onServerSearch, searchEndpoint, debounceMs, options])

  // Disabled click-outside detection to prevent interference
  // Users can close by clicking the trigger again or pressing Escape

  // Simple focus handling
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Simple delayed focus
      const timeoutId = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
  
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen])

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue)
    setIsOpen(false)
    setSearchQuery("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange?.("")
    setSearchQuery("")
  }

  // Get computed values
  const displayOptions = searchType === "server" ? serverOptions : filteredOptions
  const showLoading = loading || isSearching

  // Handle window resize to recalculate position
  React.useEffect(() => {
    const handleResize = () => {
      if (isOpen && containerRef.current) {
        const position = calculateDropdownPosition({
          triggerElement: containerRef.current,
          dropdownHeight: 240,
          minWidth: 200
        })
        setDropdownPosition(position)
      }
    }

    if (isOpen) {
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleResize)
      }
    }
  }, [isOpen])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          setIsOpen(false)
          break
        case 'Enter':
          event.preventDefault()
          if (displayOptions.length > 0 && !showLoading) {
            handleSelect(displayOptions[0].value)
          }
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, displayOptions, showLoading])

  const handleToggle = () => {
    if (disabled) return
    
    if (!isOpen) {
      setSearchQuery("")
      setFilteredOptions(options)
      
      // Calculate optimal position with viewport detection
      if (containerRef.current) {
        const position = calculateDropdownPosition({
          triggerElement: containerRef.current,
          dropdownHeight: 240,
          minWidth: 200
        })
        setDropdownPosition(position)
        
        // Scroll trigger into view if needed
        scrollIntoViewIfNeeded(containerRef.current)
      }
    }
    setIsOpen(!isOpen)
  }

  // Dynamic styling based on select style
  const getSelectStyles = () => {
    const baseTriggerClasses = "flex h-10 w-full items-center justify-between text-sm ring-offset-background cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
    const baseContentClasses = "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-background text-foreground shadow-md"
    const directionClasses = direction === "rtl" ? "text-right" : "text-left"
    
    switch (selectStyle) {
      case "modern":
        return {
          trigger: cn(
            baseTriggerClasses,
            "h-11 rounded-xl border-2 border-border bg-background px-4 py-2 transition-all duration-200 hover:border-muted-foreground/50 focus:border-primary focus:ring-4 focus:ring-primary/10",
            isOpen && "border-primary ring-4 ring-primary/10",
            directionClasses,
            className
          ),
          content: cn(baseContentClasses, "rounded-xl border-2 border-border shadow-xl", directionClasses)
        }
      
      case "glass":
        return {
          trigger: cn(
            baseTriggerClasses,
            "h-11 rounded-lg border border-border/20 bg-background/80 backdrop-blur-md px-4 py-2 transition-all duration-200 hover:bg-background/90 focus:border-border/40 focus:ring-4 focus:ring-primary/10",
            isOpen && "border-border/40 ring-4 ring-primary/10",
            directionClasses,
            className
          ),
          content: cn(baseContentClasses, "rounded-lg border border-border/20 bg-background/80 backdrop-blur-md shadow-xl", directionClasses)
        }
      
      case "outlined":
        return {
          trigger: cn(
            baseTriggerClasses,
            "h-10 rounded-lg border-3 border-gray-400 dark:border-gray-500 bg-transparent px-4 py-2 transition-all duration-200 hover:border-gray-600 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:border-gray-700 dark:focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/30 text-gray-700 dark:text-gray-300",
            isOpen && "border-gray-700 dark:border-gray-300 ring-2 ring-gray-500/30",
            directionClasses,
            className
          ),
          content: cn(baseContentClasses, "rounded-lg border-3 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 shadow-xl text-gray-700 dark:text-gray-300", directionClasses)
        }
      
      case "filled":
        return {
          trigger: cn(
            baseTriggerClasses,
            "h-11 rounded-lg border-0 bg-gray-200 dark:bg-gray-700 px-4 py-3 transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:bg-white dark:focus:bg-gray-800 focus:ring-3 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none text-gray-800 dark:text-gray-200 shadow-inner",
            isOpen && "bg-white dark:bg-gray-800 ring-3 ring-gray-400 dark:ring-gray-500",
            directionClasses,
            className
          ),
          content: cn(baseContentClasses, "rounded-lg border-0 bg-gray-100 dark:bg-gray-700 shadow-xl text-gray-800 dark:text-gray-200", directionClasses)
        }
      
      case "minimal":
        return {
          trigger: cn(
            "flex h-9 w-full items-center justify-between border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-2 py-2 text-sm transition-all duration-200 hover:border-gray-500 dark:hover:border-gray-400 focus:border-gray-700 dark:focus:border-gray-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-gray-700 dark:text-gray-300",
            isOpen && "border-gray-700 dark:border-gray-300",
            directionClasses,
            className
          ),
          content: cn(baseContentClasses, "rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg text-gray-700 dark:text-gray-300", directionClasses)
        }
      
      case "elegant":
        return {
          trigger: cn(
            baseTriggerClasses,
            "h-13 rounded-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950 px-5 py-4 transition-all duration-400 hover:from-purple-100 hover:via-pink-100 hover:to-rose-100 dark:hover:from-purple-900 dark:hover:via-pink-900 dark:hover:to-rose-900 hover:shadow-xl focus:border-purple-400 dark:focus:border-purple-600 focus:ring-4 focus:ring-purple-500/25 text-purple-900 dark:text-purple-100",
            isOpen && "border-purple-400 dark:border-purple-600 ring-4 ring-purple-500/25 shadow-xl",
            directionClasses,
            className
          ),
          content: cn(baseContentClasses, "rounded-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-b from-purple-50 via-pink-50 to-rose-100 dark:from-purple-950 dark:via-pink-950 dark:to-rose-900 shadow-2xl text-purple-900 dark:text-purple-100", directionClasses)
        }
      
      case "professional":
        return {
          trigger: cn(
            baseTriggerClasses,
            "h-11 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 shadow-sm transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md focus:border-slate-600 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 focus:outline-none text-slate-700 dark:text-slate-300",
            isOpen && "border-slate-600 dark:border-slate-400 ring-2 ring-slate-500/20 shadow-md",
            directionClasses,
            className
          ),
          content: cn(baseContentClasses, "rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-xl text-slate-700 dark:text-slate-300", directionClasses)
        }
      
      default:
        return {
          trigger: cn(
            baseTriggerClasses,
            "h-10 rounded-md border border-input bg-background px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            directionClasses,
            className
          ),
          content: cn(baseContentClasses, "rounded-md border border-input bg-background text-foreground", directionClasses)
        }
    }
  }

  const styles = getSelectStyles()

  return (
    <div ref={containerRef} className="relative w-full" {...props}>
      <div
        ref={ref}
        className={styles.trigger}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={cn(
          "block truncate",
          !selectedOption && "text-muted-foreground",
          direction === "rtl" ? "text-right" : "text-left"
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <div className={cn(
          "flex items-center gap-2",
          direction === "rtl" ? "flex-row-reverse" : "flex-row"
        )}>
          {allowClear && selectedOption && (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>



      {/* Searchable Dropdown - Portal with Working Focus */}
      {isOpen && typeof window !== "undefined" && createPortal(
        <div 
          ref={dropdownRef}
          data-dropdown-portal="true"
          data-searchable-select="true"
          className={cn(
            "fixed z-[99999] pointer-events-auto",
            styles.content
          )}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            maxHeight: `${dropdownPosition.maxHeight}px`,
            pointerEvents: 'auto'
          }}
        >
          {/* Search Input */}
          <div className={cn("p-2 border-b border-border", direction === "rtl" ? "text-right" : "text-left")}>
            <div className="relative">
              <Search className={cn(
                "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
                direction === "rtl" ? "right-3" : "left-3"
              )} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {

                  setSearchQuery(e.target.value);
                }}
                autoFocus
                onFocus={() => {

                }}
                onBlur={() => {

                }}
                onClick={(e) => {

                  e.currentTarget.focus();
                }}
                onKeyDown={(e) => {

                }}
                className={cn(
                  "w-full rounded-md border border-input bg-background text-foreground py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20",
                  direction === "rtl" ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                )}
                dir={direction}
                autoComplete="off"
              />
              {showLoading && (
                <Loader2 className={cn(
                  "absolute top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground",
                  direction === "rtl" ? "left-3" : "right-3"
                )} />
              )}
            </div>
          </div>

          {/* Options List */}
          <div 
            className="overflow-auto p-1" 
            style={{ maxHeight: `${(dropdownPosition.maxHeight || 240) - 60}px` }}
            onWheel={(e) => {
              // Ensure mouse wheel events work properly
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              // Prevent modal from capturing events
              e.stopPropagation();
            }}
          >
            {showLoading && searchQuery && (
              <div className={cn(
                "flex items-center justify-center py-4 text-sm text-muted-foreground",
                direction === "rtl" ? "flex-row-reverse" : "flex-row"
              )}>
                <Loader2 className={cn(
                  "h-4 w-4 animate-spin",
                  direction === "rtl" ? "ml-2" : "mr-2"
                )} />
                {searchingText}
              </div>
            )}
            
            {!showLoading && displayOptions.length === 0 && searchQuery && (
              <div className={cn(
                "py-4 text-center text-sm text-muted-foreground",
                direction === "rtl" ? "text-right" : "text-left"
              )}>
                {noResultsText}
              </div>
            )}
            
            {!showLoading && displayOptions.length === 0 && !searchQuery && searchType === "server" && (
              <div className={cn(
                "py-4 text-center text-sm text-muted-foreground",
                direction === "rtl" ? "text-right" : "text-left"
              )}>
                Start typing to search...
              </div>
            )}

            {displayOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 text-sm outline-none transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:bg-accent focus:text-accent-foreground",
                  option.disabled && "pointer-events-none opacity-50",
                  option.value === value && "bg-accent text-accent-foreground",
                  direction === "rtl" ? "pr-8 pl-2 text-right" : "pl-8 pr-2 text-left"
                )}
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
              >
                <span className={cn(
                  "absolute flex h-3.5 w-3.5 items-center justify-center",
                  direction === "rtl" ? "right-2" : "left-2"
                )}>
                  {option.value === value && <Check className="h-4 w-4" />}
                </span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
})

SearchableSelect.displayName = "SearchableSelect"
