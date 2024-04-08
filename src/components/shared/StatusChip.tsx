import React from 'react'
import type { MUIColor } from '@/types/common.types'
import { Chip, Skeleton, Stack } from '@mui/material'
import type { ChipProps } from '@mui/material'
import omit from 'lodash/omit'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type {
  Agreement,
  AgreementListEntry,
  AgreementState,
  EServiceDescriptorState,
  Purpose,
  PurposeVersionState,
} from '@/api/api.generatedTypes'

const CHIP_COLORS_E_SERVICE: Record<EServiceDescriptorState, MUIColor> = {
  PUBLISHED: 'success',
  DRAFT: 'info',
  SUSPENDED: 'error',
  ARCHIVED: 'info',
  DEPRECATED: 'warning',
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

const chipColors = {
  eservice: CHIP_COLORS_E_SERVICE,
  agreement: CHIP_COLORS_AGREEMENT,
  purpose: CHIP_COLORS_PURPOSE,
} as const

type StatusChipProps = Omit<ChipProps, 'color' | 'label'> &
  (
    | {
        for: 'eservice'
        state: EServiceDescriptorState
      }
    | {
        for: 'agreement'
        agreement: Agreement | AgreementListEntry
      }
    | {
        for: 'purpose'
        purpose: Purpose
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
    color = chipColors['eservice'][props.state]
    label = t(`status.eservice.${props.state}`)
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

  return (
    <Chip
      label={label}
      color={color}
      {...omit(props, ['for', 'state', 'agreement', 'attributeKey'])}
    />
  )
}

const PurposeStatusChip: React.FC<{ purpose: Purpose }> = ({ purpose }) => {
  const { t } = useTranslation('common')

  const currentVersionState = purpose.currentVersion?.state ?? 'DRAFT'

  const waitingForApprovalVersionState =
    purpose.waitingForApprovalVersion?.state ?? 'WAITING_FOR_APPROVAL'

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
    </Stack>
  )
}

export const StatusChipSkeleton: React.FC = () => {
  return <Skeleton sx={{ borderRadius: 999 }} variant="rectangular" height={23} width={54} />
}
