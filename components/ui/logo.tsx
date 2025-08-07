'use client'

import React from 'react'
import { Sparkles, Shield } from 'lucide-react'
import { useSettings } from '@/providers/settings-provider'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
  const settings = useSettings()

  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5', 
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10'
  }

  const textSizeClasses = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg', 
    lg: 'text-xl',
    xl: 'text-2xl'
  }

  const animationClasses = {
    none: '',
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    fancy: 'hover:scale-110 hover:rotate-12 transition-transform duration-300'
  }

  const renderIcon = () => {
    const iconClass = cn(
      sizeClasses[settings.logoSize],
      animationClasses[settings.logoAnimation],
      'transition-all duration-200'
    )

    switch (settings.logoType) {
      case 'sparkles':
        return <Sparkles className={iconClass} />
      case 'shield':
        return <Shield className={iconClass} />
      case 'image':
        return (
          <div className={cn(sizeClasses[settings.logoSize], 'relative')}>
            <Image
              src={settings.logoImagePath || '/placeholder.svg?height=32&width=32'}
              alt="Logo"
              fill
              className={cn('object-contain', animationClasses[settings.logoAnimation])}
              onError={(e) => {
                // Fallback to sparkles icon if image fails to load
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )
      case 'custom':
        return (
          <div className={cn(
            textSizeClasses[settings.logoSize],
            animationClasses[settings.logoAnimation],
            'font-bold'
          )}>
            {settings.logoText || 'SA'}
          </div>
        )
      default:
        return <Sparkles className={iconClass} />
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {renderIcon()}
      {showText && settings.logoType !== 'custom' && (
        <span className={cn(
          'font-semibold',
          textSizeClasses[settings.logoSize]
        )}>
          {settings.logoText}
        </span>
      )}
    </div>
  )
}
