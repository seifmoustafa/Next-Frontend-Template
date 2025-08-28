"use client";

import type React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettings } from "@/providers/settings-provider";
import { cn } from "@/lib/utils";

interface GenericModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function GenericModal({
  open,
  onOpenChange,
  title,
  children,
  size = "md",
}: GenericModalProps) {
  const settings = useSettings();

  const getSizeClasses = () => {
    const baseSizes = {
      sm: "sm:max-w-sm",
      md: "sm:max-w-md",
      lg: "sm:max-w-lg",
      xl: "sm:max-w-xl",
      full: "sm:max-w-4xl",
    };

    // Adjust sizes based on spacing settings
    if (settings.spacingSize === "compact") {
      return {
        sm: "sm:max-w-xs",
        md: "sm:max-w-sm",
        lg: "sm:max-w-md",
        xl: "sm:max-w-lg",
        full: "sm:max-w-3xl",
      }[size];
    } else if (settings.spacingSize === "spacious") {
      return {
        sm: "sm:max-w-md",
        md: "sm:max-w-lg",
        lg: "sm:max-w-xl",
        xl: "sm:max-w-2xl",
        full: "sm:max-w-6xl",
      }[size];
    }

    return baseSizes[size];
  };

  const getModalClasses = () => {
    let baseClasses = "p-0 overflow-hidden flex flex-col";
    let sizeClasses = "";
    let styleClasses = "";

    switch (settings.modalStyle) {
      case "centered":
        // Keep default centering behavior
        sizeClasses = "w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh]";
        break;
      case "fullscreen":
        // Responsive fullscreen - full on mobile, large on desktop
        sizeClasses = "w-[98vw] h-[95vh] max-w-none max-h-none sm:w-[95vw] sm:h-[90vh] md:w-[90vw] md:h-[85vh]";
        styleClasses = "sm:rounded-lg";
        break;
      case "drawer":
        // Drawer from right side - responsive width
        sizeClasses = "w-full h-[95vh] max-w-md sm:max-w-lg md:max-w-xl max-h-none";
        styleClasses = "!translate-x-0 !translate-y-0 !left-auto !top-0 right-0 rounded-l-lg rounded-r-none";
        break;
      case "glass":

        sizeClasses = "w-[85vw] max-w-2xl max-h-[80vh]";
        styleClasses = "bg-background/20 backdrop-blur-2xl border-2 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)] rounded-3xl";
        break;
      case "floating":
        // Compact floating with theme-aware colors
        sizeClasses = "w-[70vw] max-w-sm max-h-[60vh]";
        styleClasses = "bg-background border border-purple-500/30 shadow-[0_30px_60px_-12px_rgba(168,85,247,0.3)] rounded-2xl transform rotate-1";
        break;
      case "card":
        // Wide card with proper contrast
        sizeClasses = "w-[95vw] max-w-4xl max-h-[85vh]";
        styleClasses = "bg-background border-4 border-emerald-500/40 shadow-2xl rounded-xl";
        break;
      case "overlay":
        // Full screen with inverted theme colors
        sizeClasses = "w-[98vw] h-[95vh] max-w-none max-h-none";
        styleClasses = "bg-muted/95 border-2 border-orange-500/50 shadow-[0_0_100px_rgba(251,146,60,0.3)] rounded-none";
        break;
      default:
        // Default modal with responsive sizing
        sizeClasses = "w-[95vw] max-h-[90vh]";
    }

    // Apply border radius based on settings (except for drawer which has custom radius)
    let radiusClasses = "";
    if (settings.modalStyle !== "drawer") {
      switch (settings.borderRadius) {
        case "none":
          radiusClasses = "rounded-none";
          break;
        case "small":
          radiusClasses = "rounded-sm";
          break;
        case "large":
          radiusClasses = "rounded-xl";
          break;
        case "full":
          radiusClasses = "rounded-2xl";
          break;
        default:
          radiusClasses = "rounded-lg";
      }
    }

    // Apply shadow based on settings
    let shadowClasses = "";
    switch (settings.shadowIntensity) {
      case "none":
        shadowClasses = "shadow-none";
        break;
      case "subtle":
        shadowClasses = "shadow-sm";
        break;
      case "strong":
        shadowClasses = "shadow-2xl";
        break;
      default:
        shadowClasses = "shadow-lg";
    }

    return cn(baseClasses, sizeClasses, styleClasses, radiusClasses, shadowClasses);
  };

  const getHeaderPadding = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "px-4 py-3";
      case "comfortable":
        return "px-8 py-6";
      case "spacious":
        return "px-10 py-8";
      default:
        return "px-6 py-4";
    }
  };

  const getContentPadding = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "px-4 py-3";
      case "comfortable":
        return "px-8 py-6";
      case "spacious":
        return "px-10 py-8";
      default:
        return "px-6 py-4";
    }
  };

  const getTitleSize = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-base";
      case "large":
        return "text-2xl";
      default:
        return "text-lg";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className={cn(getModalClasses())}>
        <DialogHeader className={cn(getHeaderPadding(), "border-b shrink-0")}>
          <DialogTitle className={cn("font-semibold", getTitleSize())}>
            {title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className={cn(getContentPadding(), "pr-4")}>
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
 