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

    // Settings - Arabic
    "settings.appearance": "المظهر",
    "settings.layout": "التخطيط",
    "settings.localization": "اللغة",
    "settings.advanced": "متقدم",
    "settings.colorTheme": "سمة الألوان",
    "settings.darkMode": "الوضع المظلم",
    "settings.lightDarkToggle": "تبديل بين الوضع الفاتح والمظلم",
    "settings.selectColorTheme": "اختر سمة الألوان",
    "settings.cardStyle": "نمط البطاقات",
    "settings.fontSize": "حجم الخط",
    "settings.borderRadius": "استدارة الحواف",
    "settings.layoutTemplates": "قوالب التخطيط",
    "settings.sidebarPosition": "موضع الشريط الجانبي",
    "settings.languageSettings": "إعدادات اللغة",
    "settings.selectLanguage": "اختر لغة الواجهة",
    "settings.currentLanguage": "اللغة الحالية",
    "settings.textDirection": "اتجاه النص",
    "settings.fontUsed": "الخط المستخدم",
    "settings.sidebarPos": "موضع الشريط الجانبي",
    "settings.animationLevel": "مستوى التأثيرات الحركية",
    "settings.resetSettings": "إعادة ضبط الإعدادات",
    "settings.resetDescription":
      "إعادة جميع إعدادات الواجهة إلى الوضع الافتراضي. هذا سيؤدي إلى إعادة ضبط جميع التخصيصات التي قمت بها.",
    "settings.resetAll": "إعادة ضبط جميع الإعدادات",
    "settings.saveSettings": "حفظ الإعدادات",
    "settings.settingsSaved": "تم الحفظ!",

    // Layout Templates - Arabic
    "layout.classic": "كلاسيكي",
    "layout.elegant": "أنيق",
    "layout.modern": "عصري",
    "layout.minimal": "بسيط",
    "layout.compact": "مضغوط",
    "layout.floating": "عائم",
    "layout.classicDesc": "تصميم كلاسيكي مع شريط جانبي عريض وأيقونات كبيرة",
    "layout.elegantDesc": "تصميم أنيق مع خطوط ناعمة وألوان متدرجة",
    "layout.modernDesc": "تصميم عصري مع شريط جانبي مصغر وهيدر كبير",
    "layout.minimalDesc": "تصميم بسيط مع شريط علوي فقط وقوائم منسدلة",
    "layout.compactDesc": "تصميم مضغوط مع مساحات صغيرة وعناصر مكثفة",
    "layout.floatingDesc": "تصميم عائم مع بطاقات منفصلة وتأثيرات ثلاثية الأبعاد",

    // Color Themes - Arabic
    "color.purple": "أرجواني",
    "color.blue": "أزرق",
    "color.green": "أخضر",
    "color.orange": "برتقالي",
    "color.red": "أحمر",
    "color.teal": "فيروزي",

    // Card Styles - Arabic
    "cardStyle.default": "افتراضي",
    "cardStyle.glass": "زجاجي",
    "cardStyle.solid": "صلب",
    "cardStyle.bordered": "إطار",
    "cardStyle.defaultDesc": "بطاقات بتصميم بسيط",
    "cardStyle.glassDesc": "تأثير زجاجي شفاف",
    "cardStyle.solidDesc": "بطاقات ملونة بالكامل",
    "cardStyle.borderedDesc": "بطاقات بإطار واضح",

    // Animation Levels - Arabic
    "animation.none": "بدون",
    "animation.minimal": "بسيط",
    "animation.moderate": "متوسط",
    "animation.high": "عالي",
    "animation.noneDesc": "بدون تأثيرات حركية",
    "animation.minimalDesc": "تأثيرات حركية بسيطة",
    "animation.moderateDesc": "تأثيرات حركية متوسطة",
    "animation.highDesc": "تأثيرات حركية متقدمة",

    // Font Sizes - Arabic
    "fontSize.small": "صغير",
    "fontSize.default": "متوسط",
    "fontSize.large": "كبير",
    "fontSize.smallDesc": "خط أصغر للواجهة",
    "fontSize.defaultDesc": "حجم الخط الافتراضي",
    "fontSize.largeDesc": "خط أكبر للواجهة",

    // Border Radius - Arabic
    "radius.none": "بدون",
    "radius.small": "صغير",
    "radius.default": "متوسط",
    "radius.large": "كبير",
    "radius.full": "دائري",

    // Sidebar Position - Arabic
    "sidebar.right": "يمين (RTL)",
    "sidebar.left": "يسار (LTR)",

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

    // Settings - English
    "settings.appearance": "Appearance",
    "settings.layout": "Layout",
    "settings.localization": "Language",
    "settings.advanced": "Advanced",
    "settings.colorTheme": "Color Theme",
    "settings.darkMode": "Dark Mode",
    "settings.lightDarkToggle": "Toggle between light and dark mode",
    "settings.selectColorTheme": "Select Color Theme",
    "settings.cardStyle": "Card Style",
    "settings.fontSize": "Font Size",
    "settings.borderRadius": "Border Radius",
    "settings.layoutTemplates": "Layout Templates",
    "settings.sidebarPosition": "Sidebar Position",
    "settings.languageSettings": "Language Settings",
    "settings.selectLanguage": "Select Interface Language",
    "settings.currentLanguage": "Current Language",
    "settings.textDirection": "Text Direction",
    "settings.fontUsed": "Font Used",
    "settings.sidebarPos": "Sidebar Position",
    "settings.animationLevel": "Animation Level",
    "settings.resetSettings": "Reset Settings",
    "settings.resetDescription":
      "Reset all interface settings to default. This will undo all customizations you have made.",
    "settings.resetAll": "Reset All Settings",
    "settings.saveSettings": "Save Settings",
    "settings.settingsSaved": "Saved!",

    // Layout Templates - English
    "layout.classic": "Classic",
    "layout.elegant": "Elegant",
    "layout.modern": "Modern",
    "layout.minimal": "Minimal",
    "layout.compact": "Compact",
    "layout.floating": "Floating",
    "layout.classicDesc": "Classic design with wide sidebar and large icons",
    "layout.elegantDesc": "Elegant design with smooth lines and gradient colors",
    "layout.modernDesc": "Modern design with collapsible sidebar and large header",
    "layout.minimalDesc": "Minimal design with top bar only and dropdown menus",
    "layout.compactDesc": "Compact design with small spaces and dense elements",
    "layout.floatingDesc": "Floating design with separate cards and 3D effects",

    // Color Themes - English
    "color.purple": "Purple",
    "color.blue": "Blue",
    "color.green": "Green",
    "color.orange": "Orange",
    "color.red": "Red",
    "color.teal": "Teal",

    // Card Styles - English
    "cardStyle.default": "Default",
    "cardStyle.glass": "Glass",
    "cardStyle.solid": "Solid",
    "cardStyle.bordered": "Bordered",
    "cardStyle.defaultDesc": "Simple design cards",
    "cardStyle.glassDesc": "Transparent glass effect",
    "cardStyle.solidDesc": "Fully colored cards",
    "cardStyle.borderedDesc": "Cards with clear borders",

    // Animation Levels - English
    "animation.none": "None",
    "animation.minimal": "Minimal",
    "animation.moderate": "Moderate",
    "animation.high": "High",
    "animation.noneDesc": "No animations",
    "animation.minimalDesc": "Simple animations",
    "animation.moderateDesc": "Moderate animations",
    "animation.highDesc": "Advanced animations",

    // Font Sizes - English
    "fontSize.small": "Small",
    "fontSize.default": "Default",
    "fontSize.large": "Large",
    "fontSize.smallDesc": "Smaller interface font",
    "fontSize.defaultDesc": "Default font size",
    "fontSize.largeDesc": "Larger interface font",

    // Border Radius - English
    "radius.none": "None",
    "radius.small": "Small",
    "radius.default": "Default",
    "radius.large": "Large",
    "radius.full": "Full",

    // Sidebar Position - English
    "sidebar.right": "Right (RTL)",
    "sidebar.left": "Left (LTR)",

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
