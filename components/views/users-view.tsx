"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GenericTable } from "@/components/ui/generic-table"
import { GenericModal } from "@/components/ui/generic-modal"
import { UserForm } from "@/components/forms/user-form"
import { useUsersViewModel } from "@/viewmodels/users.viewmodel"
import { useServices } from "@/providers/service-provider"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import type { User } from "@/services/user.service"
import { Plus, Search, Filter, Download, UsersIcon, RefreshCw } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"

export function UsersView() {
  const { userService } = useServices()
  const { t } = useI18n()
  const { token } = useAuth()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const {
    users,
    loading,
    error,
    total,
    currentPage,
    searchTerm,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    changePage,
    refreshUsers,
  } = useUsersViewModel(userService)

  const columns = [
    {
      key: "username",
      label: t("users.username"),
      sortable: true,
      width: "32",
    },
    {
      key: "firstName",
      label: t("users.firstName"),
      sortable: true,
      width: "28",
    },
    {
      key: "lastName",
      label: t("users.lastName"),
      sortable: true,
      width: "28",
    },
    {
      key: "phoneNumber",
      label: t("users.phoneNumber"),
      sortable: false,
      width: "32",
    },
    {
      key: "adminTypeName",
      label: t("users.adminType"),
      sortable: true,
      width: "24",
      render: (value: string) => (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            value === "SuperAdmin"
              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              : value === "Admin"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          }`}
        >
          {value}
        </span>
      ),
    },
  ]

  const actions = [
    {
      label: t("common.edit"),
      onClick: (user: User) => setEditingUser(user),
    },
    {
      label: t("common.delete"),
      onClick: (user: User) => {
        if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
          deleteUser(user.id)
        }
      },
      variant: "destructive" as const,
    },
  ]

  if (loading && users.length === 0) {
    return <LoadingSpinner />
  }

  if (error && users.length === 0) {
    return <ErrorMessage message={error} onRetry={refreshUsers} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("users.title")}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">إدارة المستخدمين والصلاحيات</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={refreshUsers}
            variant="outline"
            size="lg"
            className="hover-lift bg-transparent flex-1 sm:flex-none"
          >
            <RefreshCw className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
            تحديث
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gradient-primary hover-lift flex-1 sm:flex-none"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
            {t("users.addUser")}
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card className="glass border-0 hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="p-3 rounded-xl bg-primary/20">
              <UsersIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-muted-foreground">إجمالي المستخدمين</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass border-0 hover-lift">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl">المستخدمون ({total})</CardTitle>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("users.search")}
                  className="pl-10 rtl:pl-4 rtl:pr-10 w-full sm:w-80 bg-muted/50 border-0"
                  value={searchTerm}
                  onChange={(e) => searchUsers(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="hover-lift bg-transparent">
                  <Filter className="w-4 h-4" />
                </Button>

                <Button variant="outline" size="icon" className="hover-lift bg-transparent">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <GenericTable
            data={users}
            columns={columns}
            actions={actions}
            loading={loading}
            pagination={{
              currentPage,
              totalPages: Math.ceil(total / 10),
              onPageChange: changePage,
            }}
          />
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <GenericModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} title={t("users.addUser")}>
        <UserForm
          onSubmit={async (data) => {
            await createUser(data)
            setIsCreateModalOpen(false)
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </GenericModal>

      {/* Edit User Modal */}
      <GenericModal
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        title={`تعديل ${editingUser?.firstName} ${editingUser?.lastName}`}
      >
        {editingUser && (
          <UserForm
            initialData={editingUser}
            onSubmit={async (data) => {
              await updateUser(editingUser.id, data)
              setEditingUser(null)
            }}
            onCancel={() => setEditingUser(null)}
          />
        )}
      </GenericModal>
    </div>
  )
}
