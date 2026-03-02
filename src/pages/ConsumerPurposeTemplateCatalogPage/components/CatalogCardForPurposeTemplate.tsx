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
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import type { TenantKind } from '@/api/api.generatedTypes'

type CatalogRoutesKeys = Extract<RouteKey, 'SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS'>
type CatalogCardForPurposeTemplateRouteParams<TRouteKey extends RouteKey> = ReturnType<
  typeof useParams<TRouteKey>
>

interface CatalogCardForPurposeTemplateProps<TRouteKey extends CatalogRoutesKeys> {
  title: string
  description: string
  creatorName: string
  targetTenantKind: TenantKind
  avatarURL?: string
  prefetchFn: () => void
  to: TRouteKey
  params: CatalogCardForPurposeTemplateRouteParams<TRouteKey>
}

export function CatalogCardForPurposeTemplate<TRouteKey extends CatalogRoutesKeys>({
  title,
  description,
  creatorName,
  targetTenantKind,
  avatarURL,
  prefetchFn,
  to,
  params,
}: CatalogCardForPurposeTemplateProps<TRouteKey>) {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'catalogCard' })

  const targetTenantKindLabel: 'labelPA' | 'labelNotPA' =
    targetTenantKind === 'PA' ? 'labelPA' : 'labelNotPA'

  return (
    <Card
      elevation={8}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 294,
        maxWidth: 620,
      }}
    >
      <CardHeader
        sx={{ p: 3, pb: 0, fontSize: 14 }}
        disableTypography={true}
        title={t(`targetTenantKind.${targetTenantKindLabel}`)}
      />
      <CardContent sx={{ alignItems: 'start', py: 2 }}>
        <Typography variant="h6" color="text.primary" sx={{ marginBottom: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.primary" component="div">
          <p
            style={{
              WebkitLineClamp: 2,
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
        sx={{ display: 'flex', justifyContent: 'space-between', flex: 1, alignItems: 'end' }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
          <Avatar src={avatarURL} alt={creatorName} sx={{ bgcolor: 'background.default' }}>
            <AccountBalanceIcon sx={{ color: '#bdbdbd' }} fontSize="small" />
          </Avatar>
          <Stack direction="column">
            <Typography variant="caption">{t('creatorLabel')}</Typography>
            <Typography variant="caption-semibold">{creatorName}</Typography>
          </Stack>
        </Stack>
        <Link
          as="button"
          size="small"
          variant="contained"
          to={to}
          params={params}
          onFocusVisible={prefetchFn}
          color="primary"
          sx={{ minWidth: 113, minHeight: 48 }}
        >
          {tCommon('actions.inspect')}
        </Link>
      </CardActions>
    </Card>
  )
}

export const CatalogCardForPurposeTemplateSkeleton = () => {
  return <Skeleton sx={{ borderRadius: 2 }} variant="rectangular" height={294} />
}
