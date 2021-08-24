import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { AttributeModalTemplate, AttributeKey, AttributeGroup } from '../../types'
import { AttributeModal } from './AttributeModal'
import { Overlay } from './Overlay'
import { TableAction } from './TableAction'
import { TableWithLoader } from './TableWithLoader'

type EServiceAttributeGroupProps = {
  attributes: AttributeGroup[]
  canRequiredValidation?: boolean
  canCreateNewAttributes?: boolean
  add: any
  remove: any
  attributeKey: AttributeKey
}

export function EServiceAttributeGroup({
  attributes,
  canRequiredValidation = false,
  canCreateNewAttributes = false,
  add,
  remove,
  attributeKey,
}: EServiceAttributeGroupProps) {
  const [modalTemplate, setModalTemplate] = useState<AttributeModalTemplate>()

  const headData = canRequiredValidation
    ? ['nome attributo', 'convalida richiesta', '']
    : ['nome attributo', '']

  const buildShowModal = (template: AttributeModalTemplate) => (_: any) => {
    setModalTemplate(template)
  }

  const closeModal = () => {
    setModalTemplate(undefined)
  }

  return (
    <React.Fragment>
      <TableWithLoader isLoading={false} headData={headData}>
        {attributes.length === 0 ? (
          <tr>
            <td colSpan={headData.length}>Nessun attributo presente</td>
          </tr>
        ) : (
          attributes.map(({ attributeGroup, verificationRequired }, j) => {
            console.log(attributeGroup)
            return (
              <tr key={j}>
                <td>{attributeGroup.map((item) => item.description).join(' <em>oppure</em> ')}</td>
                {canRequiredValidation && <td>{verificationRequired ? 'Sì' : 'No'}</td>}
                <td>
                  <TableAction
                    label="Elimina"
                    iconClass="bi-trash"
                    btnProps={{
                      onClick: () => {
                        remove(attributeGroup)
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
          aggiungi attributo o gruppo
        </Button>

        {canCreateNewAttributes && (
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
    </React.Fragment>
  )
}
