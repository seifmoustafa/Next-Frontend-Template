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
    const baseClasses = "w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col";
    
    let styleClasses = "";
    switch (settings.modalStyle) {
      case "centered":
        styleClasses = "items-center justify-center";
        break;
      case "fullscreen":
        styleClasses = "w-screen h-screen max-w-none max-h-none rounded-none";
        break;
      case "drawer":
        styleClasses = "fixed right-0 top-0 h-screen max-h-screen rounded-l-lg rounded-r-none";
        break;
      default:
        styleClasses = "";
    }

    // Apply border radius based on settings
    let radiusClasses = "";
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

    return cn(baseClasses, styleClasses, radiusClasses, shadowClasses);
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
      <DialogContent className={cn(getSizeClasses(), getModalClasses())}>
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
