"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardViewModel } from "@/viewmodels/dashboard.viewmodel"
import { useServices } from "@/providers/service-provider"
import { useI18n } from "@/providers/i18n-provider"
import { Users, DollarSign, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { GenericChart } from "@/components/ui/generic-chart"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"

export function DashboardView() {
  const { analyticsService } = useServices()
  const { t } = useI18n()

  const { data, loading, error, refreshData } = useDashboardViewModel(analyticsService)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />
  }

  if (!data) {
    return <div className="text-center py-12">{t("common.noData")}</div>
  }

  const stats = [
    {
      title: t("dashboard.totalUsers"),
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: t("dashboard.revenue"),
      value: `$${data.revenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+8%",
      changeType: "positive" as const,
      color: "from-green-500 to-green-600",
    },
    {
      title: t("dashboard.orders"),
      value: data.orders.toLocaleString(),
      icon: ShoppingCart,
      change: "-2%",
      changeType: "negative" as const,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: t("dashboard.growth"),
      value: `${data.growth}%`,
      icon: TrendingUp,
      change: "+5%",
      changeType: "positive" as const,
      color: "from-purple-500 to-purple-600",
    },
  ]

  const chartData = data.chartData.map((item) => ({
    ...item,
    name: t(`months.${item.name}`),
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t("dashboard.title")}
        </h1>
        <p className="text-muted-foreground text-lg">{t("dashboard.welcome")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.changeType === "positive"

          return (
            <Card key={stat.title} className="hover-lift glass border-0 overflow-hidden group">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}
              />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>

              <CardContent className="relative">
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="flex items-center text-sm">
                  {isPositive ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={isPositive ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                  <span className="text-muted-foreground mr-1">{t("stats.fromLastMonth")}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart */}
      <Card className="hover-lift glass border-0">
        <CardHeader>
          <CardTitle className="text-xl">{t("dashboard.revenueOverview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <GenericChart data={chartData} type="line" height={400} />
        </CardContent>
      </Card>
    </div>
  )
}
