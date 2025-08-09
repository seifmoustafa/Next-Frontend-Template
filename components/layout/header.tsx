"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/i18n-provider"
import { cn } from "@/lib/utils"
import { LanguageSwitcher, ThemeSwitcher, HeaderSearch } from "./common"
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown"

interface HeaderProps {
  onMenuClick: () => void
  isModern?: boolean
}

export function Header({ onMenuClick, isModern = false }: HeaderProps) {
  const { t } = useI18n()

  return (
    <header className={cn("sticky top-0 z-40 glass border-b border-border", isModern && "h-20 flex items-center")}> 
      <div className={cn("flex items-center justify-between px-6", isModern ? "py-6" : "py-4")}> 
        {/* Left side */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover-lift sidebar-trigger"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <HeaderSearch
            containerClassName="hidden md:block"
            inputClassName={cn(
              "bg-muted/50 border-0 focus:bg-background transition-colors",
              isModern ? "w-96 h-12" : "w-80",
              "pl-10 rtl:pl-4 rtl:pr-10"
            )}
            iconClassName="left-3 rtl:left-auto rtl:right-3"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <LanguageSwitcher buttonClassName="hover-lift" />
          <ThemeSwitcher buttonClassName="hover-lift" />
          <UserProfileDropdown showName={false} />
        </div>
      </div>
    </header>
  )
}
