import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { object, string, number, ref } from 'yup'
import { useHistory } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import isEmpty from 'lodash/isEmpty'
import {
  ApiEndpointKey,
  EServiceDescriptorRead,
  EServiceReadType,
  StepperStepComponentProps,
} from '../../types'
import { buildDynamicPath } from '../lib/router-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledForm } from './Shared/StyledForm'
import { StepActions } from './Shared/StepActions'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { useEserviceCreateFetch } from '../hooks/useEserviceCreateFetch'
import { useRoute } from '../hooks/useRoute'
import { RunActionOutput } from '../hooks/useFeedback'
import { LoadingWithMessage } from './Shared/LoadingWithMessage'
import { minutesToSeconds, secondsToMinutes } from '../lib/format-utils'
import { useTranslation } from 'react-i18next'
import { StyledPaper } from './StyledPaper'
import { StyledInputControlledSwitch } from './Shared/StyledInputControlledSwitch'

type VersionData = {
  audience: string
  version: string
  voucherLifespan: number
  description: string
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  agreementApprovalPolicy: boolean
}

export function EServiceCreateStep2Version({ forward, back }: StepperStepComponentProps) {
  const { routes } = useRoute()
  const history = useHistory()
  const { runAction } = useFeedback()
  const { data: fetchedData, isLoading } = useEserviceCreateFetch()
  const { t } = useTranslation('eservice')

  const validationSchema = object({
    version: string().required(),
    audience: string().required(),
    voucherLifespan: number().required(),
    description: string().required(),
    dailyCallsPerConsumer: number().required(),
    dailyCallsTotal: number()
      .min(ref('dailyCallsPerConsumer'), t('create.step2.dailyCallsTotalField.validation.min'))
      .required(),
  })
  const initialValues: VersionData = {
    version: '1',
    audience: '',
    voucherLifespan: 1,
    description: '',
    dailyCallsPerConsumer: 1,
    dailyCallsTotal: 1,
    agreementApprovalPolicy: true,
  }
  const [initialOrFetchedValues, setInitialOrFetchedValues] = useState(initialValues)

  // Pre-fill if there is already a draft of the service available
  useEffect(() => {
    if (fetchedData && !isEmpty(fetchedData.activeDescriptor)) {
      const activeDescriptor = (fetchedData as EServiceReadType)
        .activeDescriptor as EServiceDescriptorRead
      const {
        audience,
        version,
        voucherLifespan,
        description,
        dailyCallsPerConsumer,
        dailyCallsTotal,
        agreementApprovalPolicy,
      } = activeDescriptor
      setInitialOrFetchedValues({
        version,
        audience: Boolean(audience.length > 0) ? audience[0] : '',
        voucherLifespan: secondsToMinutes(voucherLifespan),
        description,
        dailyCallsPerConsumer: dailyCallsPerConsumer || 1,
        dailyCallsTotal: dailyCallsTotal || 1,
        agreementApprovalPolicy: agreementApprovalPolicy === 'MANUAL',
      })
    }
  }, [fetchedData]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: VersionData) => {
    // Format the data like the backend wants it
    const dataToPost = {
      audience: [data.audience],
      voucherLifespan: minutesToSeconds(data.voucherLifespan),
      description: data.description,
      dailyCallsPerConsumer: data.dailyCallsPerConsumer,
      dailyCallsTotal: data.dailyCallsTotal,
      agreementApprovalPolicy: data.agreementApprovalPolicy ? 'MANUAL' : 'AUTOMATIC',
    }

    const sureFetchedData = fetchedData as EServiceReadType

    // Define which endpoint to call
    let endpoint: ApiEndpointKey = 'ESERVICE_VERSION_DRAFT_CREATE'
    const endpointParams: Record<string, string> = { eserviceId: sureFetchedData.id }
    const isNewDescriptor = isEmpty(sureFetchedData.activeDescriptor)
    if (!isNewDescriptor) {
      const activeDescriptor = sureFetchedData.activeDescriptor as EServiceDescriptorRead
      endpoint = 'ESERVICE_VERSION_DRAFT_UPDATE'
      endpointParams.descriptorId = activeDescriptor.id
    }

    const { outcome, response } = (await runAction(
      { path: { endpoint, endpointParams }, config: { data: dataToPost } },
      { silent: true, suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      wrapOnSubmitSuccess(isNewDescriptor, response as AxiosResponse)
    }
  }

  const wrapOnSubmitSuccess = (isNewDescriptor: boolean, response: AxiosResponse) => {
    if (isNewDescriptor) {
      const descriptorId = response.data.id

      // Replace the create route with the acutal descriptorId, now that we have it.
      // WARNING: this will NOT cause a re-render that will fetch fresh data
      // at the EServiceCreate component level. This is because, to the router, this is not
      // a change of route, we are still in the 'ESERVICE_EDIT' route.
      // The EServiceCreate component rerenders because we added "history.location"
      // as a useEffect dependency in EServiceCreate useEserviceCreateFetch hook
      history.replace(
        buildDynamicPath(routes.PROVIDE_ESERVICE_EDIT.PATH, {
          eserviceId: (fetchedData as EServiceReadType).id,
          descriptorId,
        }),
        { stepIndexDestination: 2 }
      )
    } else {
      // Go to next step
      forward()
    }
  }

  return (
    <React.Fragment>
      {!isLoading ? (
        <React.Fragment>
          <Formik
            initialValues={initialOrFetchedValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
          >
            {({ handleSubmit, errors, values, handleChange }) => (
              <StyledForm onSubmit={handleSubmit}>
                <StyledPaper>
                  <StyledInputControlledText
                    sx={{ mt: 0 }}
                    name="version"
                    label={t('create.step2.versionField.label')}
                    infoLabel={t('create.step2.versionField.infoLabel')}
                    disabled={true}
                    value={values.version}
                    error={errors.version}
                  />

                  <StyledInputControlledText
                    name="description"
                    label={t('create.step2.descriptionField.label')}
                    infoLabel={t('create.step2.descriptionField.infoLabel')}
                    value={values.description}
                    error={errors.description}
                    onChange={handleChange}
                    multiline={true}
                    focusOnMount={true}
                    inputProps={{ maxLength: 250 }}
                  />

                  <StyledInputControlledText
                    name="audience"
                    label={t('create.step2.audienceField.label')}
                    infoLabel={t('create.step2.audienceField.infoLabel')}
                    value={values.audience}
                    error={errors.audience}
                    onChange={handleChange}
                    inputProps={{ maxLength: 60 }}
                  />

                  <StyledInputControlledText
                    name="voucherLifespan"
                    label={t('create.step2.voucherLifespanField.label')}
                    infoLabel={t('create.step2.voucherLifespanField.infoLabel')}
                    type="number"
                    inputProps={{ min: '1', max: '1440' }}
                    value={values.voucherLifespan}
                    error={errors.voucherLifespan}
                    onChange={handleChange}
                  />

                  <StyledInputControlledText
                    name="dailyCallsPerConsumer"
                    label={t('create.step2.dailyCallsPerConsumerField.label')}
                    infoLabel={t('create.step2.dailyCallsPerConsumerField.infoLabel')}
                    type="number"
                    value={values.dailyCallsPerConsumer}
                    error={errors.dailyCallsPerConsumer}
                    onChange={handleChange}
                    inputProps={{ min: '1' }}
                  />

                  <StyledInputControlledText
                    name="dailyCallsTotal"
                    label={t('create.step2.dailyCallsTotalField.label')}
                    infoLabel={t('create.step2.dailyCallsTotalField.infoLabel')}
                    type="number"
                    value={values.dailyCallsTotal}
                    error={errors.dailyCallsTotal}
                    onChange={handleChange}
                    inputProps={{ min: '1' }}
                    sx={{ mb: 3 }}
                  />

                  <StyledInputControlledSwitch
                    label={t('create.step2.agreementApprovalPolicyField.label')}
                    value={values.agreementApprovalPolicy}
                    vertical
                    name="agreementApprovalPolicy"
                    onChange={handleChange}
                  />
                </StyledPaper>

                <StepActions
                  back={{ label: t('create.backWithoutSaveBtn'), type: 'button', onClick: back }}
                  forward={{ label: t('create.forwardWithSaveBtn'), type: 'submit' }}
                />
              </StyledForm>
            )}
          </Formik>
        </React.Fragment>
      ) : (
        <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
      )}
    </React.Fragment>
  )
}
