import React, { FormEvent, useMemo, useState } from 'react'
import { StyledIntro } from '../components/Shared/StyledIntro'
import {
  EServiceDescriptorRead,
  EServiceDocumentRead,
  EServiceReadType,
  FrontendAttributes,
} from '../../types'
import { RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { useHistory, useParams } from 'react-router-dom'
import {
  decorateEServiceWithActiveDescriptor,
  getDownloadDocumentName,
  getLatestActiveVersion,
} from '../lib/eservice-utils'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { NotFound } from './NotFound'
import { useTranslation } from 'react-i18next'
import { remapBackendAttributesToFrontend } from '../lib/attributes'
import { InformationRow } from '../components/InformationRow'
import { AttributeSection } from '../components/AttributeSection'
import StyledSection from '../components/Shared/StyledSection'
import { Box, Chip, Divider, Grid, Stack, Typography } from '@mui/material'
import { StyledLink } from '../components/Shared/StyledLink'
import { formatThousands, secondsToHoursMinutes } from '../lib/format-utils'
import { downloadFile } from '../lib/file-utils'
import { AxiosResponse } from 'axios'
import { ButtonNaked } from '@pagopa/mui-italia'
import { AttachFile as AttachFileIcon, Launch as LaunchIcon } from '@mui/icons-material'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import {
  CHIP_COLORS_E_SERVICE,
  eServiceHelpLink,
  MAX_WIDTH,
  verifyVoucherHelpLink,
} from '../lib/constants'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { useRoute } from '../hooks/useRoute'
import { buildDynamicRoute } from '../lib/router-utils'
import { StyledInputControlledSelect } from '../components/Shared/StyledInputControlledSelect'
import { WELL_KNOWN_URL } from '../lib/env'

export function EServiceManage() {
  const { eserviceId, descriptorId } = useParams<{
    eserviceId: string | undefined
    descriptorId: string | undefined
  }>()
  const { t } = useTranslation('eservice')
  const history = useHistory()
  const { routes } = useRoute()

  const {
    data: eserviceData,
    isLoading,
    error,
  } = useAsyncFetch<EServiceReadType>(
    { path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } } },
    {
      mapFn: decorateEServiceWithActiveDescriptor(descriptorId),
      useEffectDeps: [eserviceId, descriptorId],
      disabled: !eserviceId || !descriptorId,
    }
  )

  const handleGoBackToEServices = () => {
    history.push(routes.PROVIDE.PATH)
  }

  const frontendAttributes = useMemo(() => {
    if (!eserviceData?.attributes) return
    return remapBackendAttributesToFrontend(eserviceData?.attributes)
  }, [eserviceData])

  if (error) {
    return <NotFound errorType="serverError" />
  }

  const activeDescriptor = getLatestActiveVersion(eserviceData)
  const isCurrentVersion = activeDescriptor?.id === descriptorId

  return (
    <Box sx={{ maxWidth: MAX_WIDTH }}>
      <StyledIntro isLoading={isLoading}>
        {{ title: eserviceData?.name, description: eserviceData?.description }}
      </StyledIntro>

      {eserviceData && (
        <>
          <Grid spacing={2} container>
            <Grid item xs={7}>
              <GeneralInfoSection data={eserviceData} />
              <VersionInfoSection data={eserviceData} isCurrentVersion={isCurrentVersion} />
            </Grid>
            <Grid item xs={5}>
              <DownloadSection data={eserviceData} />
              <VoucherVerificationSection />
            </Grid>
          </Grid>

          {frontendAttributes && <AttributesSection frontendAttributes={frontendAttributes} />}

          <Grid spacing={2} container>
            <Grid item xs={6}>
              <VersionHistorySection
                viewindDescriptorId={descriptorId!}
                eserviceId={eserviceId!}
                descriptors={eserviceData.descriptors}
              />
            </Grid>
          </Grid>
        </>
      )}

      <Box sx={{ mt: 4 }}>
        <PageBottomActions>
          <StyledButton onClick={handleGoBackToEServices} variant="outlined">
            {t('backToListBtn')}
          </StyledButton>
        </PageBottomActions>
      </Box>
    </Box>
  )
}

