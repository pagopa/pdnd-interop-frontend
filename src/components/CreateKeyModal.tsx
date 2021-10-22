import React, { useState } from 'react'
import { ToastContentWithOutcome } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { TOAST_CONTENTS } from '../lib/constants'
import { getFetchOutcome } from '../lib/error-utils'
import { StyledInputSelect } from './Shared/StyledInputSelect'
import { StyledInputTextArea } from './Shared/StyledInputTextArea'
import { useFeedback } from '../hooks/useFeedback'
import { StyledDialog } from './Shared/StyledDialog'

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
  const { setLoadingText } = useFeedback()
  const [data, setData] = useState<Partial<NewPublicKey>>({ use: 'sig', clientId })

  const buildSetData = (key: string) => (e: any) => {
    setData({ ...(data || {}), [key]: e.target.value })
  }

  const upload = async () => {
    setLoadingText('Stiamo creando la nuova chiave')

    // Encode public key
    const dataToPost = { ...data }
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
      proceedCallback={upload}
      disabled={!data}
    >
      <StyledInputSelect
        id="alg"
        onChange={buildSetData('alg')}
        options={[{ label: 'Seleziona algoritmo...' }, { label: 'RS256', value: 'RS256' }]}
        label="Algoritmo*"
      />

      <StyledInputTextArea
        id="key"
        label="Chiave pubblica*"
        value={data?.key || ''}
        onChange={buildSetData('key')}
        height={280}
      />
    </StyledDialog>
  )
}
