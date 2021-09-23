import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { EServiceDocumentRead } from '../../types'
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
      <div>
        <div>
          <strong>{readable.name}</strong>
        </div>

        <StyledInputTextArea
          readOnly={!canEdit}
          className="bg-danger text-white"
          onChange={updateTempDescr}
          onBlur={onBlur}
          value={tempDescr || ''}
        />
      </div>
      <div>
        <Button onClick={updateCanEdit} className="me-2">
          <i className="text-white fs-5 bi bi-pencil" />
        </Button>
        <Button onClick={deleteDocument}>
          <i className="text-white fs-5 bi bi-trash" />
        </Button>
      </div>
    </div>
  )
}
