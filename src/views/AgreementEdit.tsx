import { Box, Chip, Divider, Grid, Stack, Typography } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
  AgreementSummary,
  AttributeKind,
  BackendAttributeContent,
  EServiceDocumentRead,
  EServiceReadType,
  FrontendAttribute,
  FrontendAttributes,
  GroupBackendAttribute,
  RequestOutcome,
  SingleBackendAttribute,
} from '../../types'
import { AttributeSection } from '../components/AttributeSection'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import PageBottomActionsCard from '../components/Shared/PageBottomActionsCard'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledDeleteableDocument } from '../components/Shared/StyledDeleteableDocument'
import StyledInputControlledFileNew from '../components/Shared/StyledInputControlledFileNew'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledPaper } from '../components/StyledPaper'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { CHIP_COLORS_AGREEMENT, MAX_WIDTH } from '../lib/constants'
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
  const { t } = useTranslation(['agreement', 'common'])

  const [documents, setDocuments] = useState<Array<EServiceDocumentRead>>([])
  const [providerMessage, setProviderMessage] = React.useState('')

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

  function handleProviderMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setProviderMessage(e.target.value)
  }

  return (
    <Box sx={{ maxWidth: MAX_WIDTH }}>
      <StyledIntro isLoading={isLoading}>{{ title: t('edit.title') }}</StyledIntro>
      {agreement && (
        <>
          <Grid container>
            <Grid item xs={6}>
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
                      <Chip
                        label={t(`status.agreement.${agreement.state}`, { ns: 'common' })}
                        color={CHIP_COLORS_AGREEMENT[agreement.state]}
                      />
                    }
                  />
                </Stack>
              </StyledPaper>
            </Grid>
          </Grid>

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
          <StyledPaper>
            <Stack>
              <Typography variant="overline">{t('edit.providerMessage.title')}</Typography>
              <Typography color="text.secondary" variant="caption">
                {t('edit.providerMessage.description')}
              </Typography>

              <StyledInputControlledText
                label={t('edit.providerMessage.field.label')}
                name="providerMessage"
                value={providerMessage}
                onChange={handleProviderMessageChange}
                multiline
              />
            </Stack>
          </StyledPaper>
          <StyledPaper>
            <Stack>
              <Typography variant="overline">{t('edit.providerMessage.title')}</Typography>
              <Typography color="text.secondary" variant="caption">
                {t('edit.providerMessage.description')}
              </Typography>
              <DocumentInput documents={documents} setDocuments={setDocuments} />
            </Stack>
          </StyledPaper>
          <PageBottomActions>
            <StyledButton variant="outlined">Torna alle richieste</StyledButton>
            <StyledButton variant="contained">Salva bozza</StyledButton>
          </PageBottomActions>

          <Grid container>
            <Grid item xs={6}>
              <PageBottomActionsCard
                title={t('edit.bottomPageActionCard.title')}
                description={t('edit.bottomPageActionCard.description')}
              >
                <StyledButton variant="outlined">
                  {t('edit.bottomPageActionCard.cancelBtn')}
                </StyledButton>
                <StyledButton variant="contained">
                  {t('edit.bottomPageActionCard.submitBtn')}
                </StyledButton>
              </PageBottomActionsCard>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  )
}

type DocumentInputProps = {
  documents: Array<EServiceDocumentRead>
  setDocuments: React.Dispatch<React.SetStateAction<Array<EServiceDocumentRead>>>
}

function DocumentInput({ documents, setDocuments }: DocumentInputProps) {
  const [showInput, setShowInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation('common')

  const handleShowFileInput = () => {
    setShowInput(true)
  }

  const handleHideFileInput = () => {
    setShowInput(false)
  }

  const handleUpload = async (file: File) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDocuments((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        name: file.name,
        prettyName: file.name,
        contentType: file.type,
      },
    ])
    setIsLoading(false)
    handleHideFileInput()
  }

  const handleRemoveFile = () => {
    console.log('Removed')
    //TODO
  }

  const handleUpdateDocDescription = async (docId: string, newDescription: string) => {
    //TODO

    return 'success' as RequestOutcome
  }
  const handleDeleteDocument = async (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => docId !== doc.id))
  }
  const handleDownloadDocument = async (docId: string) => {
    //TODO
  }

  return (
    <>
      <Stack sx={{ mt: 3 }} spacing={2}>
        {documents.map((document) => (
          <StyledDeleteableDocument
            key={document.id}
            readable={document}
            updateDescription={handleUpdateDocDescription.bind(null, document.id)}
            deleteDocument={handleDeleteDocument.bind(null, document.id)}
            downloadDocument={handleDownloadDocument.bind(null, document.id)}
          />
        ))}
      </Stack>

      {documents.length > 0 && <Divider sx={{ mt: 2 }} />}

      <Box sx={{ mt: 2 }}>
        {!showInput ? (
          <ButtonNaked color="primary" onClick={handleShowFileInput}>
            {t('addBtn')}
          </ButtonNaked>
        ) : (
          <>
            <StyledInputControlledFileNew
              value={null}
              uploadFn={handleUpload}
              removeFn={handleRemoveFile}
              isLoading={isLoading}
              uploadText={'test'}
            />
            <Box sx={{ mt: 2 }}>
              <ButtonNaked color="error" onClick={handleHideFileInput}>
                Annulla
              </ButtonNaked>
            </Box>
          </>
        )}
      </Box>
    </>
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
