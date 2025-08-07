import * as React from "react"
import { useSettings } from "@/providers/settings-provider"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const settings = useSettings()
  
  const getCardClasses = () => {
    const baseClasses = "rounded-lg text-card-foreground transition-all duration-200"
    
    switch (settings.cardStyle) {
      case "glass":
        return cn(baseClasses, "bg-white/10 backdrop-blur border border-white/20")
      case "solid":
        return cn(baseClasses, "bg-muted border-0")
      case "bordered":
        return cn(baseClasses, "border-2 bg-card")
      case "elevated":
        return cn(baseClasses, "shadow-lg border-0 bg-card")
      default:
        return cn(baseClasses, "border bg-card shadow-sm")
    }
  }

  return (
    <div
      ref={ref}
      className={cn(getCardClasses(), className)}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const settings = useSettings()
  
  const getPadding = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "p-4"
      case "comfortable":
        return "p-8"
      case "spacious":
        return "p-10"
      default:
        return "p-6"
    }
  }

  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", getPadding(), className)}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const settings = useSettings()
  
  const getFontSize = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-lg"
      case "large":
        return "text-3xl"
      default:
        return "text-2xl"
    }
  }

  return (
    <h3
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight",
        getFontSize(),
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const settings = useSettings()
  
  const getFontSize = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-xs"
      case "large":
        return "text-base"
      default:
        return "text-sm"
    }
  }

  return (
    <p
      ref={ref}
      className={cn(getFontSize(), "text-muted-foreground", className)}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const settings = useSettings()
  
  const getPadding = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "p-4 pt-0"
      case "comfortable":
        return "p-8 pt-0"
      case "spacious":
        return "p-10 pt-0"
      default:
        return "p-6 pt-0"
    }
  }

  return (
    <div ref={ref} className={cn(getPadding(), className)} {...props} />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const settings = useSettings()
  
  const getPadding = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "p-4 pt-0"
      case "comfortable":
        return "p-8 pt-0"
      case "spacious":
        return "p-10 pt-0"
      default:
        return "p-6 pt-0"
    }
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center", getPadding(), className)}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
