import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { Alert, Button, Stack, Tooltip, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateIcon from '@mui/icons-material/Create'
import PublishIcon from '@mui/icons-material/Publish'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import {
  SummaryAccordion,
  SummaryAccordionSkeleton,
} from '../../components/shared/SummaryAccordion'
import { PageContainer } from '@/components/layout/containers'
import {
  ConsumerPurposeSummaryGeneralInformationAccordion,
  ConsumerPurposeSummaryRiskAnalysisAccordion,
} from './components'
import { useGetConsumerPurposeAlertProps } from './hooks/useGetConsumerPurposeAlertProps'
import { useQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import {
  checkIsRulesetExpired,
  getDaysToExpiration,
  getFormattedExpirationDate,
} from '@/utils/purpose.utils'

const ConsumerPurposeSummaryPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_SUMMARY'>()

  const { jwt } = AuthHooks.useJwt()

  const navigate = useNavigate()

  const { data: purpose, isLoading } = useQuery(PurposeQueries.getSingle(purposeId))

  const expirationDate = purpose?.rulesetExpiration

  const daysToExpiration = getDaysToExpiration(expirationDate)

  const isRulesetExpired = checkIsRulesetExpired(expirationDate)

  const alertProps = useGetConsumerPurposeAlertProps(purpose)

  const eservicePersonalData = purpose?.eservice.personalData

  const checkIncompatibleAnswerValue = () => {
    const userAnswer = purpose?.riskAnalysisForm?.answers['usesPersonalData']?.[0]
    const isYes = userAnswer === 'YES'
    const isNo = userAnswer === 'NO'

    const incompatible =
      (isYes && eservicePersonalData !== true) || (isNo && eservicePersonalData !== false)

    return incompatible
  }

  const isPublishButtonDisabled =
    (purpose?.riskAnalysisForm &&
      eservicePersonalData !== undefined &&
      checkIncompatibleAnswerValue()) ||
    isRulesetExpired

  const arePublishOrEditButtonsDisabled =
    purpose?.agreement.state === 'ARCHIVED' || purpose?.eservice.descriptor.state === 'ARCHIVED'

  const { mutate: deleteDraft } = PurposeMutations.useDeleteDraft()
  const { mutate: publishDraft } = PurposeMutations.useActivateVersion()

  const isThereConsumerDelegation = Boolean(purpose?.delegation)
  const isDelegationMine =
    isThereConsumerDelegation && purpose?.delegation?.delegate.id === jwt?.organizationId //consumer side delegation

  const handleDeleteDraft = () => {
    deleteDraft(
      { purposeId },
      {
        onSuccess() {
          navigate('SUBSCRIBE_PURPOSE_LIST')
        },
      }
    )
  }

  const handleEditDraft = () => {
    if (purpose?.purposeTemplate?.id) {
      navigate('SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT', {
        params: {
          purposeId,
          purposeTemplateId: purpose.purposeTemplate.id,
        },
      })
    } else {
      navigate('SUBSCRIBE_PURPOSE_EDIT', {
        params: {
          purposeId,
        },
      })
    }
  }

  const handlePublishDraft = () => {
    if (!purpose?.currentVersion) return
    publishDraft(
      {
        purposeId,
        versionId: purpose.currentVersion.id,
        ...(isDelegationMine && { delegationId: purpose.delegation?.id }),
      },
      {
        onSuccess() {
          navigate('SUBSCRIBE_PURPOSE_DETAILS', {
            params: {
              purposeId,
            },
          })
        },
      }
    )
  }

  return (
    <PageContainer
      title={purpose?.title}
      isLoading={isLoading}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_PURPOSE_LIST',
      }}
      statusChip={purpose ? { for: 'purpose', purpose } : undefined}
    >
      {alertProps && <Alert sx={{ mb: 3 }} {...alertProps} />}
      <Stack spacing={3}>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion
            headline="1"
            title={t('summary.generalInformationSection.title')}
            defaultExpanded={true}
          >
            <ConsumerPurposeSummaryGeneralInformationAccordion purposeId={purposeId} />
          </SummaryAccordion>
        </React.Suspense>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion headline="2" title={t('summary.riskAnalysisSection.title')}>
            <ConsumerPurposeSummaryRiskAnalysisAccordion purposeId={purposeId} />
          </SummaryAccordion>
        </React.Suspense>
      </Stack>
      {expirationDate && !isRulesetExpired && (
        <Alert sx={{ mt: 3 }} severity="info">
          {t('summary.alerts.infoRulesetExpiration', {
            days: daysToExpiration,
            date: getFormattedExpirationDate(expirationDate),
          })}
        </Alert>
      )}
      {isRulesetExpired && (
        <Alert severity="error" sx={{ alignItems: 'center', mt: 3 }} variant="outlined">
          <Stack spacing={13} direction="row" alignItems="center">
            {' '}
            {/**TODO FIX SPACING */}
            <Typography>{t('summary.alerts.rulesetExpired.label')}</Typography>
            <Button
              variant="naked"
              size="medium"
              sx={{ fontWeight: 700, mr: 1 }}
              onClick={() => navigate('SUBSCRIBE_PURPOSE_CREATE')}
            >
              {t('summary.alerts.rulesetExpired.action')}
            </Button>
          </Stack>
        </Alert>
      )}
      <Stack spacing={1} sx={{ mt: 4 }} direction="row" justifyContent="end">
        <Button
          startIcon={<DeleteOutlineIcon />}
          variant="text"
          color="error"
          onClick={handleDeleteDraft}
        >
          {tCommon('deleteDraft')}
        </Button>
        <Button
          disabled={arePublishOrEditButtonsDisabled}
          startIcon={<CreateIcon />}
          variant="text"
          onClick={handleEditDraft}
        >
          {tCommon('editDraft')}
        </Button>

        <Tooltip title={isPublishButtonDisabled ? t('summary.publishBtnDisabled') : ''} arrow>
          <span>
            <Button
              disabled={arePublishOrEditButtonsDisabled || isPublishButtonDisabled}
              startIcon={<PublishIcon />}
              variant="contained"
              onClick={handlePublishDraft}
            >
              {tCommon('publishDraft')}
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </PageContainer>
  )
}

export default ConsumerPurposeSummaryPage
