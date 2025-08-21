"use client";

import React from "react";
import {
  BarChart,
  Bar,
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
import { BarChartsProps } from "./types";

export function BarCharts({ 
  basicData = [],
  stackedData = [],
  multiColorData = [],
  positiveNegativeData = []
}: BarChartsProps) {
  const { t } = useI18n();
  
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];

  return (
    <div className="space-y-6">
      {/* Basic Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.bar.basic.title")}</CardTitle>
          <CardDescription>{t("charts.bar.basic.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={basicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stacked Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.bar.stacked.title")}</CardTitle>
          <CardDescription>{t("charts.bar.stacked.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="desktop" stackId="a" fill="#8884d8" />
              <Bar dataKey="mobile" stackId="a" fill="#82ca9d" />
              <Bar dataKey="tablet" stackId="a" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multi-Color Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.bar.multiColor.title")}</CardTitle>
          <CardDescription>{t("charts.bar.multiColor.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={multiColorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue">
                {multiColorData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Positive and Negative Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.bar.positiveNegative.title")}</CardTitle>
          <CardDescription>{t("charts.bar.positiveNegative.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={positiveNegativeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" fill="#82ca9d" />
              <Bar dataKey="loss" fill="#ff6b6b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
