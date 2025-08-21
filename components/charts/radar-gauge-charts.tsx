"use client";

import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { GenericChartsProps } from "./types";

// Custom Gauge Component
const GaugeChart = ({ value, max = 100, title }: { value: number; max?: number; title: string }) => {
  const percentage = (value / max) * 100;
  const angle = (percentage / 100) * 180;
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-32 h-16">
        <svg width="128" height="64" viewBox="0 0 128 64">
          {/* Background arc */}
          <path
            d="M 10 54 A 54 54 0 0 1 118 54"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 10 54 A 54 54 0 0 1 118 54"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 170} 170`}
            className="transition-all duration-1000"
          />
          {/* Needle */}
          <line
            x1="64"
            y1="54"
            x2={64 + 40 * Math.cos((angle - 90) * (Math.PI / 180))}
            y2={54 + 40 * Math.sin((angle - 90) * (Math.PI / 180))}
            stroke="#1f2937"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Center dot */}
          <circle cx="64" cy="54" r="3" fill="#1f2937" />
        </svg>
        <div className="absolute inset-0 flex items-end justify-center">
          <span className="text-lg font-bold">{value}</span>
        </div>
      </div>
      <span className="text-sm text-gray-600">{title}</span>
    </div>
  );
};

export function RadarGaugeCharts({ 
  data = [] 
}: GenericChartsProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Basic Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.radar.basic.title")}</CardTitle>
          <CardDescription>{t("charts.radar.basic.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 150]} />
              <Radar
                name="Student A"
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multi-Series Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.radar.multiSeries.title")}</CardTitle>
          <CardDescription>{t("charts.radar.multiSeries.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 150]} />
              <Radar
                name="Student A"
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.4}
              />
              <Radar
                name="Student B"
                dataKey="B"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.4}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skills Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.radar.skills.title")}</CardTitle>
          <CardDescription>{t("charts.radar.skills.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Skill Level"
                dataKey="level"
                stroke="#ff7300"
                fill="#ff7300"
                fillOpacity={0.6}
                strokeWidth={2}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gauge Charts */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.gauge.title")}</CardTitle>
          <CardDescription>{t("charts.gauge.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <GaugeChart value={75} title="Performance" />
            <GaugeChart value={88} title="Quality" />
            <GaugeChart value={92} title="Efficiency" />
            <GaugeChart value={67} title="Satisfaction" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
