import React, { useRef, useState } from 'react'
import { EServiceDocumentRead } from '../../../types'
import { useFeedback } from '../../hooks/useFeedback'
import { Action } from '../Action'

type StyledDeleteableDocumentComponentProps = {
  eserviceId: string
  descriptorId: string
  readable: EServiceDocumentRead
  deleteDocument: any
}

export function StyledDeleteableDocument({
  eserviceId,
  descriptorId,
  readable,
  deleteDocument,
}: StyledDeleteableDocumentComponentProps) {
  const { runAction } = useFeedback()
  const contentEditableRef = useRef<HTMLDivElement>(null)
  const [canEdit, setCanEdit] = useState(false)

  // Cross browser place caret at the end of a contenteditable
  // See: https://stackoverflow.com/a/4238971
  const placeCaretAtEnd = (el: HTMLDivElement) => {
    el.focus()
    if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      const sel = window.getSelection()
      sel!.removeAllRanges()
      sel!.addRange(range)
    } else if (typeof (document.body as any).createTextRange != 'undefined') {
      var textRange = (document.body as any).createTextRange()
      textRange.moveToElementText(el)
      textRange.collapse(false)
      textRange.select()
    }
  }

  const updateCanEdit = (e: any) => {
    e.preventDefault()
    const newState = !canEdit
    setCanEdit(newState)

    if (newState) {
      setTimeout(() => {
        contentEditableRef.current!.focus()
        placeCaretAtEnd(contentEditableRef.current!)
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
        config: { data: { description: contentEditableRef.current!.textContent } },
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
          onBlur={onBlur}
          dangerouslySetInnerHTML={{ __html: decodeURIComponent(readable.description) }}
        />
      </div>
      <div className="ms-5 flex-shrink-0">
        <Action
          className={`rounded-circle px-2 py-2 d-inline-block${canEdit ? ' bg-secondary' : ''}`}
          style={{ width: 48 }}
          btnProps={{ onClick: updateCanEdit }}
          label="Modifica descrizione"
        />
        <Action
          className="px-2 py-2"
          style={{ width: 48 }}
          btnProps={{ onClick: deleteDocument }}
          label="Cancella documento"
        />
      </div>
    </div>
  )
}
