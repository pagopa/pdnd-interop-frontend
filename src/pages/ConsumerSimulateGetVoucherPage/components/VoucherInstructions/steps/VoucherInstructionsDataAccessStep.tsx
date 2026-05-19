import React from 'react'
import { StepActions } from '@/components/shared/StepActions'
import { useTranslation } from 'react-i18next'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import { Alert, AlertTitle, Box, Button, Stack, Typography } from '@mui/material'
import { useClientKind } from '@/hooks/useClientKind'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { SectionContainer } from '@/components/layout/containers'
import { PurposeQueries } from '@/api/purpose'
import { useQuery } from '@tanstack/react-query'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { IconLink } from '@/components/shared/IconLink'
import { apiSignalhubPushLink, apiSignalhubPullLink } from '@/config/constants'
import { useSearchParams } from 'react-router-dom'
import type { InteractionType, MemberType, VoucherType } from '../VoucherInstructionsGeneralForm'
import { INTERACTION_TYPE, MEMBER_TYPE, VOUCHER_TYPE } from '../VoucherInstructionsGeneralForm'
import { CodeSnippetPreview } from '../CodeSnippetPreview'
import { FE_URL } from '@/config/env'
import { useNavigate } from '@/router'
import { RestartAlt } from '@mui/icons-material'
import { EServiceQueries } from '@/api/eservice'
import { theme } from '@pagopa/interop-fe-commons'
import { ApiVersionSummary } from '../ApiVersionSummary'