function GeneralInfoSection({ data }: { data: EServiceReadType }) {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'contentInfo.sections.generalInformations',
  })
  return (
    <StyledSection>
      <StyledSection.Title>{t('title')}</StyledSection.Title>
      <StyledSection.Content>
        <InformationRow label={t('technology')}>{data.technology}</InformationRow>
      </StyledSection.Content>
    </StyledSection>
  )
}

function VersionInfoSection({
  data,
  isCurrentVersion,
}: {
  data: EServiceReadType
  isCurrentVersion: boolean
}) {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'contentInfo.sections.versionInformations',
  })
  const { t: tCommon } = useTranslation('common')

  const activeDescriptor = data.activeDescriptor as EServiceDescriptorRead

  const getFormattedVoucherLifespan = () => {
    const { hours, minutes } = secondsToHoursMinutes(activeDescriptor.voucherLifespan)

    const minutesLabel = tCommon('time.minute', { count: minutes })
    const hoursLabel = tCommon('time.hour', { count: hours })
    const and = tCommon('conjunctions.and')

    if (hours === 0) {
      return `${minutes} ${minutesLabel}`
    }

    if (minutes === 0) {
      return `${hours} ${hoursLabel}`
    }

    return `${hours} ${hoursLabel} ${and} ${minutes} ${minutesLabel}`
  }

  return (
    <StyledSection>
      <StyledSection.Title>{t('title')}</StyledSection.Title>
      <StyledSection.Content>
        <Stack spacing={2}>
          <InformationRow label={t('actualVersion')}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography component="span">{activeDescriptor.version}</Typography>
              {isCurrentVersion && <Chip size="small" label="versione corrente" color="primary" />}
            </Stack>
          </InformationRow>
          <InformationRow label={t('versionStatus')}>
            <Chip
              size="small"
              label={tCommon(`status.eservice.${activeDescriptor.state || 'DRAFT'}`)}
              color={CHIP_COLORS_E_SERVICE[activeDescriptor.state]}
            />
          </InformationRow>
          <InformationRow label={t('description')}>{activeDescriptor?.description}</InformationRow>
          <InformationRow label={t('audience')} labelDescription={t('audienceDescription')}>
            {activeDescriptor.audience.join(', ')}
          </InformationRow>
          <InformationRow label={t('voucherLifespan')}>
            {getFormattedVoucherLifespan()}
          </InformationRow>
          <InformationRow label={t('dailyCallsPerConsumer')}>
            {formatThousands(activeDescriptor.dailyCallsPerConsumer)} {t('callsPerDay')}
          </InformationRow>
          <InformationRow label={t('dailyCallsTotal')}>
            {formatThousands(activeDescriptor.dailyCallsTotal)} {t('callsPerDay')}
          </InformationRow>

          <Divider />

          <Typography variant="body2">
            {t('doubtsQuestion')}{' '}
            <StyledLink href={eServiceHelpLink} target="_blank">
              {t('doubtsLink')}
            </StyledLink>
          </Typography>
        </Stack>
      </StyledSection.Content>
    </StyledSection>
  )
}

function DownloadSection({ data }: { data: EServiceReadType }) {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'contentInfo.sections.download',
  })
  const { runAction } = useFeedback()

  const activeDescriptor = data.activeDescriptor as EServiceDescriptorRead

  const handleDownloadDocument = async (document: EServiceDocumentRead) => {
    const { response, outcome } = (await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DOWNLOAD_DOCUMENT',
          endpointParams: {
            eserviceId: data.id,
            descriptorId: activeDescriptor.id,
            documentId: document.id,
          },
        },
        config: { responseType: 'arraybuffer' },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      const filename = getDownloadDocumentName(document)
      downloadFile((response as AxiosResponse).data, filename)
    }
  }

  const docs = [...activeDescriptor.docs, activeDescriptor.interface]

  return (
    <StyledSection>
      <StyledSection.Title>{t('title')}</StyledSection.Title>
      <StyledSection.Content>
        <Stack spacing={2} alignItems="start">
          {docs.map((doc) => (
            <Stack key={doc.id} spacing={2}>
              <ButtonNaked
                onClick={handleDownloadDocument.bind(null, doc)}
                size="large"
                color="primary"
                startIcon={<AttachFileIcon />}
              >
                {doc.prettyName}
              </ButtonNaked>
              {/* TEMP BACKEND - Size data doesn't come from backend (yet) */}
              {/* <Typography fontWeight={600} sx={{ marginLeft: '30px' }}>
                {(doc.size / 1024).toFixed(2)}&nbsp;KB
              </Typography> */}
            </Stack>
          ))}
        </Stack>
      </StyledSection.Content>
    </StyledSection>
  )
}

