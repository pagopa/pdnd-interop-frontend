import React from 'react'
import type { SvgIconComponent } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import { EServiceCatalog } from '@/types/eservice.types'
import { useJwt } from '@/hooks/useJwt'
import { useTranslation } from 'react-i18next'
import PersonIcon from '@mui/icons-material/Person'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'

type OwnerTooltipProps = {
  eservice: EServiceCatalog
  canCreateAgreementDraft: boolean
  isMine: boolean
}

export const OwnerTooltip: React.FC<OwnerTooltipProps> = ({
  eservice,
  canCreateAgreementDraft,
  isMine,
}) => {
  const { isAdmin } = useJwt()
  const { t } = useTranslation('eservice', { keyPrefix: 'tableEServiceCatalog' })

  let label: string | null = null
  let Icon: SvgIconComponent | null = null

  if (!canCreateAgreementDraft) {
    label = t('missingCertifiedAttributes')
    Icon = ClearIcon
  }

  if (eservice.agreement && eservice.agreement.state === 'DRAFT' && isAdmin) {
    label = t('agreementInDraft')
    Icon = ModeEditIcon
  }

  if (eservice.agreement && !['DRAFT', 'REJECTED'].includes(eservice.agreement.state) && isAdmin) {
    label = t('alreadySubscribed')
    Icon = CheckIcon
  }

  if (isMine) {
    label = t('youAreTheProvider')
    Icon = PersonIcon
  }

  if (!label || !Icon) return null

  return (
    <Tooltip title={label}>
      <Icon sx={{ ml: 0.75, fontSize: 16 }} color="primary" />
    </Tooltip>
  )
}