export const VoucherInstructionsDataAccessStep: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const { goToPreviousStep, goToNextStep, resetStepper } = useVoucherInstructionsContext()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const purposeId = searchParams.get('purposeId') || ''
  const voucherType = (searchParams.get('voucherType') as VoucherType) || ''
  const memberType = (searchParams.get('memberType') as MemberType) || ''
  const eserviceId = searchParams.get('eserviceId') || ''

  const { data: purpose } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    enabled: Boolean(purposeId),
  })

  /* @TODO - use this for the redirect when the bff will return the descriptorId (https://pagopa.atlassian.net/browse/PIN-10116) */
  const { data: eservice } = useQuery({
    ...EServiceQueries.getSingle(eserviceId),
    enabled: Boolean(eserviceId),
  })

  const interactionType = (searchParams.get('interactionType') as InteractionType) || ''

  const getFilePath = () => {
    const base = `${FE_URL}/data/it`

    return `${base}/data-access/data_access_curl_${clientKind === 'CONSUMER' ? 'eservice' : 'pdnd'}.txt`
  }

  /* @TODO - add condition if async + producer (waiting for bff to return the descriptorId) (https://pagopa.atlassian.net/browse/PIN-10116) */
  const handleNavigateToEservice = () => {
    if (purpose) {
      navigate('SUBSCRIBE_CATALOG_VIEW', {
        params: { eserviceId: purpose.eservice.id, descriptorId: purpose.eservice.descriptor.id },
      })
    }
  }

  return (
    <>
      <SectionContainer
        title={t('dataAccessStep.pdndAccessToken.title')}
        description={t('dataAccessStep.pdndAccessToken.description')}
      >
        <Alert
          severity="success"
          variant="outlined"
          sx={{
            boxShadow: 'unset',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <AlertTitle sx={{ pb: 1 }}>
            {t(`dataAccessStep.pdndAccessToken.successAlert.title`)}
          </AlertTitle>
          {t('dataAccessStep.pdndAccessToken.successAlert.description')}
        </Alert>
        <Alert
          severity="error"
          variant="outlined"
          sx={{
            boxShadow: 'unset',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            '& .MuiAlert-message': { width: '100%' },
          }}
        >
          <Stack direction="row" sx={{ justifyContent: 'space-between' }} alignItems="center">
            <Box>
              <AlertTitle sx={{ pb: 1 }}>
                {t(`dataAccessStep.pdndAccessToken.failureAlert.title`)}
              </AlertTitle>
              {t('dataAccessStep.pdndAccessToken.failureAlert.description')}
            </Box>
            <Button variant="outlined" onClick={() => navigate('SUBSCRIBE_DEBUG_VOUCHER')}>
              {t('dataAccessStep.pdndAccessToken.failureAlert.debugButton')}
            </Button>
          </Stack>
        </Alert>
      </SectionContainer>
      {clientKind === 'API' && voucherType === VOUCHER_TYPE.BEARER && (
        <>
          <ApiVersionSummary keyPrefix="dataAccessStep" />
          <SectionContainer
            title={t('dataAccessStep.signalHub.title')}
            description={t('dataAccessStep.signalHub.description')}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ pt: 1, pb: 3 }}
            >
              <Stack direction="column" gap={1} sx={{ mr: 3 }}>
                <Typography variant="body2" fontWeight={600}>
                  {t('dataAccessStep.signalHub.pushApiSH.title')}
                </Typography>
                <Typography variant="body2">
                  {t('dataAccessStep.signalHub.pushApiSH.description')}
                </Typography>
              </Stack>
              <IconLink
                endIcon={<OpenInNewIcon fontSize="small" />}
                href={apiSignalhubPushLink}
                target="_blank"
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('dataAccessStep.signalHub.actionLabel')}
              </IconLink>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="column" gap={1} sx={{ mr: 3 }}>
                <Typography variant="body2" fontWeight={600}>
                  {t('dataAccessStep.signalHub.pullApiSH.title')}
                </Typography>
                <Typography variant="body2">
                  {t('dataAccessStep.signalHub.pullApiSH.description')}
                </Typography>
              </Stack>
              <IconLink
                endIcon={<OpenInNewIcon fontSize="small" />}
                href={apiSignalhubPullLink}
                target="_blank"
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('dataAccessStep.signalHub.actionLabel')}
              </IconLink>
            </Stack>
          </SectionContainer>
          <SectionContainer title={t('dataAccessStep.exampleRequest.title.pdnd')}>
            <Typography variant="body2">
              {t('dataAccessStep.exampleRequest.description')}
            </Typography>
            <CodeSnippetPreview
              sx={{ mt: 2 }}
              activeLang="curl"
              entries={[{ url: getFilePath(), value: 'curl' }]}
            />
          </SectionContainer>
        </>
      )}
      {clientKind === 'CONSUMER' && voucherType === VOUCHER_TYPE.BEARER && (
        <SectionContainer title={t('dataAccessStep.exampleRequest.title.eservice')}>
          <Typography variant="body2">{t('dataAccessStep.exampleRequest.description')}</Typography>
          <CodeSnippetPreview
            sx={{ mt: 2 }}
            activeLang="curl"
            entries={[{ url: getFilePath(), value: 'curl' }]}
          />
          <Alert variant="outlined" severity="warning" sx={{ mt: 2 }}>
            <Stack direction="row">
              <Typography variant="body2">
                {t('dataAccessStep.exampleRequest.alert.title')}
              </Typography>
              {/* @TODO remove this condition when the bff will return the descriptorId for the redirect (https://pagopa.atlassian.net/browse/PIN-10116) */}
              {memberType === MEMBER_TYPE.CONSUMER && (
                <Button sx={{ whiteSpace: 'nowrap' }} onClick={() => handleNavigateToEservice()}>
                  {t('dataAccessStep.exampleRequest.alert.actionLabel')}
                </Button>
              )}
            </Stack>
          </Alert>
        </SectionContainer>
      )}
      <StepActions
        back={{
          label: t('backBtn'),
          type: 'button',
          onClick: goToPreviousStep,
          startIcon: <ArrowBackIcon />,
        }}
        secondaryAction={
          voucherType === VOUCHER_TYPE.DPOP && interactionType === INTERACTION_TYPE.SYNC
            ? {
                label: t('firstDPoPProofStep.navigateToDebugButton.label'),
                type: 'link',
                to: 'SUBSCRIBE_DEBUG_VOUCHER',
              }
            : undefined
        }
        forward={
          voucherType === VOUCHER_TYPE.DPOP
            ? {
                label: t('proceedBtn'),
                type: 'button',
                onClick: goToNextStep,
                endIcon: <ArrowForwardIcon />,
              }
            : {
                label: t('newSimulationBtn'),
                type: 'button',
                onClick: resetStepper,
                endIcon: <RestartAlt />,
              }
        }
      />
    </>
  )
}
