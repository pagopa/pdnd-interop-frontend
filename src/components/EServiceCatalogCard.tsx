import type { CatalogEService } from '@/api/api.generatedTypes'
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

export const EServiceCatalogCard: React.FC<{
  eservice: CatalogEService
  disabled: boolean
  prefetchFn: () => void
}> = ({ eservice, disabled, prefetchFn }) => {
  const avatarUrl = eservice.producer.selfcareId
    ? `${AVATAR_BASEPATH}/institutions/${eservice.producer.selfcareId}/logo.png`
    : undefined

  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice')

  const navigate = useNavigate()
  const handleInspectClick = () => {
    navigate('SUBSCRIBE_CATALOG_VIEW', {
      params: {
        eserviceId: eservice.id,
        descriptorId: eservice.activeDescriptor?.id ?? '',
      },
    })
  }

  return (
    <Card
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto auto minmax(53px, 1fr) auto',
        height: '100%',
        borderRadius: '8px',
        maxHeight: 'fit-content',
      }}
    >
      <CardHeader
        sx={{ px: 3, pt: 3, pb: 0 }}
        disableTypography
        title={
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 1.5,
              alignItems: 'center',
            }}
          >
            <PartyAvatar customSrc={avatarUrl} customAlt="partyLogo" />
            <Box sx={{ display: 'grid', gap: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  lineHeight: 2,
                  fontWeight: 400,
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-word',
                }}
              >
                {eservice.producer.name}
              </Typography>
            </Box>
          </Box>
        }
      />
      <CardContent sx={{ px: 3, py: 2 }}>
        <Stack direction="column" spacing={1}>
          <Typography
            color="text.primary"
            sx={{
              lineHeight: 1.2,
              fontWeight: 700,
              fontSize: '24px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {eservice.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: { xs: 2, sm: 3 },
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {eservice.description}
          </Typography>
        </Stack>
      </CardContent>
      <Box sx={{ minHeight: 6.5 }} />
      <CardActions
        sx={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          px: 3,
          pb: 2.5,
          pt: 0,
        }}
      >
        <Stack direction="row" spacing={2} sx={{ maxWidth: '100%', width: 'auto' }}>
          <Tooltip open={disabled ? undefined : false} title={t('list.disabledTooltip')} arrow>
            <span style={{ display: 'block' }}>
              <MIButton
                size="small"
                variant="text"
                onFocus={prefetchFn}
                onClick={handleInspectClick}
                color="primary"
                disabled={disabled}
                sx={{
                  width: '100%',
                  fontSize: '16px',
                }}
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

export const EServiceCatalogCardSkeleton = () => {
  return (
    <Skeleton
      sx={{
        borderRadius: 1,
        height: '100%',
        minHeight: 295,
      }}
      variant="rectangular"
    />
  )
}
