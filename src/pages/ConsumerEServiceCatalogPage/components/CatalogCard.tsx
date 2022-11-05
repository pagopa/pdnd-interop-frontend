import { EServiceQueries } from '@/api/eservice'
import { ActionMenu } from '@/components/shared/ActionMenu'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { useNavigateRouter } from '@/router'
import { EServiceFlatten } from '@/types/eservice.types'
import { Card, CardActions, CardContent, Skeleton, Stack, Typography } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { OwnerTooltip } from './OwnerTooltip'

interface CatalogCardProps {
  eservice: EServiceFlatten
}

export const CatalogCard: React.FC<CatalogCardProps> = ({ eservice }) => {
  const { t } = useTranslation('common')
  const { navigate } = useNavigateRouter()
  const prefetchEService = EServiceQueries.usePrefetchSingle()

  const { actions, canCreateAgreementDraft, isMine } = useGetEServiceConsumerActions(
    eservice.id,
    eservice.descriptorId
  )

  const handleInpect = () => {
    if (!eservice?.descriptorId) return
    navigate('SUBSCRIBE_CATALOG_VIEW', {
      params: {
        eserviceId: eservice.id,
        descriptorId: eservice.descriptorId,
      },
    })
  }

  const handlePrefetch = () => {
    if (!eservice?.descriptorId) return
    prefetchEService(eservice.id, eservice.descriptorId)
  }

  return (
    <Card sx={{ height: '100%' }}>
      <Stack justifyContent="space-between" sx={{ height: '100%' }}>
        <CardContent>
          <Stack direction="row" alignItems="center">
            <Typography component="span">
              {eservice.name}, v. {eservice.version}
            </Typography>{' '}
            <OwnerTooltip
              eservice={eservice}
              canCreateAgreementDraft={canCreateAgreementDraft}
              isMine={isMine}
            />
          </Stack>

          <Typography color="text.secondary">{eservice.producerName}</Typography>
          <br />
          <Typography color="text.secondary">{eservice.description}</Typography>
        </CardContent>

        <CardActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <ButtonNaked
            onFocusVisible={handlePrefetch}
            size="medium"
            color="primary"
            onClick={handleInpect}
          >
            <span onPointerEnter={handlePrefetch}>{t('actions.inspect')}</span>
          </ButtonNaked>

          <ActionMenu actions={actions} />
        </CardActions>
      </Stack>
    </Card>
  )
}

export const CatalogCardSkeleton = () => {
  return <Skeleton sx={{ borderRadius: 2 }} variant="rectangular" height={250} />
}
