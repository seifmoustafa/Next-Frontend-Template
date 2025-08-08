"use client"

import { useState, useEffect } from "react"
import type { AnalyticsData, IAnalyticsService } from "@/services/analytics.service"
import { useI18n } from "@/providers/i18n-provider"

export function useDashboardViewModel(analyticsService: IAnalyticsService) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useI18n()

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const analyticsData = await analyticsService.getDashboardAnalytics()
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"))
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    loadDashboardData()
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  return {
    data,
    loading,
    error,
    refreshData,
  }
}
