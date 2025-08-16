"use client";

import { memo, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GenericTable } from "@/components/ui/generic-table";
import { Input } from "@/components/ui/input";
import GenericSelect from "@/components/ui/generic-select";
import { Eye, Search, Users, Home } from "lucide-react";

interface SettingsPreviewProps {
  t: (key: string) => string;
}

function SettingsPreviewComponent({ t }: SettingsPreviewProps) {
  const sampleTableData = useMemo(
    () => [
      { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", status: "inactive" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "active" },
    ],
    []
  );

  const sampleTableColumns = useMemo(
    () => [
      { key: "name" as const, label: t("settings.sampleTable.name"), sortable: true },
      { key: "email" as const, label: t("settings.sampleTable.email"), sortable: true },
      {
        key: "status" as const,
        label: t("settings.sampleTable.status"),
        render: (value: string) => (
          <Badge variant={value === "active" ? "default" : "secondary"}>
            {t(`settings.sampleTable.${value}`)}
          </Badge>
        ),
      },
    ],
    [t]
  );

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          {t("settings.preview.title")}
        </CardTitle>
        <CardDescription>{t("settings.preview.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            {t("settings.preview.buttons.label")}
          </Label>
          <div className="space-y-2">
            <Button size="sm" className="w-full">
              {t("settings.preview.buttons.small")}
            </Button>
            <Button className="w-full">
              {t("settings.preview.buttons.default")}
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              {t("settings.preview.buttons.outline")}
            </Button>
            <Button variant="secondary" className="w-full">
              {t("settings.preview.buttons.secondary")}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            {t("settings.preview.badges.label")}
          </Label>
          <div className="flex flex-wrap gap-2">
            <Badge>{t("settings.preview.badges.default")}</Badge>
            <Badge variant="secondary">
              {t("settings.preview.badges.secondary")}
            </Badge>
            <Badge variant="outline">
              {t("settings.preview.badges.outline")}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            {t("settings.preview.inputs.label")}
          </Label>
          <div className="space-y-2">
            <Input placeholder={t("settings.preview.inputs.placeholder") || ""} />
            <GenericSelect
              placeholder={t("settings.preview.select.placeholder")}
              options={[
                { label: "Option 1", value: "1" },
                { label: "Option 2", value: "2" },
                { label: "Option 3", value: "3" },
              ]}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            {t("settings.preview.table.label")}
          </Label>
          <GenericTable data={sampleTableData} columns={sampleTableColumns} />
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            {t("settings.preview.misc.label")}
          </Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span>John Doe</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>{t("settings.preview.misc.search")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{t("settings.preview.misc.users")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>{t("settings.preview.misc.home")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const SettingsPreview = memo(SettingsPreviewComponent);
export default SettingsPreview;

