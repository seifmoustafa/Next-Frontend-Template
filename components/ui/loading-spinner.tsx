"use client"
import { useI18n } from "@/providers/i18n-provider"

export function LoadingSpinner() {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-muted-foreground font-medium">{t("common.loading")}</p>
      </div>
    </div>
  )
}
