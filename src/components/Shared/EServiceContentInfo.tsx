import { Box, Chip, Grid, Typography } from '@mui/material'
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
import { useTranslation } from 'react-i18next'

type EServiceContentInfoProps = {
  data: EServiceReadType
}

export const EServiceContentInfo: FunctionComponent<EServiceContentInfoProps> = ({ data }) => {
  const { t } = useTranslation('attribute')
  const { runAction } = useFeedback()
  const { routes } = useRoute()
  const activeDescriptor = data.activeDescriptor as EServiceDescriptorRead

  // Get all documents actual URL
  const wrapDownloadDocument = (documentId: string, filename: string) => async () => {
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
        config: { responseType: 'arraybuffer' },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      downloadFile((response as AxiosResponse).data, filename)
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

      let summary: string | JSX.Element
      let details: string | JSX.Element = ''
      if (labels.length === 1) {
        const { name, description, explicitAttributeVerification } = labels[0]
        summary = `${name} ${getVerificationRequiredStringMaybe(
          explicitAttributeVerification,
          attributeKey
        )}`

        details = description
      } else {
        const summaryComponent = labels.map(({ name }, i) => {
          if (i < labels.length - 1) {
            return (
              <React.Fragment key={i}>
                {name}{' '}
                <Typography component="span" fontWeight={600}>
                  oppure
                </Typography>{' '}
              </React.Fragment>
            )
          }

          return name
        })

        summary = (
          <React.Fragment>
            {summaryComponent}{' '}
            {getVerificationRequiredStringMaybe(
              labels[0].explicitAttributeVerification,
              attributeKey
            )}
          </React.Fragment>
        )

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
    const { hours, minutes } = secondsToHoursMinutes(activeDescriptor.voucherLifespan)

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
        <Typography component="span">{t(`status.eservice.${activeDescriptor.state}`)}</Typography>
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
        <DescriptionBlock key={i} label={`Attributi ${t(`type.${key}`, { count: 2 })}`}>
          {data.attributes[key].length > 0 ? (
            <Grid container sx={{ mt: 1 }}>
              <Grid item xs={8}>
                <StyledAccordion entries={toAccordionEntries(data.attributes[key], key)} />
              </Grid>
            </Grid>
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
              label: activeDescriptor.interface.prettyName,
              onClick: wrapDownloadDocument(
                activeDescriptor.interface.id,
                activeDescriptor.interface.name
              ),
            },
            ...activeDescriptor.docs.map((d) => ({
              label: d.prettyName,
              onClick: wrapDownloadDocument(d.id, d.name),
            })),
          ]}
        />
      </DescriptionBlock>

      {Boolean(data.descriptors.length > 0) && (
        <DescriptionBlock label="Storico delle versioni">
          {sortBy(data.descriptors, 'version').map((d, i) => {
            const state = t(`status.eservice.${d.state}`)

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
