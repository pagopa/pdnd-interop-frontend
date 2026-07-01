import React from 'react'
import type { MUIColor } from '@/types/common.types'
import { Chip, Skeleton, Stack } from '@mui/material'
import type { ChipProps } from '@mui/material'
import omit from 'lodash/omit'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { match } from 'ts-pattern'
import { isDescriptorPendingArchiving } from '@/utils/eservice.utils'
import type {
  Agreement,
  AgreementListEntry,
  AgreementState,
  DelegationState,
  EServiceDescriptorState,
  EServiceTemplateVersionState,
  Purpose,
  PurposeTemplateState,
  PurposeVersionState,
  RiskAnalysisSigningState,
} from '@/api/api.generatedTypes'

const CHIP_COLORS_E_SERVICE: Record<EServiceDescriptorState, MUIColor> = {
  PUBLISHED: 'success',
  DRAFT: 'info',
  SUSPENDED: 'error',
  ARCHIVED: 'info',
  DEPRECATED: 'warning',
  WAITING_FOR_APPROVAL: 'warning',
  ARCHIVING: 'warning',
  ARCHIVING_SUSPENDED: 'error',
}

const CHIP_COLORS_DESCRIPTOR: Record<EServiceDescriptorState, MUIColor> = {
  PUBLISHED: 'success',
  DRAFT: 'info',
  SUSPENDED: 'error',
  ARCHIVED: undefined,
  DEPRECATED: 'warning',
  WAITING_FOR_APPROVAL: 'warning',
  ARCHIVING: 'warning',
  ARCHIVING_SUSPENDED: 'error',
}

const CHIP_COLORS_AGREEMENT: Record<AgreementState, MUIColor> = {
  ACTIVE: 'success',
  SUSPENDED: 'error',
  PENDING: 'warning',
  ARCHIVED: 'info',
  DRAFT: 'info',
  REJECTED: 'error',
  MISSING_CERTIFIED_ATTRIBUTES: 'error',
}

const CHIP_COLORS_PURPOSE: Record<PurposeVersionState, MUIColor> = {
  DRAFT: 'info',
  ACTIVE: 'success',
  SUSPENDED: 'error',
  WAITING_FOR_APPROVAL: 'warning',
  ARCHIVED: 'info',
  REJECTED: 'error',
}

const CHIP_COLORS_RISK_ANALYSIS: Record<Exclude<RiskAnalysisSigningState, 'DRAFT'>, MUIColor> = {
  ASSIGNED: 'warning',
  SUBMITTED: 'info',
  SIGNED: 'success',
  REJECTED: 'error',
}

const CHIP_COLORS_DELEGATION: Record<DelegationState, MUIColor> = {
  ACTIVE: 'success',
  REJECTED: 'error',
  REVOKED: 'error',
  WAITING_FOR_APPROVAL: 'warning',
}

const CHIP_COLORS_E_SERVICE_TEMPLATE: Record<EServiceTemplateVersionState, MUIColor> = {
  PUBLISHED: 'success',
  DRAFT: 'info',
  SUSPENDED: 'error',
  DEPRECATED: 'warning',
}

const CHIP_COLORS_PURPOSE_TEMPLATE: Record<PurposeTemplateState, MUIColor> = {
  PUBLISHED: 'success',
  DRAFT: 'info',
  SUSPENDED: 'error',
  ARCHIVED: 'warning',
}

const chipColors = {
  eservice: CHIP_COLORS_E_SERVICE,
  descriptor: CHIP_COLORS_DESCRIPTOR,
  agreement: CHIP_COLORS_AGREEMENT,
  purpose: CHIP_COLORS_PURPOSE,
  delegation: CHIP_COLORS_DELEGATION,
  eserviceTemplate: CHIP_COLORS_E_SERVICE_TEMPLATE,
  purposeTemplate: CHIP_COLORS_PURPOSE_TEMPLATE,
  riskAnalysis: CHIP_COLORS_RISK_ANALYSIS,
  riskAnalysisList: CHIP_COLORS_RISK_ANALYSIS,
} as const

type StatusChipProps = Omit<ChipProps, 'color' | 'label'> &
  (
    | {
        for: 'eservice'
        state: EServiceDescriptorState
        isDraftToCorrect?: boolean
      }
    | {
        for: 'descriptor'
        state: EServiceDescriptorState
        isActiveDescriptor?: boolean
      }
    | {
        for: 'agreement'
        agreement: Agreement | AgreementListEntry
      }
    | {
        for: 'purpose'
        purpose: Purpose
      }
    | {
        for: 'delegation'
        state: DelegationState
      }
    | {
        for: 'eserviceTemplate'
        state: EServiceTemplateVersionState
      }
    | {
        for: 'purposeTemplate'
        state: PurposeTemplateState
      }
    | {
        for: 'riskAnalysis'
        state: Exclude<RiskAnalysisSigningState, 'DRAFT'>
      }
    | {
        for: 'riskAnalysisList'
        state: Exclude<RiskAnalysisSigningState, 'DRAFT' | 'SIGNED' | 'REJECTED'>
      }
  )

