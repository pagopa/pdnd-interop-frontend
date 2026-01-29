import React from 'react'
import type { RouteKey, useParams } from '@/router'
import { Link } from '@/router'
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
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
  avatarURL: string
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
        minHeight: 410,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <CardHeader
        sx={{ p: 3, pb: 0 }}
        disableTypography={true}
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src={avatarURL} alt={producerName} sx={{ bgcolor: 'background.default' }}>
              <AccountBalanceIcon sx={{ color: '#bdbdbd' }} fontSize="small" />
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {producerName}
            </Typography>
          </Stack>
        }
      />
      <CardContent sx={{ alignItems: 'start' }}>
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

      <CardActions sx={{ justifyContent: 'end', alignItems: 'end', flex: 1 }}>
        <Stack direction="row" spacing={2}>
          <Tooltip open={disabled ? undefined : false} title={t('list.disabledTooltip')} arrow>
            <span>
              <Link
                as="button"
                size="small"
                variant="contained"
                to={to}
                params={params}
                onFocusVisible={prefetchFn}
                color="primary"
                disabled={disabled}
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
  return <Skeleton sx={{ borderRadius: 2 }} variant="rectangular" height={410} />
}
