"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  UserType,
  CreateUserTypeRequest,
  UpdateUserTypeRequest,
} from "@/services/user-type.service";

interface UserTypeFormProps {
  initialData?: UserType;
  onSubmit: (
    data: CreateUserTypeRequest | UpdateUserTypeRequest
  ) => Promise<void>;
  onCancel: () => void;
}

export function UserTypeForm({
  initialData,
  onSubmit,
  onCancel,
}: UserTypeFormProps) {
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

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="adminTypeName" className="text-sm font-medium">
            اسم نوع المستخدم
          </Label>
          <Input
            id="adminTypeName"
            value={formData.adminTypeName}
            onChange={(e) =>
              setFormData({ ...formData, adminTypeName: e.target.value })
            }
            required
            className="h-10"
            placeholder="أدخل اسم نوع المستخدم"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-10 order-2 sm:order-1"
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="h-10 gradient-primary order-1 sm:order-2"
          >
            {loading ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </div>
      </form>
    </div>
  );
}
