import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import {
  AttributeKey,
  BackendAttribute,
  DialogSubscribeProps,
  EServiceDescriptorRead,
  EServiceReadType,
  EserviceSubscribeFormInputValues,
  GroupBackendAttribute,
  ProviderOrSubscriber,
  SingleBackendAttribute,
} from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useMode } from '../hooks/useMode'
import { DialogContext, PartyContext } from '../lib/context'
import { minutesToHHMMSS } from '../lib/date-utils'
import { canSubscribe } from '../lib/attributes'
import { isAdmin } from '../lib/auth-utils'
import { downloadFile } from '../lib/file-utils'
import { AxiosResponse } from 'axios'
import { StyledAccordion } from '../components/Shared/StyledAccordion'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { Skeleton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { FileDownloadOutlined as FileDownloadOutlinedIcon } from '@mui/icons-material'
import { ATTRIBUTE_TYPE_PLURAL_LABEL, ESERVICE_STATE_LABEL } from '../config/labels'
import { ROUTES } from '../config/routes'
import { Contained } from '../components/Shared/Contained'
import { object, boolean } from 'yup'
import { isTrue } from '../lib/validation-config'

type EServiceReadProps = {
  data: EServiceReadType
  isLoading: boolean
}

export function EServiceRead({ data, isLoading }: EServiceReadProps) {
  const { runAction, runActionWithDestination } = useFeedback()
  const { party } = useContext(PartyContext)
  const { setDialog } = useContext(DialogContext)
  const mode = useMode()
  const currentMode = mode as ProviderOrSubscriber
  const activeDescriptor = data.activeDescriptor as EServiceDescriptorRead

  const DESCRIPTIONS = {
    provider: "Nota: questa versione dell'e-service non è più modificabile",
    subscriber: `${
      party?.partyId === data.producer.id ? "Nota: sei l'erogatore di questo e-service" : ''
    }`,
  }

  // Get all documents actual URL
  const wrapDownloadDocument = (documentId: string) => async () => {
    const { response, outcome } = await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DOWNLOAD_DOCUMENT',
          endpointParams: {
            eserviceId: data.id,
            descriptorId: activeDescriptor.id,
            documentId,
          },
        },
      },
      { suppressToast: true }
    )

    if (outcome === 'success') {
      downloadFile((response as AxiosResponse).data, 'document')
    }
  }

  if (isEmpty(data) || !party) {
    return null
  }

  const canSubscribeEservice = canSubscribe(party.attributes, data.attributes.certified)
  const isMine = data.producer.id === party?.partyId
  const isVersionPublished = data.activeDescriptor?.state === 'PUBLISHED'

  const toAccordionEntries = (attributes: Array<BackendAttribute>) => {
    return attributes.map((attribute) => {
      const isSingle = has(attribute, 'single')

      const labels = isSingle
        ? [(attribute as SingleBackendAttribute).single]
        : (attribute as GroupBackendAttribute).group

      let summary = ''
      let details: string | JSX.Element = ''
      if (labels.length === 1) {
        const { name, description, explicitAttributeVerification } = labels[0]
        summary = `${name} ${explicitAttributeVerification ? ' (verifica richiesta)' : ''}`
        details = description
      } else {
        summary = `${labels.map(({ name }) => name).join(' oppure ')}${
          labels[0].explicitAttributeVerification ? ' (verifica richiesta)' : ''
        }`
        details = (
          <React.Fragment>
            {labels.map((label, i) => {
              return (
                <Box sx={{ mb: i !== labels.length - 1 ? 2 : 0 }} key={i}>
                  <Typography component="span" sx={{ fontWeight: 700 }}>
                    {label.name}
                  </Typography>
                  : {label.description}
                </Box>
              )
            })}
          </React.Fragment>
        )
      }

      return { summary, details }
    })
  }

  const handleSubscriptionDialog = () => {
    const subscribe = async () => {
      const agreementData = {
        eserviceId: data.id,
        descriptorId: data.activeDescriptor?.id,
        consumerId: party?.partyId,
      }

      await runActionWithDestination(
        { path: { endpoint: 'AGREEMENT_CREATE' }, config: { data: agreementData } },
        { destination: ROUTES.SUBSCRIBE_AGREEMENT_LIST, suppressToast: false }
      )
    }

    const eserviceSubscribeFormInitialValues: EserviceSubscribeFormInputValues = {
      agreementHandle: { confirm: false },
    }
    const eserviceSubscribeFormValidationSchema = object({
      agreementHandle: object({
        confirm: boolean().test('value', 'La checkbox deve essere spuntata', isTrue),
      }),
    })

    setDialog({
      type: 'subscribe',
      onSubmit: subscribe,
      initialValues: eserviceSubscribeFormInitialValues,
      validationSchema: eserviceSubscribeFormValidationSchema,
    } as DialogSubscribeProps)
  }

  if (isLoading) {
    return <Skeleton height={400} />
  }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: data.name, description: DESCRIPTIONS[currentMode] }}</StyledIntro>

      <DescriptionBlock label="Descrizione dell'e-service">
        <Typography component="span">{data.description}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Ente erogatore">
        <Typography component="span">{data.producer.name}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Versione">
        <Typography component="span">{activeDescriptor.version}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Stato della versione">
        <Typography component="span">{ESERVICE_STATE_LABEL[activeDescriptor.state]}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Audience">
        <Typography component="span">{activeDescriptor.audience.join(', ')}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Tecnologia">
        <Typography component="span">{data.technology}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Durata del voucher dall'attivazione">
        <Typography component="span">
          {minutesToHHMMSS(activeDescriptor.voucherLifespan)} (hh:mm:ss)
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Richiesta di fruizione">
        <a className="fakeData" href="#0" target="_blank">
          Scarica
        </a>
      </DescriptionBlock>

      {activeDescriptor.interface && (
        <DescriptionBlock label="Interfaccia">
          <StyledButton onClick={wrapDownloadDocument(activeDescriptor.interface.id)}>
            <Typography component="span">Scarica il documento di interfaccia</Typography>
          </StyledButton>
        </DescriptionBlock>
      )}

      {Boolean(activeDescriptor.docs.length > 0) && (
        <DescriptionBlock label="Documentazione">
          {activeDescriptor.docs.map((d, i) => (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: 1,
                borderColor: 'divider',
                mt: i === 0 ? 2 : 0,
              }}
              key={i}
            >
              <Box sx={{ py: 1, my: 1 }}>
                <strong>{d.name}</strong>
                {d.description !== 'undefined' && (
                  <React.Fragment>
                    <br />
                    <Typography sx={{ display: 'inline-block', mt: 1, mb: 1 }}>
                      {decodeURIComponent(d.description)}
                    </Typography>
                  </React.Fragment>
                )}
              </Box>
              <StyledButton onClick={wrapDownloadDocument(d.id)}>
                <FileDownloadOutlinedIcon fontSize="small" sx={{ mr: 1 }} color="primary" />
              </StyledButton>
            </Box>
          ))}
        </DescriptionBlock>
      )}

      {(Object.keys(data.attributes) as Array<AttributeKey>).map((key, i) => (
        <DescriptionBlock key={i} label={`Attributi ${ATTRIBUTE_TYPE_PLURAL_LABEL[key]}`}>
          <Contained>
            {data.attributes[key].length > 0 ? (
              <Box sx={{ mt: 1 }}>
                <StyledAccordion entries={toAccordionEntries(data.attributes[key])} />
              </Box>
            ) : (
              <Typography component="span">Nessun attributo presente</Typography>
            )}
          </Contained>
        </DescriptionBlock>
      ))}

      {mode === 'subscriber' && (
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
          <StyledButton variant="outlined" to={ROUTES.SUBSCRIBE_CATALOG_LIST.PATH}>
            Torna al catalogo
          </StyledButton>
        </Box>
      )}
    </React.Fragment>
  )
}
