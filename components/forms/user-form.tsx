"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { User, CreateUserRequest, UpdateUserRequest } from "@/services/user.service";
import type { UserType } from "@/services/user-type.service";
import { useI18n } from "@/providers/i18n-provider";
import { useServices } from "@/providers/service-provider";
import { useSettings } from "@/providers/settings-provider";
import { cn } from "@/lib/utils";

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export function UserForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: UserFormProps) {
  const { t } = useI18n();
  const { userTypeService } = useServices();
  const settings = useSettings();
  const [loading, setLoading] = useState(false);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    password: "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    phoneNumber: initialData?.phoneNumber || "",
    userTypeId: "",
    adminTypeId: "",
  });

  useEffect(() => {
    const loadUserTypes = async () => {
      try {
        const types = await userTypeService.getUserTypes();
        setUserTypes(types);

        if (!isEdit && types.length > 0) {
          const defaultType = types.find((t) => t.adminTypeName === "Admin") || types[0];
          setFormData((prev) => ({
            ...prev,
            userTypeId: defaultType.id,
            adminTypeId: defaultType.id,
          }));
        } else if (isEdit && initialData) {
          const userType = types.find((t) => t.adminTypeName === initialData.adminTypeName);
          if (userType) {
            setFormData((prev) => ({
              ...prev,
              adminTypeId: userType.id,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load user types:", error);
      }
    };

    loadUserTypes();
  }, [userTypeService, isEdit, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        const updateData: UpdateUserRequest = {
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          adminTypeId: formData.adminTypeId,
        };
        await onSubmit(updateData);
      } else {
        const createData: CreateUserRequest = {
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          userTypeId: formData.userTypeId,
        };
        await onSubmit(createData);
      }
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
          <Label htmlFor="username" className="font-medium">
            {t("users.username")}
          </Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            className={getInputHeight()}
            placeholder="أدخل اسم المستخدم"
          />
        </div>

        {!isEdit && (
          <div className={getFieldSpacing()}>
            <Label htmlFor="password" className="font-medium">
              كلمة المرور
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className={getInputHeight()}
              placeholder="أدخل كلمة المرور"
            />
          </div>
        )}

        <div className={cn("grid grid-cols-1 sm:grid-cols-2", getGridGap())}>
          <div className={getFieldSpacing()}>
            <Label htmlFor="firstName" className="font-medium">
              {t("users.firstName")}
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              className={getInputHeight()}
              placeholder="الاسم الأول"
            />
          </div>

          <div className={getFieldSpacing()}>
            <Label htmlFor="lastName" className="font-medium">
              {t("users.lastName")}
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              className={getInputHeight()}
              placeholder="اسم العائلة"
            />
          </div>
        </div>

        <div className={getFieldSpacing()}>
          <Label htmlFor="phoneNumber" className="font-medium">
            {t("users.phoneNumber")}
          </Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            required
            className={getInputHeight()}
            placeholder="رقم الهاتف"
          />
        </div>

        <div className={getFieldSpacing()}>
          <Label htmlFor="userType" className="font-medium">
            {t("users.adminType")}
          </Label>
          <Select
            value={isEdit ? formData.adminTypeId : formData.userTypeId}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                userTypeId: value,
                adminTypeId: value,
              })
            }
          >
            <SelectTrigger className={getInputHeight()}>
              <SelectValue placeholder="اختر نوع المستخدم" />
            </SelectTrigger>
            <SelectContent>
              {userTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.adminTypeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
