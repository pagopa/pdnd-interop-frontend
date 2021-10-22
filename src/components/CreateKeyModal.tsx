import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { ToastContentWithOutcome } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { TOAST_CONTENTS } from '../lib/constants'
import { getFetchOutcome } from '../lib/error-utils'
import { LoadingOverlay } from './LoadingOverlay'
import { StyledInputSelect } from './Shared/StyledInputSelect'
import { StyledInputTextArea } from './Shared/StyledInputTextArea'

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
  const [loadingText, setLoadingText] = useState<string | undefined>()
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

    setLoadingText(undefined)
    close(toastContent)

    if (afterSuccess) {
      afterSuccess()
    }
  }

  const simpleClose = () => {
    close()
  }

  return (
    <React.Fragment>
      <Modal.Dialog contentClassName="px-1 py-1" style={{ minWidth: 640 }}>
        <Modal.Header onHide={simpleClose} closeButton>
          <Modal.Title className="me-5">Carica nuova chiave pubblica</Modal.Title>
        </Modal.Header>

        <Modal.Body className="py-4">
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
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-primary" onClick={simpleClose}>
            Annulla
          </Button>
          <Button variant="primary" onClick={upload} disabled={!data}>
            Carica chiave
          </Button>
        </Modal.Footer>
      </Modal.Dialog>

      {loadingText && <LoadingOverlay loadingText={loadingText} />}
    </React.Fragment>
  )
}
