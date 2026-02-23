import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { Alert, Button, Stack, Tooltip, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateIcon from '@mui/icons-material/Create'
import PublishIcon from '@mui/icons-material/Publish'
import { SummaryAccordion, SummaryAccordionSkeleton } from '@/components/shared/SummaryAccordion'
import { useQuery } from '@tanstack/react-query'
import { EServiceTemplateMutations, EServiceTemplateQueries } from '@/api/eserviceTemplate'
import {
  ProviderEServiceTemplateGeneralInfoSummarySection,
  ProviderEServiceTemplateThresholdsAndAttributesSummarySection,
  ProviderEServiceTemplateTechnicalSpecsSummarySection,
  ProviderEServiceTemplateAdditionalInfoSummarySection,
} from './components'
import { ProviderEServiceTemplateRiskAnalysisSummaryList } from './components/ProviderEServiceTemplateRiskAnalysisSummaryList'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'
import { useDrawerState } from '@/hooks/useDrawerState'
import { UpdatePersonalDataDrawer } from '@/components/shared/UpdatePersonalDataDrawer'
import type { EServiceMode } from '@/api/api.generatedTypes'

const ProviderEServiceTemplateSummaryPage: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()
  const navigate = useNavigate()

  const { mutate: deleteVersion } = EServiceTemplateMutations.useDeleteVersionDraft()
  const { mutate: publishVersion } = EServiceTemplateMutations.usePublishVersionDraft()
  const { mutate: updateEserviceTemplatePersonalData } =
    EServiceTemplateMutations.useUpdateEServiceTemplatePersonalDataFlagAfterPublication()

  const { data: eserviceTemplate, isLoading } = useQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const handleDeleteDraft = () => {
    if (!eserviceTemplate) return

    deleteVersion(
      { eServiceTemplateId, eServiceTemplateVersionId },
      { onSuccess: () => navigate('PROVIDE_ESERVICE_TEMPLATE_LIST') }
    )
  }

  const handleEditDraft = () => {
    if (!eserviceTemplate) return
    navigate('PROVIDE_ESERVICE_TEMPLATE_EDIT', {
      params: {
        eServiceTemplateId: eServiceTemplateId,
        eServiceTemplateVersionId: eServiceTemplateVersionId,
      },
      state: { stepIndexDestination: 0 },
    })
  }

  const handlePublishDraft = () => {
    if (!eserviceTemplate) return

    publishVersion(
      {
        eServiceTemplateId: eServiceTemplateId,
        eServiceTemplateVersionId: eServiceTemplateVersionId,
      },
      {
        onSuccess: () =>
          navigate('PROVIDE_ESERVICE_TEMPLATE_DETAILS', {
            params: {
              eServiceTemplateId: eServiceTemplateId,
              eServiceTemplateVersionId: eServiceTemplateVersionId,
            },
          }),
      }
    )
  }

  const arePersonalDataSet = eserviceTemplate?.eserviceTemplate.personalData !== undefined
  const hasMissingFields = !eserviceTemplate?.voucherLifespan || !eserviceTemplate?.description

  const canBePublished = () => {
    return !!(eserviceTemplate?.interface && arePersonalDataSet && !hasMissingFields)
  }

  const isReceiveMode = eserviceTemplate?.eserviceTemplate.mode === 'RECEIVE'

  const {
    isOpen: isEServiceTemplateUpdatePersonalDataDrawerOpen,
    openDrawer: openUpdatePersonalDataDrawer,
    closeDrawer: closeEServiceTemplateUpdatePersonalDataDrawer,
  } = useDrawerState()

  const handleEServiceTemplatePersonalDataUpdate = (
    eserviceTemplateId: string,
    personalData: boolean
  ) => {
    updateEserviceTemplatePersonalData(
      {
        eserviceTemplateId: eserviceTemplateId,
        personalData: personalData,
      },
      { onSuccess: closeEServiceTemplateUpdatePersonalDataDrawer }
    )
  }

  return (
    <>
      <PageContainer
        title={t('summary.title', {
          eserviceTemplateName: eserviceTemplate?.eserviceTemplate.name,
          versionEserviceTemplateNumber: eserviceTemplate?.version ?? '1',
        })}
        backToAction={{
          label: t('backToListBtn'),
          to: 'PROVIDE_ESERVICE_TEMPLATE_LIST',
        }}
        isLoading={isLoading}
        statusChip={{
          for: 'eserviceTemplate',
          state: 'DRAFT',
        }}
      >
        <Stack spacing={3}>
          <React.Suspense fallback={<SummaryAccordionSkeleton />}>
            <SummaryAccordion
              headline="1"
              title={t('summary.generalInfoSummary.title')}
              defaultExpanded={true}
            >
              <ProviderEServiceTemplateGeneralInfoSummarySection />
            </SummaryAccordion>
          </React.Suspense>

          {isReceiveMode && (
            <React.Suspense fallback={<SummaryAccordionSkeleton />}>
              <SummaryAccordion headline="2" title={t('summary.riskAnalysisSummaryList.title')}>
                <ProviderEServiceTemplateRiskAnalysisSummaryList />
              </SummaryAccordion>
            </React.Suspense>
          )}

          <React.Suspense fallback={<SummaryAccordionSkeleton />}>
            <SummaryAccordion
              headline={isReceiveMode ? '3' : '2'}
              title={t('summary.thresholdsAndAttributesSummary.title')}
            >
              <ProviderEServiceTemplateThresholdsAndAttributesSummarySection />
            </SummaryAccordion>
          </React.Suspense>

          <React.Suspense fallback={<SummaryAccordionSkeleton />}>
            <SummaryAccordion
              headline={isReceiveMode ? '4' : '3'}
              title={t('summary.technicalSpecsSummary.title')}
              showWarning={!eserviceTemplate?.voucherLifespan}
              warningLabel={t('summary.completeInfoChip')}
            >
              <ProviderEServiceTemplateTechnicalSpecsSummarySection />
            </SummaryAccordion>
          </React.Suspense>

          <React.Suspense fallback={<SummaryAccordionSkeleton />}>
            <SummaryAccordion
              headline={isReceiveMode ? '5' : '4'}
              title={t('summary.additionalInfoSummary.title')}
              showWarning={!eserviceTemplate?.description}
              warningLabel={t('summary.completeInfoChip')}
            >
              <ProviderEServiceTemplateAdditionalInfoSummarySection />
            </SummaryAccordion>
          </React.Suspense>
        </Stack>
        {FEATURE_FLAG_ESERVICE_PERSONAL_DATA && !arePersonalDataSet && !isLoading && (
          <Alert severity="warning" sx={{ alignItems: 'center', mt: 3 }} variant="outlined">
            <Stack spacing={30} direction="row" alignItems="center">
              {' '}
              {/**TODO FIX SPACING */}
              <Typography>{t('summary.alertUpdatePersonalData.label')}</Typography>
              <Button
                variant="naked"
                size="medium"
                sx={{ fontWeight: 700, mr: 1, alignSelf: 'flex-end' }}
                onClick={openUpdatePersonalDataDrawer}
              >
                {tCommon('specifyProcessing')}
              </Button>
            </Stack>
          </Alert>
        )}
        {hasMissingFields && !isLoading && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            {t('summary.missingFieldsBanner')}
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
          <Button startIcon={<CreateIcon />} variant="text" onClick={handleEditDraft}>
            {tCommon('editDraft')}
          </Button>
          <PublishButton
            onClick={handlePublishDraft}
            disabled={!canBePublished()}
            arePersonalDataSet={FEATURE_FLAG_ESERVICE_PERSONAL_DATA && arePersonalDataSet}
            hasMissingFields={hasMissingFields}
          />
        </Stack>
      </PageContainer>
      <UpdatePersonalDataDrawer
        isOpen={isEServiceTemplateUpdatePersonalDataDrawerOpen}
        onClose={closeEServiceTemplateUpdatePersonalDataDrawer}
        eserviceId={eserviceTemplate?.eserviceTemplate.id as string}
        personalData={eserviceTemplate?.eserviceTemplate.personalData}
        onSubmit={handleEServiceTemplatePersonalDataUpdate}
        eserviceMode={eserviceTemplate?.eserviceTemplate.mode as EServiceMode}
        where="template e-service"
      />
    </>
  )
}

type PublishButtonProps = {
  disabled: boolean
  onClick: VoidFunction
  arePersonalDataSet: boolean
  hasMissingFields: boolean
}

const PublishButton: React.FC<PublishButtonProps> = ({
  disabled,
  onClick,
  arePersonalDataSet,
  hasMissingFields,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'summary' })

  const getTooltipTitle = () => {
    if (hasMissingFields) return t('missingFieldsTooltip')
    if (!arePersonalDataSet) return t('missingPersonalDataField')
    return t('notPublishableTooltip.label')
  }

  const Wrapper = disabled
    ? ({ children }: { children: React.ReactElement }) => (
        <Tooltip arrow title={getTooltipTitle()}>
          <span tabIndex={disabled ? 0 : undefined}>{children}</span>
        </Tooltip>
      )
    : React.Fragment

  return (
    <Wrapper>
      <Button disabled={disabled} startIcon={<PublishIcon />} variant="contained" onClick={onClick}>
        {tCommon('publish')}
      </Button>
    </Wrapper>
  )
}

export default ProviderEServiceTemplateSummaryPage
