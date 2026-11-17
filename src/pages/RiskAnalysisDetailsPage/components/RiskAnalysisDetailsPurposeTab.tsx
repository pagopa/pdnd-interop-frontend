import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import {
  RiskAnalysisPurposeGeneralInfoSection,
  RiskAnalysisPurposeLoadEstimateSection,
} from '@/components/shared/RiskAnalysisPurposeInfoSections'
import { Stack } from '@mui/material'
import React from 'react'
import { RiskAnalysisDetailsAssignmentSection } from './RiskAnalysisDetailsAssignmentSection'
import type { ConcludedSigningState } from '../types'

type RiskAnalysisDetailsPurposeTabProps = {
  purpose: Purpose
  signingState: ConcludedSigningState
}

export const RiskAnalysisDetailsPurposeTab: React.FC<RiskAnalysisDetailsPurposeTabProps> = ({
  purpose,
  signingState,
}) => {
  return (
    <Stack spacing={3}>
      <RiskAnalysisPurposeGeneralInfoSection purpose={purpose} />
      <RiskAnalysisPurposeLoadEstimateSection purpose={purpose} />
      <RiskAnalysisDetailsAssignmentSection purpose={purpose} signingState={signingState} />
    </Stack>
  )
}

export const RiskAnalysisDetailsPurposeTabSkeleton: React.FC = () => {
  return (
    <Stack spacing={3}>
      <SectionContainerSkeleton height={317} />
      <SectionContainerSkeleton height={100} />
      <SectionContainerSkeleton height={180} />
    </Stack>
  )
}
