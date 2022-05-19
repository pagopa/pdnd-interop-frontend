import React, { useContext } from 'react'
import { EServiceFlatReadType, EServiceReadType } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { DialogContext, PartyContext } from '../lib/context'
import { canSubscribe } from '../lib/attributes'
import { isAdmin } from '../lib/auth-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { Box } from '@mui/system'
import { EServiceContentInfo } from '../components/Shared/EServiceContentInfo'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import {
  decorateEServiceWithActiveDescriptor,
  getEserviceAndDescriptorFromUrl,
} from '../lib/eservice-utils'
import { useLocation } from 'react-router-dom'
import { NotFound } from './NotFound'
import { useRoute } from '../hooks/useRoute'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledLink } from '../components/Shared/StyledLink'
import { buildDynamicPath } from '../lib/router-utils'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function EServiceRead() {
  const { t } = useTranslation(['eservice', 'common'])
  const { runAction } = useFeedback()
  const { routes } = useRoute()
  const { party } = useContext(PartyContext)
  const { setDialog } = useContext(DialogContext)

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
    { path: { endpoint: 'ESERVICE_GET_LIST_FLAT' }, config: { params: { callerId: party?.id } } },
    { mapFn: (list) => list.find((d) => d.id === eserviceId && d.descriptorId === descriptorId) }
  )

  const canSubscribeEservice =
    party && data && canSubscribe(party.attributes, data.attributes.certified)
  const isMine = data?.producer.id === party?.id
  const isVersionPublished = data?.activeDescriptor?.state === 'PUBLISHED'

  const handleSubscriptionDialog = () => {
    if (!data) {
      return
    }

    const subscribe = async () => {
      const agreementData = {
        eserviceId: data.id,
        descriptorId: data.activeDescriptor?.id,
        consumerId: party?.id,
      }

      await runAction(
        { path: { endpoint: 'AGREEMENT_CREATE' }, config: { data: agreementData } },
        { onSuccessDestination: routes.SUBSCRIBE_AGREEMENT_LIST }
      )
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
      close: () => {
        setDialog(null)
      },
    })
  }

  if (error) {
    return <NotFound errorType="serverError" />
  }

  const isLoading = isEServiceLoading || isFlatEServiceLoading

  return (
    <React.Fragment>
      <StyledIntro isLoading={isLoading}>
        {{ title: data?.name, description: data?.description }}
      </StyledIntro>

      {data ? (
        <React.Fragment>
          {flatData && flatData.callerSubscribed && isAdmin(party) && (
            <DescriptionBlock label={t('read.alreadySubscribedField.label')}>
              <StyledLink
                to={buildDynamicPath(routes.SUBSCRIBE_AGREEMENT_EDIT.PATH, {
                  agreementId: flatData.callerSubscribed as string,
                })}
              >
                {t('read.alreadySubscribedField.link.label')}
              </StyledLink>
            </DescriptionBlock>
          )}
          <EServiceContentInfo data={data} />

          {isMine && (
            <Alert sx={{ mb: 1 }} severity="info">
              {t('read.alert.youAreTheProvider')}
            </Alert>
          )}
          {!canSubscribeEservice && (
            <Alert sx={{ mb: 1 }} severity="info">
              {t('read.alert.missingCertifiedAttributes')}
            </Alert>
          )}
          {flatData?.callerSubscribed && (
            <Alert sx={{ mb: 1 }} severity="info">
              {t('read.alert.alreadySubscribed')}
            </Alert>
          )}

          <Box sx={{ display: 'flex' }}>
            {isVersionPublished &&
              !isMine &&
              canSubscribeEservice &&
              !flatData?.callerSubscribed &&
              isAdmin(party) && (
                <StyledButton sx={{ mr: 2 }} variant="contained" onClick={handleSubscriptionDialog}>
                  {t('actions.subscribe', { ns: 'common' })}
                </StyledButton>
              )}
            {/* TEMP PIN-612 */}
            {/* {!isMine && isAdmin(party) && !canSubscribeEservice && (
          <StyledButton
            sx={{ mr: 2 }}
            variant="contained"
            onClick={() => {
              setDialog({ type: 'askExtension' })
            }}
          >
            Richiedi estensione
          </StyledButton>
        )} */}

            <StyledButton variant="outlined" to={routes.SUBSCRIBE_CATALOG_LIST.PATH}>
              {t('read.actions.backToCatalogLabel')}
            </StyledButton>
          </Box>
        </React.Fragment>
      ) : (
        <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
      )}
    </React.Fragment>
  )
}
