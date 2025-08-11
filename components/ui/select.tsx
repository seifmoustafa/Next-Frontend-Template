"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSettings } from "@/providers/settings-provider"
import { useI18n } from "@/providers/i18n-provider"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { selectStyle } = useSettings()
  const { direction } = useI18n()
  
  const getSelectTriggerStyles = () => {
    const baseClasses = "flex w-full items-center justify-between text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
    const directionClasses = direction === "rtl" ? "text-right" : "text-left"
    
    switch (selectStyle) {
      case "modern":
        return cn(
          baseClasses,
          "h-12 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 px-6 py-3 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-blue-900 dark:text-blue-100",
          directionClasses
        )
      
      case "glass":
        return cn(
          baseClasses,
          "h-11 rounded-xl border border-white/30 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/30 backdrop-blur-xl px-5 py-3 transition-all duration-300 hover:bg-white/30 dark:hover:bg-gray-700/40 focus:border-white/50 dark:focus:border-gray-600 focus:ring-4 focus:ring-white/20 dark:focus:ring-gray-500/20 text-gray-800 dark:text-gray-200 shadow-lg",
          directionClasses
        )
      
      case "outlined":
        return cn(
          baseClasses,
          "h-10 rounded-lg border-3 border-gray-400 dark:border-gray-500 bg-transparent px-4 py-2 transition-all duration-200 hover:border-gray-600 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:border-gray-700 dark:focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/30 text-gray-700 dark:text-gray-300",
          directionClasses
        )
      
      case "filled":
        return cn(
          baseClasses,
          "h-11 rounded-lg border-0 bg-gray-200 dark:bg-gray-700 px-4 py-3 transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:bg-white dark:focus:bg-gray-800 focus:ring-3 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none text-gray-800 dark:text-gray-200 shadow-inner",
          directionClasses
        )
      
      case "minimal":
        return cn(
          "flex h-9 w-full items-center justify-between border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-2 py-2 text-sm transition-all duration-200 hover:border-gray-500 dark:hover:border-gray-400 focus:border-gray-700 dark:focus:border-gray-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 text-gray-700 dark:text-gray-300",
          directionClasses
        )
      
      case "elegant":
        return cn(
          baseClasses,
          "h-13 rounded-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950 px-5 py-4 transition-all duration-400 hover:from-purple-100 hover:via-pink-100 hover:to-rose-100 dark:hover:from-purple-900 dark:hover:via-pink-900 dark:hover:to-rose-900 hover:shadow-xl focus:border-purple-400 dark:focus:border-purple-600 focus:ring-4 focus:ring-purple-500/25 text-purple-900 dark:text-purple-100",
          directionClasses
        )
      
      case "professional":
        return cn(
          baseClasses,
          "h-11 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 shadow-sm transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md focus:border-slate-600 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 focus:outline-none text-slate-700 dark:text-slate-300",
          directionClasses
        )
      
      default:
        return cn(
          baseClasses,
          "h-10 rounded-md border border-input bg-background px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          directionClasses
        )
    }
  }

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(getSelectTriggerStyles(), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
  const { selectStyle } = useSettings()
  const { direction } = useI18n()
  
  const getSelectContentStyles = () => {
    const baseClasses = "relative z-50 max-h-96 min-w-[8rem] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    const directionClasses = direction === "rtl" ? "text-right" : "text-left"
    
    switch (selectStyle) {
      case "modern":
        return cn(
          baseClasses,
          "rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 shadow-2xl text-blue-900 dark:text-blue-100",
          directionClasses
        )
      
      case "glass":
        return cn(
          baseClasses,
          "rounded-xl border border-white/30 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/40 backdrop-blur-xl shadow-2xl text-gray-800 dark:text-gray-200",
          directionClasses
        )
      
      case "outlined":
        return cn(
          baseClasses,
          "rounded-lg border-3 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 shadow-xl text-gray-700 dark:text-gray-300",
          directionClasses
        )
      
      case "filled":
        return cn(
          baseClasses,
          "rounded-lg border-0 bg-gray-100 dark:bg-gray-700 shadow-xl text-gray-800 dark:text-gray-200",
          directionClasses
        )
      
      case "minimal":
        return cn(
          baseClasses,
          "rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg text-gray-700 dark:text-gray-300",
          directionClasses
        )
      
      case "elegant":
        return cn(
          baseClasses,
          "rounded-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-b from-purple-50 via-pink-50 to-rose-100 dark:from-purple-950 dark:via-pink-950 dark:to-rose-900 shadow-2xl text-purple-900 dark:text-purple-100",
          directionClasses
        )
      
      case "professional":
        return cn(
          baseClasses,
          "rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-xl text-slate-700 dark:text-slate-300",
          directionClasses
        )
      
      default:
        return cn(
          baseClasses,
          "rounded-md border border-input bg-background text-foreground shadow-md",
          directionClasses
        )
    }
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          getSelectContentStyles(),
          "z-[9999]", // High z-index to appear above modals
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => {
  const { direction } = useI18n()
  
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn(
        "py-1.5 text-sm font-semibold",
        direction === "rtl" ? "pr-8 pl-2 text-right" : "pl-8 pr-2 text-left",
        className
      )}
      {...props}
    />
  )
})
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  const { direction } = useI18n()
  
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        direction === "rtl" ? "pr-8 pl-2 text-right" : "pl-8 pr-2 text-left",
        className
      )}
      {...props}
    >
      <span className={cn(
        "absolute flex h-3.5 w-3.5 items-center justify-center",
        direction === "rtl" ? "right-2" : "left-2"
      )}>
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
