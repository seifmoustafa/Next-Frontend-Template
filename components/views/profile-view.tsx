"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/providers/auth-provider"
import { useI18n } from "@/providers/i18n-provider"
import { User, Save, Loader2, Lock, Eye, EyeOff, Shield, Phone } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"

interface UserProfile {
  id: string
  username: string
  firstName: string
  lastName: string
  phoneNumber: string
  adminTypeName: string
}

interface ProfileFormData {
  firstName: string
  lastName: string
  phoneNumber: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function ProfileView() {
  const { user: authUser } = useAuth()
  const { t } = useI18n()

  // Profile data state
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState("")

  // Profile form state
  const [profileFormData, setProfileFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  })
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileUpdateError, setProfileUpdateError] = useState("")

  // Password form state
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setProfileLoading(true)
      setProfileError("")

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      const token = localStorage.getItem("accessToken")

      const response = await fetch(`${baseUrl}/admins/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(t("profile.fetchError"))
      }

      const userData = await response.json()
      setProfile(userData)
      setProfileFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
      })
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : t("common.error"))
    } finally {
      setProfileLoading(false)
    }
  }

  // Update profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileUpdateLoading(true)
    setProfileUpdateError("")
    setProfileSuccess(false)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      const token = localStorage.getItem("accessToken")

      const response = await fetch(`${baseUrl}/admins/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileFormData),
      })

      if (!response.ok) {
        throw new Error(t("profile.updateError"))
      }

      const updatedUser = await response.json()
      setProfile(updatedUser)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err) {
      setProfileUpdateError(err instanceof Error ? err.message : t("common.error"))
    } finally {
      setProfileUpdateLoading(false)
    }
  }

  // Update password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordUpdateLoading(true)
    setPasswordError("")
    setPasswordSuccess(false)

    // Validate passwords match
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordError(t("profile.passwordMismatch"))
      setPasswordUpdateLoading(false)
      return
    }

    // Validate password strength
    if (passwordFormData.newPassword.length < 6) {
      setPasswordError(t("profile.passwordTooShort"))
      setPasswordUpdateLoading(false)
      return
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      const token = localStorage.getItem("accessToken")

      const response = await fetch(`${baseUrl}/admins/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        }),
      })

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(t("profile.currentPasswordIncorrect"))
        }
        throw new Error(t("profile.passwordUpdateError"))
      }

      // Reset form on success (204 response)
      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : t("common.error"))
    } finally {
      setPasswordUpdateLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (profileLoading) {
    return <LoadingSpinner />
  }

  if (profileError && !profile) {
    return <ErrorMessage message={profileError} onRetry={fetchProfile} />
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t("profile.title")}
        </h1>
        <p className="text-muted-foreground text-lg">{t("profile.description")}</p>
      </div>

      {/* Profile Overview Card */}
      <Card className="glass border-0 hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">
                {profile?.firstName.charAt(0)}
                {profile?.lastName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{profile?.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>{profile?.adminTypeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{profile?.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Profile Information */}
        <Card className="glass border-0 hover-lift">
          <CardHeader>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-2 rounded-lg bg-primary/20">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{t("profile.personalInfo")}</CardTitle>
                <p className="text-muted-foreground text-sm">{t("profile.personalInfoDescription")}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("profile.firstName")}</Label>
                  <Input
                    id="firstName"
                    value={profileFormData.firstName}
                    onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })}
                    required
                    className="h-12"
                    placeholder={t("profile.firstNamePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("profile.lastName")}</Label>
                  <Input
                    id="lastName"
                    value={profileFormData.lastName}
                    onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })}
                    required
                    className="h-12"
                    placeholder={t("profile.lastNamePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t("profile.phone")}</Label>
                  <Input
                    id="phoneNumber"
                    value={profileFormData.phoneNumber}
                    onChange={(e) => setProfileFormData({ ...profileFormData, phoneNumber: e.target.value })}
                    required
                    className="h-12"
                    placeholder={t("profile.phonePlaceholder")}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>{t("profile.username")}</Label>
                  <Input value={profile?.username || ""} disabled className="h-12 bg-muted/50" />
                  <p className="text-xs text-muted-foreground">{t("profile.usernameHint")}</p>
                </div>

                <div className="space-y-2">
                  <Label>{t("profile.adminType")}</Label>
                  <Input value={profile?.adminTypeName || ""} disabled className="h-12 bg-muted/50" />
                </div>
              </div>

              {profileUpdateError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {profileUpdateError}
                </div>
              )}

              {profileSuccess && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
                  {t("profile.updateSuccess")}
                </div>
              )}

              <Button type="submit" disabled={profileUpdateLoading} className="w-full h-12 gradient-primary">
                {profileUpdateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("profile.saving")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("profile.saveChanges")}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="glass border-0 hover-lift">
          <CardHeader>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Lock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-xl">{t("profile.changePassword")}</CardTitle>
                <p className="text-muted-foreground text-sm">{t("profile.changePasswordDescription")}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t("profile.currentPassword")}</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordFormData.currentPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                    required
                    className="h-12 pr-10"
                    placeholder={t("profile.currentPasswordPlaceholder")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("profile.newPassword")}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordFormData.newPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                    required
                    className="h-12 pr-10"
                    placeholder={t("profile.newPasswordPlaceholder")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("profile.confirmPassword")}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordFormData.confirmPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                    required
                    className="h-12 pr-10"
                    placeholder={t("profile.confirmPasswordPlaceholder")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <p className="font-medium mb-1">{t("profile.passwordRequirements")}</p>
                <ul className="text-xs space-y-1">
                  <li>• {t("profile.passwordReqLength")}</li>
                  <li>• {t("profile.passwordReqCase")}</li>
                  <li>• {t("profile.passwordReqNumbers")}</li>
                </ul>
              </div>

              {passwordError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
                  {t("profile.passwordUpdateSuccess")}
                </div>
              )}

              <Button
                type="submit"
                disabled={passwordUpdateLoading}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600"
              >
                {passwordUpdateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("profile.updating")}
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    {t("profile.updatePassword")}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
