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
import { useFeedback } from '../hooks/useFeedback'
import { useLocation } from 'react-router-dom'
import { getBits } from '../lib/router-utils'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { Purpose } from '../../types'

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
  helperText?: string
  required: boolean
}

type RiskAnalysis = {
  version: string
  questions: Array<Question>
}

type Questions = Record<string, Question>
type Answers = Record<string, unknown>

export const PurposeWriteStep2RiskAnalysis: FunctionComponent<ActiveStepProps> = ({
  back,
  forward,
}) => {
  const location = useLocation()
  const bits = getBits(location)
  const purposeId = bits[bits.length - 1]

  const riskAnalysisConfig = _riskAnalysisConfig as RiskAnalysis
  const { runAction } = useFeedback()
  const [validation, setValidation] = useState({})
  const [questions, setQuestions] = useState<Questions>({})
  const initialValues = riskAnalysisConfig.questions.reduce(
    (acc, { id, defaultValue }) => ({ ...acc, [id]: defaultValue }),
    {}
  ) as Answers

  const { data: purposeData } = useAsyncFetch<Purpose>(
    { path: { endpoint: 'PURPOSE_GET_SINGLE' }, config: { params: { purposeId } } },
    { loadingTextLabel: 'Stiamo caricando le informazioni della finalità' }
  )

  const onSubmit = async (riskAnalysisForm: unknown) => {
    const dataToPost = {
      riskAnalysisForm,
      title: purposeData?.title,
      description: purposeData?.description,
      eserviceId: purposeData?.eservice.id,
    }
    console.log('submit', dataToPost)
    const { outcome } = await runAction(
      { path: { endpoint: 'PURPOSE_UPDATE' }, config: { data: dataToPost } },
      { suppressToast: true }
    )

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
      const queuedQuestions = Object.values(acc).map((d) => d.id)

      const satisfiesAllDependencies = next.dependencies.every((d) => {
        const isInArray = queuedQuestions.includes(d.id)
        const id = d.id as string

        const hasSameValue = Array.isArray(formik.values[id])
          ? (formik.values[id] as Array<unknown>).includes(d.value)
          : formik.values[id] === d.value

        return isInArray && hasSameValue
      })

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

  useEffect(() => {
    // Update the questions that have to be shown
    const updatedQuestions = getUpdatedQuestions()
    setQuestions(updatedQuestions)
    // Update the validation schema to validate only questions that are currently rendered
    const updatedValidation = getUpdatedValidation(updatedQuestions)
    setValidation(updatedValidation)
  }, [formik.values]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledForm onSubmit={formik.handleSubmit}>
      {Object.keys(questions).map((id, i) => {
        const { type, label, options, helperText, required } = questions[id] as Question

        const untypedProps = {
          name: id,
          value: formik.values[id],
          type,
          setFieldValue: formik.setFieldValue,
          onChange: formik.handleChange,
          label,
          options,
          error: formik.errors[id],
          helperText,
          required,
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
  )
}
