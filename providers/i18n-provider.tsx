"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "ar" | "en"
type Direction = "rtl" | "ltr"

interface I18nContextType {
  language: Language
  direction: Direction
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations = {
  ar: {
    // Authentication
    "auth.login": "تسجيل الدخول",
    "auth.username": "اسم المستخدم",
    "auth.password": "كلمة المرور",
    "auth.loginButton": "دخول",
    "auth.loginError": "خطأ في اسم المستخدم أو كلمة المرور",
    "auth.welcome": "مرحباً بك في لوحة التحكم",
    "auth.pleaseLogin": "يرجى تسجيل الدخول للمتابعة",

    // Navigation
    "nav.dashboard": "لوحة التحكم",
    "nav.users": "المستخدمون",
    "nav.analytics": "التحليلات",
    "nav.settings": "الإعدادات",
    "nav.logout": "تسجيل الخروج",

    // Dashboard
    "dashboard.title": "نظرة عامة على لوحة التحكم",
    "dashboard.welcome": "مرحباً بعودتك!",
    "dashboard.totalUsers": "إجمالي المستخدمين",
    "dashboard.revenue": "الإيرادات",
    "dashboard.orders": "الطلبات",
    "dashboard.growth": "النمو",
    "dashboard.revenueOverview": "نظرة عامة على الإيرادات",

    // Users
    "users.title": "إدارة المستخدمين",
    "users.addUser": "إضافة مستخدم",
    "users.username": "اسم المستخدم",
    "users.firstName": "الاسم الأول",
    "users.lastName": "الاسم الأخير",
    "users.phoneNumber": "رقم الهاتف",
    "users.adminType": "نوع المدير",
    "users.actions": "الإجراءات",
    "users.search": "البحث في المستخدمين...",

    // Common
    "common.search": "بحث...",
    "common.filter": "تصفية",
    "common.export": "تصدير",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.view": "عرض",
    "common.loading": "جاري التحميل...",
    "common.noData": "لا توجد بيانات متاحة",
    "common.error": "حدث خطأ",
    "common.retry": "إعادة المحاولة",

    // Stats
    "stats.fromLastMonth": "من الشهر الماضي",
    "stats.increase": "زيادة",
    "stats.decrease": "انخفاض",
  },
  en: {
    // Authentication
    "auth.login": "Login",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.loginButton": "Sign In",
    "auth.loginError": "Invalid username or password",
    "auth.welcome": "Welcome to Admin Dashboard",
    "auth.pleaseLogin": "Please sign in to continue",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.users": "Users",
    "nav.analytics": "Analytics",
    "nav.settings": "Settings",
    "nav.logout": "Logout",

    // Dashboard
    "dashboard.title": "Dashboard Overview",
    "dashboard.welcome": "Welcome back!",
    "dashboard.totalUsers": "Total Users",
    "dashboard.revenue": "Revenue",
    "dashboard.orders": "Orders",
    "dashboard.growth": "Growth",
    "dashboard.revenueOverview": "Revenue Overview",

    // Users
    "users.title": "User Management",
    "users.addUser": "Add User",
    "users.username": "Username",
    "users.firstName": "First Name",
    "users.lastName": "Last Name",
    "users.phoneNumber": "Phone Number",
    "users.adminType": "Admin Type",
    "users.actions": "Actions",
    "users.search": "Search users...",

    // Common
    "common.search": "Search...",
    "common.filter": "Filter",
    "common.export": "Export",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.loading": "Loading...",
    "common.noData": "No data available",
    "common.error": "An error occurred",
    "common.retry": "Try Again",

    // Stats
    "stats.fromLastMonth": "from last month",
    "stats.increase": "increase",
    "stats.decrease": "decrease",
  },
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar") // Default to Arabic
  const direction: Direction = language === "ar" ? "rtl" : "ltr"

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr")
    document.documentElement.setAttribute("lang", lang)

    // Update body class for font
    if (lang === "ar") {
      document.body.classList.add("font-arabic")
      document.body.classList.remove("font-english")
    } else {
      document.body.classList.add("font-english")
      document.body.classList.remove("font-arabic")
    }
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      handleSetLanguage(savedLanguage)
    } else {
      // Set Arabic as default
      handleSetLanguage("ar")
    }
  }, [])

  return (
    <I18nContext.Provider
      value={{
        language,
        direction,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
