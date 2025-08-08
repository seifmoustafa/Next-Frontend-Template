"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { UserType, CreateUserTypeRequest, UpdateUserTypeRequest } from "@/services/user-type.service";
import { useSettings } from "@/providers/settings-provider";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";

interface UserTypeFormProps {
  initialData?: UserType;
  onSubmit: (data: CreateUserTypeRequest | UpdateUserTypeRequest) => Promise<void>;
  onCancel: () => void;
}

export function UserTypeForm({
  initialData,
  onSubmit,
  onCancel,
}: UserTypeFormProps) {
  const settings = useSettings();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    adminTypeName: initialData?.adminTypeName || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFormSpacing = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "space-y-3";
      case "comfortable":
        return "space-y-6";
      case "spacious":
        return "space-y-8";
      default:
        return "space-y-4";
    }
  };

  const getFieldSpacing = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "space-y-1";
      case "comfortable":
        return "space-y-3";
      case "spacious":
        return "space-y-4";
      default:
        return "space-y-2";
    }
  };

  const getGridGap = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "gap-3";
      case "comfortable":
        return "gap-6";
      case "spacious":
        return "gap-8";
      default:
        return "gap-4";
    }
  };

  const getInputHeight = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "h-9";
      case "comfortable":
        return "h-12";
      case "spacious":
        return "h-14";
      default:
        return "h-10";
    }
  };

  const getButtonSize = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "sm";
      case "comfortable":
      case "spacious":
        return "lg";
      default:
        return "default";
    }
  };

  const getSeparatorSpacing = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "pt-4 mt-4";
      case "comfortable":
        return "pt-8 mt-8";
      case "spacious":
        return "pt-10 mt-10";
      default:
        return "pt-6 mt-6";
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className={getFormSpacing()}>
        <div className={getFieldSpacing()}>
          <Label htmlFor="adminTypeName" className="font-medium">
            {t("userTypes.typeName")}
          </Label>
          <Input
            id="adminTypeName"
            value={formData.adminTypeName}
            onChange={(e) => setFormData({ ...formData, adminTypeName: e.target.value })}
            required
            className={getInputHeight()}
            placeholder={t("userTypes.typeNamePlaceholder")}
          />
        </div>

        <Separator />

        <div className={cn("flex flex-col sm:flex-row justify-end", getGridGap(), getSeparatorSpacing())}>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className={cn(getInputHeight(), "order-2 sm:order-1")}
            disabled={loading}
            size={getButtonSize()}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className={cn(getInputHeight(), "gradient-primary order-1 sm:order-2")}
            size={getButtonSize()}
          >
            {loading ? t("common.loading") : t("common.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
