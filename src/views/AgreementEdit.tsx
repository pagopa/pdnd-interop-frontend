import { Box, Chip, Grid, Stack, Typography } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
  AgreementSummary,
  AttributeKind,
  BackendAttributeContent,
  EServiceReadType,
  FrontendAttribute,
  FrontendAttributes,
  GroupBackendAttribute,
  SingleBackendAttribute,
} from '../../types'
import { AttributeSection } from '../components/AttributeSection'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledPaper } from '../components/StyledPaper'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { CHIP_COLORS_AGREEMENT } from '../lib/constants'
import { NotFound } from './NotFound'

if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    if (window && window.document) {
      window.document.querySelector('body > iframe')?.remove()
    }
  }, 1000)
}

function mapBackendAttributesToFrontendAttributes(data: EServiceReadType): FrontendAttributes {
  function backendAttributeToFrontendAttribute(
    kind: AttributeKind,
    backendAttributes: Array<BackendAttributeContent>
  ): FrontendAttribute {
    const attributes = backendAttributes.map(({ id, name, description, creationTime }) => ({
      id,
      name,
      description,
      creationTime,
      kind,
    }))

    return {
      attributes,
      explicitAttributeVerification: false,
    }
  }

  const frontendAttributes: Partial<FrontendAttributes> = {}
  const backendAttributes = data.attributes
  const keys = Object.keys(backendAttributes) as Array<keyof typeof backendAttributes>

  keys.map((key) => {
    frontendAttributes[key] = data.attributes[key].reduce((acc: Array<FrontendAttribute>, next) => {
      if (next.hasOwnProperty('single')) {
        return [
          ...acc,
          backendAttributeToFrontendAttribute('CERTIFIED', [
            (next as SingleBackendAttribute).single,
          ]),
        ]
      }

      return [
        ...acc,
        backendAttributeToFrontendAttribute('CERTIFIED', (next as GroupBackendAttribute).group),
      ]
    }, [])
  })

  return frontendAttributes as FrontendAttributes
}

export function AgreementEdit() {
  const { agreementId } = useParams<{ agreementId: string }>()
  const { t } = useTranslation('agreement')

  const {
    data: agreement,
    error: agreementError,
    isLoading,
  } = useAsyncFetch<AgreementSummary>({
    path: { endpoint: 'AGREEMENT_GET_SINGLE', endpointParams: { agreementId } },
  })

  const { data: frontendAttributes } = useAsyncFetch<EServiceReadType, FrontendAttributes>(
    {
      path: {
        endpoint: 'ESERVICE_GET_SINGLE',
        endpointParams: { eserviceId: agreement?.eservice.id },
      },
    },
    {
      mapFn: mapBackendAttributesToFrontendAttributes,
      useEffectDeps: [agreement],
      disabled: !agreement?.eservice.id,
    }
  )

  if (agreementError) {
    return <NotFound errorType="serverError" />
  }

  function handleGoToEService() {
    // history.push()
  }

  return (
    <React.Fragment>
      <StyledIntro isLoading={isLoading}>{{ title: t('edit.title') }}</StyledIntro>
      {agreement && (
        <>
          <Box sx={{ maxWidth: 620 }}>
            <StyledPaper>
              <Typography variant="overline">informazioni generali</Typography>
              <Stack mt={2} spacing={2}>
                <AttributeGeneralInformation
                  label={t('edit.generalInformations.eserviceField.label')}
                  content={`${agreement.eservice.name} ${t(
                    'edit.generalInformations.eserviceField.versionLabel'
                  )} ${agreement.eservice.version}`}
                  Button={
                    <ButtonNaked onClick={handleGoToEService} color="primary">
                      Vedi E-Service
                    </ButtonNaked>
                  }
                />
                <AttributeGeneralInformation
                  label={t('edit.generalInformations.providerField.label')}
                  content={agreement.consumer.name}
                />
                <AttributeGeneralInformation
                  label={t('edit.generalInformations.requestStatusField.label')}
                  content={
                    <Chip label={agreement.state} color={CHIP_COLORS_AGREEMENT[agreement.state]} />
                  }
                />
              </Stack>
            </StyledPaper>
          </Box>

          {frontendAttributes && (
            <>
              <AttributeSection
                attributeKey="certified"
                description={t('edit.attribute.certified.description')}
                attributesSubtitle={t('edit.attribute.subtitle')}
                attributes={frontendAttributes.certified}
                readOnly
              />
              <AttributeSection
                attributeKey="verified"
                description={t('edit.attribute.verified.description')}
                attributesSubtitle={t('edit.attribute.subtitle')}
                attributes={frontendAttributes.verified}
                readOnly
              />
              <AttributeSection
                attributeKey="declared"
                description={t('edit.attribute.declared.description')}
                attributesSubtitle={t('edit.attribute.subtitle')}
                attributes={frontendAttributes.declared}
                readOnly
              />
            </>
          )}
        </>
      )}
    </React.Fragment>
  )
}

interface AttributeGeneralInformationProps {
  label: string
  content: string | JSX.Element
  Button?: JSX.Element | null
}

function AttributeGeneralInformation({
  label,
  content,
  Button = null,
}: AttributeGeneralInformationProps) {
  return (
    <Grid container>
      <Grid xs={4} item>
        <Typography variant="body2">{label}</Typography>
      </Grid>
      <Grid xs={5} item>
        <Typography variant="body2" fontWeight={600}>
          {content}
        </Typography>
      </Grid>
      <Grid sx={{ display: 'flex', justifyContent: 'end' }} xs={3} item>
        <Stack justifyContent="start">{Button}</Stack>
      </Grid>
    </Grid>
  )
}
