import React, { useState } from 'react'
import { Button, Toast } from 'react-bootstrap'
import { AttributeModalTemplate, AttributeKey, AttributeGroup, ToastContent } from '../../types'
import { AttributeModal } from './AttributeModal'
import { Overlay } from './Overlay'
import { TableAction } from './TableAction'
import { TableWithLoader } from './TableWithLoader'

type EServiceAttributeGroupProps = {
  attributes: AttributeGroup[]
  canRequireVerification?: boolean
  canCreateNewAttributes?: boolean
  add: any
  remove: any
  attributeKey: AttributeKey
}

export function EServiceAttributeGroup({
  attributes,
  canRequireVerification = false,
  canCreateNewAttributes = false,
  add,
  remove,
  attributeKey,
}: EServiceAttributeGroupProps) {
  const [toast, setToast] = useState<ToastContent>()
  const [modalTemplate, setModalTemplate] = useState<AttributeModalTemplate>()

  const headData = canRequireVerification
    ? ['nome attributo', 'convalida richiesta', '']
    : ['nome attributo', '']

  const buildShowModal = (template: AttributeModalTemplate) => (_: any) => {
    setModalTemplate(template)
  }

  const closeModal = (toastContent?: ToastContent) => {
    setModalTemplate(undefined)
    setToast(toastContent)
  }

  return (
    <React.Fragment>
      <TableWithLoader isLoading={false} headData={headData}>
        {attributes.length === 0 ? (
          <tr>
            <td colSpan={headData.length}>Nessun attributo presente</td>
          </tr>
        ) : (
          attributes.map(({ group, verificationRequired }, j) => {
            return (
              <tr key={j}>
                <td
                  dangerouslySetInnerHTML={{
                    __html: group.map((item) => item.description).join(' <em>oppure</em> '),
                  }}
                />
                {canRequireVerification && <td>{verificationRequired ? 'Sì' : 'No'}</td>}
                <td>
                  <TableAction
                    label="Elimina"
                    iconClass="bi-trash"
                    btnProps={{
                      onClick: () => {
                        remove(group)
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

      {toast && (
        <Toast
          animation={true}
          className="position-fixed bottom-0 mb-4"
          bg="success"
          style={{ zIndex: 3, left: '50%', transform: `translate(-50%, 0)` }}
          onClose={() => closeModal()}
        >
          <Toast.Header>
            <strong className="me-auto">🎉 {(toast as any)!.title}</strong>
          </Toast.Header>
          <Toast.Body>{(toast as any)!.description}</Toast.Body>
        </Toast>
      )}
    </React.Fragment>
  )
}
