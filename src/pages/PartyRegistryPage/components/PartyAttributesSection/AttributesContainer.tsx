import React from 'react'
import { SectionContainer } from '@/components/layout/containers'

export const AttributesContainer: React.FC<{
  title: string
  description: React.ReactNode
  children: React.ReactNode
}> = ({ title, description, children }) => {
  return (
    <SectionContainer newDesign innerSection title={title} description={description}>
      {children}
    </SectionContainer>
  )
}
