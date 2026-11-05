import type { CatalogEService } from '@/api/api.generatedTypes'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import React from 'react'
import { EServiceCatalogCard } from './EServiceCatalogCard'
import { PREFETCH_STALE_TIME, SH_ESERVICES_TO_HIDE_TEMP } from '@/config/constants'
import { AVATAR_BASEPATH, STAGE } from '@/config/env'
import { useQueryClient } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import { Stack, Typography } from '@mui/material'
import { MIButton } from '@pagopa/mui-italia'
import { TempNextDrawer } from '@/components/shared/TempNextDrawer'
import type { UseCase } from '@/types/useCase.types'
import { useTranslation } from 'react-i18next'

type UseCaseDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  useCase: UseCase
}

const UseCaseDrawer: React.FC<UseCaseDrawerProps> = ({ isOpen, onClose, useCase }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'featuredList.useCases.drawer' })
  const { name, description, slug, eserviceIds } = useCase

  const queryClient = useQueryClient()

  const handlePrefetch = (eservice: CatalogEService) => {
    if (!eservice.activeDescriptor) return
    queryClient.prefetchQuery({
      ...EServiceQueries.getDescriptorCatalog(eservice.id, eservice.activeDescriptor.id),
      staleTime: PREFETCH_STALE_TIME,
    })
  }

  return (
    <TempNextDrawer isOpen={isOpen} onClose={onClose} title={name} subtitle={description}>
      <Stack spacing={3}>
        <MIButton
          variant="text"
          endIcon={<LaunchOutlinedIcon />}
          key="action1"
          href={slug}
          rel="noreferrer"
          aria-label={t('readButtonAriaLabel')}
          sx={{ alignSelf: 'flex-start' }}
        >
          {t('readButtonLabel')}
        </MIButton>
        <Typography variant="body1" fontWeight={600}>
          {t('useCaseEServicesTitle')}
        </Typography>
        {/* {useCase.eserviceIds.map((eservice) => (
          <EServiceCatalogCard
            key={eservice.activeDescriptor?.id}
            eservice={eservice}
            disabled={!!SH_ESERVICES_TO_HIDE_TEMP[STAGE]?.includes(eservice.id)}
            prefetchFn={() => handlePrefetch(eservice)}
            avatarUrl={
              eservice.producer.selfcareId
                ? `${AVATAR_BASEPATH}/institutions/${eservice.producer.selfcareId}/logo.png`
                : undefined
            }
          />
        ))} */}
        <Typography variant="body1" fontWeight={600}>
          {t('useCaseSubscribedEServicesTitle')}
        </Typography>
      </Stack>
    </TempNextDrawer>
  )
}

export default UseCaseDrawer
