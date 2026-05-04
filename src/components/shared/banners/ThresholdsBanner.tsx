import React from 'react'
import { Banner } from './Banner'
import { useThresholdsBanner } from '@/hooks/bannerHooks/useThresholdsBanner'

export const ThresholdsBanner: React.FC = () => {
  const { title, text, isOpen, closeBanner } = useThresholdsBanner()

  return <Banner title={title || ''} content={text} isOpen={isOpen} setIsOpen={closeBanner} />
}
