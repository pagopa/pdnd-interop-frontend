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
import { TableCell, TableRow, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { StyledLink } from './Shared/StyledLink'

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

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledButton sx={{ mr: '1rem' }} variant="contained" onClick={buildShowModal('add')}>
          Aggiungi attributo o gruppo
        </StyledButton>

        {canCreateNewAttributes && (
          <Typography sx={{ mb: 0, display: 'flex', alignItems: 'center' }}>
            <Typography component="span" sx={{ mr: '0.25rem' }}>
              L'attributo non è presente nella lista?
            </Typography>
            <StyledLink component="button" onClick={buildShowModal('create')}>
              Crealo qui!
            </StyledLink>
          </Typography>
        )}
      </Box>

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
