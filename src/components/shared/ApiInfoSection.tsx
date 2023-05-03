import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { SectionContainer, SectionContainerSkeleton } from '../layout/containers'
import { type SkeletonProps, Stack, Typography } from '@mui/material'
import { RouterLink } from '@/router'
import { InformationContainer } from '@pagopa/interop-fe-commons'

type ApiInfoSectionProps = {
  ids: Array<{ name: string; id: string }>
}

export const ApiInfoSection: React.FC<ApiInfoSectionProps> = ({ ids }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'apiInfoSection',
  })

  return (
    <SectionContainer
      title={t('title')}
      description={
        <Trans components={{ 1: <RouterLink to="SUBSCRIBE_INTEROP_M2M" /> }}>{t('content')}</Trans>
      }
    >
      {ids.map((element, index) => (
        <InformationContainer
          key={index}
          content={element.id}
          copyToClipboard={{ value: element.id, tooltipTitle: t('tooltipTitle') }}
          direction="column"
          label={element.name}
        />
      ))}
    </SectionContainer>
  )
}

export const ApiInfoSectionSkeleton: React.FC<SkeletonProps> = (props) => {
  return <SectionContainerSkeleton variant="rectangular" height={500} {...props} />
}
