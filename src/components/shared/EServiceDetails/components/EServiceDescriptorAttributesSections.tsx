import React from 'react'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'
import { SectionContainer } from '@/components/layout/containers'
import { ReadOnlyDescriptorAttributes } from '../../ReadOnlyDescriptorAttributes'

export const EServiceDescriptorAttributesSections: React.FC = () => {
  const { descriptorAttributes } = useEServiceDetailsContext()

  return (
    <SectionContainer newDesign component="div">
      <ReadOnlyDescriptorAttributes descriptorAttributes={descriptorAttributes} />
    </SectionContainer>
  )
}
