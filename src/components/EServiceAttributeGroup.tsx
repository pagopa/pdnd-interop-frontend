import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import {
  AttributeModalTemplate,
  EServiceAttribute,
  EServiceAttributeFromCatalog,
} from '../../types'
import { Overlay } from './Overlay'
import { TableAction } from './TableAction'
import { TableWithLoader } from './TableWithLoader'

type EServiceAttributeGroupProps = {
  title: string
  subtitle: string
  attributeClass: EServiceAttribute[]
  catalog: EServiceAttributeFromCatalog[]
  hasValidation?: boolean
  canCreate?: boolean
  add: any
  remove: any
}

export function EServiceAttributeGroup({
  title,
  subtitle,
  attributeClass,
  hasValidation = false,
  canCreate = false,
  add,
  remove,
}: EServiceAttributeGroupProps) {
  const [modal, setModal] = useState<AttributeModalTemplate>()

  const headData = hasValidation
    ? ['nome attributo', 'convalida richiesta', '']
    : ['nome attributo', '']

  const buildShowModal = (template: AttributeModalTemplate) => (_: any) => {
    setModal(template)
  }

  return (
    <div className="my-5">
      <h3>{title}</h3>
      <p>{subtitle}</p>

      <TableWithLoader isLoading={false} headData={headData}>
        {attributeClass.length === 0 ? (
          <tr>
            <td colSpan={headData.length}>Nessun attributo presente</td>
          </tr>
        ) : (
          attributeClass.map((attribute, j) => {
            return (
              <tr key={j}>
                <td>ciao</td>
                <td>ciao</td>
                <td>
                  <TableAction
                    label="Elimina"
                    iconClass="bi-trash"
                    btnProps={{ onClick: remove(attribute) }}
                  />
                </td>
              </tr>
            )
          })
        )}
      </TableWithLoader>

      <div className="d-flex align-items-center">
        <Button className="me-3" variant="primary" onClick={buildShowModal('add')}>
          aggiungi attributo
        </Button>

        {canCreate && (
          <p className="mb-0 d-flex align-items-center">
            <span className="me-2">L'attributo non è presente nella lista?</span>
            <Button
              className="px-0 py-0 mx-0 my-0 border-0 link-default"
              variant="link"
              onClick={buildShowModal('create')}
            >
              Crealo qui!
            </Button>
          </p>
        )}
      </div>

      {modal && (
        <Overlay>
          <AttributeModal template={modal} />
        </Overlay>
      )}
    </div>
  )
}

type AttributeModalProps = {
  template: AttributeModalTemplate
}

function AttributeModal({ template }: AttributeModalProps) {
  return (
    <Modal.Dialog>
      <Modal.Header closeButton>
        <Modal.Title>Aggiungi attributo</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Modal body text goes here.</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary">Close</Button>
        <Button variant="primary">Save changes</Button>
      </Modal.Footer>
    </Modal.Dialog>
  )
}
