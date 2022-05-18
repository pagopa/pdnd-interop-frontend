import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import {
  AgreementState,
  AgreementSummary,
  ActionProps,
  Party,
  ProviderOrSubscriber,
  BackendAttributeContent,
} from '../../types'
import { buildDynamicPath, getLastBit } from '../lib/router-utils'
// import { formatDate, getRandomDate } from '../lib/date-utils'
import { mergeActions } from '../lib/eservice-utils'
import { useMode } from '../hooks/useMode'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { PartyContext } from '../lib/context'
import { getAgreementState } from '../lib/status-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledLink } from '../components/Shared/StyledLink'
import { Box } from '@mui/system'
import { Grid, Typography } from '@mui/material'
import { useRoute } from '../hooks/useRoute'
import { StyledAccordion } from '../components/Shared/StyledAccordion'
import { formatDateString } from '../lib/format-utils'
import { InfoMessage } from '../components/Shared/InfoMessage'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { NotFound } from './NotFound'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'

export function AgreementEdit() {
  const { t } = useTranslation('common')
  const { runAction, forceRerenderCounter } = useFeedback()
  const mode = useMode()
  const agreementId = getLastBit(useLocation())
  const { party } = useContext(PartyContext)
  const { routes } = useRoute()
  const { data, error, isLoading } = useAsyncFetch<AgreementSummary>(
    { path: { endpoint: 'AGREEMENT_GET_SINGLE', endpointParams: { agreementId } } },
    { useEffectDeps: [forceRerenderCounter, mode] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const activate = async () => {
    const { id: partyId } = party as Party
    await runAction(
      {
        path: { endpoint: 'AGREEMENT_ACTIVATE', endpointParams: { agreementId, partyId } },
      },
      { showConfirmDialog: true }
    )
  }

  const suspend = async () => {
    const { id: partyId } = party as Party
    await runAction(
      { path: { endpoint: 'AGREEMENT_SUSPEND', endpointParams: { agreementId, partyId } } },
      { showConfirmDialog: true }
    )
  }

  const upgrade = async () => {
    await runAction(
      { path: { endpoint: 'AGREEMENT_UPGRADE', endpointParams: { agreementId } } },
      { onSuccessDestination: routes.SUBSCRIBE_AGREEMENT_LIST }
    )
  }

  // TEMP PIN-217
  // const archive = () => {
  //   //
  // }

  const wrapVerify = (attributeId: string) => async () => {
    const sureData = data as AgreementSummary
    await runAction({
      path: {
        endpoint: 'AGREEMENT_VERIFY_ATTRIBUTE',
        endpointParams: { agreementId: sureData.id, attributeId },
      },
    })
  }
  /*
   * End list of actions
   */

  type AgreementActions = Record<AgreementState, Array<ActionProps>>
  // Build list of available actions for each agreement in its current state
  const getAvailableActions = () => {
    if (!data) {
      return []
    }

    const sharedActions: AgreementActions = {
      ACTIVE: [{ onClick: suspend, label: 'Sospendi' }],
      SUSPENDED: [{ onClick: activate, label: 'Riattiva' }],
      PENDING: [],
      INACTIVE: [],
    }

    const providerOnlyActions: AgreementActions = {
      ACTIVE: [],
      SUSPENDED: [], // [{ onClick: archive, label: 'Archivia' }],
      PENDING: [{ onClick: activate, label: 'Attiva' }],
      INACTIVE: [],
    }

    const subscriberOnlyActionsActive: Array<ActionProps> = []
    if (
      data.eservice.activeDescriptor &&
      data.eservice.activeDescriptor.version > data.eservice.version
    ) {
      subscriberOnlyActionsActive.push({ onClick: upgrade, label: 'Aggiorna' })
    }

    const subscriberOnlyActions: AgreementActions = {
      ACTIVE: subscriberOnlyActionsActive,
      SUSPENDED: [],
      PENDING: [],
      INACTIVE: [],
    }

    const currentMode = mode as ProviderOrSubscriber
    const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
      currentMode
    ]

    const status = data ? getAgreementState(data, mode) : 'SUSPENDED'

    return mergeActions<AgreementActions>([currentActions, sharedActions], status)
  }

  const checkVerifiedStatus = (
    verified: boolean | undefined,
    explicitAttributeVerification: boolean
  ) => {
    if (!explicitAttributeVerification) {
      return 'Verificato, nuova verifica non richiesta'
    }

    if (typeof verified === 'undefined') {
      return 'In attesa di verifica'
    }

    return verified ? 'Verificato' : 'Rifiutato'
  }

  const SubscriberAttributes = () => {
    return (
      <Box>
        {data?.attributes.map((backendAttribute, i) => {
          const attributes: Array<BackendAttributeContent> =
            'single' in backendAttribute ? [backendAttribute.single] : backendAttribute.group
          const entries = attributes.map((a) => {
            return {
              summary: a.name,
              summarySecondary: checkVerifiedStatus(a.verified, a.explicitAttributeVerification),
              details: (
                <React.Fragment>
                  {a.verificationDate && (
                    <DescriptionBlock label="Data di verifica">
                      {formatDateString(a.verificationDate)}
                    </DescriptionBlock>
                  )}
                  <DescriptionBlock label="Fonte autoritativa">{a.origin}</DescriptionBlock>
                  <DescriptionBlock label="Descrizione">{a.description}</DescriptionBlock>
                </React.Fragment>
              ),
            }
          })

          return (
            <Box key={i} sx={{ mt: 1, mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
              {Boolean(entries.length > 1) && (
                <InfoMessage
                  sx={{ mb: 2 }}
                  label="l’intero gruppo seguente è verificato se lo è almeno uno degli attributi che lo compongono"
                />
              )}
              <StyledAccordion entries={entries} />
            </Box>
          )
        })}
      </Box>
    )
  }

  const ProviderAttributes = () => {
    return (
      <Box>
        {data?.attributes.map((backendAttribute, i) => {
          const attributes: Array<BackendAttributeContent> =
            'single' in backendAttribute ? [backendAttribute.single] : backendAttribute.group

          return (
            <Box key={i} sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
              {Boolean(attributes.length > 1) && (
                <InfoMessage
                  sx={{ mb: 2 }}
                  label="l’intero gruppo seguente è verificato se lo è almeno uno degli attributi che lo compongono"
                />
              )}
              {attributes.map((a, i) => {
                return (
                  <Grid container key={i} sx={{ mb: 1 }} alignItems="center">
                    <Grid item xs={4}>
                      <Typography>{a.name}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">
                        {checkVerifiedStatus(a.verified, a.explicitAttributeVerification)}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <StyledButton variant="outlined" size="small" onClick={wrapVerify(a.id)}>
                        Verifica
                        {typeof a.verified !== 'undefined' ? ' nuovamente' : ''}
                      </StyledButton>
                    </Grid>
                  </Grid>
                )
              })}
            </Box>
          )
        })}
      </Box>
    )
  }

  const agreementSuspendExplanation =
    "La richiesta può essere sospesa sia dall'Erogatore che dal Fruitore. Se almeno uno dei due attori la sospende, inibirà l'accesso all'E-Service per tutte le finalità associate all'E-Service dal Fruitore"

  if (error) {
    return <NotFound errorType="server-error" />
  }

  return (
    <React.Fragment>
      <StyledIntro isLoading={isLoading}>
        {{ title: 'Gestisci richiesta di fruizione' }}
      </StyledIntro>

      {data ? (
        <React.Fragment>
          <DescriptionBlock label="Richiesta relativa a">
            <StyledLink
              to={buildDynamicPath(
                mode === 'subscriber'
                  ? routes.SUBSCRIBE_CATALOG_VIEW.PATH
                  : routes.PROVIDE_ESERVICE_MANAGE.PATH,
                {
                  eserviceId: data?.eservice.id,
                  descriptorId: data?.eserviceDescriptorId,
                }
              )}
            >
              {data?.eservice.name}, versione {data?.eservice.version}
            </StyledLink>
            {mode === 'subscriber' &&
            data?.eservice.activeDescriptor &&
            data?.state !== 'INACTIVE' ? (
              <React.Fragment>
                {' '}
                (è disponibile una{' '}
                <StyledLink
                  to={buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
                    eserviceId: data?.eservice.id,
                    descriptorId: data?.eservice.activeDescriptor.id,
                  })}
                >
                  versione più recente
                </StyledLink>
                ; per attivarla, aggiorna la richiesta di fruizione)
              </React.Fragment>
            ) : null}
          </DescriptionBlock>

          {mode === 'provider' && (
            <DescriptionBlock label="Ente fruitore">
              <Typography component="span">{data?.consumer.name}</Typography>
            </DescriptionBlock>
          )}

          <DescriptionBlock
            label="Stato della richiesta"
            tooltipLabel={data?.state !== 'PENDING' ? agreementSuspendExplanation : undefined}
          >
            {data?.state === 'SUSPENDED' ? (
              <React.Fragment>
                <Typography component="span">
                  Lato erogatore: {t(`status.agreement.${getAgreementState(data, 'provider')}`)}
                </Typography>
                <br />
                <Typography component="span">
                  Lato fruitore: {t(`status.agreement.${getAgreementState(data, 'subscriber')}`)}
                </Typography>
              </React.Fragment>
            ) : (
              <Typography component="span">{t(`status.agreement.${data.state}`)}</Typography>
            )}
          </DescriptionBlock>

          <DescriptionBlock label="Attributi verificati">
            {data.attributes.length > 0 ? (
              mode === 'provider' ? (
                <ProviderAttributes />
              ) : (
                <SubscriberAttributes />
              )
            ) : (
              <Typography>Per questo E-Service non sono richiesti attributi</Typography>
            )}
          </DescriptionBlock>

          <PageBottomActions>
            {getAvailableActions().map(({ onClick, label }, i) => (
              <StyledButton variant={i === 0 ? 'contained' : 'outlined'} key={i} onClick={onClick}>
                {label}
              </StyledButton>
            ))}
          </PageBottomActions>
        </React.Fragment>
      ) : (
        <LoadingWithMessage
          label="Stiamo caricando la richiesta di fruizione"
          transparentBackground
        />
      )}
    </React.Fragment>
  )
}
