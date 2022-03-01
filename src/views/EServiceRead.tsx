import React, { useContext } from 'react'
import { EServiceReadType } from '../../types'
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
import { StyledSkeleton } from '../components/Shared/StyledSkeleton'
import { NotFound } from './NotFound'
import { useRoute } from '../hooks/useRoute'

export function EServiceRead() {
  const { runActionWithDestination } = useFeedback()
  const { routes } = useRoute()
  const { party } = useContext(PartyContext)
  const { setDialog } = useContext(DialogContext)

  const location = useLocation()
  const { eserviceId, descriptorId } = getEserviceAndDescriptorFromUrl(location)
  const { data, error } = useAsyncFetch<EServiceReadType>(
    {
      path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } },
    },
    {
      mapFn: decorateEServiceWithActiveDescriptor(descriptorId),
      loadingTextLabel: 'Stiamo caricando il tuo e-service',
    }
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

      await runActionWithDestination(
        { path: { endpoint: 'AGREEMENT_CREATE' }, config: { data: agreementData } },
        { destination: routes.SUBSCRIBE_AGREEMENT_LIST, suppressToast: false }
      )
    }

    setDialog({
      type: 'basic',
      proceedCallback: subscribe,
      proceedLabel: 'Iscriviti',
      title: 'Richiesta di fruizione',
      description: `Stai per inoltrare una richiesta di fruizione per l'e-service ${data.name}, versione ${data.activeDescriptor?.version}`,
      close: () => {
        setDialog(null)
      },
    })
  }

  if (!data) {
    return <StyledSkeleton />
  }

  if (error) {
    return <NotFound errorType="server-error" />
  }

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: data?.name,
          description: `${data?.description}\n${
            party?.id === data?.producer.id ? "Nota: sei l'erogatore di questo e-service" : ''
          }`,
        }}
      </StyledIntro>

      {data && <EServiceContentInfo data={data} />}

      <Box sx={{ display: 'flex' }}>
        {isVersionPublished && !isMine && isAdmin(party) && canSubscribeEservice && (
          <StyledButton sx={{ mr: 2 }} variant="contained" onClick={handleSubscriptionDialog}>
            Iscriviti
          </StyledButton>
        )}
        {!isMine && isAdmin(party) && !canSubscribeEservice && (
          <StyledButton
            className="mockFeature"
            sx={{ mr: 2 }}
            variant="contained"
            onClick={() => {
              setDialog({ type: 'askExtension' })
            }}
          >
            Richiedi estensione
          </StyledButton>
        )}
        <StyledButton variant="outlined" to={routes.SUBSCRIBE_CATALOG_LIST.PATH}>
          Torna al catalogo
        </StyledButton>
      </Box>
    </React.Fragment>
  )
}
