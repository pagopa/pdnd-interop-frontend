import React from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { SectionContainer } from '@/components/layout/containers'
import type { ActionItemButton } from '@/types/common.types'
import { useCurrentRoute } from '@/router'
import { AuthHooks } from '@/api/auth'
import { useNavigate } from 'react-router-dom'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import {
  ConsumerPurposeTemplateLinkedEServiceTableSkeleton,
  ConsumerPurposeTemplateLinkedEServiceTable,
} from '@/components/shared/PurposeTemplate/PurposeTemplateLinkedEServiceTab/ConsumerPurposeTemplateLinkedEServiceTable'

type ConsumerPurposeTemplateLinkedEServiceTabProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const ConsumerPurposeTemplateLinkedEServiceTab: React.FC<
  ConsumerPurposeTemplateLinkedEServiceTabProps
> = ({ purposeTemplate }) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'read.linkedEservicesTab' })
  const { t: tCommon } = useTranslation('common')

  const { routeKey } = useCurrentRoute()
  const { isAdmin } = AuthHooks.useJwt()

  const navigate = useNavigate()

  const topSideActions: Array<ActionItemButton> =
    routeKey === 'SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS' && isAdmin
      ? [
          {
            action: () => {}, //TODO: REMOVE COMMENT WHEN AVAILABLE
            // navigate('SUBSCRIBE_PURPOSE_TEMPLATE_EDIT', {
            //   params: {
            //     purposeTemplateId: purposeTemplate.id,
            //   },
            //   state: { stepIndexDestination: 1 },
            // }),
            label: tCommon('actions.edit'),
            variant: 'contained',
            icon: EditIcon,
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
    <>
      <SectionContainer
        title={t('title')}
        description={descriptionLabel}
        topSideActions={topSideActions}
        sx={{
          backgroundColor: 'transparent',
        }}
      >
        <React.Suspense fallback={<ConsumerPurposeTemplateLinkedEServiceTableSkeleton />}>
          <ConsumerPurposeTemplateLinkedEServiceTable purposeTemplate={purposeTemplate} />
        </React.Suspense>
      </SectionContainer>
    </>
  )
}
