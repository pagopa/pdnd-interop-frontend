import React, { useContext, useEffect, useState } from 'react'
import { StyledInput } from '../components/Shared/StyledInput'
import { FormikProps, useFormik } from 'formik'
import { TFunction, useTranslation } from 'react-i18next'
import { string, mixed, object, boolean, AnyObjectSchema } from 'yup'
import { ObjectShape } from 'yup/lib/object'
import { StyledInputControlledTextProps } from '../components/Shared/StyledInputControlledText'
import { LangContext } from '../lib/context'
import { StyledInputControlledRadioProps } from '../components/Shared/StyledInputControlledRadio'
import { StyledInputControlledCheckboxMultipleProps } from '../components/Shared/StyledInputControlledCheckboxMultiple'
import { StyledInputControlledSelectProps } from '../components/Shared/StyledInputControlledSelect'
import { StyledInputControlledSwitchProps } from '../components/Shared/StyledInputControlledSwitch'
import { LangCode } from '../../types'

type MultiLangEntry = {
  it: string
  en: string
}

type QuestionV1 = {
  id: string
  label: MultiLangEntry
  defaultValue: unknown
  options?: Array<{
    label: MultiLangEntry
    value: string
  }>
  dependencies: Array<{
    id: string
    value: unknown
  }>
  type: 'text' | 'radio' | 'checkbox' | 'select-one'
  infoLabel?: MultiLangEntry
  required: boolean
}

type QuestionV2 = {
  id: string
  /**
   * The HTML5 input type
   */
  inputType: 'text' | 'radio' | 'checkbox' | 'select-one' | 'switch'
  /**
   * Used for backend validation
   */
  dataType: 'single' | 'multi' | 'freeText'
  label: MultiLangEntry
  defaultValue: unknown
  options?: Array<{
    label: MultiLangEntry
    value: string
    forceUserCheckEServiceCatalog?: boolean
  }>
  dependencies: Array<{
    id: string
    value: unknown
  }>
  /**
   * Declares the dependency of the state of one of its own option if the user
   * sets a specific value in another question.
   * EX:
   *
   * ```ts
   * {
   *   option: "PREPARE_ICE_CREAM"
   *   dependencies: [
   *     {
   *       id: "hasMilk",
   *       value: false,
   *       action: "disable"
   *     }
   *   ]
   * }
   * ```
   *
   * If the user sets the value fakse to the "hasMilk" question, the option "PREPARE_ICE_CREAN"
   * will be disabled for this question
   *
   */
  optionsDependencies: Array<{
    option: string
    dependencies: Array<{
      id: string
      value: unknown
      action: 'disable'
    }>
  }>
  infoLabel?: MultiLangEntry
  required: boolean
}

export type Question = QuestionV1 | QuestionV2

export type RiskAnalysis = {
  version: string
  questions: Array<Question>
}

type GetUpdatedQuestions = (values: Answers, riskAnalysis: RiskAnalysis) => Questions
type GetUpdatedValidation = (questionsObj: Questions, t: TFunction) => AnyObjectSchema
type BuildForm = (
  questions: Questions,
  formik: FormikProps<Answers>,
  lang: LangCode,
  t: TFunction
) => Array<JSX.Element>

type DynamicFormOperations = Record<
  string,
  {
    getUpdatedQuestions: GetUpdatedQuestions
    getUpdatedValidation: GetUpdatedValidation
    buildForm: BuildForm
  }
>

const dynamicFormOperationsVersions: DynamicFormOperations = {
  '1.0': {
    getUpdatedQuestions: (values, riskAnalysis) => {
      const updatedQuestions = riskAnalysis.questions.reduce((acc, next) => {
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
          const hasSameValue = Array.isArray(values[id])
            ? (values[id] as Array<unknown>).includes(d.value)
            : values[id] === d.value

          return isInArray && hasSameValue
        })

        // Then it needs to be added as a new question to ask
        if (satisfiesAllDependencies) {
          acc[next.id] = next
        }

        return acc
      }, {} as Questions)
      return updatedQuestions
    },

    getUpdatedValidation: (questionsObj, t) => {
      const text = string().required()
      const radio = string().required()
      // const radio = mixed().oneOf(['YES', 'NO']).required()
      const selectOne = string().required()
      const checkbox = string().required()
      const singleCheckbox = mixed().test(
        'presence',
        t('create.step2.singleCheckboxField.validation.mixed.required'),
        (value) => typeof value !== 'undefined' && value.length > 0
      )
      const multiCheckbox = mixed().test(
        'presence',
        t('create.step2.multiCheckboxField.validation.mixed.required'),
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
        const question = questionsObj[next] as QuestionV1
        const questionType = question.type as keyof typeof validationOptions

        let validationOption = validationOptions[questionType]
        if (questionType === 'checkbox') {
          const typedOptions = (question.options as QuestionV1['options'])!
          validationOption = typedOptions.length > 1 ? multiCheckbox : singleCheckbox
        }

        acc[id] = validationOption
        return acc
      }, {} as ObjectShape)

      return object(schema)
    },

    buildForm: (questions, formik, lang, t) => {
      const questionKeys = Object.keys(questions)

      return questionKeys.map((id, i) => {
        const { type, label, options, infoLabel, required } = questions[id] as QuestionV1

        const untypedProps = {
          name: id,
          value: formik.values[id],
          type,
          setFieldValue: formik.setFieldValue,
          onChange: formik.handleChange,
          label: label[lang],
          options: options && options.map((o) => ({ ...o, label: o.label[lang] })),
          error: formik.errors[id],
          infoLabel: infoLabel && infoLabel[lang],
          required,
          emptyLabel: t('create.step2.emptyLabel'),
        }

        const props = {
          text: untypedProps as StyledInputControlledTextProps,
          radio: untypedProps as StyledInputControlledRadioProps,
          checkbox: untypedProps as StyledInputControlledCheckboxMultipleProps,
          'select-one': untypedProps as StyledInputControlledSelectProps,
        }[type]

        const sx = questionKeys.length - 1 === i ? { mb: 0 } : undefined
        return <StyledInput key={i} {...props} sx={sx} />
      })
    },
  },
  // TODO: V2 Business logic
  '2.0': {
    getUpdatedQuestions: (values, riskAnalysis) => {
      return {}
    },

    getUpdatedValidation: (questionsObj, t) => {
      return object()
    },

    buildForm: (questions, formik, lang, t) => {
      return [<></>]
    },
  },
}

