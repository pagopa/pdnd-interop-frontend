import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { MEDIUM_MAX_WIDTH, ROUTES } from '../lib/constants'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { EServiceReadType, SelectOption } from '../../types'
import { PartyContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { requiredValidationPattern } from '../lib/validation'
import { StyledInputControlledSelect } from '../components/Shared/StyledInputControlledSelect'

type ClientSubmit = {
  name: string
  description: string
  consumerInstitutionId: string
  eServiceId: string
  purposes: string
}

export function ClientCreate() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const { runActionWithDestination } = useFeedback()
  const { party } = useContext(PartyContext)
  const { data: eserviceData } = useAsyncFetch<EServiceReadType[], SelectOption[]>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: { params: { consumerId: party?.partyId } },
    },
    {
      defaultValue: [],
      mapFn: (data) => data.map((d) => ({ value: d.id, label: d.name })),
      loadingTextLabel: 'Stiamo caricando gli e-service associabili al client',
    }
  )

  const onSubmit = async (data: Partial<ClientSubmit>) => {
    const dataToPost = { ...data, consumerInstitutionId: party?.institutionId }

    await runActionWithDestination(
      { path: { endpoint: 'CLIENT_CREATE' }, config: { data: dataToPost } },
      { destination: ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT, suppressToast: false }
    )
  }

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: `Crea nuovo client`,
          description:
            "Il client sarà associato ad uno specifico e-service. Una volta creato, sarà possibile aggiungere operatori di sicurezza che gestiranno le chiavi per permettere l'accesso machine-to-machine all'e-service",
        }}
      </StyledIntro>

      <StyledForm onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: MEDIUM_MAX_WIDTH }}>
        <StyledInputControlledText
          name="name"
          label="Nome del client*"
          control={control}
          rules={{ required: requiredValidationPattern }}
          errors={errors}
        />

        <StyledInputControlledText
          name="description"
          label="Descrizione del client*"
          control={control}
          rules={{ required: requiredValidationPattern }}
          errors={errors}
        />

        <StyledInputControlledSelect
          name="eserviceId"
          label="E-service da associare*"
          control={control}
          rules={{ required: requiredValidationPattern }}
          errors={errors}
          disabled={eserviceData.length === 0}
          options={eserviceData}
          defaultValue={Boolean(eserviceData.length > 0) ? eserviceData[0].value : null}
        />

        <StyledInputControlledText
          name="purposes"
          label="Finalità*"
          control={control}
          rules={{ required: requiredValidationPattern }}
          errors={errors}
        />

        <StyledButton sx={{ mt: 3 }} variant="contained" type="submit">
          Crea client
        </StyledButton>
      </StyledForm>
    </React.Fragment>
  )
}
