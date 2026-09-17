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

  // Extra `ChipProps` (size, sx, onClick, …) forwarded to the rendered `Chip` for the
  // single-chip variants; the discriminant and variant-specific fields are stripped out.
  const chipProps = omit(props, [
    'for',
    'state',
    'agreement',
    'purpose',
    'isActiveDescriptor',
    'isDraftToCorrect',
    'attributeKey',
  ])

  return match(props)
    .with({ for: 'agreement' }, ({ agreement }) => (
      <Stack direction="row" spacing={1}>
        {getAgreementChipState(agreement, t).map(({ label, color }, i) => (
          <Chip size="small" key={i} label={label} color={color} />
        ))}
      </Stack>
    ))
    .with({ for: 'purpose' }, ({ purpose }) => <PurposeStatusChip purpose={purpose} />)
    .with({ for: 'eservice' }, (p) => {
      const remappedState: EServiceDescriptorState = match(p.state)
        .with('ARCHIVING', () => 'PUBLISHED' as const)
        .with('ARCHIVING_SUSPENDED', () => 'SUSPENDED' as const)
        .otherwise((state) => state)

      const color = p.isDraftToCorrect ? 'warning' : chipColors.eservice[remappedState]
      const label = p.isDraftToCorrect
        ? t('status.eservice.DRAFT_TO_CORRECT')
        : t(`status.eservice.${remappedState}`)

      return <Chip label={label} color={color} {...chipProps} />
    })
    .with({ for: 'descriptor' }, (p) => {
      const isActiveDescriptorBeingArchived =
        p.isActiveDescriptor && isDescriptorPendingArchiving(p.state)

      const remappedState: EServiceDescriptorState = match({
        state: p.state,
        isActiveDescriptorBeingArchived,
      })
        .with({ isActiveDescriptorBeingArchived: false }, ({ state }) => state)
        .with({ state: 'ARCHIVING' }, () => 'PUBLISHED' as const)
        .otherwise(() => 'SUSPENDED' as const)

      return (
        <Chip
          label={t(`status.descriptor.${remappedState}`)}
          color={chipColors.descriptor[remappedState]}
          {...chipProps}
        />
      )
    })
    .with({ for: 'delegation' }, (p) => (
      <Chip
        label={t(`status.delegation.${p.state}`)}
        color={chipColors.delegation[p.state]}
        {...chipProps}
      />
    ))
    .with({ for: 'eserviceTemplate' }, (p) => (
      <Chip
        label={t(`status.eserviceTemplate.${p.state}`)}
        color={chipColors.eserviceTemplate[p.state]}
        {...chipProps}
      />
    ))
    .with({ for: 'purposeTemplate' }, (p) => (
      <Chip
        label={t(`status.purposeTemplate.${p.state}`)}
        color={chipColors.purposeTemplate[p.state]}
        {...chipProps}
      />
    ))
    .with({ for: 'riskAnalysis' }, (p) => (
      <Chip
        label={t(`status.riskAnalysis.${p.state}`)}
        color={chipColors.riskAnalysis[p.state]}
        {...chipProps}
      />
    ))
    .with({ for: 'riskAnalysisList' }, (p) => (
      <Chip
        label={t(`status.riskAnalysisList.${p.state}`)}
        color={chipColors.riskAnalysisList[p.state]}
        {...chipProps}
      />
    ))
    .exhaustive()
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
