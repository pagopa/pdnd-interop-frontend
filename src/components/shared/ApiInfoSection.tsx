import React from 'react'
import { useTranslation } from 'react-i18next'
import { SectionContainer, SectionContainerSkeleton } from '../layout/containers'
import { Link, type SkeletonProps, Stack, Typography } from '@mui/material'
import { useNavigateRouter } from '@/router'
import { InformationContainer } from '@pagopa/interop-fe-commons'

type ApiInfoSectionProps = {
  ids: Array<{ name: string; id: string }>
}

export const ApiInfoSection: React.FC<ApiInfoSectionProps> = ({ ids }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'apiInfoSection',
  })
  const { navigate } = useNavigateRouter()

  const handleLinkNavigation = () => {
    navigate('SUBSCRIBE_INTEROP_M2M')
  }
  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        <Typography variant="body2">
          {t('content')}{' '}
          <Link variant="body2" onClick={handleLinkNavigation}>
            {t('link')}
          </Link>
        </Typography>
        {ids.map((element, index) => (
          <InformationContainer
            key={index}
            content={element.id}
            copyToClipboard={{ value: element.id }}
            direction="column"
            label={element.name}
          />
        ))}
      </Stack>
    </SectionContainer>
  )
}

export const ApiInfoSectionSkeleton: React.FC<SkeletonProps> = (props) => {
  return <SectionContainerSkeleton variant="rectangular" height={500} {...props} />
}
