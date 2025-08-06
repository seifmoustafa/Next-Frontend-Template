"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/services/user.service";
import type { UserType } from "@/services/user-type.service";
import { useI18n } from "@/providers/i18n-provider";
import { useServices } from "@/providers/service-provider";

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
          const defaultType =
            types.find((t) => t.adminTypeName === "Admin") || types[0];
          setFormData((prev) => ({
            ...prev,
            userTypeId: defaultType.id,
            adminTypeId: defaultType.id,
          }));
        } else if (isEdit && initialData) {
          const userType = types.find(
            (t) => t.adminTypeName === initialData.adminTypeName
          );
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

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            {t("users.username")}
          </Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
            className="h-10"
            placeholder="أدخل اسم المستخدم"
          />
        </div>

        {!isEdit && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              كلمة المرور
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="h-10"
              placeholder="أدخل كلمة المرور"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              {t("users.firstName")}
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
              className="h-10"
              placeholder="الاسم الأول"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              {t("users.lastName")}
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
              className="h-10"
              placeholder="اسم العائلة"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm font-medium">
            {t("users.phoneNumber")}
          </Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            required
            className="h-10"
            placeholder="رقم الهاتف"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userType" className="text-sm font-medium">
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
            <SelectTrigger className="h-10">
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

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-10 order-2 sm:order-1"
            disabled={loading}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="h-10 gradient-primary order-1 sm:order-2"
          >
            {loading ? t("common.loading") : t("common.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
