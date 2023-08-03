import { EServiceQueries } from '@/api/eservice'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { EServiceDetails, EServiceDetailsSkeleton } from '@/components/shared/EServiceDetails'
import { Link, useParams } from '@/router'
import { formatTopSideActions } from '@/utils/common.utils'
import { Alert } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'

const ProviderEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()

  const { data: descriptor, isLoading: isLoadingDescriptor } =
    EServiceQueries.useGetDescriptorProvider(eserviceId, descriptorId, { suspense: false })

  const { actions } = useGetProviderEServiceActions(
    descriptor?.eservice.id,
    descriptor?.state,
    descriptor?.id,
    descriptor?.eservice.draftDescriptor?.id
  )

  const topSideActions = formatTopSideActions(actions)

  return (
    <PageContainer
      title={descriptor?.eservice.name || ''}
      description={descriptor?.eservice?.description}
      topSideActions={topSideActions}
      isLoading={isLoadingDescriptor}
    >
      {descriptor && (
        <>
          <HasDraftDescriptorAlert descriptor={descriptor} />
          <EServiceDetails descriptor={descriptor} />
        </>
      )}
      {(!descriptor || isLoadingDescriptor) && <EServiceDetailsSkeleton />}

      <PageBottomActionsContainer>
        <Link as="button" to="PROVIDE_ESERVICE_LIST" variant="outlined">
          {t('read.actions.backToListLabel')}
        </Link>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

const HasDraftDescriptorAlert: React.FC<{ descriptor: ProducerEServiceDescriptor }> = ({
  descriptor,
}) => {
  const { t } = useTranslation('eservice')
  const { isAdmin } = AuthHooks.useJwt()

  if (!descriptor.eservice.draftDescriptor || !isAdmin) return null

  return (
    <Alert sx={{ mt: 2 }} severity="info">
      <Trans
        components={{
          1: (
            <Link
              to="PROVIDE_ESERVICE_EDIT"
              params={{
                eserviceId: descriptor.eservice.id,
                descriptorId: descriptor.eservice.draftDescriptor.id,
              }}
              state={{ stepIndexDestination: 1 }}
            />
          ),
        }}
      >
        {t('read.alert.hasNewVersionDraft')}
      </Trans>
    </Alert>
  )
}

export default ProviderEServiceDetailsPage
