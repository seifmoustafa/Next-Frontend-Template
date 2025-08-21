"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { LineChartsProps } from "./types";

export function LineCharts({ 
  basicData = [],
  multiSeriesData = [],
  curvedData = [],
  steppedData = []
}: LineChartsProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Basic Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.line.basic.title")}</CardTitle>
          <CardDescription>{t("charts.line.basic.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={basicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multi-Series Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.line.multiSeries.title")}</CardTitle>
          <CardDescription>{t("charts.line.multiSeries.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={multiSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="desktop" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="mobile" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="tablet" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Curved Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.line.curved.title")}</CardTitle>
          <CardDescription>{t("charts.line.curved.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={curvedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#ff7300" 
                strokeWidth={3}
                dot={{ fill: "#ff7300", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stepped Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.line.stepped.title")}</CardTitle>
          <CardDescription>{t("charts.line.stepped.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={steppedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="step" 
                dataKey="profit" 
                stroke="#387908" 
                strokeWidth={2}
                dot={{ fill: "#387908", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
