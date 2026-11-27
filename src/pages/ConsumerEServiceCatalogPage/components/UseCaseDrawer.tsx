import type { CatalogEService, CatalogUseCase } from '@/api/api.generatedTypes'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import React from 'react'
import { EServiceCatalogCard } from './EServiceCatalogCard'
import { PREFETCH_STALE_TIME, SH_ESERVICES_TO_HIDE_TEMP } from '@/config/constants'
import { AVATAR_BASEPATH, STAGE } from '@/config/env'
import { useQueryClient } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import { Stack, Typography, useTheme } from '@mui/material'
import { MIButton } from '@pagopa/mui-italia'
import { TempNextDrawer } from '@/components/shared/TempNextDrawer'
import { useTranslation } from 'react-i18next'

type UseCaseDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  useCase: CatalogUseCase
}

const UseCaseDrawer: React.FC<UseCaseDrawerProps> = ({ isOpen, onClose, useCase }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'featuredList.useCases.drawer' })
  const { name, description, slug, unsubscribedEservices, subscribedEservices } = useCase

  const theme = useTheme()

  const queryClient = useQueryClient()

  const handlePrefetch = (eservice: CatalogEService) => {
    if (!eservice.activeDescriptor) return
    queryClient.prefetchQuery({
      ...EServiceQueries.getDescriptorCatalog(eservice.id, eservice.activeDescriptor.id),
      staleTime: PREFETCH_STALE_TIME,
    })
  }

  return (
    <TempNextDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={name}
      subtitle={description}
      sxPaper={{ bgcolor: theme.colors.neutral.grey[50] }}
    >
      <Stack spacing={3}>
        <MIButton
          variant="text" // TODO change when mui italia updates
          endIcon={<LaunchOutlinedIcon />}
          key="action1"
          href={slug}
          rel="noreferrer"
          aria-label={t('readButtonAriaLabel')}
          sx={{ alignSelf: 'flex-start' }}
        >
          {t('readButtonLabel')}
        </MIButton>
        {unsubscribedEservices && unsubscribedEservices.length > 0 && (
          <>
            <Typography variant="body1" fontWeight={600}>
              {t('useCaseEServicesTitle')}
            </Typography>
            {unsubscribedEservices.map((eservice) => (
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
            ))}
          </>
        )}
        {subscribedEservices && subscribedEservices.length > 0 && (
          <>
            <Typography variant="body1" fontWeight={600}>
              {t('useCaseSubscribedEServicesTitle')}
            </Typography>
            {subscribedEservices.map((eservice) => (
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
            ))}
          </>
        )}
      </Stack>
    </TempNextDrawer>
  )
}

export default UseCaseDrawer
