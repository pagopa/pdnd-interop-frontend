import React from 'react'
import type { Purpose } from '@/api/api.generatedTypes'
import { ConsumerPurposeDetailsGeneralInfoSection } from './ConsumerPurposeDetailsGeneralInfoSection'
import { ConsumerPurposeDetailsLoadEstimateSection } from './ConsumerPurposeDetailsLoadEstimateSection'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { Stack } from '@mui/material'

interface PurposeDetailsTabProps {
  purpose: Purpose
  openRejectReasonDrawer: VoidFunction
}

export const PurposeDetailsTab: React.FC<PurposeDetailsTabProps> = ({
  purpose,
  openRejectReasonDrawer,
}) => {
  return (
    <Stack spacing={3}>
      <ConsumerPurposeDetailsGeneralInfoSection purpose={purpose} />
      <ConsumerPurposeDetailsLoadEstimateSection
        purpose={purpose}
        openRejectReasonDrawer={openRejectReasonDrawer}
      />
    </Stack>
  )
}

export const PurposeDetailTabSkeleton: React.FC = () => {
  return (
    <Stack spacing={3}>
      <SectionContainerSkeleton height={317} />
      <SectionContainerSkeleton height={538} />
    </Stack>
  )
}
