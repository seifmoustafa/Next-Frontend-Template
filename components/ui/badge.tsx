import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { useSettings } from "@/providers/settings-provider"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
      },
      badgeStyle: {
        default: "rounded-full border px-2.5 py-0.5 text-xs border-border bg-background/80 text-foreground hover:bg-background",
        modern: "rounded-lg border px-2.5 py-0.5 text-xs bg-muted/50 backdrop-blur-sm shadow-sm hover:shadow-md border-border/50 text-foreground hover:bg-muted/70",
        glass: "rounded-xl border px-2.5 py-0.5 text-xs bg-background/20 backdrop-blur-md shadow-lg hover:shadow-xl border-border/30 text-foreground hover:bg-background/30",
        neon: "rounded-md border px-2.5 py-0.5 text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:shadow-xl border-primary/40 bg-primary/5 text-primary hover:bg-primary/10",
        gradient: "rounded-full border-0 px-2.5 py-0.5 text-xs bg-gradient-to-r from-primary/70 to-primary/90 text-primary-foreground shadow-lg hover:from-primary/80 hover:to-primary",
        outlined: "rounded-lg border-2 px-2.5 py-0.5 text-xs bg-transparent hover:bg-primary/5 border-primary/50 hover:border-primary/70 text-primary hover:text-primary",
        filled: "rounded-md border-0 px-2.5 py-0.5 text-xs bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg",
        minimal: "rounded-none border-0 px-2.5 py-0.5 text-xs bg-transparent hover:bg-muted/30 text-muted-foreground hover:text-foreground",
        pill: "rounded-full border px-3 py-0.5 text-xs hover:shadow-md border-border bg-muted/30 text-foreground hover:bg-muted/50",
        square: "rounded-sm border px-2.5 py-0.5 text-xs hover:shadow-sm border-border bg-muted/20 text-foreground hover:bg-muted/40"
      },
    },
    defaultVariants: {
      variant: "default",
      badgeStyle: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  const settings = useSettings()

  return (
    <div
      className={cn(badgeVariants({
        variant,
        badgeStyle: settings.badgeStyle,
        className
      }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
