import React from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { SectionContainer } from '@/components/layout/containers'
import type { ActionItemButton } from '@/types/common.types'
import { useCurrentRoute, useNavigate } from '@/router'
import { AuthHooks } from '@/api/auth'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import {
  ConsumerPurposeTemplateLinkedResourceTable,
  ConsumerPurposeTemplateLinkedResourceTableSkeleton,
} from '@/components/shared/PurposeTemplate/PurposeTemplateLinkedResourceTab/ConsumerPurposeTemplateLinkedResourceTable'

type ConsumerPurposeTemplateLinkedResourceTabProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const ConsumerPurposeTemplateLinkedResourceTab: React.FC<
  ConsumerPurposeTemplateLinkedResourceTabProps
> = ({ purposeTemplate }) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'read.linkedResourcesTab' })
  const { t: tCommon } = useTranslation('common')

  const { routeKey } = useCurrentRoute()
  const { isAdmin } = AuthHooks.useJwt()

  const navigate = useNavigate()

  const isEditable = purposeTemplate.state === 'PUBLISHED' || purposeTemplate.state === 'DRAFT'

  const topSideActions: Array<ActionItemButton> =
    routeKey === 'SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS' && isAdmin
      ? [
          {
            action: () =>
              navigate('SUBSCRIBE_PURPOSE_TEMPLATE_EDIT', {
                params: {
                  purposeTemplateId: purposeTemplate.id,
                },
                state: { stepIndexDestination: 1 },
              }),
            label: tCommon('actions.edit'),
            variant: 'contained',
            icon: EditIcon,
            disabled: !isEditable,
            tooltip: !isEditable ? t('editButtonTooltip') : undefined,
          },
        ]
      : []

  const descriptionLabel = t('description')
    .split('\n')
    .map((line, idx) => (
      <span key={idx}>
        {line}
        <br />
      </span>
    ))

  return (
    <SectionContainer
      title={t('title')}
      description={descriptionLabel}
      topSideActions={topSideActions}
      sx={{ backgroundColor: 'transparent' }}
    >
      <React.Suspense fallback={<ConsumerPurposeTemplateLinkedResourceTableSkeleton />}>
        <ConsumerPurposeTemplateLinkedResourceTable purposeTemplate={purposeTemplate} />
      </React.Suspense>
    </SectionContainer>
  )
}
