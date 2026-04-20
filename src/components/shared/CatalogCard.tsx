import React from 'react'
import type { RouteKey, useParams } from '@/router'
import { Link } from '@/router'
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

type CatalogRoutesKeys = Extract<
  RouteKey,
  'SUBSCRIBE_CATALOG_VIEW' | 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS'
>
type CatalogCardRouteParams<TRouteKey extends RouteKey> = ReturnType<typeof useParams<TRouteKey>>

interface CatalogCardProps<TRouteKey extends CatalogRoutesKeys> {
  title: string
  description: string
  producerName: string
  avatarURL?: string
  prefetchFn: () => void
  to: TRouteKey
  params: CatalogCardRouteParams<TRouteKey>
  disabled?: boolean
}

export function CatalogCard<TRouteKey extends CatalogRoutesKeys>({
  title,
  description,
  disabled,
  producerName,
  avatarURL,
  prefetchFn,
  to,
  params,
}: CatalogCardProps<TRouteKey>) {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice')

  return (
    <Card
      elevation={8}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: { xs: 'auto', sm: 410 },
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Box
        sx={{
          p: { xs: 1, sm: 3 },
          pb: { xs: 1, sm: 0 },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Avatar
          src={avatarURL}
          alt={producerName}
          sx={{ bgcolor: 'background.default', flexShrink: 0 }}
        >
          <AccountBalanceIcon sx={{ color: '#bdbdbd' }} fontSize="small" />
        </Avatar>
        <Typography variant="caption" color="text.secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ligula sapien, congue eu odio
          vel, condimentum efficitur neque. Suspendisse interdum metus eget ligula mattis, eu
          finibus urna viverra. Nulla rutrum sem sem, ac egestas nisi rutrum eu. Mauris ultricies at
          erat vel efficitur. Ut venenatis tellus eget sapien rhoncus bibendum non luctus urna.
          Curabitur fermentum suscipit dolor sagittis vulputate. Maecenas ante metus, finibus ut
          ipsum cursus, consectetur euismod velit. Nulla vel eleifend nibh. In vel justo quis leo
          consequat mattis. Cras ac iaculis lorem, sed malesuada odio. Vivamus sem massa, rutrum
          eget ullamcorper a, ullamcorper eu sapien. Duis iaculis magna non neque tincidunt gravida.
          Mauris in ligula nulla. Vivamus ac dapibus massa. Donec id felis nec nunc semper congue.
          Mauris eu dolor quis neque imperdiet sollicitudin et congue ante. Integer cursus porta
          sem. Nullam iaculis rhoncus erat sit amet semper. Morbi vulputate venenatis ipsum, luctus
          finibus orci ultricies vitae.
        </Typography>
      </Box>

      <CardContent sx={{ alignItems: 'start', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" color="text.primary" sx={{ marginBottom: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.primary" component="div">
          <p
            style={{
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              display: '-webkit-box',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          alignItems: 'center',
          p: { xs: 2, sm: 3 },
          pt: 0,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ maxWidth: '100%', width: { xs: '100%', sm: 'auto' } }}
        >
          <Tooltip open={disabled ? undefined : false} title={t('list.disabledTooltip')} arrow>
            <span style={{ display: 'block' }}>
              <Link
                as="button"
                size="small"
                variant="contained"
                to={to}
                params={params}
                onFocusVisible={prefetchFn}
                color="primary"
                disabled={disabled}
                sx={{
                  width: '100%',
                }}
              >
                {tCommon('actions.inspect')}
              </Link>
            </span>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  )
}

export const CatalogCardSkeleton = () => {
  return (
    <Skeleton
      sx={{
        borderRadius: 2,
        height: '100%',
        minHeight: { xs: 200, sm: 410 },
      }}
      variant="rectangular"
    />
  )
}
