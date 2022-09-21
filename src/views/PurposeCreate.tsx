import React, { useState } from 'react'
import {
  EServiceFlatReadType,
  InputSelectOption,
  Purpose,
  PurposeLegalBasisAnswer,
  PurposeRiskAnalysisFormAnswers,
} from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { StyledInputControlledSelect } from '../components/Shared/StyledInputControlledSelect'
import { StyledPaper } from '../components/StyledPaper'
import { Alert, Divider, Grid, Stack, Typography } from '@mui/material'
import { StyledInputControlledSwitch } from '../components/Shared/StyledInputControlledSwitch'
import { StyledInputControlledAutocomplete } from '../components/Shared/StyledInputControlledAutocomplete'
import { DescriptionBlock } from '../components/DescriptionBlock'
import _riskAnalysisConfigV1 from '../data/risk-analysis/v1.0.json'
import _riskAnalysisConfigPAV2 from '../data/risk-analysis/pa/v2.0.json'
import { useContext } from 'react'
import { LangContext } from '../lib/context'
import { useMemo } from 'react'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { StyledButton } from '../components/Shared/StyledButton'
import { useHistory } from 'react-router-dom'
import { useRoute } from '../hooks/useRoute'
import { RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { omit } from 'lodash'
import { AxiosResponse } from 'axios'
import { buildDynamicRoute } from '../lib/router-utils'
import { Question } from '../hooks/useDynamicRiskAnalysisForm'

function getRiskAnalysis(version: string) {
  return { '1.0': _riskAnalysisConfigV1, '2.0': _riskAnalysisConfigPAV2 }[version]
}

export const PurposeCreate = () => {
  const history = useHistory()
  const { routes } = useRoute()
  const { runAction } = useFeedback()
  const { t } = useTranslation('purpose')
  const { jwt } = useJwt()
  const [eserviceId, setEserviceId] = useState('')
  const [isTemplate, setIsTemplate] = useState(false)
  const [purposeTemplate, setPurposeTemplate] = useState<Purpose | null>(null)

  const DEFAULT_PURPOSE_DATA = {
    title: t('create.defaultPurpose.title'),
    description: t('create.defaultPurpose.description'),
  }

  const {
    data: eserviceData,
    isLoading: eserviceIsLoading,
    error,
  } = useAsyncFetch<Array<EServiceFlatReadType>, Array<InputSelectOption>>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: {
        params: {
          callerId: jwt?.organization.id,
          consumerId: jwt?.organization.id,
          agreementStates: 'ACTIVE',
          state: 'PUBLISHED',
        },
      },
    },
    {
      mapFn: (data) =>
        data.map((d) => ({
          label: `${d.name} erogato da ${d.producerName}`,
          value: d.id,
        })),
      onSuccess: (mappedData) => {
        const id = mappedData && mappedData.length > 0 ? (mappedData[0].value as string) : ''
        setEserviceId(id)
      },
    }
  )

  const { data: purposeData, isLoading: purposeIsLoading } = useAsyncFetch<
    { purposes: Array<Purpose> },
    Array<Purpose>
  >(
    {
      path: { endpoint: 'PURPOSE_GET_LIST' },
      config: {
        params: {
          eserviceId,
          states: ['ACTIVE', 'SUSPENDED', 'ARCHIVED'],
        },
      },
    },
    {
      mapFn: (data) => data.purposes.sort((a, b) => a.title.localeCompare(b.title)),
      useEffectDeps: [eserviceId, isTemplate],
      disabled: !isTemplate || eserviceId === '',
      onSuccess: (data) => {
        if (data && data.length > 0) {
          setPurposeTemplate(data[0])
        }
      },
    }
  )

  const wrapSetEserviceId = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement
    setPurposeTemplate(null)
    setEserviceId(target.value)
  }
  const wrapSetIsTemplate = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement
    setPurposeTemplate(null)
    setIsTemplate(target.checked)
  }

  const wrapSetPurpose = (_purpose: Purpose | Array<Purpose> | null) => {
    setPurposeTemplate(_purpose as Purpose | null)
  }

  const createNewPurpose = async () => {
    const dataToPost: Partial<Purpose & { eserviceId: string }> = purposeTemplate
      ? {
          ...omit(purposeTemplate, [
            'consumerId',
            'id',
            'agreement',
            'clients',
            'versions',
            'createdAt',
            'eservice',
            'suspendedByConsumer',
            'updatedAt',
          ]),
          title: `${purposeTemplate.title} — clone`,
        }
      : DEFAULT_PURPOSE_DATA

    dataToPost.consumerId = jwt?.organization.id
    dataToPost.eserviceId = eserviceId

    const { outcome, response } = (await runAction(
      {
        path: { endpoint: 'PURPOSE_DRAFT_CREATE' },
        config: { data: dataToPost },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      const newPurposeId = (response as AxiosResponse).data.id
      const onSuccessDestination = buildDynamicRoute(routes.SUBSCRIBE_PURPOSE_EDIT, {
        purposeId: newPurposeId,
      })

      await runAction(
        {
          path: {
            endpoint: 'PURPOSE_VERSION_DRAFT_CREATE',
            endpointParams: { purposeId: newPurposeId },
          },
          config: { data: { dailyCalls: 1 } },
        },
        { onSuccessDestination }
      )
    }
    //
  }
  const backToPurposeList = () => {
    history.push(routes.SUBSCRIBE_PURPOSE_LIST.PATH)
  }

  // const transformFn = (options: Array<Purpose>, search: string) => {
  //   return options
  // }

  if (eserviceIsLoading) {
    return <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
  }

  if (error) {
    return <span>ricarica la pagina</span>
  }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: t('create.emptyTitle') }}</StyledIntro>

      <Grid container sx={{ maxWidth: 1280 }}>
        <Grid item lg={8} sx={{ width: '100%' }}>
          <StyledPaper>
            <StyledInputControlledSelect
              focusOnMount={true}
              name="eserviceId"
              label={t('create.eserviceField.label')}
              value={eserviceId}
              onChange={wrapSetEserviceId}
              options={eserviceData}
              emptyLabel="Nessun E-Service associabile"
            />
            <StyledInputControlledSwitch
              name="isTemplate"
              label={t('create.isTemplateField.label')}
              value={isTemplate}
              onChange={wrapSetIsTemplate}
            />
            {isTemplate && (
              <>
                <PurposeTemplateAutocompleteInput
                  onChange={wrapSetPurpose}
                  options={purposeData}
                  defaultValue={purposeTemplate}
                  isLoading={purposeIsLoading}
                />
                <PurposeTemplatePreview purposeTemplate={purposeTemplate} />
              </>
            )}
          </StyledPaper>

          <PageBottomActions>
            <StyledButton
              variant="contained"
              onClick={createNewPurpose}
              disabled={isTemplate && !purposeTemplate}
            >
              {t('create.createNewPurposeBtn')}
            </StyledButton>
            <StyledButton variant="text" onClick={backToPurposeList}>
              {t('create.backToListBtn')}
            </StyledButton>
          </PageBottomActions>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

