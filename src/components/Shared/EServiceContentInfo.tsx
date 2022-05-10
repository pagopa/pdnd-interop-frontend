import { Box, Chip, Typography } from '@mui/material'
import { AxiosResponse } from 'axios'
import has from 'lodash/has'
import React, { FunctionComponent } from 'react'
import {
  AttributeKey,
  BackendAttribute,
  EServiceDescriptorRead,
  EServiceReadType,
  GroupBackendAttribute,
  SingleBackendAttribute,
} from '../../../types'
import { ATTRIBUTE_TYPE_PLURAL_LABEL, ESERVICE_STATE_LABEL } from '../../config/labels'
import { RunActionOutput, useFeedback } from '../../hooks/useFeedback'
import { useRoute } from '../../hooks/useRoute'
import { secondsToHoursMinutes } from '../../lib/format-utils'
import { downloadFile } from '../../lib/file-utils'
import { buildDynamicPath } from '../../lib/router-utils'
import { DescriptionBlock } from '../DescriptionBlock'
import { ResourceList } from './ResourceList'
import { StyledAccordion } from './StyledAccordion'
import { StyledLink } from './StyledLink'
import sortBy from 'lodash/sortBy'
import { formatThousands } from '../../lib/format-utils'

type EServiceContentInfoProps = {
  data: EServiceReadType
}

export const EServiceContentInfo: FunctionComponent<EServiceContentInfoProps> = ({ data }) => {
  const { runAction } = useFeedback()
  const { routes } = useRoute()
  const activeDescriptor = data.activeDescriptor as EServiceDescriptorRead

  // Get all documents actual URL
  const wrapDownloadDocument = (documentId: string) => async () => {
    const { response, outcome } = (await runAction(
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
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      downloadFile((response as AxiosResponse).data, 'document')
    }
  }

  const getVerificationRequiredStringMaybe = (
    explicitAttributeVerification: boolean,
    attributeKey: AttributeKey
  ) => {
    return explicitAttributeVerification && attributeKey === 'verified'
      ? ' (verifica richiesta)'
      : ''
  }

  const toAccordionEntries = (attributes: Array<BackendAttribute>, attributeKey: AttributeKey) => {
    return attributes.map((attribute) => {
      const isSingle = has(attribute, 'single')

      const labels = isSingle
        ? [(attribute as SingleBackendAttribute).single]
        : (attribute as GroupBackendAttribute).group

      let summary = ''
      let details: string | JSX.Element = ''
      if (labels.length === 1) {
        const { name, description, explicitAttributeVerification } = labels[0]
        summary = `${name} ${getVerificationRequiredStringMaybe(
          explicitAttributeVerification,
          attributeKey
        )}`
        details = description
      } else {
        summary = `${labels
          .map(({ name }) => name)
          .join(' oppure ')}${getVerificationRequiredStringMaybe(
          labels[0].explicitAttributeVerification,
          attributeKey
        )}`
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

  const getFormattedVoucherLifespan = () => {
    const { hours, minutes } = secondsToHoursMinutes(activeDescriptor.voucherLifespan / 60)

    const minutesLabel = minutes !== 1 ? 'minuti' : 'minuto'
    const hoursLabel = hours !== 1 ? 'ore' : 'ora'

    if (hours === 0) {
      return `${minutes} ${minutesLabel}`
    }

    if (minutes === 0) {
      return `${hours} ${hoursLabel}`
    }

    return `${hours} ${hoursLabel} e ${minutes} ${minutesLabel}`
  }

  return (
    <React.Fragment>
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

      <DescriptionBlock label="Durata del voucher">
        <Typography component="span">{getFormattedVoucherLifespan()}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Soglia chiamate API/giorno per fruitore">
        <Typography component="span">
          {formatThousands(activeDescriptor.dailyCallsPerConsumer)} chiamate/giorno
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Soglia chiamate API/giorno totali">
        <Typography component="span">
          {formatThousands(activeDescriptor.dailyCallsTotal)} chiamate/giorno
        </Typography>
      </DescriptionBlock>

      {(Object.keys(data.attributes) as Array<AttributeKey>).map((key, i) => (
        <DescriptionBlock key={i} label={`Attributi ${ATTRIBUTE_TYPE_PLURAL_LABEL[key]}`}>
          {data.attributes[key].length > 0 ? (
            <Box sx={{ mt: 1 }}>
              <StyledAccordion entries={toAccordionEntries(data.attributes[key], key)} />
            </Box>
          ) : (
            <Typography component="span">Nessun attributo presente</Typography>
          )}
        </DescriptionBlock>
      ))}

      <DescriptionBlock label="Risorse">
        <ResourceList
          resources={[
            // TEMP PIN-1095 and PIN-1105
            // {
            //   label: 'Richiesta di fruizione',
            //   onClick: () => {
            //     console.log('download richiesta di fruizione')
            //   },
            // },
            {
              label: 'Documento di interfaccia',
              prettyName: activeDescriptor.interface.prettyName,
              onClick: wrapDownloadDocument(activeDescriptor.interface.id),
            },
            ...activeDescriptor.docs.map((d) => ({
              label: d.prettyName,
              onClick: wrapDownloadDocument(d.id),
            })),
          ]}
        />
      </DescriptionBlock>

      {Boolean(data.descriptors.length > 0) && (
        <DescriptionBlock label="Storico delle versioni">
          {sortBy(data.descriptors, 'version').map((d, i) => {
            const state = ESERVICE_STATE_LABEL[d.state]

            return (
              <Box key={i} sx={{ pb: 1 }}>
                {d.id !== data.activeDescriptor?.id ? (
                  <Box>
                    <StyledLink
                      to={buildDynamicPath(routes.PROVIDE_ESERVICE_MANAGE.PATH, {
                        eserviceId: data.id,
                        descriptorId: d.id,
                      })}
                    >
                      Versione {d.version}
                    </StyledLink>{' '}
                    <Chip size="small" label={state} />
                  </Box>
                ) : (
                  <Typography component="span">
                    Versione {d.version} <Chip size="small" label={state} color="primary" />
                  </Typography>
                )}
              </Box>
            )
          })}
        </DescriptionBlock>
      )}
    </React.Fragment>
  )
}
