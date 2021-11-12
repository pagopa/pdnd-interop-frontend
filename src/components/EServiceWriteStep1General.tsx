import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import isEmpty from 'lodash/isEmpty'
import { Box } from '@mui/system'
import {
  ApiEndpointKey,
  EServiceCreateDataType,
  EServiceNoDescriptorId,
  FrontendAttributes,
  StepperStepComponentProps,
} from '../../types'
import { PartyContext } from '../lib/context'
import { buildDynamicPath } from '../lib/url-utils'
import { requiredValidationPattern } from '../lib/validation'
import {
  remapBackendAttributesToFrontend,
  remapFrontendAttributesToBackend,
} from '../lib/attributes'
import { useFeedback } from '../hooks/useFeedback'
import { EServiceWriteProps } from '../views/EServiceWrite'
import { EServiceAttributeSection } from './EServiceAttributeSection'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledLink } from './Shared/StyledLink'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { StyledInputControlledRadio } from './Shared/StyledInputControlledRadio'
import { StyledInputControlledSwitch } from './Shared/StyledInputControlledSwitch'
import { ROUTES } from '../config/routes'

export function EServiceWriteStep1General({
  forward,
  fetchedDataMaybe,
}: StepperStepComponentProps & EServiceWriteProps) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm()

  const { party } = useContext(PartyContext)
  const history = useHistory()
  const { runActionWithCallback } = useFeedback()

  // Attributes are separated from the rest of the data.
  // There is no logical reason, it is just easier to handle the operations this way
  const [attributes, setAttributes] = useState<FrontendAttributes>({
    certified: [],
    verified: [],
    declared: [],
  })

  // Pre-fill if there is already a draft of the service available
  useEffect(() => {
    if (!isEmpty(fetchedDataMaybe)) {
      const { technology, name, description, attributes: backendAttributes } = fetchedDataMaybe!
      setValue('technology', technology)
      setValue('name', name)
      setValue('description', description)
      setAttributes(remapBackendAttributesToFrontend(backendAttributes))
    }
  }, [fetchedDataMaybe]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: Partial<EServiceCreateDataType>) => {
    // Format the data like the backend wants it
    const dataToPost = {
      ...data,
      producerId: party!.partyId,
      attributes: remapFrontendAttributesToBackend(attributes),
    }

    // Define which endpoint to call
    let endpoint: ApiEndpointKey = 'ESERVICE_CREATE'
    let endpointParams = {}
    const isNewService = isEmpty(fetchedDataMaybe)
    if (!isNewService) {
      endpoint = 'ESERVICE_UPDATE'
      endpointParams = { eserviceId: fetchedDataMaybe!.id }
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
        buildDynamicPath(ROUTES.PROVIDE.SUBROUTES!.ESERVICE.SUBROUTES!.EDIT.PATH, {
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

  const isNewService = isEmpty(fetchedDataMaybe)
  const hasVersion = !isEmpty(fetchedDataMaybe?.activeDescriptor)
  const isEditable =
    // case 1: new service
    isNewService ||
    // case 2: already existing service but no versions created
    (!isNewService && !hasVersion) ||
    // case 3: already existing service and version, but version is 1 and still a draft
    (!isNewService &&
      hasVersion &&
      fetchedDataMaybe!.activeDescriptor!.version === '1' &&
      fetchedDataMaybe!.activeDescriptor!.status === 'draft')

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Crea e-service: informazioni generali',
          description:
            "Attenzione: una volta pubblicata la prima versione dell'e-service, le informazioni contenute in questa sezione non saranno più modificabili",
        }}
      </StyledIntro>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <StyledIntro variant="h1">{{ title: 'Caratterizzazione e-service' }}</StyledIntro>

        <StyledInputControlledText
          name="name"
          label="Nome dell'e-service*"
          control={control}
          rules={{ required: requiredValidationPattern }}
          errors={errors}
          disabled={!isEditable}
        />

        <StyledInputControlledText
          name="description"
          label="Descrizione dell'e-service*"
          control={control}
          rules={{ required: requiredValidationPattern }}
          errors={errors}
          disabled={!isEditable}
          multiline={true}
        />

        <StyledInputControlledRadio
          name="technology"
          label="Tecnologia*"
          control={control}
          rules={{ required: requiredValidationPattern }}
          errors={errors}
          disabled={!isEditable}
          options={[
            { label: 'REST', value: 'REST' },
            { label: 'SOAP', value: 'SOAP' },
          ]}
          defaultValue="REST"
        />

        <StyledInputControlledSwitch
          name="pop"
          label="Proof of Possession*"
          control={control}
          disabled={!isEditable}
        />

        <StyledIntro variant="h1">{{ title: 'Attributi' }}</StyledIntro>
        <EServiceAttributeSection attributes={attributes} setAttributes={setAttributes} />

        <Box sx={{ mt: 4, display: 'flex' }}>
          <StyledButton sx={{ mr: 3 }} type="submit" variant="contained">
            Salva bozza e prosegui
          </StyledButton>
          <StyledButton
            variant="outlined"
            component={StyledLink}
            to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE.SUBROUTES!.LIST.PATH}
          >
            Torna agli e-service
          </StyledButton>
        </Box>
      </StyledForm>
    </React.Fragment>
  )
}
