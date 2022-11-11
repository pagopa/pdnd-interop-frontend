import { SectionContainerSkeleton } from '@/components/layout/containers'
import { ActiveStepProps } from '@/hooks/useActiveStep'
import React from 'react'

export const EServiceCreateStep3Documents: React.FC<ActiveStepProps> = () => {
  return <div>Hello World!</div>
}

export const EServiceCreateStep3DocumentsSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