function getAgreementChipState(
  item: Agreement | AgreementListEntry,
  t: TFunction<'common'>
): Array<ChipProps> {
  const result: Array<Partial<ChipProps>> = []

  const isSuspended = item.state === 'SUSPENDED'

  if (!isSuspended) {
    result.push({ label: t(`status.agreement.${item.state}`) })
  }

  if (isSuspended) {
    if (item.suspendedByPlatform) {
      result.push({ label: t('status.agreement.frontendStatus.suspendedByPlatform') })
    }

    if (item.suspendedByProducer) {
      result.push({ label: t('status.agreement.frontendStatus.suspendedByProducer') })
    }

    if (item.suspendedByConsumer) {
      result.push({ label: t('status.agreement.frontendStatus.suspendedByConsumer') })
    }
  }

  return result.map((r) => ({
    ...r,
    color: CHIP_COLORS_AGREEMENT[item.state as AgreementState],
  })) as Array<ChipProps>
}

export const StatusChip: React.FC<StatusChipProps> = (props) => {
  const { t } = useTranslation('common')

  let color: MUIColor = 'primary'
  let label = ''

  if (props.for === 'eservice') {
    const remappedState: EServiceDescriptorState = match(props.state)
      .with('ARCHIVING', () => 'PUBLISHED' as const)
      .with('ARCHIVING_SUSPENDED', () => 'SUSPENDED' as const)
      .otherwise((state) => state)

    color = props.isDraftToCorrect ? 'warning' : chipColors['eservice'][remappedState]
    label = props.isDraftToCorrect
      ? t('status.eservice.DRAFT_TO_CORRECT')
      : t(`status.eservice.${remappedState}`)
  }

  if (props.for === 'descriptor') {
    const isActiveDescriptorBeingArchived =
      props.isActiveDescriptor && isDescriptorPendingArchiving(props.state)

    const remappedState: EServiceDescriptorState = match({
      state: props.state,
      isActiveDescriptorBeingArchived,
    })
      .with({ isActiveDescriptorBeingArchived: false }, ({ state }) => state)
      .with({ state: 'ARCHIVING' }, () => 'PUBLISHED' as const)
      .otherwise(() => 'SUSPENDED' as const)

    color = chipColors['descriptor'][remappedState]
    label = t(`status.descriptor.${remappedState}`)
  }

  if (props.for === 'agreement') {
    return (
      <Stack direction="row" spacing={1}>
        {getAgreementChipState(props.agreement, t).map(({ label, color }, i) => (
          <Chip size="small" key={i} label={label} color={color} />
        ))}
      </Stack>
    )
  }

  if (props.for === 'purpose') {
    return <PurposeStatusChip purpose={props.purpose} />
  }

  if (props.for === 'delegation') {
    color = chipColors['delegation'][props.state]
    label = t(`status.delegation.${props.state}`)
  }

  if (props.for === 'eserviceTemplate') {
    color = chipColors['eserviceTemplate'][props.state]
    label = t(`status.eserviceTemplate.${props.state}`)
  }

  if (props.for === 'purposeTemplate') {
    color = chipColors['purposeTemplate'][props.state]
    label = t(`status.purposeTemplate.${props.state}`)
  }

  if (props.for === 'riskAnalysis') {
    color = chipColors['riskAnalysis'][props.state]
    label = t(`status.riskAnalysis.${props.state}`)
  }

  if (props.for === 'riskAnalysisList') {
    color = chipColors['riskAnalysisList'][props.state]
    label = t(`status.riskAnalysisList.${props.state}`)
  }

  return (
    <Chip
      label={label}
      color={color}
      {...omit(props, ['for', 'state', 'agreement', 'attributeKey', 'isActiveDescriptor'])}
    />
  )
}

const PurposeStatusChip: React.FC<{ purpose: Purpose }> = ({ purpose }) => {
  const { t } = useTranslation('common')

  const currentVersionState = purpose.currentVersion?.state ?? 'DRAFT'

  const waitingForApprovalVersionState =
    purpose.waitingForApprovalVersion?.state ?? 'WAITING_FOR_APPROVAL'

  const rejectedVersionState = purpose.rejectedVersion?.state ?? 'REJECTED'

  return (
    <Stack direction="row" spacing={1}>
      {purpose.currentVersion && (
        <Chip
          size="small"
          label={t(`status.purpose.${currentVersionState}`)}
          color={chipColors['purpose'][currentVersionState]}
        />
      )}
      {purpose.waitingForApprovalVersion && !purpose.currentVersion && (
        <Chip
          size="small"
          label={t(`status.purpose.${waitingForApprovalVersionState}`)}
          color={chipColors['purpose'][waitingForApprovalVersionState]}
        />
      )}
      {purpose.rejectedVersion && !purpose.currentVersion && (
        <Chip
          size="small"
          label={t(`status.purpose.${rejectedVersionState}`)}
          color={chipColors['purpose'][rejectedVersionState]}
        />
      )}
    </Stack>
  )
}

export const StatusChipSkeleton: React.FC = () => {
  return <Skeleton sx={{ borderRadius: 999 }} variant="rectangular" height={23} width={54} />
}
