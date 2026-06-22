import {
  PageContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { Redirect, useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import type { EServiceRiskAnalysis } from '@/api/api.generatedTypes'
import { useSearchParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { EServiceRiskAnalysisInfoSummary } from '@/components/shared/RiskAnalysisInfoSummary'

const RiskAnalysisEServiceAssociatedPage: React.FC = () => {
  return (
    <React.Suspense fallback={<RiskAnalysisEServiceAssociatedPageContentSkeleton />}>
      <RiskAnalysisEServiceAssociatedPageContent />
    </React.Suspense>
  )
}

const RiskAnalysisEServiceAssociatedPageContent: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { eserviceId, descriptorId } = useParams<'WATCH_RISK_ANALYSIS_FOR_ESERVICE'>()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )
  const [searchParams, setSearchParams] = useSearchParams()

  const riskAnalysisList = descriptor?.eservice.riskAnalysis

  const urlRiskAnalysisId = searchParams.get('riskAnalysisId')
  const defaultRiskAnalysisId =
    urlRiskAnalysisId &&
    riskAnalysisList.some((riskAnalysis) => riskAnalysis.id === urlRiskAnalysisId)
      ? urlRiskAnalysisId
      : riskAnalysisList[0].id

  const formMethods = useForm<{ riskAnalysisId: string }>({
    defaultValues: {
      riskAnalysisId: defaultRiskAnalysisId,
    },
  })

  const watch = formMethods.watch
  const riskAnalysisId = watch('riskAnalysisId')

  useEffect(() => {
    const { unsubscribe } = watch(({ riskAnalysisId }) => {
      if (riskAnalysisId) {
        setSearchParams((prev) => {
          prev.set('riskAnalysisId', riskAnalysisId)
          return prev
        })
      } else {
        setSearchParams((prev) => {
          prev.delete('riskAnalysisId')
          return prev
        })
      }
    })
    return () => unsubscribe()
  }, [watch, setSearchParams])

  if (riskAnalysisList?.length <= 0) {
    return <Redirect to="NOT_FOUND" />
  }

  return (
    <PageContainer
      backToAction={{
        label: t('backToEServiceBtn'),
        to: 'PROVIDE_ESERVICE_MANAGE',
        params: { eserviceId, descriptorId },
      }}
    >
      <FormProvider {...formMethods}>
        <Box>
          <SectionContainer
            description={t('watchRiskyAnalysisAssociated.description')}
            title={t('watchRiskyAnalysisAssociated.title')}
          >
            <RiskAnalysisSelect
              riskAnalysisList={riskAnalysisList || []}
              riskAnalysisId={riskAnalysisId || ''}
            />
          </SectionContainer>
          {riskAnalysisId && eserviceId && (
            <SectionContainer>
              <EServiceRiskAnalysisInfoSummary
                riskAnalysisId={riskAnalysisId}
                eserviceId={eserviceId}
              />
            </SectionContainer>
          )}
        </Box>
      </FormProvider>
    </PageContainer>
  )
}

export default RiskAnalysisEServiceAssociatedPage

type RiskyAnalysisSelectProps = {
  riskAnalysisList: EServiceRiskAnalysis[]
  riskAnalysisId: string
}
const RiskAnalysisSelect: React.FC<RiskyAnalysisSelectProps> = ({
  riskAnalysisList: riskAnalysis,
  riskAnalysisId,
}) => {
  const { t } = useTranslation('eservice')

  const menuLabelOptions = riskAnalysis.map((riskAnalysis) => ({
    label: riskAnalysis.name,
    value: riskAnalysis.id,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 1 }}
      key={riskAnalysisId}
      loading={false}
      name="riskAnalysisId"
      label={t('watchRiskyAnalysisAssociated.title')}
      options={menuLabelOptions}
    />
  )
}

const RiskAnalysisEServiceAssociatedPageContentSkeleton: React.FC = () => {
  return (
    <PageContainer isLoading={true}>
      <Box>
        <SectionContainerSkeleton />
        <SectionContainerSkeleton height={300} />
      </Box>
    </PageContainer>
  )
}
