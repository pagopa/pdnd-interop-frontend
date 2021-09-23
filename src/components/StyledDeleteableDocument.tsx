import React, { useEffect, useState } from 'react'
import { EServiceDocumentRead } from '../../types'
import { ActionWithTooltip } from './ActionWithTooltip'
import { StyledInputTextArea } from './StyledInputTextArea'

type StyledDeleteableDocumentComponentProps = {
  eserviceId: string
  descriptorId: string
  readable: EServiceDocumentRead
  deleteDocument: any
  runAction: any
}

export function StyledDeleteableDocument({
  eserviceId,
  descriptorId,
  readable,
  deleteDocument,
  runAction,
}: StyledDeleteableDocumentComponentProps) {
  const [tempDescr, setTempDescr] = useState<string>()
  const [canEdit, setCanEdit] = useState(false)

  useEffect(() => {
    setTempDescr(readable.description)
  }, [readable])

  const updateTempDescr = (e: any) => {
    setTempDescr(e.target.value)
  }

  const updateCanEdit = (e: any) => {
    e.preventDefault()
    setCanEdit(!canEdit)
  }

  const postDescription = async () => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_UPDATE_DOCUMENT_DESCRIPTION',
          endpointParams: { eserviceId, descriptorId, documentId: readable.id },
        },
        config: { method: 'POST', data: { description: tempDescr } },
      },
      { suppressToast: true }
    )
  }

  const onBlur = () => {
    setCanEdit(false)
    postDescription()
  }

  return (
    <div className="d-flex align-items-center justify-content-between">
      <div style={{ maxWidth: 500 }}>
        <strong>{readable.name}</strong>
        <br />
        <StyledInputTextArea
          readOnly={!canEdit}
          className="w-100"
          onChange={updateTempDescr}
          onBlur={onBlur}
          value={tempDescr || ''}
          autofocusOnFalseReadOnly={true}
        />
      </div>
      <div>
        <ActionWithTooltip
          btnProps={{ onClick: updateCanEdit }}
          label="Modifica descrizione"
          iconClass="bi-pencil"
        />
        <ActionWithTooltip
          btnProps={{ onClick: deleteDocument }}
          label="Cancella documento"
          iconClass="bi-trash"
        />
      </div>
    </div>
  )
}
