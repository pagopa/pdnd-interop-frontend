import {
  CheckboxGroup,
  RadioGroup,
  Select,
  TextField,
} from '@/components/shared/ReactHookFormInputs'
import { InputOption } from '@/types/common.types'
import React from 'react'
import { boolean, mixed, object, string } from 'yup'
import { ObjectShape } from 'yup/lib/object'
import identity from 'lodash/identity'
import {
  Dependency,
  DynamicFormOperations,
  Questions,
  QuestionV1,
  QuestionV2,
} from '../types/risk-analysis.types'
import { RiskAnalysisSwitch } from '../components/PurposeEditStep2RiskAnalysis/RiskAnalysisSwitch'

export const dynamicFormOperationsVersions: DynamicFormOperations = {
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
        t('edit.step2.singleCheckboxField.validation.mixed.required'),
        (value) => typeof value !== 'undefined' && value.length > 0
      )
      const multiCheckbox = mixed().test(
        'presence',
        t('edit.step2.multiCheckboxField.validation.mixed.required'),
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

    buildForm: (questions, _, lang, t) => {
      const questionKeys = Object.keys(questions)

      const formComponents = questionKeys.map((id, i) => {
        const { type, label, options, infoLabel } = questions[id] as QuestionV1

        const sx = questionKeys.length - 1 === i ? { mb: 0 } : {}
        const inputOptions = options ? options.map((o) => ({ ...o, label: o.label[lang] })) : []
        const commonProps = {
          key: id,
          name: id,
          label: label[lang],
          infoLabel: infoLabel ? infoLabel[lang] : undefined,
          sx,
        }

        switch (type) {
          case 'text':
            return <TextField {...commonProps} />

          case 'select-one':
            return (
              <Select
                {...commonProps}
                options={inputOptions}
                emptyLabel={t('edit.step2.emptyLabel')}
              />
            )

          case 'checkbox':
            return <CheckboxGroup {...commonProps} options={inputOptions} />

          case 'radio':
            return <RadioGroup {...commonProps} options={inputOptions} />
        }
      })

      return { formComponents: formComponents, isSubmitBtnDisabled: false }
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
        t('edit.step2.multiCheckboxField.validation.mixed.required'),
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
        const questionType = question.type as keyof typeof validationOptions

        const validationOption = validationOptions[questionType]

        return { ...acc, [id]: validationOption }
      }, {} as ObjectShape)

      return object(schema)
    },

    buildForm: (questions, formMethods, lang, t) => {
      const values = formMethods.getValues()

      const formComponents: Array<React.ReactNode> = []

      const questionIds = Object.keys(questions)

      type QuestionOption = Exclude<QuestionV2['options'], undefined>[0]

      function checkOptionDependency(dependency: Dependency) {
        const currentDepValue = values[dependency.id]

        const hasDependency =
          currentDepValue === dependency.value ||
          (Array.isArray(currentDepValue) &&
            (currentDepValue as string[]).includes(dependency.value as string))

        return hasDependency
      }

      function parseOption(option: QuestionOption, { hideOption, id, defaultValue }: QuestionV2) {
        // if the key "hideOption" is present in the question object and the conditions are satisfied
        // the option will be not added to the array of options
        const shouldHideOption =
          hideOption &&
          hideOption[option.value] &&
          hideOption[option.value].some(checkOptionDependency)

        if (!shouldHideOption) {
          return { value: option.value, label: option.label[lang] }
        }

        if ((values[id] as string[])?.includes(option.value)) {
          formMethods.setValue(id, defaultValue)
        }
      }

      function buildFormQuestionComponents(
        { id, type, ...question }: QuestionV2,
        inputOptions: Array<InputOption>,
        isLast: boolean
      ) {
        const questionComponents: Array<React.ReactNode> = []

        const maxLength = question?.validation?.maxLength
        const isRequired = question.required
        const isMultipleChoice = question.dataType === 'multi'

        let label = question.label[lang]
        let infoLabel = question.infoLabel && question.infoLabel[lang]

        if (maxLength) {
          const maxLengthLabel = t('edit.step2.validation.maxLength', { num: maxLength })
          if (infoLabel) {
            infoLabel += `. ${maxLengthLabel}`
          } else {
            infoLabel = maxLengthLabel
          }
        }

        const labelValidation: Array<string> = []

        if (isRequired) {
          labelValidation.push(t('edit.step2.validation.required'))
        }

        if (isMultipleChoice) {
          labelValidation.push(t('edit.step2.validation.multipleChoice'))
        }

        if (labelValidation.length > 0) {
          label += ` (${labelValidation.join(', ')})`
        }

        const sx = isLast ? { mb: 0 } : {}
        const commonProps = { key: id, name: id, label, infoLabel, sx }

        switch (type) {
          case 'text':
            questionComponents.push(<TextField {...commonProps} inputProps={{ maxLength }} />)
            break
          case 'select-one':
            questionComponents.push(
              <Select
                {...commonProps}
                options={inputOptions}
                emptyLabel={t('edit.step2.emptyLabel')}
              />
            )
            break
          case 'checkbox':
            questionComponents.push(<CheckboxGroup {...commonProps} options={inputOptions} />)
            break
          case 'radio':
            questionComponents.push(<RadioGroup {...commonProps} options={inputOptions} />)
            break
          case 'switch':
            questionComponents.push(<RiskAnalysisSwitch {...commonProps} options={inputOptions} />)
            break
        }

        return questionComponents
      }

      for (let i = 0; i < questionIds.length; i++) {
        const questionId = questionIds[i]

        const question = questions[questionId] as QuestionV2

        const inputOptions = (question.options
          ?.map((option) => parseOption(option, question))
          .filter(identity) || []) as Array<InputOption>

        formComponents.push(
          ...buildFormQuestionComponents(question, inputOptions, questionIds.length - 1 === i)
        )
      }

      return { formComponents, isSubmitBtnDisabled: false }
    },
  },
}

export function getFormOperations(version: string) {
  const dynamicFormOperations = dynamicFormOperationsVersions[version]

  if (!dynamicFormOperations) {
    throw new Error('There is no business logic for this specific risk analysis data form')
  }

  return dynamicFormOperations
}
