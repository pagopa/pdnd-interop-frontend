import React from 'react'
import { AgreementState, AgreementSummary } from '@/types/agreement.types'
import { MUIColor } from '@/types/common.types'
import { EServiceState } from '@/types/eservice.types'
import { UserState } from '@/types/party.types'
import { Chip, ChipProps, Skeleton } from '@mui/material'
import omit from 'lodash/omit'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { PurposeState } from '@/types/purpose.types'

const CHIP_COLORS_E_SERVICE: Record<EServiceState, MUIColor> = {
  PUBLISHED: 'primary',
  DRAFT: 'info',
  SUSPENDED: 'error',
  ARCHIVED: 'info',
  DEPRECATED: 'warning',
}

const CHIP_COLORS_AGREEMENT: Record<AgreementState, MUIColor> = {
  ACTIVE: 'primary',
  SUSPENDED: 'error',
  PENDING: 'warning',
  ARCHIVED: 'info',
  DRAFT: 'info',
  REJECTED: 'error',
  MISSING_CERTIFIED_ATTRIBUTES: 'error',
}

const CHIP_COLORS_USER: Record<UserState, MUIColor> = {
  PENDING: 'warning',
  ACTIVE: 'primary',
  SUSPENDED: 'error',
}

const CHIP_COLORS_PURPOSE: Record<PurposeState, MUIColor> = {
  DRAFT: 'info',
  ACTIVE: 'primary',
  SUSPENDED: 'error',
  WAITING_FOR_APPROVAL: 'warning',
  ARCHIVED: 'info',
}

const chipColors = {
  eservice: CHIP_COLORS_E_SERVICE,
  agreement: CHIP_COLORS_AGREEMENT,
  purpose: CHIP_COLORS_PURPOSE,
  user: CHIP_COLORS_USER,
} as const

type StatusChipProps = Omit<ChipProps, 'color' | 'label'> &
  (
    | {
        for: 'eservice'
        state: EServiceState
      }
    | {
        for: 'agreement'
        agreement: AgreementSummary
      }
    | {
        for: 'purpose'
        state: PurposeState
      }
    | {
        for: 'user'
        state: UserState
      }
  )

function getAgreementChipState(item: AgreementSummary, t: TFunction<'common'>): Array<ChipProps> {
  const result: Array<Partial<ChipProps>> = []

  if (item.state !== 'SUSPENDED') {
    result.push({ label: t(`status.agreement.${item.state}`) })
  }

  if (item.suspendedByPlatform) {
    result.push({ label: t('status.agreement.frontendStatus.suspendedByPlatform') })
  }

  if (item.suspendedByProducer) {
    result.push({ label: t('status.agreement.frontendStatus.suspendedByProducer') })
  }

  if (item.suspendedByConsumer) {
    result.push({ label: t('status.agreement.frontendStatus.suspendedByConsumer') })
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
      <>
        {getAgreementChipState(props.agreement, t).map(({ label, color }, i) => (
          <Chip size="small" key={i} label={label} color={color} />
        ))}
      </>
    )
  }

  if (props.for === 'user') {
    color = chipColors['user'][props.state]
    label = t(`status.user.${props.state}`)
  }

  if (props.for === 'purpose') {
    color = chipColors['purpose'][props.state]
    label = t(`status.purpose.${props.state}`)
  }

  return <Chip label={label} color={color} {...omit(props, ['for', 'state'])} />
}

export const StatusChipSkeleton: React.FC = () => {
  return <Skeleton sx={{ borderRadius: 999 }} variant="rectangular" height={23} width={54} />
}
