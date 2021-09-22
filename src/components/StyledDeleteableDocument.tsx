import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { StyledInputTextArea } from './StyledInputTextArea'
import { UserFeedbackHOCProps, withUserFeedback } from './withUserFeedback'

type StyledDeleteableDocumentComponentProps = {
  eserviceId: string
  descriptorId: string
  file: any
  tempDescription?: string
  setTempDescription: any
}

function StyledDeleteableDocumentComponent({
  eserviceId,
  descriptorId,
  file,
  tempDescription,
  setTempDescription,
  runAction,
}: StyledDeleteableDocumentComponentProps & UserFeedbackHOCProps) {
  const [canEdit, setCanEdit] = useState(false)

  const updateCanEdit = (e: any) => {
    e.preventDefault()
    setCanEdit(!canEdit)
  }

  const postDescription = async () => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_UPDATE_DOCUMENT_DESCRIPTION',
          endpointParams: { eserviceId, descriptorId, documentId: file.id },
        },
        config: { method: 'POST', data: { description: tempDescription } },
      },
      { suppressToast: false }
    )
  }

  const deleteEntry = async () => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DELETE_DOCUMENT',
          endpointParams: { eserviceId, descriptorId, documentId: file.id },
        },
        config: { method: 'DELETE' },
      },
      { suppressToast: false }
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
          <strong>{file?.name}</strong>
        </div>

        <div
          className="bg-danger text-white"
          contentEditable={canEdit}
          onInput={setTempDescription}
          onBlur={onBlur}
          dangerouslySetInnerHTML={{ __html: tempDescription || '' }}
        />
      </div>
      <div>
        <Button onClick={updateCanEdit} className="me-2">
          <i className="text-white fs-5 bi bi-pencil" />
        </Button>
        <Button onClick={deleteEntry}>
          <i className="text-white fs-5 bi bi-trash" />
        </Button>
      </div>
    </div>
  )
}

export const StyledDeleteableDocument = withUserFeedback(StyledDeleteableDocumentComponent)
