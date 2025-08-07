"use client"
import { useI18n } from "@/providers/i18n-provider"
import { useSettings } from "@/providers/settings-provider"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "inline"
  showText?: boolean
  className?: string
}

export function LoadingSpinner({ 
  size = "md", 
  showText = true, 
  className 
}: LoadingSpinnerProps) {
  const { t } = useI18n()
  const settings = useSettings()

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8"
      case "lg":
        return "w-24 h-24"
      case "inline":
        return "w-4 h-4"
      default:
        return "w-16 h-16"
    }
  }

  const getLoadingComponent = () => {
    const sizeClasses = getSizeClasses()
    
    switch (settings.loadingStyle) {
      case "dots":
        if (size === "inline") {
          return (
            <div className="flex space-x-0.5">
              <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-100"></div>
              <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-200"></div>
            </div>
          )
        }
        return (
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-200"></div>
          </div>
        )
      case "bars":
        if (size === "inline") {
          return (
            <div className="flex space-x-0.5">
              <div className="w-0.5 h-4 bg-current animate-pulse"></div>
              <div className="w-0.5 h-4 bg-current animate-pulse delay-100"></div>
              <div className="w-0.5 h-4 bg-current animate-pulse delay-200"></div>
            </div>
          )
        }
        return (
          <div className="flex space-x-1">
            <div className="w-1 h-8 bg-primary animate-pulse"></div>
            <div className="w-1 h-8 bg-primary animate-pulse delay-100"></div>
            <div className="w-1 h-8 bg-primary animate-pulse delay-200"></div>
            <div className="w-1 h-8 bg-primary animate-pulse delay-300"></div>
          </div>
        )
      case "pulse":
        if (size === "inline") {
          return (
            <div className="w-4 h-4 bg-current rounded animate-pulse"></div>
          )
        }
        return (
          <div className={cn(sizeClasses, "bg-primary rounded animate-pulse")}></div>
        )
      default: // spinner
        if (size === "inline") {
          return (
            <div className="relative">
              <div className="w-4 h-4 border-2 border-current/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            </div>
          )
        }
        return (
          <div className="relative">
            <div className={cn(sizeClasses, "border-4 border-primary/20 rounded-full")}></div>
            <div className={cn("absolute top-0 left-0", sizeClasses, "border-4 border-primary border-t-transparent rounded-full animate-spin")}></div>
          </div>
        )
    }
  }

  if (size === "inline") {
    return (
      <div className={cn("inline-flex items-center", className)}>
        {getLoadingComponent()}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center min-h-[60vh]", className)}>
      <div className="flex flex-col items-center space-y-4">
        {getLoadingComponent()}
        {showText && (
          <p className="text-muted-foreground font-medium">{t("common.loading")}</p>
        )}
      </div>
    </div>
  )
}
