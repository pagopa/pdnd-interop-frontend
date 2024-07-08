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
import React from 'react'
import { useTranslation } from 'react-i18next'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import type { CatalogEService } from '@/api/api.generatedTypes'
import { Link } from '@tanstack/react-router'
import { RouterButton } from '@/components/shared/RouterButton'

interface CatalogCardProps {
  eservice: CatalogEService
}

export const CatalogCard: React.FC<CatalogCardProps> = ({ eservice }) => {
  const { t: tCommon } = useTranslation('common')
  // const prefetchEService = EServiceQueries.usePrefetchDescriptorCatalog()

  // const handlePrefetch = () => {
  //   prefetchEService(eservice.id, eservice.activeDescriptor?.id ?? '')
  // }

  return (
    <Card
      elevation={8}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 410,
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
          <RouterButton
            size="small"
            variant="contained"
            to="/fruizione/catalogo-e-service/$eserviceId/$descriptorId"
            params={{
              eserviceId: eservice.id,
              descriptorId: eservice.activeDescriptor?.id ?? '',
            }}
            color="primary"
          >
            {tCommon('actions.inspect')}
          </RouterButton>
        </Stack>
      </CardActions>
    </Card>
  )
}

export const CatalogCardSkeleton = () => {
  return <Skeleton sx={{ borderRadius: 2 }} variant="rectangular" height={410} />
}
