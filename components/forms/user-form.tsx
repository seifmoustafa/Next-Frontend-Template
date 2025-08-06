"use client";

import type React from "react";
import { useState } from "react";
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
import { useI18n } from "@/providers/i18n-provider";

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

// Common user type IDs - you might want to fetch these from an API
const USER_TYPES = [
  { id: "dad67693-7383-34dc-db4d-89d0debf0d7b", name: "Admin" },
  { id: "super-admin-id", name: "SuperAdmin" },
  { id: "moderator-id", name: "Moderator" },
];

export function UserForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: UserFormProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    password: "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    phoneNumber: initialData?.phoneNumber || "",
    userTypeId: "dad67693-7383-34dc-db4d-89d0debf0d7b", // Default to Admin
    adminTypeId: "dad67693-7383-34dc-db4d-89d0debf0d7b", // For updates
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        // For update, use adminTypeId instead of userTypeId
        const updateData: UpdateUserRequest = {
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          adminTypeId: formData.adminTypeId,
        };
        await onSubmit(updateData);
      } else {
        // For create, use userTypeId and include password
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">{t("users.username")}</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
          className="h-12"
        />
      </div>

      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="h-12"
            placeholder="أدخل كلمة المرور"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("users.firstName")}</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">{t("users.lastName")}</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
            className="h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">{t("users.phoneNumber")}</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userType">{t("users.adminType")}</Label>
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
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {USER_TYPES.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-12 bg-transparent"
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="h-12 gradient-primary"
        >
          {loading ? t("common.loading") : t("common.save")}
        </Button>
      </div>
    </form>
  );
}