function VoucherVerificationSection() {
  const { t } = useTranslation(['eservice', 'common'], {
    keyPrefix: 'contentInfo.sections.voucherVerification',
  })

  function VoucherLink({ label, href }: { label: string; href: string }) {
    return (
      <StyledLink
        component="a"
        href={href}
        target="_blank"
        variant="body2"
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <LaunchIcon sx={{ mr: 1 }} /> {label}
      </StyledLink>
    )
  }

  return (
    <StyledSection>
      <StyledSection.Title>{t('title')}</StyledSection.Title>
      <StyledSection.Content>
        <Typography>{t('description')}</Typography>

        <Stack sx={{ mt: 2 }} spacing={2}>
          <VoucherLink label={t('howLink')} href={verifyVoucherHelpLink} />
          <VoucherLink label={t('wellKnownLink')} href={WELL_KNOWN_URL} />
        </Stack>
      </StyledSection.Content>
    </StyledSection>
  )
}

function AttributesSection({ frontendAttributes }: { frontendAttributes: FrontendAttributes }) {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'contentInfo.sections.attributes',
  })

  return (
    <>
      <AttributeSection
        attributeKey="certified"
        description={t('certified.description')}
        attributesSubtitle={t('subtitle')}
        attributes={frontendAttributes.certified}
        readOnly
      />
      <AttributeSection
        attributeKey="verified"
        description={t('verified.description')}
        attributesSubtitle={t('subtitle')}
        attributes={frontendAttributes.verified}
        readOnly
      />
      <AttributeSection
        attributeKey="declared"
        description={t('declared.description')}
        attributesSubtitle={t('subtitle')}
        attributes={frontendAttributes.declared}
        readOnly
      />
    </>
  )
}

function VersionHistorySection({
  viewindDescriptorId,
  eserviceId,
  descriptors,
}: {
  viewindDescriptorId: string
  eserviceId: string
  descriptors: EServiceDescriptorRead[]
}) {
  const { t } = useTranslation(['eservice', 'common'], {
    keyPrefix: 'contentInfo.sections.versionHistory',
  })

  const history = useHistory()
  const { routes } = useRoute()
  const [selectedDescriptorId, setSelectedDescriptorId] = useState(viewindDescriptorId)

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDescriptorId(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    history.push(
      buildDynamicRoute(routes.PROVIDE_ESERVICE_MANAGE, {
        eserviceId,
        descriptorId: selectedDescriptorId,
      }).PATH
    )
  }

  const shouldNotRender = descriptors.length <= 1

  if (shouldNotRender) return null

  const descriptorsOptions = descriptors.map((descriptor) => ({
    label: t('historyField.option', { version: descriptor.version }),
    value: descriptor.id,
  }))

  return (
    <StyledSection>
      <StyledSection.Title>{t('title')}</StyledSection.Title>
      <StyledSection.Content>
        <StyledForm onSubmit={handleSubmit}>
          <InformationRow label={t('historyField.title')}>
            <StyledInputControlledSelect
              label={t('historyField.label')}
              sx={{ width: '100%' }}
              emptyLabel=""
              name="eServiceHistorySelection"
              onChange={handleVersionChange}
              value={selectedDescriptorId}
              options={descriptorsOptions}
            />
            <StyledButton sx={{ mt: 2 }} size="large" variant="outlined" type="submit">
              {t('submitBtn')}
            </StyledButton>
          </InformationRow>
        </StyledForm>
      </StyledSection.Content>
    </StyledSection>
  )
}
