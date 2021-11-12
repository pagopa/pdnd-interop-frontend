import React from 'react'
import { useForm } from 'react-hook-form'
import { ToastContentWithOutcome } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { getFetchOutcome } from '../lib/error-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledDialog } from './Shared/StyledDialog'
import { StyledInputControlledSelect } from './Shared/StyledInputControlledSelect'
import { requiredValidationPattern } from '../lib/validation'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { TOAST_CONTENTS } from '../config/toast'

type NewPublicKeyProps = {
  close: (toastContent?: ToastContentWithOutcome) => void
  clientId: string
  taxCode: string
  afterSuccess: VoidFunction
}

type NewPublicKey = {
  clientId: string
  use: string
  alg: string
  key: string
}

export function CreateKeyModal({ close, clientId, taxCode, afterSuccess }: NewPublicKeyProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const { setLoadingText } = useFeedback()

  const onSubmit = async (data: Partial<NewPublicKey>) => {
    setLoadingText('Stiamo creando la nuova chiave')

    // Encode public key
    const dataToPost = { ...data, use: 'sig', clientId }
    dataToPost.key = btoa(dataToPost.key!)

    const keyCreateResponse = await fetchWithLogs({
      path: { endpoint: 'OPERATOR_SECURITY_KEYS_POST', endpointParams: { clientId, taxCode } },
      config: { data: [dataToPost] },
    })

    const outcome = getFetchOutcome(keyCreateResponse)
    const toastContent: ToastContentWithOutcome = {
      ...TOAST_CONTENTS.OPERATOR_SECURITY_KEYS_POST[outcome],
      outcome,
    }

    setLoadingText(null)
    close(toastContent)

    if (afterSuccess) {
      afterSuccess()
    }
  }

  const simpleClose = () => {
    close()
  }

  return (
    <StyledDialog
      minWidth={640}
      close={simpleClose}
      title="Carica nuova chiave pubblica"
      proceedLabel="Carica chiave"
      proceedCallback={handleSubmit(onSubmit)}
    >
      <StyledInputControlledSelect
        name="alg"
        label="Seleziona algoritmo*"
        options={[{ label: 'RS256', value: 'RS256' }]}
        control={control}
        rules={{ required: requiredValidationPattern }}
        errors={errors}
        defaultValue="RS256"
      />

      <StyledInputControlledText
        name="key"
        label="Chiave pubblica*"
        control={control}
        rules={{ required: requiredValidationPattern }}
        errors={errors}
        multiline={true}
      />
    </StyledDialog>
  )
}
