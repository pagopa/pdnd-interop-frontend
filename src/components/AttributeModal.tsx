import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { AttributeModalTemplate, AttributeType, CatalogAttribute } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { TOAST_CONTENTS } from '../lib/constants'
import { getFetchOutcome } from '../lib/error-utils'
import { AsyncAutocomplete } from './AsyncAutocomplete'
import { LoadingOverlay } from './LoadingOverlay'
import { StyledInputCheckbox } from './StyledInputCheckbox'
import { StyledInputText } from './StyledInputText'
import { StyledInputTextArea } from './StyledInputTextArea'

type AttributeModalCreateNewProps = {
  close: any
  attributeKey: AttributeType
}

type AttributeModalAddExistingProps = AttributeModalCreateNewProps & {
  add: any
}

type AttributeModalProps = AttributeModalAddExistingProps & {
  template: AttributeModalTemplate
}

export function AttributeModal({ template, add, close, attributeKey }: AttributeModalProps) {
  return template === 'create' ? (
    <AttributeModalCreateNew close={close} attributeKey={attributeKey} />
  ) : (
    <AttributeModalAddExisting add={add} close={close} attributeKey={attributeKey} />
  )
}

type NewAttribute = {
  name?: string
  code?: string // authId
  origin?: string // authName
  description?: string
  certified?: boolean
}

export function AttributeModalCreateNew({ close, attributeKey }: AttributeModalCreateNewProps) {
  const [loadingText, setLoadingText] = useState<string | undefined>()
  const [data, setData] = useState<NewAttribute>({ certified: false })
  // Certified is unused, it is here just to shup TypeScript up
  const label = { verified: 'verificato', declared: 'dichiarato', certified: null }[attributeKey]

  const buildSetData = (key: string) => (e: any) => {
    setData({ ...(data || {}), [key]: e.target.value })
  }

  const create = async () => {
    setLoadingText('Stiamo creando il nuovo attributo')

    const attributeCreateResponse = await fetchWithLogs(
      { endpoint: 'ATTRIBUTE_CREATE' },
      { method: 'POST', data }
    )

    const outcome = getFetchOutcome(attributeCreateResponse)
    const toastContent = { ...TOAST_CONTENTS.ATTRIBUTE_CREATE[outcome], outcome }

    setLoadingText(undefined)
    close(toastContent)
  }

  return (
    <React.Fragment>
      <Modal.Dialog contentClassName="px-1 py-1">
        <Modal.Header onHide={close} closeButton>
          <Modal.Title className="me-5">Crea nuovo attributo {label}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="py-4">
          {[
            { id: 'name', label: "Nome dell'attributo", type: 'text' },
            { id: 'code', label: 'Id della fonte autoritativa', type: 'text' },
            { id: 'origin', label: 'Nome della fonte autoritativa', type: 'text' },
          ].map(({ id, label }, i) => {
            return (
              <StyledInputText
                key={i}
                id={id}
                label={label}
                value={(data?.[id as keyof NewAttribute] as string) || ''}
                onChange={buildSetData(id)}
              />
            )
          })}

          <StyledInputTextArea
            id="description"
            label="Descrizione dell'attributo"
            value={data?.['description'] || ''}
            onChange={buildSetData('description')}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-primary" onClick={close}>
            Annulla
          </Button>
          <Button variant="primary" onClick={create} disabled={!data}>
            Crea attributo
          </Button>
        </Modal.Footer>
      </Modal.Dialog>

      {loadingText && <LoadingOverlay loadingText={loadingText} />}
    </React.Fragment>
  )
}

export function AttributeModalAddExisting({
  add,
  close,
  attributeKey,
}: AttributeModalAddExistingProps) {
  const [selected, setSelected] = useState<CatalogAttribute[]>([])
  const [validation, setValidation] = useState(false)

  const updateSelected = (newSelected: CatalogAttribute[]) => {
    setSelected(newSelected)
  }

  const confirm = () => {
    add(selected, validation)
    close()
  }

  const updateValidation = (e: any) => {
    setValidation(e.target.checked)
  }

  const certifiedCondition = attributeKey === 'certified'
  const verifiedCondition = attributeKey === 'verified'

  return (
    <Modal.Dialog contentClassName="px-1 py-1">
      <Modal.Header onHide={close} closeButton>
        <Modal.Title className="me-5">Aggiungi attributo o gruppo</Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-4">
        <p>Se selezioni più di un attributo verrà trattato come "gruppo"</p>
        <AsyncAutocomplete
          multiple={true}
          selected={selected}
          setSelected={updateSelected}
          placeholder="Aggiungi nuovo attributo"
          endpoint={{ endpoint: 'ATTRIBUTES_GET_LIST' }}
          transformFn={(data: any) =>
            data.attributes.filter((a: CatalogAttribute) => a.certified === certifiedCondition)
          }
          labelKey="description"
        />

        {verifiedCondition && (
          <StyledInputCheckbox
            inline={true}
            id="require-verification"
            label="Richiedi nuova convalida dell'attributo"
            checked={validation}
            onChange={updateValidation}
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-primary" onClick={(_: any) => close()}>
          Annulla
        </Button>
        <Button variant="primary" onClick={confirm} disabled={!!(selected.length === 0)}>
          Conferma
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  )
}
