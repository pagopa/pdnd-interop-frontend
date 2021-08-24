import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import {
  AttributeModalTemplate,
  EServiceAttributeFromCatalog,
  EServiceAttributeKey,
} from '../../types'
import { AsyncAutocomplete } from './AsyncAutocomplete'
import { StyledInputCheckbox } from './StyledInputCheckbox'

type AttributeModalProps = {
  template: AttributeModalTemplate
  add: any
  close: any
  attributeKey: EServiceAttributeKey
}

export function AttributeModal({ template, add, close, attributeKey }: AttributeModalProps) {
  const [selected, setSelected] = useState<EServiceAttributeFromCatalog[]>([])
  const [validation, setValidation] = useState(false)

  const updateSelected = (newSelected: EServiceAttributeFromCatalog[]) => {
    setSelected(newSelected)
  }

  const confirm = () => {
    add(selected[0], validation)
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
        <Modal.Title>Aggiungi attributo</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <AsyncAutocomplete
          selected={selected}
          setSelected={updateSelected}
          placeholder="Aggiungi nuovo attributo"
          endpoint={{ endpoint: 'ATTRIBUTES_GET_LIST' }}
          transformFn={(data: any) =>
            data.attributes.filter(
              (a: EServiceAttributeFromCatalog) => a.certified === certifiedCondition
            )
          }
          labelKey="description"
        />

        {verifiedCondition && (
          <StyledInputCheckbox
            inline={true}
            id="require-verification"
            label="Convalida richiesta?"
            checked={validation}
            onChange={updateValidation}
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Annulla
        </Button>
        <Button variant="primary" onClick={confirm} disabled={!!(selected.length === 0)}>
          Conferma
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  )
}
