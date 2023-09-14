import React from 'react'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'
import { SectionContainer } from '@/components/layout/containers'
import { ReadOnlyDescriptorAttributes } from '../../ReadOnlyDescriptorAttributes'

export const EServiceDescriptorAttributesSections: React.FC = () => {
  const { descriptor } = useEServiceDetailsContext()

  return (
    <SectionContainer newDesign component="div">
      <ReadOnlyDescriptorAttributes descriptorAttributes={descriptor.attributes} />
    </SectionContainer>
  )
}
