import React from 'react'
import { useTranslation } from 'react-i18next'
import type { PurposeTemplate } from '@/api/purposeTemplate/mockedResponses'
import EditIcon from '@mui/icons-material/Edit'
import { SectionContainer } from '@/components/layout/containers'
import type { ActionItemButton } from '@/types/common.types'
import {
  ConsumerPurposeTemplateLinkedEServiceTableSkeleton,
  ConsumerPurposeTemplateLinkedEServiceTable,
} from './ConsumerPurposeTemplateLinkedEServiceTable'

type ConsumerPurposeTemplateLinkedEServiceTabProps = {
  purposeTemplate: PurposeTemplate
}

export const ConsumerPurposeTemplateLinkedEServiceTab: React.FC<
  ConsumerPurposeTemplateLinkedEServiceTabProps
> = ({ purposeTemplate }) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'read.linkedEservicesTab' })
  const { t: tCommon } = useTranslation('common')

  const topSideActions: Array<ActionItemButton> = [
    {
      action: () => {},
      label: tCommon('actions.edit'),
      variant: 'contained',
      icon: EditIcon,
    },
  ]

  const descriptionLabel = t(
    'description'
  ) /** TODO: TO FIX DESCRIPTION UNDER THE BUTTON USING BOX? */
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
