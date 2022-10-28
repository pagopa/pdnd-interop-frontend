import React from 'react'
import { AgreementState } from '@/types/agreement.types'
import { MUIColor } from '@/types/common.types'
import { EServiceState } from '@/types/eservice.types'
import { UserState } from '@/types/party.types'
import { Chip, ChipProps } from '@mui/material'
import omit from 'lodash/omit'
import { useTranslation } from 'react-i18next'

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

const chipColors = {
  eservice: CHIP_COLORS_E_SERVICE,
  agreement: CHIP_COLORS_AGREEMENT,
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
        state: AgreementState
      }
    | {
        for: 'user'
        state: UserState
      }
  )

export const StatusChip: React.FC<StatusChipProps> = (props) => {
  const { t } = useTranslation('common')
  let color: MUIColor = 'primary'
  let label = ''

  if (props.for === 'eservice') {
    color = chipColors['eservice'][props.state]
    label = t(`status.eservice.${props.state}`)
  }

  if (props.for === 'agreement') {
    color = chipColors['agreement'][props.state]
    label = t(`status.agreement.${props.state}`)
  }

  if (props.for === 'user') {
    color = chipColors['user'][props.state]
    label = t(`status.user.${props.state}`)
  }

  return <Chip label={label} color={color} {...omit(props, ['for', 'state'])} />
}
