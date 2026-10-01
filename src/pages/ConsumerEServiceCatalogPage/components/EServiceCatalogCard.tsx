import { AVATAR_BASEPATH } from '@/config/env'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { PartyAvatar, MIButton } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@/router'
import React from 'react'
import { EServiceStackedCatalogCard } from './EServiceStackedCatalogCard'
import { catalogCardStyles, skeletonStyles } from '../style/eserviceCatalogCardStyle'
import type { CatalogEService } from '@/api/api.generatedTypes'
import {
  commonTitleTextStyle,
  commonDescTextStyle,
  commonButtonTextStyle,
} from '../style/commonStyle'
export const EServiceCatalogCard: React.FC<{
  eservice: CatalogEService
  disabled: boolean
  prefetchFn: () => void
  isCollection?: boolean // isCollection istrue for the collection of eservices instantiated from an eService template
}> = ({ eservice, disabled, prefetchFn, isCollection }) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice')
  const navigate = useNavigate()

  const avatarUrl = eservice.producer.selfcareId
    ? `${AVATAR_BASEPATH}/institutions/${eservice.producer.selfcareId}/logo.png`
    : undefined

  const handleInspectClick = () => {
    navigate('SUBSCRIBE_CATALOG_VIEW', {
      params: {
        eserviceId: eservice.id,
        descriptorId: eservice.activeDescriptor?.id ?? '',
      },
    })
  }

  if (isCollection) {
    return (
      <EServiceStackedCatalogCard
        eservice={eservice}
        disabled={disabled}
        prefetchFn={prefetchFn}
        onInspectClick={handleInspectClick}
        disabledTooltip={t('list.disabledTooltip')}
        collectionBadgeLabel={t('list.collectionBadge', { count: 78 })} //TODO: in the second release remove hardcoded value
        collectionCtaLabel={t('list.inspectCollection')}
      />
    )
  }

  return (
    <Card sx={catalogCardStyles.card}>
      <CardHeader
        sx={catalogCardStyles.header}
        disableTypography
        title={
          <Box sx={catalogCardStyles.headerBox}>
            <PartyAvatar customSrc={avatarUrl} customAlt="partyLogo" />
            <Box sx={{ display: 'grid', gap: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={catalogCardStyles.producerText}
              >
                {eservice.producer.name}
              </Typography>
            </Box>
          </Box>
        }
      />
      <CardContent sx={catalogCardStyles.content}>
        <Stack direction="column" spacing={1}>
          <Typography color="text.primary" sx={commonTitleTextStyle}>
            {eservice.name}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={commonDescTextStyle}>
            {eservice.description}
          </Typography>
        </Stack>
      </CardContent>
      <Box sx={{ minHeight: 6.5 }} />
      <CardActions sx={catalogCardStyles.actions}>
        <Stack direction="row" spacing={2} sx={{ maxWidth: '100%', width: 'auto' }}>
          <Tooltip
            title={disabled ? t('list.disabledTooltip') : ''}
            arrow
            disableHoverListener={!disabled}
          >
            <span style={{ display: 'block' }}>
              <MIButton
                size="small"
                variant="text"
                onFocus={prefetchFn}
                onClick={handleInspectClick}
                color="primary"
                disabled={disabled}
                sx={commonButtonTextStyle}
              >
                {tCommon('actions.inspectEService')}
              </MIButton>
            </span>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  )
}

export const EServiceCatalogCardSkeleton: React.FC = () => (
  <Skeleton sx={skeletonStyles} variant="rectangular" />
)