type PurposeTemplateAutocompleteInputProps = {
  onChange: (purpose: Purpose | Array<Purpose> | null) => void
  options: Array<Purpose> | undefined
  defaultValue: Purpose | null
  isLoading: boolean
}

function PurposeTemplateAutocompleteInput({
  onChange,
  options = [],
  defaultValue,
  isLoading,
}: PurposeTemplateAutocompleteInputProps) {
  const { t } = useTranslation('purpose')

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center">
        <LoadingWithMessage label={t('create.purposeField.loadingLabel')} />
      </Stack>
    )
  }

  if (options.length === 0) {
    return <Alert severity="warning">{t('create.purposeField.noDataLabel')}</Alert>
  }

  return (
    <StyledInputControlledAutocomplete
      label={t('create.purposeField.label')}
      sx={{ mt: 6, mb: 0 }}
      placeholder="..."
      name="selection"
      onChange={onChange}
      options={options}
      getOptionLabel={({ title, consumerId }: Purpose) =>
        t('create.purposeField.compiledBy', { title, consumerId })
      }
      isOptionEqualToValue={(option: Purpose, value: Purpose) => option.id === value.id}
      defaultValue={defaultValue}
    />
  )
}

type PurposeTemplatePreviewProps = {
  purposeTemplate: Purpose | null
}

function PurposeTemplatePreview({ purposeTemplate }: PurposeTemplatePreviewProps) {
  const { t } = useTranslation('purpose')
  const { lang } = useContext(LangContext)

  // TEMP REFACTOR
  const riskAnalysisFormAnswers = useMemo(() => {
    if (!purposeTemplate) return

    const riskAnalysisConfig = getRiskAnalysis(purposeTemplate.riskAnalysisForm.version)

    if (!riskAnalysisConfig) return

    // Answers in this form
    const answerIds = Object.keys(purposeTemplate.riskAnalysisForm.answers)

    // Corresponding questions
    const questionsWithAnswer = (riskAnalysisConfig.questions as Array<Question>).filter(({ id }) =>
      answerIds.includes(id)
    )

    const answers = questionsWithAnswer.map(({ label, options, id, type }) => {
      const question = label[lang]

      // Get the value of the answer
      // The value can be of three types: plain text, multiple options, single option
      const answerValue =
        purposeTemplate.riskAnalysisForm.answers[id as keyof PurposeRiskAnalysisFormAnswers]

      // Plain text: this value comes from a text field
      if (type === 'text') {
        return { question, answer: answerValue }
      }

      // Multiple options: this value comes from a multiple choice checkbox
      if (Array.isArray(answerValue)) {
        const selectedOptions = options?.filter(({ value }) =>
          answerValue.includes(value as PurposeLegalBasisAnswer)
        )
        const answer = selectedOptions?.map((o) => o.label[lang]).join(', ')
        return { question, answer }
      }

      // Single option: this value comes from an option field (select, radio, checkbox, etc)
      const answer = options?.find(({ value }) => answerValue === value)?.label[lang]
      return { question, answer }
    })

    return answers
  }, [purposeTemplate, lang])

  if (!purposeTemplate) return null

  return (
    <React.Fragment>
      <Divider sx={{ my: 6 }} />
      <Typography component="h2" variant="h6">
        {t('create.purposePreviewTitle')}
      </Typography>

      <DescriptionBlock label={t('create.consumerName')}>
        {purposeTemplate.consumerId}
      </DescriptionBlock>

      <DescriptionBlock label={t('create.purposeTitle')}>{purposeTemplate.title}</DescriptionBlock>

      <DescriptionBlock label={t('create.purposeDescription')}>
        {purposeTemplate.description}
      </DescriptionBlock>

      {riskAnalysisFormAnswers &&
        riskAnalysisFormAnswers.map(({ question, answer }, i) => {
          return (
            <DescriptionBlock key={i} label={question}>
              {answer}
            </DescriptionBlock>
          )
        })}
    </React.Fragment>
  )
}
