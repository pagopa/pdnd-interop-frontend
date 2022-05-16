import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { useHistory } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import isEmpty from 'lodash/isEmpty'
import {
  ApiEndpointKey,
  EServiceCreateDataType,
  EServiceReadType,
  FrontendAttributes,
  StepperStepComponentProps,
} from '../../types'
import { LangContext, PartyContext } from '../lib/context'
import { buildDynamicPath } from '../lib/router-utils'
import {
  remapBackendAttributesToFrontend,
  remapFrontendAttributesToBackend,
} from '../lib/attributes'
import { useFeedback } from '../hooks/useFeedback'
import { EServiceAttributeSection } from './EServiceAttributeSection'
import { StyledForm } from './Shared/StyledForm'
import { StyledIntro } from './Shared/StyledIntro'
import { StepActions } from './Shared/StepActions'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { StyledInputControlledRadio } from './Shared/StyledInputControlledRadio'
import { useEserviceCreateFetch } from '../hooks/useEserviceCreateFetch'
import { URL_FRAGMENTS } from '../lib/constants'
import { useRoute } from '../hooks/useRoute'
import { Divider, Paper } from '@mui/material'
import { RunActionOutput } from '../hooks/useFeedback'
import { LoadingWithMessage } from './Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'

export const EServiceCreateStep1General: FunctionComponent<StepperStepComponentProps> = ({
  forward,
}) => {
  const { lang } = useContext(LangContext)
  const { party } = useContext(PartyContext)
  const { routes } = useRoute()
  const history = useHistory()
  const { runAction } = useFeedback()
  const { data: fetchedData, isLoading } = useEserviceCreateFetch()
  const { t } = useTranslation('eservice')

  const validationSchema = object({
    name: string().required(),
    description: string().required(),
    technology: string().required(),
  })
  const initialValues: Omit<EServiceCreateDataType, 'producerId'> = {
    name: '',
    description: '',
    technology: 'REST',
  }
  const [initialOrFetchedValues, setInitialOrFetchedValues] = useState(initialValues)

  // Attributes are separated from the rest of the data.
  // There is no logical reason, it is just easier to handle the operations this way
  const [attributes, setAttributes] = useState<FrontendAttributes>({
    certified: [],
    verified: [],
    declared: [],
  })

  // Pre-fill if there is already a draft of the service available
  useEffect(() => {
    if (fetchedData) {
      const {
        technology,
        name,
        description,
        attributes: backendAttributes,
      } = fetchedData as EServiceReadType
      setInitialOrFetchedValues({ technology, name, description })
      setAttributes(remapBackendAttributesToFrontend(backendAttributes))
    }
  }, [fetchedData]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: Partial<EServiceCreateDataType>) => {
    if (!party) {
      return
    }

    // Format the data like the backend wants it
    const dataToPost = {
      ...data,
      producerId: party.id as string | undefined, // needed because of line 95
      attributes: remapFrontendAttributesToBackend(attributes),
    }

    // Define which endpoint to call
    let endpoint: ApiEndpointKey = 'ESERVICE_DRAFT_CREATE'
    let endpointParams = {}
    const isNewService = !fetchedData
    if (!isNewService) {
      endpoint = 'ESERVICE_DRAFT_UPDATE'
      endpointParams = { eserviceId: fetchedData.id }
      delete dataToPost.producerId // Needed to avoid getting an error on PUT
    }

    const { outcome, response } = (await runAction(
      { path: { endpoint, endpointParams }, config: { data: dataToPost } },
      { silent: true, suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      wrapGoForward(isNewService, response as AxiosResponse)
    }
  }

  const wrapGoForward = (isNewService: boolean, response: AxiosResponse) => {
    if (isNewService) {
      // Replace the create route with the acutal eserviceId, now that we have it.
      // WARNING: this will cause a re-render that will fetch fresh data
      // at the EServiceCreate component level (which is ugly)
      history.replace(
        buildDynamicPath(routes.PROVIDE_ESERVICE_EDIT.PATH, {
          eserviceId: response.data.id,
          descriptorId: URL_FRAGMENTS.FIRST_DRAFT[lang],
        }),
        { stepIndexDestination: 1 }
      )
    } else {
      // Go to next step
      forward()
    }
  }

  const isNewService = !fetchedData
  const hasVersion = !isEmpty(fetchedData?.activeDescriptor)
  const isEditable =
    // case 1: new service
    isNewService ||
    // case 2: already existing service but no versions created
    (!isNewService && !hasVersion) ||
    // case 3: already existing service and version, but version is 1 and still a draft
    (!isNewService &&
      hasVersion &&
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      fetchedData!.activeDescriptor!.version === '1' &&
      fetchedData!.activeDescriptor!.state === 'DRAFT')
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  return (
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
      {!isLoading ? (
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
              <StyledIntro component="h2">{{ title: t('step1.title') }}</StyledIntro>

              <StyledInputControlledText
                name="name"
                label={t('step1.eserviceNameField.label')}
                infoLabel={t('step1.eserviceNameField.infoLabel')}
                error={errors.name}
                value={values.name}
                onChange={handleChange}
                disabled={!isEditable}
                focusOnMount={isEditable}
              />

              <StyledInputControlledText
                name="description"
                label={t('step1.eserviceDescriptionField.label')}
                infoLabel={t('step1.eserviceDescriptionField.infoLabel')}
                error={errors.description}
                value={values.description}
                onChange={handleChange}
                disabled={!isEditable}
                multiline={true}
              />

              <StyledInputControlledRadio
                name="technology"
                label={t('step1.eserviceTechnologyField.label')}
                error={errors.technology}
                value={values.technology}
                onChange={handleChange}
                disabled={!isEditable}
                options={[
                  { label: 'REST', value: 'REST' },
                  { label: 'SOAP', value: 'SOAP' },
                ]}
              />

              <Divider />

              <StyledIntro component="h2" sx={{ my: 4 }}>
                {{ title: t('step1.attributes') }}
              </StyledIntro>
              <EServiceAttributeSection
                attributes={attributes}
                setAttributes={setAttributes}
                disabled={!isEditable}
              />

              <StepActions
                back={{
                  label: t('backToListBtn'),
                  type: 'link',
                  to: routes.PROVIDE_ESERVICE_LIST.PATH,
                }}
                forward={
                  !isEditable
                    ? { label: t('forwardWithoutSaveBtn'), onClick: forward, type: 'button' }
                    : { label: t('forwardWithSaveBtn'), type: 'submit' }
                }
              />
            </StyledForm>
          )}
        </Formik>
      ) : (
        <LoadingWithMessage label={t('loadingEServiceLabel')} transparentBackground />
      )}
    </Paper>
  )
}