function getFormOperations(version: string) {
  const dynamicFormOperations = dynamicFormOperationsVersions[version]

  if (!dynamicFormOperations) {
    throw new Error('There is no business logic for this specific risk analysis data form')
  }

  return dynamicFormOperations
}

type Questions = Record<string, Question>
type Answers = Record<string, unknown>

function useDynamicRiskAnalysisForm(
  riskAnalysisConfig: RiskAnalysis,
  handleSubmit: (validAnswers: Answers) => void
) {
  const { t } = useTranslation('purpose')

  const [validation, setValidation] = useState({})
  const [questions, setQuestions] = useState<Questions>({})
  const { lang } = useContext(LangContext)

  const dynamicFormOperations = getFormOperations(riskAnalysisConfig.version)

  const initialValues = riskAnalysisConfig.questions.reduce(
    (acc, { id, defaultValue }) => ({ ...acc, [id]: defaultValue }),
    {}
  ) as Answers

  const onSubmit = async (allAnswers: Record<string, unknown>) => {
    const currentQuestions = Object.keys(questions)
    // Send only answers to currently visible questions
    const validAnswers = Object.keys(allAnswers).reduce(
      (acc, key) => (currentQuestions.includes(key) ? { ...acc, [key]: allAnswers[key] } : acc),
      {}
    )

    handleSubmit(validAnswers)
  }

  const formik = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  })

  // TEMP REFACTOR
  // This is a very very very ugly piece of code. Find another way
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Update the questions that have to be shown
    const updatedQuestions = dynamicFormOperations.getUpdatedQuestions(
      formik.values,
      riskAnalysisConfig
    )
    setQuestions(updatedQuestions)
    // Update the validation schema to validate only questions that are currently rendered
    const updatedValidation = dynamicFormOperations.getUpdatedValidation(updatedQuestions, t)
    setValidation(updatedValidation)
  }, [
    // v1.0
    formik.values.usesPersonalData,
    formik.values.usesThirdPartyPersonalData,
    formik.values.usesConfidentialData,
    formik.values.securedDataAccess,
    formik.values.knowsAccessedDataCategories,
    formik.values.accessDataArt9Gdpr,
    formik.values.accessUnderageData,
    formik.values.dataQuantity,
    formik.values.deliveryMethod,
    formik.values.definedDataRetentionPeriod,

    // v2.0
    formik.values.purpose,
    formik.values.institutionalPurpose,
    formik.values.otherPurpose,
    formik.values.personalDataTypes,
    formik.values.otherPersonalDataTypes,
    formik.values.legalObligationReference,
    formik.values.legalBasisPublicInterest,
    formik.values.ruleOfLawText,
    formik.values.administrativeActText,
    formik.values.publicInterestTaskText,
    formik.values.dataQuantity,
    formik.values.policyProvided,
    formik.values.reasonPolicyNotProvided,
    formik.values.confirmPricipleIntegrityAndDiscretion,
    formik.values.confirmedDoneDpia,
    formik.values.dataRetentionPeriod,
    formik.values.usesThirdPartyData,
    formik.values.doesUseThirdPartyData,
    formik.values.declarationConfirmGDPR,

    // Common
    formik.values.legalBasis,
    formik.values.knowsDataQuantity,
    formik.values.deliveryMethod,
    formik.values.doneDpia,
    formik.values.purposePursuit,
    formik.values.checkedExistenceMereCorrectnessInteropCatalogue,
    formik.values.checkedAllDataNeeded,
    formik.values.checkedExistenceMinimalDataInteropCatalogue,
  ])
  /* eslint-enable react-hooks/exhaustive-deps */

  const formComponents = dynamicFormOperations.buildForm(questions, formik, lang, t)

  return { formik, formComponents }
}

export default useDynamicRiskAnalysisForm
