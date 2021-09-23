import React, { useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { Button } from 'react-bootstrap'
import {
  AttributeModalTemplate,
  AttributeType,
  FrontendAttribute,
  ToastContentWithOutcome,
  ToastProps,
} from '../../types'
import { AttributeModal } from './AttributeModal'
import { Overlay } from './Overlay'
import { StyledToast } from './StyledToast'
import { ActionWithTooltip } from './ActionWithTooltip'
import { TableWithLoader } from './TableWithLoader'

type EServiceAttributeGroupProps = {
  attributesGroup: FrontendAttribute[]
  canRequireVerification?: boolean
  canCreateNewAttributes?: boolean
  add: any
  remove: any
  attributeKey: AttributeType
}

// TEMP REFACTOR: does it make sense and can this be aligned with the withUserFeedback HOC?
export function EServiceAttributeGroup({
  attributesGroup,
  canRequireVerification = false,
  canCreateNewAttributes = false,
  add,
  remove,
  attributeKey,
}: EServiceAttributeGroupProps) {
  const [toast, setToast] = useState<ToastProps>()
  const [modalTemplate, setModalTemplate] = useState<AttributeModalTemplate>()

  const headData = canRequireVerification
    ? ['nome attributo', 'convalida richiesta', '']
    : ['nome attributo', '']

  const buildShowModal = (template: AttributeModalTemplate) => (_: any) => {
    setModalTemplate(template)
  }

  const closeModal = (toastContent?: ToastContentWithOutcome) => {
    setModalTemplate(undefined)
    if (!isEmpty(toastContent)) {
      setToast({ ...toastContent!, onClose: closeToast })
    }
  }

  const closeToast = () => {
    setToast(undefined)
  }

  return (
    <React.Fragment>
      <TableWithLoader
        loading={false}
        headData={headData}
        data={attributesGroup}
        noDataLabel="Nessun attributo presente"
      >
        {attributesGroup.map(({ attributes, explicitAttributeVerification }, j) => {
          return (
            <tr key={j}>
              <td
                dangerouslySetInnerHTML={{
                  __html: attributes
                    .map(({ description, id }) => description || id) // TEMP PIN-427
                    .join(' <em>oppure</em> '),
                }}
              />
              {canRequireVerification && <td>{explicitAttributeVerification ? 'Sì' : 'No'}</td>}
              <td>
                <ActionWithTooltip
                  label="Elimina"
                  iconClass="bi-trash"
                  btnProps={{
                    onClick: () => {
                      remove(attributes)
                    },
                  }}
                />
              </td>
            </tr>
          )
        })}
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
      {toast && <StyledToast {...toast} />}
    </React.Fragment>
  )
}
