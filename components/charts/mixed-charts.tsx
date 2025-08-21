"use client";

import React from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { GenericChartsProps } from "./types";

export function MixedCharts({ 
  data = [],
  dualAxisData = []
}: GenericChartsProps & { dualAxisData?: any[] }) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Line + Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.mixed.lineBar.title")}</CardTitle>
          <CardDescription>{t("charts.mixed.lineBar.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" barSize={20} fill="#8884d8" />
              <Line type="monotone" dataKey="profit" stroke="#ff7300" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Area + Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.mixed.areaLine.title")}</CardTitle>
          <CardDescription>{t("charts.mixed.areaLine.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" fill="#82ca9d" stroke="#82ca9d" />
              <Line type="monotone" dataKey="profit" stroke="#ff7300" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar + Area + Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.mixed.barAreaLine.title")}</CardTitle>
          <CardDescription>{t("charts.mixed.barAreaLine.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" fill="#8884d8" stroke="#8884d8" />
              <Bar dataKey="sales" barSize={20} fill="#82ca9d" />
              <Line type="monotone" dataKey="profit" stroke="#ff7300" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Dual Y-Axis Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.mixed.dualAxis.title")}</CardTitle>
          <CardDescription>{t("charts.mixed.dualAxis.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={dualAxisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" barSize={20} fill="#8884d8" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ff7300" 
                strokeWidth={2} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
