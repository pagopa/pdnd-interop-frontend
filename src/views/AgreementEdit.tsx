import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import has from 'lodash/has'
import {
  AgreementState,
  AgreementSummary,
  SingleBackendAttribute,
  GroupBackendAttribute,
  ActionProps,
  Party,
  ProviderOrSubscriber,
} from '../../types'
import { AGREEMENT_STATE_LABEL } from '../config/labels'
import { buildDynamicPath, getLastBit } from '../lib/router-utils'
import { formatDate, getRandomDate } from '../lib/date-utils'
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
import { Typography } from '@mui/material'
import { Contained } from '../components/Shared/Contained'
import { StyledSkeleton } from '../components/Shared/StyledSkeleton'
import { useRoute } from '../hooks/useRoute'

export function AgreementEdit() {
  const {
    runAction,
    runFakeAction,
    runActionWithDestination,
    forceRerenderCounter,
    wrapActionInDialog,
  } = useFeedback()
  const mode = useMode()
  const agreementId = getLastBit(useLocation())
  const { party } = useContext(PartyContext)
  const { routes } = useRoute()
  const { data } = useAsyncFetch<AgreementSummary>(
    {
      path: { endpoint: 'AGREEMENT_GET_SINGLE', endpointParams: { agreementId } },
    },
    {
      useEffectDeps: [forceRerenderCounter, mode],
      loadingTextLabel: "Stiamo caricando l'accordo richiesto",
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const activate = async () => {
    const { partyId } = party as Party
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_ACTIVATE',
          endpointParams: { agreementId, partyId },
        },
      },
      { suppressToast: false }
    )
  }

  const suspend = async () => {
    const { partyId } = party as Party
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_SUSPEND',
          endpointParams: { agreementId, partyId },
        },
      },
      { suppressToast: false }
    )
  }

  const upgrade = async () => {
    await runActionWithDestination(
      {
        path: { endpoint: 'AGREEMENT_UPGRADE', endpointParams: { agreementId } },
      },
      { destination: routes.SUBSCRIBE_AGREEMENT_LIST, suppressToast: false }
    )
  }

  const archive = () => {
    runFakeAction('Archivia accordo')
  }

  const wrapVerify = (attributeId: string) => async () => {
    const sureData = data as AgreementSummary
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_VERIFY_ATTRIBUTE',
          endpointParams: { agreementId: sureData.id, attributeId },
        },
      },
      { suppressToast: false }
    )
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
      ACTIVE: [
        {
          onClick: wrapActionInDialog(suspend, 'AGREEMENT_SUSPEND'),
          label: 'Sospendi',
        },
      ],
      SUSPENDED: [
        {
          onClick: wrapActionInDialog(activate, 'AGREEMENT_ACTIVATE'),
          label: 'Riattiva',
        },
      ],
      PENDING: [],
      INACTIVE: [],
    }

    const providerOnlyActions: AgreementActions = {
      ACTIVE: [],
      SUSPENDED: [{ onClick: wrapActionInDialog(archive), label: 'Archivia', isMock: true }],
      PENDING: [
        {
          onClick: wrapActionInDialog(activate, 'AGREEMENT_ACTIVATE'),
          label: 'Attiva',
        },
      ],
      INACTIVE: [],
    }

    const subscriberOnlyActionsActive: Array<ActionProps> = []
    if (
      data.eservice.activeDescriptor &&
      data.eservice.activeDescriptor.version > data.eservice.version
    ) {
      subscriberOnlyActionsActive.push({
        onClick: wrapActionInDialog(upgrade, 'AGREEMENT_UPGRADE'),
        label: 'Aggiorna',
      })
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

  const SingleAttribute = ({
    name,
    verified,
    id,
    explicitAttributeVerification,
  }: {
    name?: string | undefined
    verified: boolean | null
    id: string
    explicitAttributeVerification: boolean
  }) => {
    const randomDate = getRandomDate(new Date(2022, 0, 1), new Date(2023, 0, 1))

    const computeLabel = () => {
      if (!explicitAttributeVerification) {
        return 'verificato, nuova verifica non richiesta'
      }

      if (verified === null || typeof verified === 'undefined') {
        return 'in attesa di verifica'
      }

      return verified ? 'verificato' : 'rifiutato'
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>
          {name}, con{' '}
          <Typography component="span" className="fakeData">
            scadenza {formatDate(randomDate)}
          </Typography>
        </Typography>

        {/* display */}
        <Typography component="span">{computeLabel()}</Typography>

        {/* actions */}
        {mode === 'provider' && explicitAttributeVerification && (
          <Box sx={{ display: 'flex' }}>
            <StyledButton variant="contained" onClick={wrapVerify(id)}>
              Verifica
            </StyledButton>
            {/* <StyledButton variant="contained" onClick={wrapRefuse(id)}>
              Rifiuta
            </StyledButton> */}
          </Box>
        )}
      </Box>
    )
  }

  const agreementSuspendExplanation =
    "L'accordo può essere sospeso sia dall'erogatore che dal fruitore dell'e-service. Se almeno uno dei due attori lo sospende, inibirà l'accesso all'e-service a tutti i client associati all'e-service dal fruitore"

  if (!data) {
    return <StyledSkeleton />
  }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Accordo di interoperabilità' }}</StyledIntro>

      <DescriptionBlock label="Accordo relativo a">
        <StyledLink
          to={buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
            eserviceId: data?.eservice.id,
            descriptorId: data?.eserviceDescriptorId,
          })}
        >
          {data?.eservice.name}, versione {data?.eservice.version}
        </StyledLink>
        {mode === 'subscriber' && data?.eservice.activeDescriptor && data?.state !== 'INACTIVE' ? (
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
            ; per attivarla, aggiorna l’accordo di interoperabilità)
          </React.Fragment>
        ) : null}
      </DescriptionBlock>

      <DescriptionBlock label="Stato dell'accordo" tooltipLabel={agreementSuspendExplanation}>
        {data?.state === 'SUSPENDED' ? (
          <React.Fragment>
            <Typography component="span">
              Lato erogatore: {AGREEMENT_STATE_LABEL[getAgreementState(data, 'provider')]}
            </Typography>
            <br />
            <Typography component="span">
              Lato fruitore: {AGREEMENT_STATE_LABEL[getAgreementState(data, 'subscriber')]}
            </Typography>
          </React.Fragment>
        ) : (
          <Typography component="span">{AGREEMENT_STATE_LABEL[data?.state]}</Typography>
        )}
      </DescriptionBlock>

      <DescriptionBlock label="Attributi">
        <Contained>
          <Box sx={{ mt: 1 }}>
            {data?.attributes.length > 0 ? (
              data?.attributes.map((backendAttribute, i) => {
                let attributesToDisplay: JSX.Element | Array<JSX.Element>

                if (has(backendAttribute, 'single')) {
                  const { single } = backendAttribute as SingleBackendAttribute
                  attributesToDisplay = <SingleAttribute {...single} />
                } else {
                  const { group } = backendAttribute as GroupBackendAttribute
                  attributesToDisplay = group.map((a, j) => {
                    if (j === group.length - 1) {
                      return <SingleAttribute key={j} {...a} />
                    }

                    return (
                      <React.Fragment key={j}>
                        <SingleAttribute {...a} />
                        <em>oppure</em>
                      </React.Fragment>
                    )
                  })
                }

                return (
                  <Box
                    key={i}
                    sx={{
                      width: '100%',
                      mb: 2,
                      pb: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                    }}
                  >
                    {attributesToDisplay}
                  </Box>
                )
              })
            ) : (
              <Typography>Per questo e-service non sono stati richiesti attributi</Typography>
            )}
          </Box>
        </Contained>
      </DescriptionBlock>

      {mode === 'provider' && (
        <DescriptionBlock label="Ente fruitore">
          <Typography component="span">{data?.consumer.name}</Typography>
        </DescriptionBlock>
      )}

      <Box sx={{ mt: 4, display: 'flex' }}>
        {getAvailableActions().map(({ onClick, label }, i) => (
          <StyledButton
            sx={{ mr: 2 }}
            variant={i === 0 ? 'contained' : 'outlined'}
            key={i}
            onClick={onClick}
          >
            {label}
          </StyledButton>
        ))}
      </Box>
    </React.Fragment>
  )
}
