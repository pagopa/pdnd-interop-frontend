import { SectionContainerSkeleton } from '@/components/layout/containers'
import { ActiveStepProps } from '@/hooks/useActiveStep'
import React from 'react'

export const EServiceCreateStep2Version: React.FC<ActiveStepProps> = () => {
  return <div>Hello World!</div>
}

export const EServiceCreateStep2VersionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
