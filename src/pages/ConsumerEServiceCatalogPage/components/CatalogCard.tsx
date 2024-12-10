import { EServiceQueries } from '@/api/eservice'
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
import type { CatalogEService } from '@/api/api.generatedTypes'
import { useQueryClient } from '@tanstack/react-query'

interface CatalogCardProps {
  eservice: CatalogEService
  disabled?: boolean
}

export const CatalogCard: React.FC<CatalogCardProps> = ({ eservice, disabled }) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice')
  const queryClient = useQueryClient()

  const handlePrefetch = () => {
    if (!eservice.activeDescriptor) return
    queryClient.prefetchQuery(
      EServiceQueries.getDescriptorCatalog(eservice.id, eservice.activeDescriptor.id)
    )
  }

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
            <Avatar sx={{ bgcolor: 'background.default' }}>
              <AccountBalanceIcon sx={{ color: '#bdbdbd' }} fontSize="small" />
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {eservice.producer.name}
            </Typography>
          </Stack>
        }
      />
      <CardContent sx={{ alignItems: 'start' }}>
        <Typography variant="h6" color="text.primary" sx={{ marginBottom: 1 }}>
          {eservice.name}
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
            {eservice.description}
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
                to="SUBSCRIBE_CATALOG_VIEW"
                params={{
                  eserviceId: eservice.id,
                  descriptorId: eservice.activeDescriptor?.id ?? '',
                }}
                onFocusVisible={handlePrefetch}
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
