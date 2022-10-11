import React, { FunctionComponent, useEffect } from 'react'
import { ActiveStepProps } from '../hooks/useActiveStep'
import { StepActions } from './Shared/StepActions'
import { StyledForm } from './Shared/StyledForm'
//import _riskAnalysisConfig from '../data/risk-analysis/pa/v2.0.json'
import _riskAnalysisConfig from '../data/risk-analysis/v1.0.json'
import { RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { Purpose, PurposeRiskAnalysisFormAnswers } from '../../types'
import { getPurposeFromUrl } from '../lib/purpose'
import { StyledIntro } from './Shared/StyledIntro'
import { LoadingWithMessage } from './Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'
import { StyledPaper } from './StyledPaper'
import useDynamicRiskAnalysisForm, { RiskAnalysis } from '../hooks/useDynamicRiskAnalysisForm'
import { useLocation } from 'react-router-dom'

export const PurposeEditStep2RiskAnalysis: FunctionComponent<ActiveStepProps> = ({
  back,
  forward,
}) => {
  const { t } = useTranslation('purpose')
  const location = useLocation()
  const purposeId = getPurposeFromUrl(location)

  const riskAnalysisConfig = _riskAnalysisConfig as RiskAnalysis
  const { runAction } = useFeedback()

  const { data: purposeFetchedData, isLoading } = useAsyncFetch<Purpose>({
    path: { endpoint: 'PURPOSE_GET_SINGLE', endpointParams: { purposeId } },
  })

  const handleSubmit = async (validAnswers: Record<string, unknown>) => {
    const dataToPost = {
      riskAnalysisForm: { answers: validAnswers, version: riskAnalysisConfig.version },
      title: purposeFetchedData?.title,
      description: purposeFetchedData?.description,
    }
    const { outcome } = (await runAction(
      {
        path: { endpoint: 'PURPOSE_DRAFT_UPDATE', endpointParams: { purposeId } },
        config: { data: dataToPost },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      forward()
    }
  }

  const { formik, isSubmitBtnDisabled, formComponents } = useDynamicRiskAnalysisForm(
    riskAnalysisConfig,
    handleSubmit
  )

  useEffect(() => {
    // If there is data on the server
    if (purposeFetchedData && purposeFetchedData.riskAnalysisForm) {
      const { answers } = purposeFetchedData.riskAnalysisForm
      const currentAnswersIds = Object.keys(answers)
      // Set them as formik values. This will also trigger the useEffect that
      // depends on formik.values and update the questions accordingly
      currentAnswersIds.forEach((_id) => {
        const id = _id as keyof PurposeRiskAnalysisFormAnswers
        let answer = answers[id]
        const question = riskAnalysisConfig.questions.find((question) => question.id === id)
        // Only the checkbox needs the data as Array
        if (question?.type !== 'checkbox' && answer) {
          answer = answer[0]
        }
        formik.setFieldValue(id, answer, false)
      })
    }
  }, [purposeFetchedData]) // eslint-disable-line react-hooks/exhaustive-deps

  return !isLoading ? (
    <StyledForm onSubmit={formik.handleSubmit}>
      <StyledPaper>
        <StyledIntro component="h2">
          {{ title: t('edit.step2.title'), description: t('edit.step2.description') }}
        </StyledIntro>

        {formComponents}
      </StyledPaper>

      <StepActions
        back={{ label: t('edit.backWithoutSaveBtn'), type: 'button', onClick: back }}
        forward={{
          label: t('edit.forwardWithSaveBtn'),
          disabled: isSubmitBtnDisabled,
          type: 'submit',
        }}
      />
    </StyledForm>
  ) : (
    <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
  )
}
