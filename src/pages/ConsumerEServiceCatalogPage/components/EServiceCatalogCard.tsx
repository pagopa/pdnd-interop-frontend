import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { PartyAvatar } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { catalogCardStyles, skeletonStyles } from '../style/eserviceCatalogCardStyle'
import type { CatalogEService } from '@/api/api.generatedTypes'
import { commonTitleTextStyle, commonDescTextStyle } from '../style/commonStyle'
import { EServiceCatalogCardActionButton } from './EServiceCatalogCardActionButton'

export const EServiceCatalogCard: React.FC<{
  eservice: CatalogEService
  disabled: boolean
  avatarUrl?: string
  prefetchFn: () => void
}> = ({ eservice, disabled, prefetchFn, avatarUrl }) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice')

  return (
    <Card sx={{ ...catalogCardStyles.card, opacity: disabled ? 0.5 : 1 }}>
      <CardHeader
        sx={catalogCardStyles.header}
        disableTypography
        title={
          <Box sx={catalogCardStyles.headerBox}>
            <PartyAvatar customSrc={avatarUrl} customAlt={eservice.producer.name} />
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
          <Typography color="text.primary" sx={commonTitleTextStyle} component="h2">
            {eservice.name}
          </Typography>
          <Typography variant="body1" color="text.primary" sx={commonDescTextStyle}>
            {eservice.description}
          </Typography>
        </Stack>
      </CardContent>
      <Box sx={{ minHeight: 6.5 }} />
      <CardActions sx={catalogCardStyles.actions}>
        <EServiceCatalogCardActionButton
          prefetchFn={prefetchFn}
          disabled={disabled}
          to="SUBSCRIBE_CATALOG_VIEW"
          params={{
            eserviceId: eservice.id,
            descriptorId: eservice.activeDescriptor?.id ?? '',
          }}
          buttonLabel={tCommon('actions.inspectEService')}
          tooltipTitle={t('list.disabledTooltip')}
        />
      </CardActions>
    </Card>
  )
}

export const EServiceCatalogCardSkeleton: React.FC = () => (
  <Skeleton sx={skeletonStyles} variant="rectangular" />
)
