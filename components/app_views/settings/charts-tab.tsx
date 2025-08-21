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

  // Comprehensive sample data for all chart types
  const monthlyRevenueData = [
    { name: t("months.jan"), value: 4000, revenue: 4000, users: 2400, orders: 1200 },
    { name: t("months.feb"), value: 3000, revenue: 3000, users: 1398, orders: 800 },
    { name: t("months.mar"), value: 2000, revenue: 2000, users: 9800, orders: 1500 },
    { name: t("months.apr"), value: 2780, revenue: 2780, users: 3908, orders: 1200 },
    { name: t("months.may"), value: 1890, revenue: 1890, users: 4800, orders: 900 },
    { name: t("months.jun"), value: 2390, revenue: 2390, users: 3800, orders: 1100 },
    { name: t("months.jul"), value: 3490, revenue: 3490, users: 4300, orders: 1300 },
    { name: t("months.aug"), value: 4000, revenue: 4000, users: 2400, orders: 1200 },
    { name: t("months.sep"), value: 3000, revenue: 3000, users: 1398, orders: 800 },
    { name: t("months.oct"), value: 2000, revenue: 2000, users: 9800, orders: 1500 },
    { name: t("months.nov"), value: 2780, revenue: 2780, users: 3908, orders: 1200 },
    { name: t("months.dec"), value: 1890, revenue: 1890, users: 4800, orders: 900 },
  ];

  const stackedAreaData = [
    { name: t("months.jan"), desktop: 4000, mobile: 2400, tablet: 1200 },
    { name: t("months.feb"), desktop: 3000, mobile: 1398, tablet: 800 },
    { name: t("months.mar"), desktop: 2000, mobile: 9800, tablet: 1500 },
    { name: t("months.apr"), desktop: 2780, mobile: 3908, tablet: 1200 },
    { name: t("months.may"), desktop: 1890, mobile: 4800, tablet: 900 },
    { name: t("months.jun"), desktop: 2390, mobile: 3800, tablet: 1100 },
  ];

  const marketShareData = [
    { name: t("devices.desktop") || "Desktop", value: 400, fill: "#8884d8" },
    { name: t("devices.mobile") || "Mobile", value: 300, fill: "#82ca9d" },
    { name: t("devices.tablet") || "Tablet", value: 300, fill: "#ffc658" },
    { name: t("devices.smarttv") || "Smart TV", value: 200, fill: "#ff7300" },
    { name: t("devices.other") || "Other", value: 100, fill: "#8dd1e1" },
  ];

  const scatterData = [
    { x: 100, y: 200, z: 20, name: t("products.productA") || "Product A" },
    { x: 120, y: 100, z: 15, name: t("products.productB") || "Product B" },
    { x: 170, y: 300, z: 25, name: t("products.productC") || "Product C" },
    { x: 140, y: 250, z: 18, name: t("products.productD") || "Product D" },
    { x: 150, y: 400, z: 30, name: t("products.productE") || "Product E" },
    { x: 110, y: 280, z: 22, name: t("products.productF") || "Product F" },
    { x: 180, y: 350, z: 28, name: t("products.productG") || "Product G" },
    { x: 130, y: 180, z: 16, name: t("products.productH") || "Product H" },
  ];

  const bubbleData = [
    { x: 100, y: 200, z: 200, name: t("campaigns.campaignA") || "Campaign A" },
    { x: 120, y: 100, z: 260, name: t("campaigns.campaignB") || "Campaign B" },
    { x: 170, y: 300, z: 400, name: t("campaigns.campaignC") || "Campaign C" },
    { x: 140, y: 250, z: 280, name: t("campaigns.campaignD") || "Campaign D" },
    { x: 150, y: 400, z: 500, name: t("campaigns.campaignE") || "Campaign E" },
    { x: 110, y: 280, z: 200, name: t("campaigns.campaignF") || "Campaign F" },
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
    { subject: "Performance", A: 120, B: 110, fullMark: 150 },
    { subject: "Quality", A: 98, B: 130, fullMark: 150 },
    { subject: "Efficiency", A: 86, B: 130, fullMark: 150 },
    { subject: "Reliability", A: 99, B: 100, fullMark: 150 },
    { subject: "Innovation", A: 85, B: 90, fullMark: 150 },
    { subject: "Support", A: 65, B: 85, fullMark: 150 },
  ];

  // Enhanced heatmap data with better examples
  const heatmapData1 = Array.from({ length: 52 }, (_, week) => 
    Array.from({ length: 7 }, (_, day) => ({
      x: day,
      y: week,
      value: Math.floor(Math.random() * 100) + 1,
      label: `Week ${week + 1}, ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day]}: Activity Level`
    }))
  ).flat();

  const heatmapData2 = Array.from({ length: 12 }, (_, month) => 
    Array.from({ length: 31 }, (_, day) => ({
      x: day,
      y: month,
      value: Math.floor(Math.random() * 50) + 10,
      label: `${t(`months.${['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][month]}`)} ${day + 1}: Sales`
    }))
  ).flat();

  const hierarchicalData = [
    { name: t("departments.technology") || "Technology", size: 400, children: [
      { name: "Frontend", size: 200 },
      { name: "Backend", size: 150 },
      { name: "DevOps", size: 50 }
    ]},
    { name: t("departments.marketing") || "Marketing", size: 300, children: [
      { name: "Digital", size: 180 },
      { name: "Content", size: 120 }
    ]},
    { name: t("departments.sales") || "Sales", size: 300, children: [
      { name: "Enterprise", size: 200 },
      { name: "SMB", size: 100 }
    ]},
    { name: t("departments.support") || "Support", size: 200 },
    { name: t("departments.operations") || "Operations", size: 150 },
  ];

  const conversionFunnelData = [
    { name: "Website Visitors", value: 10000, fill: "#8884d8" },
    { name: "Product Views", value: 8000, fill: "#82ca9d" },
    { name: "Add to Cart", value: 6000, fill: "#ffc658" },
    { name: "Checkout Started", value: 4000, fill: "#ff7300" },
    { name: "Purchase Completed", value: 2000, fill: "#8dd1e1" },
  ];

  const salesFunnelData = [
    { name: "Awareness", value: 5000, fill: "#8884d8" },
    { name: "Interest", value: 3500, fill: "#82ca9d" },
    { name: "Consideration", value: 2500, fill: "#ffc658" },
    { name: "Intent", value: 1500, fill: "#ff7300" },
    { name: "Purchase", value: 800, fill: "#8dd1e1" },
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
              data={hierarchicalData}
              heatmapData1={heatmapData1}
              heatmapData2={heatmapData2}
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
