"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { useSettings } from "@/providers/settings-provider";
import { useI18n } from "@/providers/i18n-provider";

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  showLabels?: boolean;
  onLabel?: string;
  offLabel?: string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, showLabels = false, onLabel, offLabel, ...props }, ref) => {
  const { switchStyle, colorTheme } = useSettings();
  const { t, direction } = useI18n();

  // Default labels
  const defaultOnLabel = onLabel || t("common.yes");
  const defaultOffLabel = offLabel || t("common.no");
  const isRTL = direction === "rtl";

  // Get style-specific classes with RTL support
  const getSwitchStyles = () => {
    const baseStyles =
      "peer inline-flex shrink-0 cursor-pointer items-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

    // RTL-aware thumb translations
    const getThumbTranslation = (distance: string) => {
      return isRTL
        ? `data-[state=checked]:-translate-x-${distance} data-[state=unchecked]:translate-x-0`
        : `data-[state=checked]:translate-x-${distance} data-[state=unchecked]:translate-x-0`;
    };

    switch (switchStyle) {
      case "modern":
        return {
          root: cn(
            baseStyles,
            "h-7 w-12 rounded-full border-2 border-transparent shadow-lg backdrop-blur-sm",
            "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-primary/80 data-[state=checked]:shadow-primary/25",
            "data-[state=unchecked]:bg-gray-300/80 dark:data-[state=unchecked]:bg-gray-600/80",
            "hover:shadow-xl hover:shadow-primary/10 transform hover:scale-105 active:scale-95",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-white/10 before:to-transparent before:pointer-events-none",
            "relative overflow-hidden",
            className
          ),
          thumb: cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-xl ring-0 transition-all duration-300",
            "data-[state=checked]:shadow-2xl data-[state=checked]:shadow-primary/20",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white before:to-gray-100 before:opacity-90",
            "relative overflow-hidden",
            isRTL
              ? "data-[state=checked]:-translate-x-5 data-[state=unchecked]:translate-x-0"
              : "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          ),
        };

      case "ios":
        return {
          root: cn(
            baseStyles,
            "h-8 w-14 rounded-full border-0 shadow-inner backdrop-blur-sm",
            "data-[state=checked]:bg-primary data-[state=checked]:shadow-inner data-[state=checked]:shadow-primary/30",
            "data-[state=unchecked]:bg-gray-300/90 dark:data-[state=unchecked]:bg-gray-600/90",
            "hover:shadow-lg hover:shadow-primary/5 transform hover:scale-[1.02] active:scale-[0.98]",
            "relative overflow-hidden",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none",
            className
          ),
          thumb: cn(
            "pointer-events-none block h-7 w-7 rounded-full bg-white shadow-lg ring-0 transition-all duration-200 my-0.5",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white before:to-gray-50 before:opacity-95",
            "relative overflow-hidden shadow-xl",
            isRTL
              ? "data-[state=checked]:-translate-x-6 data-[state=unchecked]:-translate-x-0.5"
              : "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0.5"
          ),
        };

      case "android":
        return {
          root: cn(
            baseStyles,
            "h-6 w-10 rounded-full border-0 backdrop-blur-sm",
            "data-[state=checked]:bg-primary/25 data-[state=checked]:shadow-inner data-[state=checked]:shadow-primary/20",
            "data-[state=unchecked]:bg-gray-400/25 dark:data-[state=unchecked]:bg-gray-600/25",
            "hover:shadow-md hover:shadow-primary/5 transform hover:scale-105 active:scale-95",
            "relative overflow-hidden",
            className
          ),
          thumb: cn(
            "pointer-events-none block h-5 w-5 rounded-full shadow-xl ring-0 transition-all duration-200",
            "data-[state=checked]:bg-primary data-[state=checked]:shadow-primary/40 data-[state=checked]:shadow-xl",
            "data-[state=unchecked]:bg-gray-500 data-[state=unchecked]:shadow-gray-500/40",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none",
            "relative overflow-hidden",
            isRTL
              ? "data-[state=checked]:-translate-x-4 data-[state=unchecked]:translate-x-0"
              : "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
          ),
        };

      case "toggle":
        return {
          root: cn(
            baseStyles,
            "h-8 w-16 rounded-lg border-2 backdrop-blur-sm",
            "data-[state=checked]:border-primary data-[state=checked]:bg-primary/15 data-[state=checked]:shadow-inner data-[state=checked]:shadow-primary/10",
            "data-[state=unchecked]:border-gray-300/80 data-[state=unchecked]:bg-gray-50/80 dark:data-[state=unchecked]:bg-gray-800/80 dark:data-[state=unchecked]:border-gray-600/80",
            "hover:shadow-lg hover:shadow-primary/5 transform hover:scale-[1.02] active:scale-[0.98]",
            "relative overflow-hidden",
            "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-white/10 before:to-transparent before:pointer-events-none",
            className
          ),
          thumb: cn(
            "pointer-events-none block h-6 w-6 rounded-md shadow-lg ring-0 transition-all duration-300 my-0.5 mx-0.5",
            "data-[state=checked]:bg-primary data-[state=checked]:shadow-primary/30 data-[state=checked]:shadow-xl",
            "data-[state=unchecked]:bg-white data-[state=unchecked]:shadow-gray-400/30 dark:data-[state=unchecked]:bg-gray-300",
            "before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none",
            "relative overflow-hidden",
            isRTL
              ? "data-[state=checked]:-translate-x-8 data-[state=unchecked]:translate-x-0"
              : "data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
          ),
        };

      case "slider":
        return {
          root: cn(
            baseStyles,
            "h-6 w-12 rounded-full border-0 relative overflow-hidden backdrop-blur-sm",
            "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-primary/60 data-[state=checked]:shadow-inner data-[state=checked]:shadow-primary/20",
            "data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-gray-300/90 data-[state=unchecked]:to-gray-400/90 dark:data-[state=unchecked]:from-gray-600/90 dark:data-[state=unchecked]:to-gray-700/90",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/25 before:via-white/10 before:to-transparent before:pointer-events-none",
            "after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/20 after:to-transparent after:pointer-events-none",
            "hover:shadow-xl hover:shadow-primary/10 transform hover:scale-105 active:scale-95",
            className
          ),
          thumb: cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-xl ring-0 transition-all duration-300 my-1",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white before:to-gray-100 before:opacity-95",
            "relative overflow-hidden shadow-2xl",
            isRTL
              ? "data-[state=checked]:-translate-x-6 data-[state=unchecked]:-translate-x-1"
              : "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1"
          ),
        };

      case "neon":
        return {
          root: cn(
            baseStyles,
            "h-7 w-13 rounded-full border-2 relative overflow-hidden backdrop-blur-sm",
            "data-[state=checked]:border-primary data-[state=checked]:bg-black/20 data-[state=checked]:shadow-[0_0_20px_rgba(var(--primary),0.5)] dark:data-[state=checked]:bg-primary/10",
            "data-[state=unchecked]:border-gray-400/50 data-[state=unchecked]:bg-gray-100/50 dark:data-[state=unchecked]:bg-gray-800/50",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:pointer-events-none",
            "hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] transform hover:scale-105 active:scale-95",
            "transition-all duration-300",
            className
          ),
          thumb: cn(
            "pointer-events-none block h-5 w-5 rounded-full shadow-xl ring-0 transition-all duration-300",
            "data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_15px_rgba(var(--primary),0.8)] data-[state=checked]:animate-pulse",
            "data-[state=unchecked]:bg-gray-400 data-[state=unchecked]:shadow-gray-400/50",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none",
            "relative overflow-hidden",
            isRTL
              ? "data-[state=checked]:-translate-x-6 data-[state=unchecked]:translate-x-0"
              : "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
          ),
        };

      case "neumorphism":
        return {
          root: cn(
            baseStyles,
            "h-8 w-16 rounded-2xl border-0 relative backdrop-blur-sm",
            "data-[state=checked]:bg-gray-200 dark:data-[state=checked]:bg-gray-800",
            "data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-800",
            "data-[state=checked]:shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.5),inset_4px_4px_8px_rgba(0,0,0,0.1)]",
            "data-[state=unchecked]:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]",
            "dark:data-[state=checked]:shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.1),inset_4px_4px_8px_rgba(0,0,0,0.3)]",
            "dark:data-[state=unchecked]:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]",
            "hover:shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.6),inset_6px_6px_12px_rgba(0,0,0,0.15)] transform hover:scale-[1.02] active:scale-[0.98]",
            "transition-all duration-300",
            className
          ),
          thumb: cn(
            "pointer-events-none block h-6 w-6 rounded-xl ring-0 transition-all duration-300 my-1 mx-1",
            "data-[state=checked]:bg-primary data-[state=checked]:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.8)]",
            "data-[state=unchecked]:bg-gray-300 data-[state=unchecked]:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.8)]",
            "dark:data-[state=checked]:shadow-[2px_2px_4px_rgba(0,0,0,0.4),-2px_-2px_4px_rgba(255,255,255,0.1)]",
            "dark:data-[state=unchecked]:shadow-[2px_2px_4px_rgba(0,0,0,0.4),-2px_-2px_4px_rgba(255,255,255,0.1)]",
            "relative overflow-hidden",
            isRTL
              ? "data-[state=checked]:-translate-x-8 data-[state=unchecked]:translate-x-0"
              : "data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
          ),
        };

      case "liquid":
        return {
          root: cn(
            baseStyles,
            "h-8 w-16 rounded-full border-0 relative overflow-hidden backdrop-blur-sm",
            "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary/20 data-[state=checked]:via-primary/30 data-[state=checked]:to-primary/20",
            "data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-gray-200/80 data-[state=unchecked]:to-gray-300/80 dark:data-[state=unchecked]:from-gray-700/80 dark:data-[state=unchecked]:to-gray-600/80",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:pointer-events-none before:animate-pulse",
            "after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-full after:bg-gradient-to-b after:from-white/10 after:to-transparent after:pointer-events-none",
            "hover:shadow-2xl hover:shadow-primary/20 transform hover:scale-105 active:scale-95",
            "transition-all duration-500 ease-out",
            className
          ),
          thumb: cn(
            "pointer-events-none block h-7 w-7 rounded-full shadow-2xl ring-0 transition-all duration-500 ease-out my-0.5",
            "data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-primary data-[state=checked]:via-primary/90 data-[state=checked]:to-primary/80",
            "data-[state=unchecked]:bg-gradient-to-br data-[state=unchecked]:from-white data-[state=unchecked]:to-gray-100 dark:data-[state=unchecked]:from-gray-300 dark:data-[state=unchecked]:to-gray-400",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none",
            "after:absolute after:inset-1 after:rounded-full after:bg-gradient-to-t after:from-transparent after:to-white/20 after:pointer-events-none",
            "relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.15)]",
            isRTL
              ? "data-[state=checked]:-translate-x-8 data-[state=unchecked]:-translate-x-0.5"
              : "data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0.5"
          ),
        };

      case "cyberpunk":
        return {
          root: cn(
            baseStyles,
            "h-6 w-14 rounded-sm border-2 relative overflow-hidden backdrop-blur-sm",
            "data-[state=checked]:border-primary data-[state=checked]:bg-black/80 data-[state=checked]:shadow-[0_0_20px_rgba(var(--primary),0.6),inset_0_0_20px_rgba(var(--primary),0.1)]",
            "data-[state=unchecked]:border-gray-500/50 data-[state=unchecked]:bg-gray-900/50 dark:data-[state=unchecked]:bg-gray-800/50",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:pointer-events-none before:animate-pulse",
            "after:absolute after:top-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-transparent after:via-primary/60 after:to-transparent after:pointer-events-none",
            "hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:border-primary/80 transform hover:scale-105 active:scale-95",
            "transition-all duration-300",
            className
          ),
          thumb: cn(
            "pointer-events-none block h-4 w-4 rounded-sm shadow-xl ring-0 transition-all duration-300 my-0.5 mx-0.5",
            "data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_15px_rgba(var(--primary),1),inset_0_0_10px_rgba(255,255,255,0.2)]",
            "data-[state=unchecked]:bg-gray-400 data-[state=unchecked]:shadow-gray-400/50",
            "before:absolute before:inset-0 before:rounded-sm before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none",
            "after:absolute after:top-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:pointer-events-none",
            "relative overflow-hidden",
            isRTL
              ? "data-[state=checked]:-translate-x-8 data-[state=unchecked]:translate-x-0"
              : "data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
          ),
        };

      default: // default style
        return {
          root: cn(
            baseStyles,
            "h-6 w-11 rounded-full border-2 border-transparent backdrop-blur-sm",
            "data-[state=checked]:bg-primary data-[state=checked]:shadow-inner data-[state=checked]:shadow-primary/20",
            "data-[state=unchecked]:bg-input/80",
            "hover:shadow-md hover:shadow-primary/5 transform hover:scale-[1.02] active:scale-[0.98]",
            "relative overflow-hidden",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-white/15 before:to-transparent before:pointer-events-none",
            className
          ),
          thumb: cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-all duration-300",
            "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white before:to-gray-50 before:opacity-90",
            "relative overflow-hidden shadow-xl",
            isRTL
              ? "data-[state=checked]:-translate-x-5 data-[state=unchecked]:translate-x-0"
              : "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          ),
        };
    }
  };

  const styles = getSwitchStyles();

  if (showLabels) {
    return (
      <div
        className={cn(
          "flex items-center gap-3",
          isRTL ? "flex-row-reverse space-x-reverse" : ""
        )}
      >
        <span
          className={cn(
            "text-sm font-medium transition-colors duration-200 select-none",
            props.checked ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {defaultOnLabel}
        </span>
        <SwitchPrimitives.Root className={styles.root} {...props} ref={ref}>
          <SwitchPrimitives.Thumb className={styles.thumb} />
        </SwitchPrimitives.Root>
        <span
          className={cn(
            "text-sm font-medium transition-colors duration-200 select-none",
            props.checked ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {defaultOffLabel}
        </span>
      </div>
    );
  }

  return (
    <SwitchPrimitives.Root className={styles.root} {...props} ref={ref}>
      <SwitchPrimitives.Thumb className={styles.thumb} />
    </SwitchPrimitives.Root>
  );
});

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
