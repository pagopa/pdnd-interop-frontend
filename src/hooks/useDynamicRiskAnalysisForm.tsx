import React, { useContext, useState } from 'react'
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
import { InputCheckboxOption, InputRadioOption, InputSelectOption, LangCode } from '../../types'
import { StyledButton } from '../components/Shared/StyledButton'
import { FE_URL } from '../lib/env'
import { Alert } from '@mui/material'

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
    blockedAlert?: MultiLangEntry
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
   *   PREPARE_ICE_CREAM: [
   *     {
   *       id: "hasMilk",
   *       value: false,
   *     }
   *   ]
   * }
   * ```
   *
   * If the user sets the value false to the "hasMilk" question, the option "PREPARE_ICE_CREAN"
   * will be hidden
   *
   */
  hideOption?: Record<
    string,
    Array<{
      id: string
      value: unknown
      action: 'disable'
    }>
  >
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
) => { formComponents: Array<JSX.Element>; isSubmitBtnDisabled: boolean }

type DynamicFormOperations = Record<
  string,
  {
    /**
     * Returns the updated question data.
     *
     * @param values - the actual form values
     * @param riskAnalysis - the risk analysis document
     *
     * @returns the updated questions data
     * */
    getUpdatedQuestions: GetUpdatedQuestions
    /**
     * Returns the updated yup validation schema.
     *
     * @param questionsObj - the actual updated questions visible to the user
     * @param t - the TFunction of nexti18 internalization library
     *
     * @returns The updated object schema
     * ```ts
     *  object({
     *    [question.id]: ObjectSchema | BooleanSchema // etc...
     *  })
     *
     * ```
     * */
    getUpdatedValidation: GetUpdatedValidation
    /**
     * Returns the updated form components.
     *
     * @param questions - the actual updated questions visible to the user
     * @param formik - formik object
     * @param lang - the actual active language
     * @param t - the TFunction of nexti18 internalization library
     *
     * @returns Array of components that should be rendered inside the form
     * */
    buildForm: BuildForm
  }
>

type Questions = Record<string, Question>
type Answers = Record<string, unknown>

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

      const formComponents = questionKeys.map((id, i) => {
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

      return { formComponents, isSubmitBtnDisabled: false }
    },
  },
  '2.0': {
    getUpdatedQuestions: (values, riskAnalysis) => {
      const questions = riskAnalysis.questions as Array<QuestionV2>

      // Filters all the questions that not satisfies the dependency inside the "dependencies" property
      const updatedQuestions = questions.filter(({ dependencies }) => {
        function satisfiesDependency(dep: QuestionV2['dependencies'][0]) {
          if (Array.isArray(values[dep.id])) {
            return (values[dep.id] as Array<unknown>).includes(dep.value)
          }
          if (Array.isArray(dep.value)) {
            return dep.value.includes(values[dep.id])
          }
          return values[dep.id] === dep.value
        }
        // If length of dependencies array is 0 the "every" method returns true
        return dependencies.every(satisfiesDependency)
      })

      // Array<Question> -> Record<"id", Question>
      return updatedQuestions.reduce((acc, next) => ({ ...acc, [next.id]: next }), {} as Questions)
    },

    getUpdatedValidation: (questionsObj, t) => {
      const text = string().required()
      const radio = string().required()
      const selectOne = string().required()
      const checkbox = mixed().test(
        'presence',
        t('create.step2.multiCheckboxField.validation.mixed.required'),
        (value) => typeof value !== 'undefined' && value.length > 0
      )
      const switchSchemaValidation = boolean().isTrue()

      const validationOptions = {
        text,
        radio,
        'select-one': selectOne,
        checkbox,
        switch: switchSchemaValidation,
      }

      const schema = Object.keys(questionsObj).reduce((acc, next) => {
        const id: string = next
        const question = questionsObj[id] as QuestionV2
        const questionType = question.inputType as keyof typeof validationOptions

        const validationOption = validationOptions[questionType]

        return { ...acc, [id]: validationOption }
      }, {} as ObjectShape)

      return object(schema)
    },

    buildForm: (questions, formik, lang, t) => {
      const forceUserToCheckEServiceCatalogue: { questionId?: string; alert?: string } = {}
      const formComponents: Array<JSX.Element> = []
      let isSubmitBtnDisabled = false

      const questionIds = Object.keys(questions)

      questionIds.forEach((id, i) => {
        // if forceUserToCheckEServiceCatalogue.questionId value is defined, it means that the rest of the question
        // should not be rendered
        if (forceUserToCheckEServiceCatalogue.questionId) {
          return
        }

        const { inputType, label, options, infoLabel, required, hideOption, defaultValue } =
          questions[id] as QuestionV2

        const inputOptions: Array<InputCheckboxOption & InputRadioOption & InputSelectOption> = []

        if (options) {
          options.forEach((option) => {
            // for this option, if the forceUserCheckEServiceCatalog is true, and the option value is currently selected
            // then we need to force the user to check the eServiceCatalogue and disable the submit button
            if (option?.forceUserCheckEServiceCatalog && formik.values[id] === option.value) {
              isSubmitBtnDisabled = true
              forceUserToCheckEServiceCatalogue.alert =
                option.blockedAlert && option.blockedAlert[lang]
              forceUserToCheckEServiceCatalogue.questionId = id
            }

            // if the key "hideOption" is present in the question object and the conditions are satisfied
            // the option will be not added to the array of options
            const shouldHideOption =
              hideOption &&
              hideOption[option.value] &&
              hideOption[option.value].some((dep) => {
                const actualDepValue = formik.values[dep.id]

                if (
                  actualDepValue === dep.value ||
                  (Array.isArray(actualDepValue) &&
                    (actualDepValue as string[]).includes(dep.value as string))
                ) {
                  if ((formik.values[id] as string[]).includes(option.value)) {
                    formik.setFieldValue(id, defaultValue)
                  }
                  return true
                }
              })

            if (!shouldHideOption) {
              inputOptions.push({ value: option.value, label: option.label[lang] })
            }
          })
        }

        const untypedProps = {
          name: id,
          value: formik.values[id],
          type: inputType,
          setFieldValue: formik.setFieldValue,
          onChange: formik.handleChange,
          label: label[lang],
          options: inputOptions,
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
          switch: untypedProps as StyledInputControlledSwitchProps,
        }[inputType]

        const sx = questionIds.length - 1 === i ? { mb: 0 } : undefined

        formComponents.push(<StyledInput key={id} {...props} sx={sx} />)

        if (forceUserToCheckEServiceCatalogue.alert) {
          formComponents.push(
            <Alert
              key={'alert-' + forceUserToCheckEServiceCatalogue.alert}
              sx={{ mt: 2 }}
              severity="warning"
            >
              {forceUserToCheckEServiceCatalogue.alert}
            </Alert>
          )
        }

        if (forceUserToCheckEServiceCatalogue.questionId) {
          formComponents.push(
            <StyledButton
              key={'button-' + forceUserToCheckEServiceCatalogue.questionId}
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => window.open(FE_URL, '_blank')}
            >
              Salva e vai sul Catalogo API
            </StyledButton>
          )
        }
      })

      return { formComponents, isSubmitBtnDisabled }
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

function useDynamicRiskAnalysisForm(
  riskAnalysisConfig: RiskAnalysis,
  handleSubmit: (validAnswers: Answers) => void
) {
  const { t } = useTranslation('purpose')

  const [validation, setValidation] = useState({})
  const [questions, setQuestions] = useState<Questions>({})
  const [prevFormikValues, setPrevFormikValues] = useState<Record<string, unknown>>({})
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

  // If formik values reference has changed, update the questions and the validation
  if (prevFormikValues !== formik.values) {
    setPrevFormikValues(formik.values)

    const updatedQuestions = dynamicFormOperations.getUpdatedQuestions(
      formik.values,
      riskAnalysisConfig
    )
    setQuestions(updatedQuestions)
    // Update the validation schema to validate only questions that are currently rendered
    const updatedValidation = dynamicFormOperations.getUpdatedValidation(updatedQuestions, t)
    setValidation(updatedValidation)
  }

  const { formComponents, isSubmitBtnDisabled } = dynamicFormOperations.buildForm(
    questions,
    formik,
    lang,
    t
  )

  return { formik, isSubmitBtnDisabled, formComponents }
}

export default useDynamicRiskAnalysisForm
