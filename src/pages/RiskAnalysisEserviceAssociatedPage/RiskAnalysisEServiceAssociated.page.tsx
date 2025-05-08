import {
  PageContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { Redirect, useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import type { EServiceRiskAnalysis } from '@/api/api.generatedTypes'
import { useSearchParams } from 'react-router-dom'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { FormProvider, useForm } from 'react-hook-form'
import { PurposeQueries } from '@/api/purpose'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'

const RiskAnalysisEServiceAssociatedPage: React.FC = () => {
  return (
    <React.Suspense fallback={<RiskAnalysisEServiceAssociatedPageContentSkeleton />}>
      <RiskAnalysisEServiceAssociatedPageContent />
    </React.Suspense>
  )
}

const RiskAnalysisEServiceAssociatedPageContent: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { eserviceId, descriptorId } = useParams<'WATCH_RISK_ANALISIS_FOR_ESERVICE'>()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )
  const [searchParams, setSearchParams] = useSearchParams()

  const formMethods = useForm<{ riskAnalysisId: string }>({
    defaultValues: {
      riskAnalysisId: searchParams.get('riskAnalysisId') || '',
    },
  })

  const riskAnalysisId = formMethods.watch('riskAnalysisId')
  const riskAnalysisList = descriptor?.eservice.riskAnalysis

  useEffect(() => {
    if (riskAnalysisList && riskAnalysisList?.length > 0) {
      const riskAnalysis = riskAnalysisList.find(
        (riskAnalysis) => riskAnalysis.id === searchParams.get('riskAnalysisId')
      )
      if (riskAnalysis) {
        formMethods.setValue('riskAnalysisId', riskAnalysis.id)
      } else {
        formMethods.setValue('riskAnalysisId', riskAnalysisList[0].id)
      }
    }
  }, [riskAnalysisList])

  useEffect(() => {
    if (riskAnalysisId) {
      setSearchParams((prev) => {
        prev.set('riskAnalysisId', riskAnalysisId)
        return prev
      })
    }
  }, [riskAnalysisId, setSearchParams])

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
              <RiskAnalysisInfo riskAnalysisId={riskAnalysisId} eServiceId={eserviceId} />
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

type RiskAnalysisInfoProps = {
  riskAnalysisId: string
  eServiceId: string
}
const RiskAnalysisInfo: React.FC<RiskAnalysisInfoProps> = ({ riskAnalysisId, eServiceId }) => {
  type QuestionItem = { question: string; answer: string; questionInfoLabel?: string }

  const { t } = useTranslation('purpose', { keyPrefix: 'create.eserviceRiskAnalysisSection' })
  const currentLanguage = useCurrentLanguage()

  const { data: riskAnalysis } = useQuery({
    ...EServiceQueries.getEServiceRiskAnalysis(eServiceId!, riskAnalysisId!),
    enabled: Boolean(eServiceId && riskAnalysisId),
  })
  const riskAnalysisTemplate = riskAnalysis?.riskAnalysisForm.answers

  const { data: riskAnalysisConfig } = useQuery({
    ...PurposeQueries.getRiskAnalysisVersion({
      riskAnalysisVersion: riskAnalysis?.riskAnalysisForm.version as string,
      eserviceId: eServiceId!,
    }),
    enabled: Boolean(riskAnalysis?.riskAnalysisForm.version && eServiceId),
  })

  const questions: Array<QuestionItem> = React.useMemo(() => {
    if (!riskAnalysisTemplate || !riskAnalysisConfig) return []

    // Answers in this form
    const answerIds = Object.keys(riskAnalysisTemplate)

    // Corresponding questions
    const questionsWithAnswer = riskAnalysisConfig.questions.filter(({ id }) =>
      answerIds.includes(id)
    )

    const answers = questionsWithAnswer.map(({ label, options, id, visualType, infoLabel }) => {
      const question = label[currentLanguage]

      const questionInfoLabel = infoLabel?.[currentLanguage]

      // Get the value of the answer
      // The value can be of three types: plain text, multiple options, single option
      const answerValue = riskAnalysisTemplate[id]

      // Plain text: this value comes from a text field
      if (visualType === 'text') {
        return { question, answer: answerValue[0] }
      }

      // Multiple options: this value comes from a multiple choice checkbox
      const selectedOptions = options?.filter(({ value }) => answerValue.includes(String(value)))
      const answer = selectedOptions?.map((o) => o.label[currentLanguage]).join(', ') ?? ''

      return { question, answer, questionInfoLabel }
    })

    return answers
  }, [riskAnalysisTemplate, riskAnalysisConfig, currentLanguage])

  if (!riskAnalysisTemplate) return null

  return (
    <SectionContainer innerSection title={t('riskAnalysis.title')}>
      <List>
        {questions.map(({ question, answer, questionInfoLabel }, i) => (
          <ListItem key={i} sx={{ pl: 0 }}>
            <ListItemText>
              <Typography variant="body2">{question}</Typography>
              {questionInfoLabel && (
                <Typography variant="caption" color="grey" component="p">
                  {questionInfoLabel}
                </Typography>
              )}
              <Typography variant="body2" fontWeight={600} mt={0.5}>
                {answer}
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </SectionContainer>
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
