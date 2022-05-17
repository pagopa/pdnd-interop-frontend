import React, { FunctionComponent, useContext, useEffect } from 'react'
import { useFormik } from 'formik'
import { object, string, number } from 'yup'
import {
  ApiEndpointKey,
  DecoratedPurpose,
  EServiceFlatReadType,
  InputSelectOption,
  Purpose,
  PurposeRiskAnalysisForm,
} from '../../types'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { PartyContext } from '../lib/context'
import { StepActions } from './Shared/StepActions'
import { StyledForm } from './Shared/StyledForm'
import { StyledInputControlledSelect } from './Shared/StyledInputControlledSelect'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { ActiveStepProps } from '../hooks/useActiveStep'
import { RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import { buildDynamicPath } from '../lib/router-utils'
import { decoratePurposeWithMostRecentVersion, getPurposeFromUrl } from '../lib/purpose'
import { useRoute } from '../hooks/useRoute'
import { Paper } from '@mui/material'
import { StyledIntro } from './Shared/StyledIntro'
import { LoadingWithMessage } from './Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'

type PurposeCreate = {
  title: string
  description: string
  eserviceId: string
}

type PurposeVersionCreate = {
  dailyCalls: number
}

type PurposeStep1Write = PurposeCreate & PurposeVersionCreate

type PurposeStep1SubmitData = {
  title: string
  description: string
  eserviceId?: string
  consumerId?: string
  riskAnalysisForm?: PurposeRiskAnalysisForm
}

export const PurposeCreateStep1General: FunctionComponent<ActiveStepProps> = ({ forward }) => {
  const { routes } = useRoute()
  const history = useHistory()
  const purposeId = getPurposeFromUrl(history.location)
  const { t } = useTranslation('purpose')

  const { runAction } = useFeedback()
  const { party } = useContext(PartyContext)
  const { data: eserviceData, isLoading: isEServiceReallyLoading } = useAsyncFetch<
    Array<EServiceFlatReadType>,
    Array<InputSelectOption>
  >(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { params: { callerId: party?.id, consumerId: party?.id, agreementStates: 'ACTIVE' } },
    },
    {
      mapFn: (data) =>
        data.map((d) => ({
          value: d.id,
          label: `${d.name} ${t('eserviceProvider')} ${d.producerName}`,
        })),
    }
  )

  const { data: purposeFetchedData, isLoading: isPurposeReallyLoading } = useAsyncFetch<
    Purpose,
    DecoratedPurpose
  >(
    { path: { endpoint: 'PURPOSE_GET_SINGLE', endpointParams: { purposeId } } },
    {
      mapFn: decoratePurposeWithMostRecentVersion,
    }
  )

  useEffect(() => {
    if (eserviceData && eserviceData.length > 0) {
      formik.setFieldValue('eserviceId', eserviceData[0].value, false)
    }

    // If there already is a draft, set its data
    if (purposeFetchedData) {
      formik.setFieldValue('title', purposeFetchedData.title, false)
      formik.setFieldValue('description', purposeFetchedData.description, false)
      formik.setFieldValue('dailyCalls', purposeFetchedData.versions[0].dailyCalls, false)
    }

    // Even if there are purposeData, it may happen that the eservice used
    // to create the previous draft is no longer available (e.g. it has been suspended).
    // To aviod this case, check if the eservice currently selected is among
    // those eligible to be chosen
    if (
      purposeFetchedData &&
      eserviceData &&
      eserviceData.length > 0 &&
      eserviceData.map((item) => item.value).includes(purposeFetchedData.eservice.id)
    ) {
      formik.setFieldValue('eserviceId', purposeFetchedData.eservice.id, false)
    }
  }, [purposeFetchedData, eserviceData]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: PurposeStep1Write) => {
    // Separate the data for the purpose and purpose version services
    const purposeData: PurposeStep1SubmitData = {
      title: data.title,
      description: data.description,
      eserviceId: data.eserviceId,
      consumerId: party?.id,
    }
    const purposeVersionData = { dailyCalls: data.dailyCalls }

    // Define which endpoint to call
    // Default to the creation endpoint for a new purpose
    let purposeEndpoint: ApiEndpointKey = 'PURPOSE_DRAFT_CREATE'
    let purposeEndpointParams = {}
    let purposeVersionEndpoint: ApiEndpointKey = 'PURPOSE_VERSION_DRAFT_CREATE'
    const isNewPurpose = !purposeFetchedData

    // If it's not a new purpose, update the variables for a call to the update service
    if (!isNewPurpose) {
      purposeEndpoint = 'PURPOSE_DRAFT_UPDATE'
      purposeEndpointParams = { purposeId }
      purposeVersionEndpoint = 'PURPOSE_VERSION_DRAFT_UPDATE'

      // Delete values the backend doesn't accept for an update
      delete purposeData.consumerId
      delete purposeData.eserviceId

      // Pass back the risk analysis in case it was previously filled
      if (purposeFetchedData.riskAnalysisForm) {
        purposeData.riskAnalysisForm = purposeFetchedData.riskAnalysisForm
      }
    }

    // First, create or update the purpose
    const { outcome: createOutcome, response: createResp } = (await runAction(
      {
        path: { endpoint: purposeEndpoint, endpointParams: purposeEndpointParams },
        config: { data: purposeData },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    // Then create or update a new version that holds the dailyCalls
    if (createOutcome === 'success') {
      const newPurpose: Purpose = (createResp as AxiosResponse).data
      const purposeVersionEndpointParams: { purposeId: string; versionId?: string } = {
        purposeId: newPurpose.id,
      }

      // If we are updating the version, we also have to pass the versionId
      if (!isNewPurpose) {
        const newPurposeDecorated: DecoratedPurpose =
          decoratePurposeWithMostRecentVersion(newPurpose)
        purposeVersionEndpointParams.versionId = newPurposeDecorated.currentVersion.id
      }

      const { outcome: createVersionOutcome } = (await runAction(
        {
          path: { endpoint: purposeVersionEndpoint, endpointParams: purposeVersionEndpointParams },
          config: { data: purposeVersionData },
        },
        { suppressToast: ['success'] }
      )) as RunActionOutput

      if (createVersionOutcome === 'success') {
        wrapGoForward(isNewPurpose, newPurpose.id)
      }
    }
  }

  const wrapGoForward = (isNewPurpose: boolean, purposeId: string) => {
    if (isNewPurpose) {
      // Replace the create route with the acutal eserviceId, now that we have it.
      // WARNING: this will cause a re-render that will fetch fresh data
      // at the PurposeCreate component level (which is ugly)
      history.replace(buildDynamicPath(routes.SUBSCRIBE_PURPOSE_EDIT.PATH, { purposeId }), {
        stepIndexDestination: 1,
      })
    } else {
      // Go to next step
      forward()
    }
  }

  const initialValues = { title: '', description: '', eserviceId: '', dailyCalls: 1 }
  const validationSchema = object({
    title: string().required(),
    description: string().required(),
    eserviceId: string().required(),
    dailyCalls: number().required(),
  })
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  })

  const isLoading = isEServiceReallyLoading || isPurposeReallyLoading

  return (
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
      {!isLoading ? (
        <React.Fragment>
          <StyledIntro component="h2">{{ title: t('step1.title') }}</StyledIntro>

          <StyledForm onSubmit={formik.handleSubmit}>
            <StyledInputControlledText
              name="title"
              label={t('step1.nameField.label')}
              infoLabel={t('step1.nameField.infoLabel')}
              error={formik.errors.title}
              value={formik.values.title}
              onChange={formik.handleChange}
              focusOnMount={true}
            />

            <StyledInputControlledText
              name="description"
              label={t('step1.descriptionField.label')}
              error={formik.errors.description}
              value={formik.values.description}
              onChange={formik.handleChange}
              multiline={true}
            />

            <StyledInputControlledSelect
              name="eserviceId"
              label={t('step1.eserviceField.label')}
              error={formik.errors.eserviceId}
              value={formik.values.eserviceId}
              onChange={formik.handleChange}
              options={eserviceData}
              emptyLabel="Nessun E-Service associabile"
            />

            <StyledInputControlledText
              name="dailyCalls"
              label={t('step1.dailyCallsField.label')}
              infoLabel={t('step1.dailyCallsField.infoLabel')}
              type="number"
              error={formik.errors.dailyCalls}
              value={formik.values.dailyCalls}
              onChange={formik.handleChange}
              inputProps={{ min: '1' }}
            />

            <StepActions
              back={{
                label: t('backToListBtn'),
                type: 'link',
                to: routes.SUBSCRIBE_PURPOSE_LIST.PATH,
              }}
              forward={{ label: t('forwardWithSaveBtn'), type: 'submit' }}
            />
          </StyledForm>
        </React.Fragment>
      ) : (
        <LoadingWithMessage label={t('loadingLabel')} transparentBackground />
      )}
    </Paper>
  )
}
