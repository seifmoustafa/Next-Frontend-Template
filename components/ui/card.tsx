import * as React from "react"
import { useSettings } from "@/providers/settings-provider"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const settings = useSettings()
  
  const getCardClasses = () => {
    switch (settings.cardStyle) {
      case "glass":
        return "bg-white/10 backdrop-blur border border-white/20 shadow-lg"
      case "solid":
        return "bg-muted border-0 shadow-sm"
      case "bordered":
        return "border-2 bg-card shadow-sm"
      case "elevated":
        return "shadow-lg bg-card border-0"
      default:
        return "border bg-card text-card-foreground shadow-sm"
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg",
        getCardClasses(),
        className
      )}
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
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5",
        settings.spacingSize === "compact" ? "p-4" :
        settings.spacingSize === "comfortable" ? "p-8" :
        settings.spacingSize === "spacious" ? "p-10" : "p-6",
        className
      )}
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
  
  return (
    <h3
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight",
        settings.fontSize === "small" ? "text-lg" :
        settings.fontSize === "large" ? "text-2xl" : "text-xl",
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
  
  return (
    <p
      ref={ref}
      className={cn(
        "text-muted-foreground",
        settings.fontSize === "small" ? "text-xs" :
        settings.fontSize === "large" ? "text-base" : "text-sm",
        className
      )}
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
  
  return (
    <div
      ref={ref}
      className={cn(
        settings.spacingSize === "compact" ? "p-4 pt-0" :
        settings.spacingSize === "comfortable" ? "p-8 pt-0" :
        settings.spacingSize === "spacious" ? "p-10 pt-0" : "p-6 pt-0",
        className
      )}
      {...props}
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const settings = useSettings()
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        settings.spacingSize === "compact" ? "p-4 pt-0" :
        settings.spacingSize === "comfortable" ? "p-8 pt-0" :
        settings.spacingSize === "spacious" ? "p-10 pt-0" : "p-6 pt-0",
        className
      )}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
