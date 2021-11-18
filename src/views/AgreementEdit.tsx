import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import has from 'lodash/has'
import {
  AgreementStatus,
  AgreementSummary,
  SingleBackendAttribute,
  GroupBackendAttribute,
  ActionProps,
  Party,
  ProviderOrSubscriber,
} from '../../types'
import { ROUTES } from '../config/routes'
import { AGREEMENT_STATUS_LABEL } from '../config/labels'
import { buildDynamicPath, getLastBit } from '../lib/router-utils'
import { formatDate, getRandomDate } from '../lib/date-utils'
import { mergeActions } from '../lib/eservice-utils'
import { useMode } from '../hooks/useMode'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { PartyContext } from '../lib/context'
import { getAgreementStatus } from '../lib/status-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledLink } from '../components/Shared/StyledLink'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { Contained } from '../components/Shared/Contained'

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
      { destination: ROUTES.SUBSCRIBE_AGREEMENT_LIST, suppressToast: false }
    )
  }

  const archive = () => {
    runFakeAction('Archivia accordo')
  }

  const wrapVerify = (attributeId: string) => async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_VERIFY_ATTRIBUTE',
          endpointParams: { agreementId: data.id, attributeId },
        },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  type AgreementActions = { [key in AgreementStatus]: ActionProps[] }
  // Build list of available actions for each agreement in its current state
  const getAvailableActions = () => {
    if (!data) {
      return []
    }

    const sharedActions: AgreementActions = {
      active: [
        {
          onClick: wrapActionInDialog(suspend, 'AGREEMENT_SUSPEND'),
          label: 'Sospendi',
        },
      ],
      suspended: [
        {
          onClick: wrapActionInDialog(activate, 'AGREEMENT_ACTIVATE'),
          label: 'Riattiva',
        },
      ],
      pending: [],
      inactive: [],
    }

    const providerOnlyActions: AgreementActions = {
      active: [],
      pending: [
        {
          onClick: wrapActionInDialog(activate, 'AGREEMENT_ACTIVATE'),
          label: 'Attiva',
        },
      ],
      suspended: [{ onClick: wrapActionInDialog(archive), label: 'Archivia', isMock: true }],
      inactive: [],
    }

    const subscriberOnlyActionsActive: ActionProps[] = []
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
      active: subscriberOnlyActionsActive,
      suspended: [],
      pending: [],
      inactive: [],
    }

    const currentMode = mode as ProviderOrSubscriber
    const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
      currentMode
    ]

    const status = data ? getAgreementStatus(data, mode) : 'suspended'

    return mergeActions<AgreementActions>([currentActions, sharedActions], status)
  }

  const SingleAttribute = ({
    name,
    verified,
    id,
  }: {
    name?: string | undefined
    verified?: boolean
    id: string
  }) => {
    const randomDate = getRandomDate(new Date(2022, 0, 1), new Date(2023, 0, 1))

    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>
          {name}, con{' '}
          <Typography component="span" className="fakeData">
            scadenza {formatDate(randomDate)}
          </Typography>
        </Typography>

        {typeof verified === 'boolean' ? (
          verified ? (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1, color: 'primary.main' }}>
              <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" color="primary" />
              <Typography component="span">verificato</Typography>
            </Box>
          ) : (
            <Typography component="span">rifiutato dall’erogatore</Typography>
          )
        ) : mode === 'provider' ? (
          <StyledButton variant="contained" onClick={wrapVerify(id)}>
            Verifica
          </StyledButton>
        ) : (
          <Typography component="span">in attesa di verifica</Typography>
        )}
      </Box>
    )
  }

  const agreementSuspendExplanation =
    "L'accordo può essere sospeso sia dall'erogatore che dal fruitore dell'e-service. Se almeno uno dei due attori lo sospende, inibirà l'accesso all'e-service a tutti i client associati all'e-service dal fruitore"

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Accordo di interoperabilità' }}</StyledIntro>

      <DescriptionBlock label="Accordo relativo a">
        <StyledLink
          to={buildDynamicPath(ROUTES.SUBSCRIBE_CATALOG_VIEW.PATH, {
            eserviceId: data?.eservice.id,
            descriptorId: data?.eserviceDescriptorId,
          })}
        >
          {data?.eservice.name}, versione {data?.eservice.version}
        </StyledLink>
        {mode === 'subscriber' && data?.eservice.activeDescriptor && data?.status !== 'inactive' ? (
          <React.Fragment>
            {' '}
            (è disponibile una{' '}
            <StyledLink
              to={buildDynamicPath(ROUTES.SUBSCRIBE_CATALOG_VIEW.PATH, {
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
        {data?.status === 'suspended' ? (
          <React.Fragment>
            <Typography component="span">
              Lato erogatore: {AGREEMENT_STATUS_LABEL[getAgreementStatus(data, 'provider')]}
            </Typography>
            <br />
            <Typography component="span">
              Lato fruitore: {AGREEMENT_STATUS_LABEL[getAgreementStatus(data, 'subscriber')]}
            </Typography>
          </React.Fragment>
        ) : (
          <Typography component="span">{AGREEMENT_STATUS_LABEL[data?.status]}</Typography>
        )}
      </DescriptionBlock>

      <DescriptionBlock label="Attributi">
        <Contained>
          <Box sx={{ mt: 1 }}>
            {data?.attributes.length > 0 ? (
              data?.attributes.map((backendAttribute, i) => {
                let attributesToDisplay: any

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
