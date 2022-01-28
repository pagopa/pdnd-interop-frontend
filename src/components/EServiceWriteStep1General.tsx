import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { useHistory } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import isEmpty from 'lodash/isEmpty'
import { Box } from '@mui/system'
import {
  ApiEndpointKey,
  EServiceCreateDataType,
  EServiceNoDescriptorId,
  EServiceReadType,
  FrontendAttributes,
  StepperStepComponentProps,
} from '../../types'
import { PartyContext } from '../lib/context'
import { buildDynamicPath } from '../lib/router-utils'
import {
  remapBackendAttributesToFrontend,
  remapFrontendAttributesToBackend,
} from '../lib/attributes'
import { useFeedback } from '../hooks/useFeedback'
import { EServiceWriteProps } from '../views/EServiceWrite'
import { EServiceAttributeSection } from './EServiceAttributeSection'
import { StyledForm } from './Shared/StyledForm'
import { StyledIntro } from './Shared/StyledIntro'
import { ROUTES } from '../config/routes'
import { EServiceWriteActions } from './Shared/EServiceWriteActions'
import { StyledInputControlledTextFormik } from './Shared/StyledInputControlledTextFormik'
import { StyledInputControlledRadioFormik } from './Shared/StyledInputControlledRadioFormik'

export const EServiceWriteStep1General: FunctionComponent<
  StepperStepComponentProps & EServiceWriteProps
> = ({ forward, fetchedData }) => {
  const { party } = useContext(PartyContext)
  const history = useHistory()
  const { runActionWithCallback } = useFeedback()

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
      producerId: party.partyId,
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

    await runActionWithCallback(
      { path: { endpoint, endpointParams }, config: { data: dataToPost } },
      { callback: wrapOnSubmitSuccess(isNewService), suppressToast: false }
    )
  }

  const wrapOnSubmitSuccess = (isNewService: boolean) => (response: AxiosResponse) => {
    const eserviceId = response.data.id

    if (isNewService) {
      const tempDescriptorId: EServiceNoDescriptorId = 'prima-bozza'

      // Replace the create route with the acutal eserviceId, now that we have it.
      // WARNING: this will cause a re-render that will fetch fresh data
      // at the EServiceGate component level
      history.replace(
        buildDynamicPath(ROUTES.PROVIDE_ESERVICE_EDIT.PATH, {
          eserviceId,
          descriptorId: tempDescriptorId,
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
          <StyledIntro variant="h2" sx={{ mb: 0, pb: 0 }}>
            {{ title: 'Caratterizzazione e-service' }}
          </StyledIntro>

          <StyledInputControlledTextFormik
            name="name"
            label="Nome dell'eservice (richiesto)"
            error={errors.name}
            value={values.name}
            onChange={handleChange}
            disabled={!isEditable}
            focusOnMount={isEditable}
          />

          <StyledInputControlledTextFormik
            name="description"
            label="Descrizione dell'e-service (richiesto)"
            error={errors.description}
            value={values.description}
            onChange={handleChange}
            disabled={!isEditable}
            multiline={true}
          />

          <Box sx={{ my: 8 }}>
            <StyledInputControlledRadioFormik
              name="technology"
              label="Tecnologia (richiesto)"
              error={errors.technology}
              value={values.technology}
              onChange={handleChange}
              disabled={!isEditable}
              options={[
                { label: 'REST', value: 'REST' },
                { label: 'SOAP', value: 'SOAP' },
              ]}
            />
          </Box>

          <StyledIntro
            variant="h2"
            sx={{ mt: 8, mb: 2, pt: 4, borderTop: 1, borderColor: 'divider' }}
          >
            {{ title: 'Attributi' }}
          </StyledIntro>
          <EServiceAttributeSection attributes={attributes} setAttributes={setAttributes} />

          <EServiceWriteActions
            back={{
              label: 'Torna agli e-service',
              type: 'link',
              to: ROUTES.PROVIDE_ESERVICE_LIST.PATH,
            }}
            forward={{ label: 'Salva bozza e prosegui', type: 'submit' }}
          />
        </StyledForm>
      )}
    </Formik>
  )
}
