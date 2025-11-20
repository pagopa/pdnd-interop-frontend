import React from 'react'
import { useMaintenanceBanner } from '@/hooks/bannerHooks/useMaintenanceBanner'
import { Banner } from './Banner'

export const MaintenanceBanner: React.FC = () => {
  const { title, text, isOpen, closeBanner } = useMaintenanceBanner()

  return (
    <Banner
      title={title || ''}
      content={text}
      isOpen={isOpen}
      setIsOpen={closeBanner}
    />
  )
}
