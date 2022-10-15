import React, { useContext } from 'react'
import { CertifiedAttribute, EServiceFlatReadType, EServiceReadType } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { DialogContext } from '../lib/context'
import { canSubscribe } from '../lib/attributes'
import { RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { EServiceContentInfo } from '../components/Shared/EServiceContentInfo'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import {
  decorateEServiceWithActiveDescriptor,
  getEserviceAndDescriptorFromUrl,
} from '../lib/eservice-utils'
import { useHistory, useLocation } from 'react-router-dom'
import { NotFound } from './NotFound'
import { useRoute } from '../hooks/useRoute'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { Alert, Box, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { AxiosResponse } from 'axios'
import { MAX_WIDTH } from '../lib/constants'
import { buildDynamicPath } from '../lib/router-utils'

export function EServiceRead() {
  const { t } = useTranslation(['eservice', 'common'])
  const { runAction } = useFeedback()
  const { routes } = useRoute()
  const { jwt, isAdmin } = useJwt()
  const { setDialog } = useContext(DialogContext)
  const history = useHistory()

  const location = useLocation()
  const { eserviceId, descriptorId } = getEserviceAndDescriptorFromUrl(location)
  const {
    data,
    error,
    isLoading: isEServiceLoading,
  } = useAsyncFetch<EServiceReadType>(
    { path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } } },
    { mapFn: decorateEServiceWithActiveDescriptor(descriptorId) }
  )

  const { data: flatData, isLoading: isFlatEServiceLoading } = useAsyncFetch<
    Array<EServiceFlatReadType>,
    EServiceFlatReadType | undefined
  >(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { params: { callerId: jwt?.organization.id } },
    },
    { mapFn: (list) => list.find((d) => d.id === eserviceId && d.descriptorId === descriptorId) }
  )

  const { data: currentInstitutionCertifiedAttributes } = useAsyncFetch<
    { attributes: Array<CertifiedAttribute> },
    Array<CertifiedAttribute>
  >(
    {
      path: {
        endpoint: 'ATTRIBUTE_GET_CERTIFIED_LIST',
        endpointParams: { institutionId: jwt?.organization.id },
      },
    },
    { mapFn: (data) => data.attributes }
  )

  const isMine = data?.producer.id === jwt?.organization.id

  function checkIfCanSubscribeEservice() {
    if (isMine) {
      return true
    }

    if (data && currentInstitutionCertifiedAttributes) {
      return canSubscribe(currentInstitutionCertifiedAttributes || [], data.attributes.certified)
    }

    return false
  }

  const canSubscribeEservice = checkIfCanSubscribeEservice()
  const isVersionPublished = data?.activeDescriptor?.state === 'PUBLISHED'

  const handleSubscriptionDialog = () => {
    if (!data) {
      return
    }

    const subscribe = async () => {
      const agreementData = {
        eserviceId: data.id,
        descriptorId: data.activeDescriptor?.id,
      }

      const { outcome: draftCreateOutcome, response: draftCreateResponse } = (await runAction(
        { path: { endpoint: 'AGREEMENT_DRAFT_CREATE' }, config: { data: agreementData } },
        { suppressToast: ['success'] }
      )) as RunActionOutput

      if (draftCreateOutcome === 'success') {
        history.push(
          buildDynamicPath(routes.SUBSCRIBE_AGREEMENT_EDIT.PATH, {
            agreementId: (draftCreateResponse as AxiosResponse).data.id,
          })
        )
      }
    }

    setDialog({
      type: 'basic',
      proceedCallback: subscribe,
      proceedLabel: t('read.agreementDialog.proceedLabel'),
      title: t('read.agreementDialog.title'),
      description: t('read.agreementDialog.description', {
        name: data.name,
        version: data.activeDescriptor?.version,
      }),
    })
  }

  if (error) {
    return <NotFound errorType="serverError" />
  }

  const isLoading = isEServiceLoading || isFlatEServiceLoading
  const isSubscribed =
    flatData && flatData?.agreement && flatData.agreement.state !== 'DRAFT' && isAdmin
  const hasDraft =
    flatData && flatData.agreement && flatData?.agreement.state === 'DRAFT' && isAdmin

  const canBeSubscribed =
    isVersionPublished && canSubscribeEservice && !flatData?.agreement && isAdmin

  return (
    <Box sx={{ maxWidth: MAX_WIDTH }}>
      <Stack direction="row" spacing={2}>
        <StyledIntro sx={{ flex: 1 }} isLoading={isLoading}>
          {{ title: data?.name, description: data?.description }}
        </StyledIntro>
        {!isLoading && canBeSubscribed && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <StyledButton variant="outlined" onClick={handleSubscriptionDialog}>
              {t('actions.subscribe', { ns: 'common' })}
            </StyledButton>
          </Stack>
        )}
      </Stack>

      <Stack spacing={2}>
        {isMine && <Alert severity="info">{t('read.alert.youAreTheProvider')}</Alert>}
        {!canSubscribeEservice && (
          <Alert severity="info">{t('read.alert.missingCertifiedAttributes')}</Alert>
        )}
        {isSubscribed && <Alert severity="info">{t('read.alert.alreadySubscribed')}</Alert>}
        {hasDraft && <Alert severity="info">{t('read.alert.hasDraft')}</Alert>}
      </Stack>

      {data && descriptorId ? (
        <React.Fragment>
          <EServiceContentInfo
            data={data}
            descriptorId={descriptorId}
            agreement={flatData?.agreement}
            context="subscriber"
          />

          <PageBottomActions>
            <StyledButton variant="outlined" to={routes.SUBSCRIBE_CATALOG_LIST.PATH}>
              {t('read.actions.backToCatalogLabel')}
            </StyledButton>
          </PageBottomActions>
        </React.Fragment>
      ) : (
        <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
      )}
    </Box>
  )
}
