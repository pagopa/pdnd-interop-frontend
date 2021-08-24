import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import {
  AttributeModalTemplate,
  EServiceAttributeFromCatalog,
  EServiceAttributeKey,
} from '../../types'
import { AttributeModal } from './AttributeModal'
import { Overlay } from './Overlay'
import { TableAction } from './TableAction'
import { TableWithLoader } from './TableWithLoader'

type EServiceAttributeGroupProps = {
  title: string
  subtitle: string
  attributeClass: EServiceAttributeFromCatalog[]
  hasValidation?: boolean
  canCreate?: boolean
  add: any
  remove: any
  attributeKey: EServiceAttributeKey
}

export function EServiceAttributeGroup({
  title,
  subtitle,
  attributeClass,
  hasValidation = false,
  canCreate = false,
  add,
  remove,
  attributeKey,
}: EServiceAttributeGroupProps) {
  const [modalTemplate, setModalTemplate] = useState<AttributeModalTemplate>()

  const headData = hasValidation
    ? ['nome attributo', 'convalida richiesta', '']
    : ['nome attributo', '']

  const buildShowModal = (template: AttributeModalTemplate) => (_: any) => {
    setModalTemplate(template)
  }

  const closeModal = () => {
    setModalTemplate(undefined)
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
                <td style={{ verticalAlign: 'middle' }}>{attribute.description}</td>
                {hasValidation && (
                  <td style={{ verticalAlign: 'middle' }}>
                    {attribute.verificationRequired ? 'Sì' : 'No'}
                  </td>
                )}
                <td className="d-flex justify-content-end">
                  <TableAction
                    label="Elimina"
                    iconClass="bi-trash"
                    btnProps={{
                      onClick: () => {
                        remove(attribute)
                      },
                    }}
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

      {modalTemplate && (
        <Overlay>
          <AttributeModal
            template={modalTemplate}
            add={add}
            close={closeModal}
            attributeKey={attributeKey}
          />
        </Overlay>
      )}
    </div>
  )
}
