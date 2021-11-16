import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import {
  AttributeKey,
  BackendAttribute,
  EServiceFlatReadType,
  EServiceReadType,
  GroupBackendAttribute,
  SingleBackendAttribute,
} from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useMode } from '../hooks/useMode'
import { PartyContext } from '../lib/context'
import { minutesToHHMMSS } from '../lib/date-utils'
import { canSubscribe } from '../lib/attributes'
import { isAdmin } from '../lib/auth-utils'
import { useSubscribeDialog } from '../hooks/useSubscribeDialog'
import { useExtensionDialog } from '../hooks/useExtensionDialog'
import { downloadFile } from '../lib/file-utils'
import { AxiosResponse } from 'axios'
import { StyledAccordion } from '../components/Shared/StyledAccordion'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledLink } from '../components/Shared/StyledLink'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { FileDownloadOutlined as FileDownloadOutlinedIcon } from '@mui/icons-material'
import { ATTRIBUTE_TYPE_PLURAL_LABEL, ESERVICE_STATUS_LABEL } from '../config/labels'
import { ROUTES } from '../config/routes'
import { Contained } from '../components/Shared/Contained'

type EServiceReadProps = {
  data: EServiceReadType
}

export function EServiceRead({ data }: EServiceReadProps) {
  const { runAction } = useFeedback()
  const { party } = useContext(PartyContext)
  const mode = useMode()

  const DESCRIPTIONS = {
    provider: "Nota: questa versione dell'e-service non è più modificabile",
    subscriber: `${
      party?.partyId === data.producer.id ? "Nota: sei l'erogatore di questo e-service" : ''
    }`,
  }

  /*
   * List of possible actions for the user to perform
   */
  const { openDialog: openSubscribeDialog } = useSubscribeDialog()
  const { openDialog: openExtensionDialog } = useExtensionDialog()
  /*
   * End list of actions
   */

  // Get all documents actual URL
  const wrapDownloadDocument = (documentId: string) => async (e: any) => {
    const { response, outcome } = await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DOWNLOAD_DOCUMENT',
          endpointParams: {
            eserviceId: data.id,
            descriptorId: data.activeDescriptor!.id,
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

  if (isEmpty(data)) {
    return null
  }

  const canSubscribeEservice = canSubscribe(party?.attributes, data.attributes.certified)
  const isMine = data.producer.id === party?.partyId
  const isVersionPublished = data.activeDescriptor?.status === 'published'

  const toAccordionEntries = (attributes: BackendAttribute[]) => {
    return attributes.map((attribute) => {
      const isSingle = has(attribute, 'single')

      const labels = isSingle
        ? [(attribute as SingleBackendAttribute).single!]
        : (attribute as GroupBackendAttribute).group!

      let summary = ''
      let details: string | JSX.Element = ''
      if (labels.length === 1) {
        const { name, description, explicitAttributeVerification } = labels[0]
        summary = `${name} ${explicitAttributeVerification ? ' (verifica richiesta)' : ''}`
        details = description!
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
    const flatEService: EServiceFlatReadType = {
      name: data.name,
      id: data.id,
      producerId: data.producer.id,
      producerName: data.producer.name,
      certifiedAttributes: data.attributes.certified,
    }

    openSubscribeDialog(flatEService)
  }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: data.name, description: DESCRIPTIONS[mode!] }}</StyledIntro>

      <DescriptionBlock label="Descrizione dell'e-service">
        <Typography component="span">{data.description}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Ente erogatore">
        <Typography component="span">{data.producer.name}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Versione">
        <Typography component="span">{data.activeDescriptor!.version}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Stato della versione">
        <Typography component="span">
          {ESERVICE_STATUS_LABEL[data.activeDescriptor!.status]}
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Audience">
        <Typography component="span">{data.activeDescriptor!.audience.join(', ')}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Tecnologia">
        <Typography component="span">{data.technology}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="PoP (Proof of Possession)">
        <Typography component="span" className="fakeData">
          Non richiesta
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Durata del voucher dall'attivazione">
        <Typography component="span">
          {minutesToHHMMSS(data.activeDescriptor!.voucherLifespan)} (hh:mm:ss)
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Accordo di interoperabilità">
        <a className="fakeData" href="#0" target="_blank">
          Scarica
        </a>
      </DescriptionBlock>

      {data.activeDescriptor!.interface && (
        <DescriptionBlock label="Interfaccia">
          <StyledLink
            component="button"
            onClick={wrapDownloadDocument(data.activeDescriptor!.interface!.id)}
          >
            <Typography component="span">Scarica il documento di interfaccia</Typography>
          </StyledLink>
        </DescriptionBlock>
      )}

      {data.activeDescriptor!.docs.length > 0 && (
        <DescriptionBlock label="Documentazione">
          {data.activeDescriptor!.docs.map((d, i) => (
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
              <StyledLink component="button" onClick={wrapDownloadDocument(d.id)}>
                <FileDownloadOutlinedIcon fontSize="small" sx={{ mr: 1 }} color="primary" />
              </StyledLink>
            </Box>
          ))}
        </DescriptionBlock>
      )}

      {(Object.keys(data.attributes) as AttributeKey[]).map((key, i) => (
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
              onClick={openExtensionDialog}
            >
              Richiedi estensione
            </StyledButton>
          )}
          <StyledButton
            variant="outlined"
            component={StyledLink}
            to={ROUTES.SUBSCRIBE_CATALOG_LIST.PATH}
          >
            Torna al catalogo
          </StyledButton>
        </Box>
      )}
    </React.Fragment>
  )
}
