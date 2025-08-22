"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import {
  LineCharts,
  AreaCharts,
  BarCharts,
  PieDonutCharts,
  ScatterBubbleCharts,
  MixedCharts,
  RadarGaugeCharts,
  HeatmapTreemapCharts,
  TimelineFunnelCharts,
} from "@/components/charts";

export function ChartsTab() {
  const { t } = useI18n();
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  // Comprehensive sample data for all chart types
  const monthlyRevenueData = [
    { name: t("months.jan"), value: 4000, revenue: 4000, users: 2400, orders: 1200, profit: 3200, expenses: 800, growth: 12.5 },
    { name: t("months.feb"), value: 3000, revenue: 3000, users: 1398, orders: 800, profit: 2400, expenses: 600, growth: -25.0 },
    { name: t("months.mar"), value: 2000, revenue: 2000, users: 9800, orders: 1500, profit: 1600, expenses: 400, growth: -33.3 },
    { name: t("months.apr"), value: 2780, revenue: 2780, users: 3908, orders: 1200, profit: 2224, expenses: 556, growth: 39.0 },
    { name: t("months.may"), value: 1890, revenue: 1890, users: 4800, orders: 900, profit: 1512, expenses: 378, growth: -32.0 },
    { name: t("months.jun"), value: 2390, revenue: 2390, users: 3800, orders: 1100, profit: 1912, expenses: 478, growth: 26.5 },
    { name: t("months.jul"), value: 3490, revenue: 3490, users: 4300, orders: 1300, profit: 2792, expenses: 698, growth: 46.0 },
    { name: t("months.aug"), value: 4000, revenue: 4000, users: 2400, orders: 1200, profit: 3200, expenses: 800, growth: 14.6 },
    { name: t("months.sep"), value: 3000, revenue: 3000, users: 1398, orders: 800, profit: 2400, expenses: 600, growth: -25.0 },
    { name: t("months.oct"), value: 2000, revenue: 2000, users: 9800, orders: 1500, profit: 1600, expenses: 400, growth: -33.3 },
    { name: t("months.nov"), value: 2780, revenue: 2780, users: 3908, orders: 1200, profit: 2224, expenses: 556, growth: 39.0 },
    { name: t("months.dec"), value: 1890, revenue: 1890, users: 4800, orders: 900, profit: 1512, expenses: 378, growth: -32.0 },
  ];

  const stackedAreaData = [
    { name: t("months.jan"), desktop: 4000, mobile: 2400, tablet: 1200, smartwatch: 300, tv: 150, other: 100 },
    { name: t("months.feb"), desktop: 3000, mobile: 1398, tablet: 800, smartwatch: 250, tv: 120, other: 80 },
    { name: t("months.mar"), desktop: 2000, mobile: 9800, tablet: 1500, smartwatch: 400, tv: 200, other: 120 },
    { name: t("months.apr"), desktop: 2780, mobile: 3908, tablet: 1200, smartwatch: 350, tv: 180, other: 90 },
    { name: t("months.may"), desktop: 1890, mobile: 4800, tablet: 900, smartwatch: 320, tv: 160, other: 85 },
    { name: t("months.jun"), desktop: 2390, mobile: 3800, tablet: 1100, smartwatch: 380, tv: 190, other: 95 },
    { name: t("months.jul"), desktop: 3200, mobile: 4200, tablet: 1300, smartwatch: 420, tv: 210, other: 110 },
    { name: t("months.aug"), desktop: 3800, mobile: 3600, tablet: 1400, smartwatch: 450, tv: 225, other: 115 },
  ];

  const marketShareData = [
    { name: t("settings.devices.desktop"), value: 400, fill: "#8884d8" },
    { name: t("settings.devices.mobile"), value: 300, fill: "#82ca9d" },
    { name: t("settings.devices.tablet"), value: 300, fill: "#ffc658" },
    { name: t("settings.devices.smarttv"), value: 200, fill: "#ff7300" },
    { name: t("settings.devices.other"), value: 100, fill: "#8dd1e1" },
  ];

  const scatterData = [
    { x: 100, y: 200, z: 20, name: t("products.productA") },
    { x: 120, y: 100, z: 15, name: t("products.productB") },
    { x: 170, y: 300, z: 25, name: t("products.productC") },
    { x: 140, y: 250, z: 18, name: t("products.productD") },
    { x: 150, y: 400, z: 30, name: t("products.productE") },
    { x: 110, y: 280, z: 22, name: t("products.productF") },
    { x: 180, y: 350, z: 28, name: t("products.productG") },
    { x: 130, y: 180, z: 16, name: t("products.productH") },
  ];

  const bubbleData = [
    { x: 100, y: 200, z: 200, name: t("campaigns.campaignA") },
    { x: 120, y: 100, z: 260, name: t("campaigns.campaignB") },
    { x: 170, y: 300, z: 400, name: t("campaigns.campaignC") },
    { x: 140, y: 250, z: 280, name: t("campaigns.campaignD") },
    { x: 150, y: 400, z: 500, name: t("campaigns.campaignE") },
    { x: 110, y: 280, z: 200, name: t("campaigns.campaignF") },
  ];

  const dualAxisData = [
    { name: t("months.jan"), revenue: 4000, conversion: 24 },
    { name: t("months.feb"), revenue: 3000, conversion: 13 },
    { name: t("months.mar"), revenue: 2000, conversion: 98 },
    { name: t("months.apr"), revenue: 2780, conversion: 39 },
    { name: t("months.may"), revenue: 1890, conversion: 48 },
    { name: t("months.jun"), revenue: 2390, conversion: 38 },
  ];

  const performanceData = [
    { subject: t("charts.radarSubjects.performance"), teamA: 120, teamB: 110, teamC: 95, teamD: 105, fullMark: 150 },
    { subject: t("charts.radarSubjects.quality"), teamA: 98, teamB: 130, teamC: 115, teamD: 125, fullMark: 150 },
    { subject: t("charts.radarSubjects.efficiency"), teamA: 86, teamB: 130, teamC: 140, teamD: 120, fullMark: 150 },
    { subject: t("charts.radarSubjects.reliability"), teamA: 99, teamB: 100, teamC: 110, teamD: 95, fullMark: 150 },
    { subject: t("charts.radarSubjects.innovation"), teamA: 85, teamB: 90, teamC: 75, teamD: 100, fullMark: 150 },
    { subject: t("charts.radarSubjects.support"), teamA: 65, teamB: 85, teamC: 90, teamD: 80, fullMark: 150 },
    { subject: t("charts.radarSubjects.security"), teamA: 110, teamB: 95, teamC: 105, teamD: 115, fullMark: 150 },
    { subject: t("charts.radarSubjects.scalability"), teamA: 75, teamB: 120, teamC: 100, teamD: 90, fullMark: 150 },
  ];

  // Enhanced heatmap data with better examples
  const heatmapData1 = Array.from({ length: 52 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => ({
      x: day,
      y: week,
      value: Math.floor(Math.random() * 100) + 1,
      label: t("charts.heatmap.weekDayActivity", {
        week: week + 1,
        day: t(`daysFull.${days[day]}`)
      })
    }))
  ).flat();

  const heatmapData2 = Array.from({ length: 12 }, (_, month) =>
    Array.from({ length: 31 }, (_, day) => ({
      x: day,
      y: month,
      value: Math.floor(Math.random() * 50) + 10,
      label: t("charts.heatmap.monthDaySales", {
        month: t(`months.${['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][month]}`),
        day: day + 1
      })
    }))
  ).flat();

  const hierarchicalData = [
    {
      name: t("departments.technology"),
      size: 400,
      children: [
        { name: t("departments.frontend"), size: 200 },
        { name: t("departments.backend"), size: 150 },
        { name: t("departments.devops"), size: 50 }
      ]
    },
    {
      name: t("departments.marketing"),
      size: 300,
      children: [
        { name: t("departments.digital"), size: 180 },
        { name: t("departments.content"), size: 120 }
      ]
    },
    {
      name: t("departments.sales"),
      size: 300,
      children: [
        { name: t("departments.enterprise"), size: 200 },
        { name: t("departments.smb"), size: 100 }
      ]
    },
    { name: t("departments.support"), size: 200 },
    { name: t("departments.operations"), size: 150 },
  ];

  const conversionFunnelData = [
    {
      stage: t("charts.conversionFunnel.websiteVisitors.stage"),
      value: 10000,
      description: t("charts.conversionFunnel.websiteVisitors.desc"),
    },
    {
      stage: t("charts.conversionFunnel.productViews.stage"),
      value: 8000,
      description: t("charts.conversionFunnel.productViews.desc"),
    },
    {
      stage: t("charts.conversionFunnel.addToCart.stage"),
      value: 6000,
      description: t("charts.conversionFunnel.addToCart.desc"),
    },
    {
      stage: t("charts.conversionFunnel.checkoutStarted.stage"),
      value: 4000,
      description: t("charts.conversionFunnel.checkoutStarted.desc"),
    },
    {
      stage: t("charts.conversionFunnel.paymentInfo.stage"),
      value: 3200,
      description: t("charts.conversionFunnel.paymentInfo.desc"),
    },
    {
      stage: t("charts.conversionFunnel.purchaseCompleted.stage"),
      value: 2000,
      description: t("charts.conversionFunnel.purchaseCompleted.desc"),
    },
  ];

  const salesFunnelData = [
    {
      stage: t("charts.salesFunnel.leadGeneration.stage"),
      value: 5000,
      description: t("charts.salesFunnel.leadGeneration.desc"),
    },
    {
      stage: t("charts.salesFunnel.initialContact.stage"),
      value: 3500,
      description: t("charts.salesFunnel.initialContact.desc"),
    },
    {
      stage: t("charts.salesFunnel.needsAssessment.stage"),
      value: 2500,
      description: t("charts.salesFunnel.needsAssessment.desc"),
    },
    {
      stage: t("charts.salesFunnel.proposalSent.stage"),
      value: 1500,
      description: t("charts.salesFunnel.proposalSent.desc"),
    },
    {
      stage: t("charts.salesFunnel.negotiation.stage"),
      value: 1200,
      description: t("charts.salesFunnel.negotiation.desc"),
    },
    {
      stage: t("charts.salesFunnel.closedWon.stage"),
      value: 800,
      description: t("charts.salesFunnel.closedWon.desc"),
    },
  ];

  const profitLossData = [
    { name: t("months.jan"), profit: 4000, loss: -1000 },
    { name: t("months.feb"), profit: 3000, loss: -800 },
    { name: t("months.mar"), profit: 2000, loss: -1500 },
    { name: t("months.apr"), profit: 2780, loss: -1200 },
    { name: t("months.may"), profit: 1890, loss: -900 },
    { name: t("months.jun"), profit: 2390, loss: -1100 },
    { name: t("months.jul"), profit: 3490, loss: -1300 },
    { name: t("months.aug"), profit: 4000, loss: -1200 },
    { name: t("months.sep"), profit: 3000, loss: -800 },
    { name: t("months.oct"), profit: 2000, loss: -1500 },
    { name: t("months.nov"), profit: 2780, loss: -1200 },
    { name: t("months.dec"), profit: 1890, loss: -900 },
  ];

  // Mixed chart specific data for Bar+Area+Line combination
  const barAreaLineData = [
    { name: t("months.jan"), area1: 2000, area2: 1500, bar1: 3000, bar2: 2500, line1: 4000, line2: 3500 },
    { name: t("months.feb"), area1: 1800, area2: 1300, bar1: 2800, bar2: 2300, line1: 3800, line2: 3300 },
    { name: t("months.mar"), area1: 2200, area2: 1700, bar1: 3200, bar2: 2700, line1: 4200, line2: 3700 },
    { name: t("months.apr"), area1: 2400, area2: 1900, bar1: 3400, bar2: 2900, line1: 4400, line2: 3900 },
    { name: t("months.may"), area1: 2100, area2: 1600, bar1: 3100, bar2: 2600, line1: 4100, line2: 3600 },
    { name: t("months.jun"), area1: 2300, area2: 1800, bar1: 3300, bar2: 2800, line1: 4300, line2: 3800 },
  ];

  // Calendar heatmap data (GitHub-style activity calendar)
  const calendarData = Array.from({ length: 365 }, (_, dayIndex) => {
    const date = new Date();
    date.setDate(date.getDate() - (365 - dayIndex));
    const count = Math.floor(Math.random() * 20);
    return {
      date: date.toISOString().split("T")[0],
      value: Math.floor(Math.random() * 5), // 0-4 activity levels
      count,
      label: t("charts.heatmap.contributions", {
        date: date.toLocaleDateString(),
        count,
      }),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("charts.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("charts.description")}
        </p>
      </div>

      <Tabs defaultValue="line" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1">
          <TabsTrigger value="line" className="text-xs">{t("charts.tabs.line")}</TabsTrigger>
          <TabsTrigger value="area" className="text-xs">{t("charts.tabs.area")}</TabsTrigger>
          <TabsTrigger value="bar" className="text-xs">{t("charts.tabs.bar")}</TabsTrigger>
          <TabsTrigger value="pie" className="text-xs">{t("charts.tabs.pie")}</TabsTrigger>
          <TabsTrigger value="scatter" className="text-xs">{t("charts.tabs.scatter")}</TabsTrigger>
          <TabsTrigger value="mixed" className="text-xs">{t("charts.tabs.mixed")}</TabsTrigger>
          <TabsTrigger value="radar" className="text-xs">{t("charts.tabs.radar")}</TabsTrigger>
          <TabsTrigger value="heatmap" className="text-xs">{t("charts.tabs.heatmap")}</TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs">{t("charts.tabs.timeline")}</TabsTrigger>
        </TabsList>

        <TabsContent value="line" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("charts.line.title")}</CardTitle>
              <CardDescription>
                {t("charts.line.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineCharts 
                basicData={monthlyRevenueData}
                multiSeriesData={monthlyRevenueData}
                curvedData={profitLossData}
                steppedData={profitLossData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="area" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("charts.area.title")}</CardTitle>
              <CardDescription>
                {t("charts.area.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AreaCharts 
                basicData={monthlyRevenueData}
                stackedData={stackedAreaData}
              />
            </CardContent>
          </Card>
        </TabsContent>

      <TabsContent value="bar" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.bar.title")}</CardTitle>
            <CardDescription>
              {t("charts.bar.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarCharts 
              basicData={monthlyRevenueData}
              stackedData={stackedAreaData}
              multiColorData={marketShareData}
              positiveNegativeData={profitLossData}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pie" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.pie.title")}</CardTitle>
            <CardDescription>
              {t("charts.pie.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieDonutCharts data={marketShareData} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="scatter" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.scatter.title")}</CardTitle>
            <CardDescription>
              {t("charts.scatter.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScatterBubbleCharts 
              scatterData={scatterData}
              bubbleData={bubbleData}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="mixed" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.mixed.title")}</CardTitle>
            <CardDescription>
              {t("charts.mixed.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MixedCharts 
              lineBarData={monthlyRevenueData}
              dualAxisData={dualAxisData}
              areaLineData={monthlyRevenueData}
              barAreaLineData={barAreaLineData}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="radar" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.radar.title")}</CardTitle>
            <CardDescription>
              {t("charts.radar.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadarGaugeCharts data={performanceData} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="heatmap" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.heatmap.title")}</CardTitle>
            <CardDescription>
              {t("charts.heatmap.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HeatmapTreemapCharts 
              heatmapData1={heatmapData1}
              heatmapData2={heatmapData2}
              calendarData={calendarData}
              hierarchicalData={hierarchicalData}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="timeline" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.timeline.title")}</CardTitle>
            <CardDescription>
              {t("charts.timeline.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TimelineFunnelCharts
              data={[
                {
                  task: t("charts.timeline.tasks.projectPlanning"),
                  status: "completed",
                  date: "2024-01-15",
                  duration: 2,
                  progress: 100,
                  description: t("charts.timeline.descriptions.projectPlanning"),
                },
                {
                  task: t("charts.timeline.tasks.uiuxDesign"),
                  status: "completed",
                  date: "2024-02-01",
                  duration: 3,
                  progress: 100,
                  description: t("charts.timeline.descriptions.uiuxDesign"),
                },
                {
                  task: t("charts.timeline.tasks.frontendDevelopment"),
                  status: "in-progress",
                  date: "2024-02-15",
                  duration: 6,
                  progress: 75,
                  description: t(
                    "charts.timeline.descriptions.frontendDevelopment"
                  ),
                },
                {
                  task: t("charts.timeline.tasks.backendDevelopment"),
                  status: "in-progress",
                  date: "2024-03-01",
                  duration: 8,
                  progress: 60,
                  description: t(
                    "charts.timeline.descriptions.backendDevelopment"
                  ),
                },
                {
                  task: t("charts.timeline.tasks.integrationTesting"),
                  status: "pending",
                  date: "2024-04-01",
                  duration: 2,
                  progress: 0,
                  description: t(
                    "charts.timeline.descriptions.integrationTesting"
                  ),
                },
                {
                  task: t("charts.timeline.tasks.userAcceptance"),
                  status: "pending",
                  date: "2024-04-15",
                  duration: 2,
                  progress: 0,
                  description: t(
                    "charts.timeline.descriptions.userAcceptance"
                  ),
                },
                {
                  task: t("charts.timeline.tasks.deployment"),
                  status: "pending",
                  date: "2024-05-01",
                  duration: 1,
                  progress: 0,
                  description: t("charts.timeline.descriptions.deployment"),
                },
              ]}
              conversionData={conversionFunnelData}
              salesData={salesFunnelData}
            />
          </CardContent>
        </Card>
      </TabsContent>
      </Tabs>
    </div>
  );
}
