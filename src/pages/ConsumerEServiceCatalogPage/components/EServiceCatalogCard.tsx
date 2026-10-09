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
  avatarUrl?: string
  prefetchFn: () => void
}> = ({ eservice, disabled, prefetchFn, avatarUrl }) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice')
  const navigate = useNavigate()

  const handleInspectClick = () => {
    //TODO: in the second release, handle navigation differently for collections
    navigate('SUBSCRIBE_CATALOG_VIEW', {
      params: {
        eserviceId: eservice.id,
        descriptorId: eservice.activeDescriptor?.id ?? '',
      },
    })
  }

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
        <Stack direction="row" spacing={2} sx={{ maxWidth: '100%', width: 'auto' }}>
          <Tooltip
            title={disabled ? t('list.disabledTooltip') : ''}
            arrow
            disableHoverListener={!disabled}
          >
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
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  )
}

export const EServiceCatalogCardSkeleton: React.FC = () => (
  <Skeleton sx={skeletonStyles} variant="rectangular" />
)
