"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { GenericChartsProps } from "./types";

export function ScatterBubbleCharts({ 
  data = [],
  bubbleData = []
}: GenericChartsProps & { bubbleData?: any[] }) {
  const { t } = useI18n();
  
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

  return (
    <div className="space-y-6">
      {/* Basic Scatter Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.scatter.basic.title")}</CardTitle>
          <CardDescription>{t("charts.scatter.basic.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="stature" unit="cm" />
              <YAxis type="number" dataKey="y" name="weight" unit="kg" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="A school" data={data} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multi-Series Scatter Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.scatter.multiSeries.title")}</CardTitle>
          <CardDescription>{t("charts.scatter.multiSeries.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="stature" unit="cm" />
              <YAxis type="number" dataKey="y" name="weight" unit="kg" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="A school" data={data} fill="#8884d8" />
              <Scatter 
                name="B school" 
                data={data.map(d => ({ x: d.x + 20, y: d.y - 50, z: d.z }))} 
                fill="#82ca9d" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bubble Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.scatter.bubble.title")}</CardTitle>
          <CardDescription>{t("charts.scatter.bubble.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="GDP per capita" 
                unit="k$" 
                domain={[60, 100]}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Life expectancy" 
                unit="years" 
                domain={[0, 150]}
              />
              <Tooltip 
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => [value, name]}
                labelFormatter={(label) => `Country: ${label}`}
              />
              <Scatter name="Countries" data={bubbleData} fill="#8884d8">
                {bubbleData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Custom Shape Scatter Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.scatter.customShape.title")}</CardTitle>
          <CardDescription>{t("charts.scatter.customShape.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="stature" unit="cm" />
              <YAxis type="number" dataKey="y" name="weight" unit="kg" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter 
                name="Data points" 
                fill="#ff7300"
                shape="diamond"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
