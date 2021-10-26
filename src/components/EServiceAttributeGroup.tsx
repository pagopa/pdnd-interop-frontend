import React, { useContext, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import {
  AttributeModalTemplate,
  AttributeType,
  FrontendAttribute,
  ToastContentWithOutcome,
} from '../../types'
import { AttributeModal } from './AttributeModal'
import { Overlay } from './Overlay'
import { ActionWithTooltip } from './ActionWithTooltip'
import { TableWithLoader } from './TableWithLoader'
import { ToastContext } from '../lib/context'
import { StyledButton } from './Shared/StyledButton'

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
  const { setToast } = useContext(ToastContext)
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
    setToast(null)
  }

  return (
    <React.Fragment>
      <TableWithLoader
        loadingText={null}
        headData={headData}
        data={attributesGroup}
        noDataLabel="Nessun attributo presente"
      >
        {attributesGroup.map(({ attributes, explicitAttributeVerification }, j) => {
          return (
            <tr key={j}>
              <td
                dangerouslySetInnerHTML={{
                  __html: attributes.map(({ name }) => name).join(' <em>oppure</em> '),
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
        <StyledButton className="me-3" variant="contained" onClick={buildShowModal('add')}>
          Aggiungi attributo o gruppo
        </StyledButton>

        {canCreateNewAttributes && (
          <p className="mb-0 d-flex align-items-center">
            <span className="me-2">L'attributo non è presente nella lista?</span>
            <StyledButton
              className="px-0 py-0 mx-0 my-0 border-0 link-default"
              onClick={buildShowModal('create')}
            >
              Crealo qui!
            </StyledButton>
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
