import { Box, Chip, Divider, Grid, Stack, Typography } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { mixed, object, string } from 'yup'
import {
  AgreementSummary,
  EServiceDocumentRead,
  EServiceReadType,
  FrontendAttributes,
  RequestOutcome,
} from '../../types'
import { AttributeSection } from '../components/AttributeSection'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import PageBottomActionsCard from '../components/Shared/PageBottomActionsCard'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledDeleteableDocument } from '../components/Shared/StyledDeleteableDocument'
import { StyledForm } from '../components/Shared/StyledForm'
import StyledInputControlledFileNew from '../components/Shared/StyledInputControlledFileNew'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledLink } from '../components/Shared/StyledLink'
import StyledSection from '../components/Shared/StyledSection'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useFeedback } from '../hooks/useFeedback'
import { useRoute } from '../hooks/useRoute'
import { remapBackendAttributesToFrontend } from '../lib/attributes'
import { CHIP_COLORS_AGREEMENT, MAX_WIDTH } from '../lib/constants'
import { buildDynamicPath } from '../lib/router-utils'
import { NotFound } from './NotFound'

export function AgreementEdit() {
  const { t } = useTranslation(['agreement', 'common'])

  const [documents, setDocuments] = useState<Array<EServiceDocumentRead>>([])
  const [providerMessage, setProviderMessage] = React.useState('')

  const { agreementId } = useParams<{ agreementId: string }>()
  const history = useHistory()
  const { routes } = useRoute()
  const { runAction } = useFeedback()

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
      mapFn: (data) => remapBackendAttributesToFrontend(data.attributes),
      useEffectDeps: [agreement],
      disabled: !agreement?.eservice.id,
    }
  )

  if (agreementError) {
    return <NotFound errorType="serverError" />
  }

  function buildEServiceLink() {
    return buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
      eserviceId: agreement?.eservice.id,
      descriptorId: agreement?.descriptorId,
    })
  }

  function handleProviderMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setProviderMessage(e.target.value)
  }

  function handleGoBackToRequestsList() {
    history.push(routes.SUBSCRIBE_AGREEMENT_LIST.PATH)
  }

  function handleSaveDraft() {
    // TEMP BACKEND
  }

  function handleDeleteDraft() {
    // TEMP BACKEND
  }

  async function handleSendAgreementRequest() {
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_DRAFT_SUBMIT',
          endpointParams: { agreementId: agreement?.id },
        },
      },
      { onSuccessDestination: routes.SUBSCRIBE_AGREEMENT_LIST }
    )
  }

  return (
    <Box sx={{ maxWidth: MAX_WIDTH }}>
      <StyledIntro isLoading={isLoading}>{{ title: t('edit.title') }}</StyledIntro>
      {agreement && (
        <>
          <Grid container>
            <Grid item xs={6}>
              <StyledSection>
                <StyledSection.Title>{t('edit.generalInformations.title')}</StyledSection.Title>
                <StyledSection.Content>
                  <Stack spacing={2}>
                    <AttributeGeneralInformation
                      label={t('edit.generalInformations.eserviceField.label')}
                      content={`${agreement.eservice.name} ${t(
                        'edit.generalInformations.eserviceField.versionLabel'
                      )} ${agreement.eservice.version}`}
                      Button={
                        <StyledLink underline="hover" variant="button" to={buildEServiceLink()}>
                          {t('edit.generalInformations.eserviceField.goToEServiceBtn')}
                        </StyledLink>
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
                </StyledSection.Content>
              </StyledSection>
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

          <StyledSection>
            <StyledSection.Title>{t('edit.documents.title')}</StyledSection.Title>
            <StyledSection.Subtitle>{t('edit.documents.description')}</StyledSection.Subtitle>
            <StyledSection.Content>
              <DocumentInputSection documents={documents} setDocuments={setDocuments} />
            </StyledSection.Content>
          </StyledSection>

          <StyledSection>
            <StyledSection.Title>{t('edit.providerMessage.title')}</StyledSection.Title>
            <StyledSection.Subtitle>{t('edit.providerMessage.description')}</StyledSection.Subtitle>
            <StyledSection.Content>
              <StyledInputControlledText
                disabled
                sx={{ mb: 0, mt: 1 }}
                label={t('edit.providerMessage.field.label')}
                name="providerMessage"
                value={providerMessage}
                onChange={handleProviderMessageChange}
                multiline
              />
            </StyledSection.Content>
          </StyledSection>

          <Box sx={{ mt: 4 }}>
            <PageBottomActions>
              <StyledButton onClick={handleGoBackToRequestsList} variant="outlined">
                {t('edit.backToRequestsBtn')}
              </StyledButton>
              <StyledButton disabled onClick={handleSaveDraft} variant="contained">
                {t(`actions.saveDraft`, { ns: 'common' })}
              </StyledButton>
            </PageBottomActions>
          </Box>

          <Grid container>
            <Grid item xs={6}>
              <PageBottomActionsCard
                title={t('edit.bottomPageActionCard.title')}
                description={t('edit.bottomPageActionCard.description')}
              >
                <StyledButton disabled onClick={handleDeleteDraft} variant="outlined">
                  {t('edit.bottomPageActionCard.cancelBtn')}
                </StyledButton>
                <StyledButton onClick={handleSendAgreementRequest} variant="contained">
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

type DocumentInputSectionProps = {
  documents: Array<EServiceDocumentRead>
  setDocuments: React.Dispatch<React.SetStateAction<Array<EServiceDocumentRead>>>
}

function DocumentInputSection({ documents, setDocuments }: DocumentInputSectionProps) {
  const [showInput, setShowInput] = useState(false)

  const { t } = useTranslation('common')

  const handleShowFileInput = () => {
    setShowInput(true)
  }

  const handleHideFileInput = () => {
    setShowInput(false)
  }

  const handleUploadFile = async (file: File, prettyName: string) => {
    setDocuments((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        name: file.name,
        prettyName,
        contentType: file.type,
      },
    ])
    handleHideFileInput()
  }

  const handleUpdateDocDescription = async (_: string, _2: string) => {
    //TEMP BACKEND
    return 'success' as RequestOutcome
  }

  const handleDeleteDocument = async (docId: string) => {
    // TEMP BACKEND
    setDocuments((prev) => prev.filter((doc) => docId !== doc.id))
  }

  const handleDownloadDocument = async (_: string) => {
    //TEMP BACKEND
  }

  return (
    <>
      <Stack sx={{ mt: 1 }} spacing={2}>
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

      {documents.length > 0 && <Divider sx={{ my: 2 }} />}

      <Box>
        {!showInput ? (
          // Disabled, waiting for the backend
          <ButtonNaked disabled color="primary" onClick={handleShowFileInput}>
            {t('addBtn')}
          </ButtonNaked>
        ) : (
          <DocumentInput onUpload={handleUploadFile} />
        )}
      </Box>
    </>
  )
}

const validationSchema = object({
  file: mixed().required(),
  prettyName: string().required(),
})

type DocumentInputProps = {
  onUpload: (file: File, prettyName: string) => void
}

type DocumentInputFormValues = { file: File | null; prettyName: string }
const initialValues: DocumentInputFormValues = { file: null, prettyName: 'Specifica API' }

function DocumentInput({ onUpload }: DocumentInputProps) {
  const { t } = useTranslation('agreement')

  const handleUpload = (values: DocumentInputFormValues) => {
    if (!values.file) return
    onUpload(values.file, values.prettyName)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleUpload}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ setFieldValue, values, errors, handleChange, handleSubmit }) => (
        <StyledForm onSubmit={handleSubmit}>
          <StyledInputControlledFileNew
            value={values.file}
            uploadFn={async (file) => {
              setFieldValue('file', file)
            }}
            removeFn={setFieldValue.bind(null, 'file', null)}
            dragHereLabel={t('edit.documents.documentInputField.dragHereLabel')}
            selectFromComputerLabel={t('edit.documents.documentInputField.selectFromComputerLabel')}
            loadingLabel={t('edit.documents.documentInputField.loadingLabel')}
          />

          {values.file && (
            <>
              <StyledInputControlledText
                disabled={!values.file}
                focusOnMount
                sx={{ mt: 3 }}
                name="prettyName"
                label={'Nome documento'}
                value={values.prettyName}
                error={errors.prettyName}
                onChange={handleChange}
                rows={4}
              />
              <Stack mt={3} direction="row" justifyContent="flex-end">
                <StyledButton type="submit" variant="contained">
                  {t('edit.documents.documentInputField.uploadBtn')}
                </StyledButton>
              </Stack>
            </>
          )}
        </StyledForm>
      )}
    </Formik>
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
