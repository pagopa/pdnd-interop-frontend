import { Chip, Divider, Grid, Stack, Typography } from '@mui/material'
import { AxiosResponse } from 'axios'
import React, { FunctionComponent, useMemo, useState } from 'react'
import {
  EServiceDescriptorRead,
  EServiceDocumentRead,
  EServiceReadType,
  FrontendAttributes,
} from '../../../types'
import { RunActionOutput, useFeedback } from '../../hooks/useFeedback'
import { useRoute } from '../../hooks/useRoute'
import { secondsToHoursMinutes } from '../../lib/format-utils'
import { downloadFile } from '../../lib/file-utils'
import { buildDynamicPath, buildDynamicRoute } from '../../lib/router-utils'
import { StyledLink } from './StyledLink'
import { formatThousands } from '../../lib/format-utils'
import { useTranslation } from 'react-i18next'
import { getDownloadDocumentName, getLatestActiveVersion } from '../../lib/eservice-utils'
import { remapBackendAttributesToFrontend } from '../../lib/attributes'
import { StyledButton } from './StyledButton'
import { InformationRow } from '../InformationRow'
import StyledSection from './StyledSection'
import { useHistory } from 'react-router-dom'
import { StyledForm } from './StyledForm'
import { StyledInputControlledSelect } from './StyledInputControlledSelect'
import { AttributeSection } from '../AttributeSection'
import { CHIP_COLORS_E_SERVICE, eServiceHelpLink, verifyVoucherHelpLink } from '../../lib/constants'
import { WELL_KNOWN_URL } from '../../lib/env'
import { AttachFile as AttachFileIcon, Launch as LaunchIcon } from '@mui/icons-material'

type EServiceContentInfoProps = {
  data: EServiceReadType
  descriptorId: string
  agreementId?: string
}

export const EServiceContentInfo: FunctionComponent<EServiceContentInfoProps> = ({
  data,
  descriptorId,
  agreementId,
}) => {
  const frontendAttributes = useMemo(() => {
    if (!data.attributes) return
    return remapBackendAttributesToFrontend(data.attributes)
  }, [data])

  const activeDescriptor = getLatestActiveVersion(data)
  const isCurrentVersion = activeDescriptor?.id === descriptorId

  return (
    <React.Fragment>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <GeneralInfoSection data={data} agreementId={agreementId} />
          <VersionInfoSection data={data} isCurrentVersion={isCurrentVersion} />
        </Grid>
        <Grid item xs={5}>
          <DownloadSection data={data} />
          <VoucherVerificationSection />
        </Grid>
      </Grid>

      {frontendAttributes && <AttributesSection frontendAttributes={frontendAttributes} />}

      <Grid spacing={2} container>
        <Grid item xs={6}>
          <VersionHistorySection
            viewindDescriptorId={descriptorId!}
            eserviceId={data.id}
            descriptors={data.descriptors}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

function GeneralInfoSection({
  data,
  agreementId,
}: {
  data: EServiceReadType
  agreementId?: string
}) {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'contentInfo.sections.generalInformations',
  })
  const { routes } = useRoute()

  return (
    <StyledSection>
      <StyledSection.Title>{t('title')}</StyledSection.Title>
      <StyledSection.Content>
        <Stack spacing={2}>
          {agreementId && (
            <InformationRow label={t('alreadySubscribedField.label')}>
              <StyledLink
                to={buildDynamicPath(routes.SUBSCRIBE_AGREEMENT_READ.PATH, {
                  agreementId,
                })}
              >
                {t('alreadySubscribedField.link.label')}
              </StyledLink>
            </InformationRow>
          )}
          <InformationRow label={t('technology')}>{data.technology}</InformationRow>
        </Stack>
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
              <span>{activeDescriptor.version}</span>
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
              <StyledLink
                onClick={handleDownloadDocument.bind(null, doc)}
                component="button"
                variant="body2"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <AttachFileIcon sx={{ mr: 1 }} /> {doc.prettyName}
              </StyledLink>
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
              selectProps={{ MenuProps: { sx: { maxHeight: '160px' } } }}
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
