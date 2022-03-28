import React, { FunctionComponent, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { string, mixed, object } from 'yup'
import { ActiveStepProps } from '../hooks/useActiveStep'
import { StepActions } from './Shared/StepActions'
import { StyledForm } from './Shared/StyledForm'
import _riskAnalysisConfig from '../data/risk-analysis/v0.1.json'
import { StyledInput } from './Shared/StyledInput'
import { StyledInputControlledTextProps } from './Shared/StyledInputControlledText'
import { StyledInputControlledRadioProps } from './Shared/StyledInputControlledRadio'
import { StyledInputControlledCheckboxMultipleProps } from './Shared/StyledInputControlledCheckboxMultiple'
import { StyledInputControlledSelectProps } from './Shared/StyledInputControlledSelect'
import { ObjectShape } from 'yup/lib/object'
import { RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { useLocation } from 'react-router-dom'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { Purpose, PurposeRiskAnalysisFormAnswers } from '../../types'
import { getPurposeFromUrl } from '../lib/purpose'
import { Paper } from '@mui/material'
import { StyledIntro } from './Shared/StyledIntro'

type Dependency = {
  id: string
  value: unknown
}

type Option = {
  label: string
  value: string
}

type Question = {
  id: string
  label: string
  defaultValue: unknown
  options?: Array<Option>
  dependencies: Dependency[]
  type: 'text' | 'radio' | 'checkbox' | 'select-one'
  infoLabel?: string
  required: boolean
}

type RiskAnalysis = {
  version: string
  questions: Array<Question>
}

type Questions = Record<string, Question>
type Answers = Record<string, unknown>

export const PurposeCreateStep2RiskAnalysis: FunctionComponent<ActiveStepProps> = ({
  back,
  forward,
}) => {
  const location = useLocation()
  const purposeId = getPurposeFromUrl(location)

  const riskAnalysisConfig = _riskAnalysisConfig as RiskAnalysis
  const { runAction } = useFeedback()
  const [validation, setValidation] = useState({})
  const [questions, setQuestions] = useState<Questions>({})
  const initialValues = riskAnalysisConfig.questions.reduce(
    (acc, { id, defaultValue }) => ({ ...acc, [id]: defaultValue }),
    {}
  ) as Answers

  const { data: purposeFetchedData } = useAsyncFetch<Purpose>(
    { path: { endpoint: 'PURPOSE_GET_SINGLE', endpointParams: { purposeId } } },
    { loadingTextLabel: 'Stiamo caricando le informazioni della finalità' }
  )

  const onSubmit = async (allAnswers: Record<string, unknown>) => {
    const currentQuestions = Object.keys(questions)
    // Send only answers to currently visible questions
    const validAnswers = Object.keys(allAnswers).reduce(
      (acc, key) => (currentQuestions.includes(key) ? { ...acc, [key]: allAnswers[key] } : acc),
      {}
    )

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

  const formik = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  })

  const getUpdatedQuestions = () => {
    const updatedQuestions = riskAnalysisConfig.questions.reduce((acc, next) => {
      // We are sure we can only queue the questions that come after the current one
      // because the dependencies are always on the questions that come before.
      // E.g. question 3 can only have question 1 and/or 2 as a dependency,
      // not question 4 and subsequent
      const queuedQuestions = Object.values(acc).map((d) => d.id)

      // Check the dependencies of this questions
      const satisfiesAllDependencies = next.dependencies.every((d) => {
        // If the question is a dependency
        const isInArray = queuedQuestions.includes(d.id)
        const id = d.id as string

        // and if the field currently has the same value as stated in the dependency
        const hasSameValue = Array.isArray(formik.values[id])
          ? (formik.values[id] as Array<unknown>).includes(d.value)
          : formik.values[id] === d.value

        return isInArray && hasSameValue
      })

      // Then it needs to be added as a new question to ask
      if (satisfiesAllDependencies) {
        acc[next.id] = next
      }

      return acc
    }, {} as Questions)
    return updatedQuestions
  }

  const getUpdatedValidation = (questionsObj: Questions) => {
    const text = string().required()
    const radio = string().required()
    // const radio = mixed().oneOf(['YES', 'NO']).required()
    const selectOne = string().required()
    const checkbox = string().required()
    const singleCheckbox = mixed().test(
      'presence',
      'Il campo è obbligatorio',
      (value) => typeof value !== 'undefined' && value.length > 0
    )
    const multiCheckbox = mixed().test(
      'presence',
      "Seleziona almeno un'opzione",
      (value) => typeof value !== 'undefined' && value.length > 0
    )
    const validationOptions = {
      text,
      radio,
      'select-one': selectOne,
      checkbox,
      singleCheckbox,
      multiCheckbox,
    }

    const schema = Object.keys(questionsObj).reduce((acc, next) => {
      const id: string = next
      const question: Question = questionsObj[next]
      const questionType = question.type as keyof typeof validationOptions

      let validationOption = validationOptions[questionType]
      if (questionType === 'checkbox') {
        validationOption =
          (question.options as Option[]).length > 1 ? multiCheckbox : singleCheckbox
      }

      acc[id] = validationOption
      return acc
    }, {} as ObjectShape)

    return object(schema)
  }

  // TEMP REFACTOR
  // This is a very very very ugly piece of code. Find another way
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Update the questions that have to be shown
    const updatedQuestions = getUpdatedQuestions()
    setQuestions(updatedQuestions)
    // Update the validation schema to validate only questions that are currently rendered
    const updatedValidation = getUpdatedValidation(updatedQuestions)
    setValidation(updatedValidation)
  }, [
    formik.values.usesPersonalData,
    formik.values.usesThirdPartyPersonalData,
    formik.values.usesConfidentialData,
    formik.values.securedDataAccess,
    formik.values.legalBasis,
    formik.values.knowsAccessedDataCategories,
    formik.values.accessDataArt9Gdpr,
    formik.values.accessUnderageData,
    formik.values.knowsDataQuantity,
    formik.values.dataQuantity,
    formik.values.deliveryMethod,
    formik.values.doneDpia,
    formik.values.definedDataRetentionPeriod,
    formik.values.purposePursuit,
    formik.values.checkedExistenceMereCorrectnessInteropCatalogue,
    formik.values.checkedAllDataNeeded,
    formik.values.checkedExistenceMinimalDataInteropCatalogue,
  ])
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    // If there is data on the server
    if (purposeFetchedData && purposeFetchedData.riskAnalysisForm) {
      const { answers } = purposeFetchedData.riskAnalysisForm
      const currentAnswersIds = Object.keys(answers)
      // Set them as formik values. This will also trigger the useEffect that
      // depends on formik.values and update the questions accordingly
      currentAnswersIds.forEach((id) => {
        const answer = answers[id as keyof PurposeRiskAnalysisFormAnswers]
        formik.setFieldValue(id, answer, false)
      })
    }
  }, [purposeFetchedData]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
      <StyledIntro variant="h2">
        {{
          title: 'Analisi del rischio',
          description:
            'Le domande del questionario varieranno in base alle risposte fornite man mano. Modificando la risposta a una domanda precedente, le successive domande potrebbero variare',
        }}
      </StyledIntro>
      <StyledForm onSubmit={formik.handleSubmit}>
        {Object.keys(questions).map((id, i) => {
          const { type, label, options, infoLabel, required } = questions[id] as Question

          const untypedProps = {
            name: id,
            value: formik.values[id],
            type,
            setFieldValue: formik.setFieldValue,
            onChange: formik.handleChange,
            label,
            options,
            error: formik.errors[id],
            infoLabel,
            required,
            emptyLabel: 'Nessun valore disponibile',
          }

          const props = {
            text: untypedProps as StyledInputControlledTextProps,
            radio: untypedProps as StyledInputControlledRadioProps,
            checkbox: untypedProps as StyledInputControlledCheckboxMultipleProps,
            'select-one': untypedProps as StyledInputControlledSelectProps,
          }[type]

          return <StyledInput key={i} {...props} />
        })}

        <StepActions
          back={{ label: 'Indietro', type: 'button', onClick: back }}
          forward={{ label: 'Salva bozza e prosegui', type: 'submit' }}
        />
      </StyledForm>
    </Paper>
  )
}
