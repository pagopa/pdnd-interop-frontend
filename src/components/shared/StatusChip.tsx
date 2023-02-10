import React from 'react'
import { AgreementListingItem, AgreementState, AgreementSummary } from '@/types/agreement.types'
import { MUIColor } from '@/types/common.types'
import { EServiceState } from '@/types/eservice.types'
import { UserState } from '@/types/party.types'
import { Chip, ChipProps, Skeleton, Stack } from '@mui/material'
import omit from 'lodash/omit'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { DecoratedPurpose, PurposeListingItem, PurposeState } from '@/types/purpose.types'
import { AttributeKey, AttributeKind, AttributeState } from '@/types/attribute.types'
import { useJwt } from '@/hooks/useJwt'
import { checkPurposeSuspendedByConsumer } from '@/utils/purpose.utils'

const CHIP_COLORS_E_SERVICE: Record<EServiceState, MUIColor> = {
  PUBLISHED: 'primary',
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

const CHIP_COLORS_USER: Record<UserState, MUIColor> = {
  PENDING: 'warning',
  ACTIVE: 'primary',
  SUSPENDED: 'error',
}

const CHIP_COLORS_PURPOSE: Record<PurposeState, MUIColor> = {
  DRAFT: 'info',
  ACTIVE: 'success',
  SUSPENDED: 'error',
  WAITING_FOR_APPROVAL: 'info',
  ARCHIVED: 'info',
}

const CHIP_COLORS_ATTRIBUTE: Record<AttributeState | 'NOT_ACTIVE', MUIColor> = {
  ACTIVE: 'success',
  NOT_ACTIVE: 'warning',
  REVOKED: 'error',
}

const chipColors = {
  eservice: CHIP_COLORS_E_SERVICE,
  agreement: CHIP_COLORS_AGREEMENT,
  purpose: CHIP_COLORS_PURPOSE,
  user: CHIP_COLORS_USER,
  attribute: CHIP_COLORS_ATTRIBUTE,
} as const

type StatusChipProps = Omit<ChipProps, 'color' | 'label'> &
  (
    | {
        for: 'eservice'
        state: EServiceState
      }
    | {
        for: 'agreement'
        agreement: AgreementSummary | AgreementListingItem
      }
    | {
        for: 'purpose'
        purpose: DecoratedPurpose | PurposeListingItem
      }
    | {
        for: 'user'
        state: UserState
      }
    | {
        for: 'attribute'
        state?: AttributeState
        kind: AttributeKind
      }
  )

function getAgreementChipState(
  item: AgreementSummary | AgreementListingItem,
  t: TFunction<'common'>
): Array<ChipProps> {
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
  const { jwt } = useJwt()

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

  if (props.for === 'user') {
    color = chipColors['user'][props.state]
    label = t(`status.user.${props.state}`)
  }

  if (props.for === 'purpose') {
    const purpose = props.purpose
    const purposeState = props.purpose.currentVersion?.state ?? 'DRAFT'

    const isPurposeSuspended =
      purpose?.currentVersion && purpose?.currentVersion.state === 'SUSPENDED'
    const isPurposeSuspendedByProvider = purpose.suspendedByProducer

    const isPurposeSuspendedByConsumer = checkPurposeSuspendedByConsumer(
      purpose,
      jwt?.organizationId
    )

    return (
      <Stack direction="row" spacing={1}>
        {props.purpose.currentVersion && (
          <>
            {isPurposeSuspended ? (
              <>
                {isPurposeSuspendedByConsumer && (
                  <Chip
                    size="small"
                    label={t(`status.purpose.SUSPENDED.byConsumer`)}
                    color={chipColors['purpose'][purposeState]}
                  />
                )}
                {isPurposeSuspendedByProvider && (
                  <Chip
                    size="small"
                    label={t(`status.purpose.SUSPENDED.byProducer`)}
                    color={chipColors['purpose'][purposeState]}
                  />
                )}
              </>
            ) : (
              <Chip
                size="small"
                label={t(`status.purpose.${purposeState as Exclude<PurposeState, 'SUSPENDED'>}`)}
                color={chipColors['purpose'][purposeState]}
              />
            )}
          </>
        )}
        {props.purpose.waitingForApprovalVersion && (
          <Chip
            size="small"
            label={t(`status.purpose.WAITING_FOR_APPROVAL`)}
            color={chipColors['purpose']['WAITING_FOR_APPROVAL']}
          />
        )}
      </Stack>
    )
  }

  if (props.for === 'attribute') {
    color = chipColors['attribute'][props.state || 'NOT_ACTIVE']
    label = t(
      `status.attribute.${props.kind.toLowerCase() as AttributeKey}.${props.state ?? 'NOT_ACTIVE'}`
    )
  }

  return (
    <Chip
      label={label}
      color={color}
      {...omit(props, ['for', 'state', 'agreement', 'attributeKey'])}
    />
  )
}

export const StatusChipSkeleton: React.FC = () => {
  return <Skeleton sx={{ borderRadius: 999 }} variant="rectangular" height={23} width={54} />
}
