"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GenericChart } from "@/components/ui/generic-chart"
import { useI18n } from "@/providers/i18n-provider"

export function AnalyticsView() {
  const { t } = useI18n()

  // Mock data for demonstration
  const chartData = [
    { name: "Jan", users: 400, revenue: 2400 },
    { name: "Feb", users: 300, revenue: 1398 },
    { name: "Mar", users: 600, revenue: 9800 },
    { name: "Apr", users: 800, revenue: 3908 },
    { name: "May", users: 700, revenue: 4800 },
    { name: "Jun", users: 900, revenue: 3800 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("nav.analytics")}</h1>
        <p className="text-muted-foreground mt-2">Detailed analytics and insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericChart data={chartData} type="line" dataKey="users" height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericChart data={chartData} type="bar" dataKey="revenue" height={300} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Combined Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <GenericChart
            data={chartData}
            type="line"
            height={400}
            multiple={[
              { dataKey: "users", color: "#8884d8", name: "Users" },
              { dataKey: "revenue", color: "#82ca9d", name: "Revenue" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
