import React, { useContext, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import {
  AttributeModalTemplate,
  AttributeType,
  FrontendAttribute,
  ToastContentWithOutcome,
} from '../../types'
import { AttributeModal } from './AttributeModal'
import { Overlay } from './Shared/Overlay'
import { TableWithLoader } from './Shared/TableWithLoader'
import { ToastContext } from '../lib/context'
import { StyledButton } from './Shared/StyledButton'
import { TableCell, TableRow } from '@mui/material'

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

  const wrapRemove = (attributes: any) => (_: any) => {
    remove(attributes)
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
            <TableRow key={j} sx={{ bgcolor: 'common.white' }}>
              <TableCell
                dangerouslySetInnerHTML={{
                  __html: attributes.map(({ name }) => name).join(' <em>oppure</em> '),
                }}
              />
              {canRequireVerification && (
                <TableCell>{explicitAttributeVerification ? 'Sì' : 'No'}</TableCell>
              )}
              <TableCell>
                <StyledButton onClick={wrapRemove(attributes)}>Elimina</StyledButton>
              </TableCell>
            </TableRow>
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
              className="px-0 py-0 mx-0 my-0 border-0"
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
