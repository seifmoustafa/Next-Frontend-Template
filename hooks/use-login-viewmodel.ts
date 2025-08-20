"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

export interface LoginFormData {
  username: string;
  password: string;
}

export function useLoginViewModel() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  // Form field handlers
  const updateField = useCallback((field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  }, [error]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Login submission handler
  const handleLogin = useCallback(async () => {
    if (!formData.username || !formData.password) {
      setError(t("auth.validationError"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(formData.username, formData.password);
      
      // Redirect to dashboard on successful login
      router.replace("/demo/products");
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error instanceof Error ? error.message : t("auth.connectionError");
      setError(errorMessage);
      // Error is displayed inline above the form fields, no page reload
    } finally {
      setIsLoading(false);
    }
  }, [formData.username, formData.password, login, router, t]);

  // Navigation handler for authenticated users
  const redirectIfAuthenticated = useCallback(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({ username: "", password: "" });
    setShowPassword(false);
    setError("");
  }, []);

  return {
    // State
    formData,
    showPassword,
    isLoading,
    error,
    isAuthenticated,

    // Actions
    updateField,
    togglePasswordVisibility,
    handleLogin,
    redirectIfAuthenticated,
    resetForm,

    // Computed
    isFormValid: formData.username.length > 0 && formData.password.length > 0,
  };
}
