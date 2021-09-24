import React, { useEffect, useRef, useState } from 'react'
import { EServiceDocumentRead } from '../../types'
import { ActionWithTooltip } from './ActionWithTooltip'

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
  const contentEditableRef = useRef<HTMLDivElement>(null)
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
    const newState = !canEdit
    setCanEdit(newState)
    if (newState) {
      setTimeout(() => {
        contentEditableRef.current?.focus()
      }, 0)
    }
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
    <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
      <div className="me-5 flex-shrink-1">
        <strong>{readable.name}</strong>
        <br />

        <div
          ref={contentEditableRef}
          contentEditable={canEdit}
          className="mt-2"
          onChange={updateTempDescr}
          onBlur={onBlur}
          dangerouslySetInnerHTML={{
            __html: tempDescr || '',
          }}
        />
      </div>
      <div className="ms-5 flex-shrink-0">
        <ActionWithTooltip
          className={`rounded-circle px-2 py-2 d-inline-block${canEdit ? ' bg-secondary' : ''}`}
          style={{ width: 48 }}
          btnProps={{ onClick: updateCanEdit }}
          label="Modifica descrizione"
          iconClass="bi-pencil"
        />
        <ActionWithTooltip
          className="px-2 py-2"
          style={{ width: 48 }}
          btnProps={{ onClick: deleteDocument }}
          label="Cancella documento"
          iconClass="bi-trash"
        />
      </div>
    </div>
  )
}
