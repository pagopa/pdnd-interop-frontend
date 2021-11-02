import React, { useRef, useState } from 'react'
import { Delete as DeleteIcon, ModeEdit as ModeEditIcon } from '@mui/icons-material'
import { EServiceDocumentRead } from '../../../types'
import { useFeedback } from '../../hooks/useFeedback'
import { StyledButton } from './StyledButton'
import { Box } from '@mui/system'

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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: '1rem',
        pb: '1rem',
        borderBottom: 1,
      }}
    >
      <Box sx={{ mr: '2rem', flexShrink: 1 }}>
        <strong>{readable.name}</strong>
        <br />

        <Box
          ref={contentEditableRef}
          contentEditable={canEdit}
          sx={{ mt: '0.25rem' }}
          onBlur={onBlur}
          dangerouslySetInnerHTML={{ __html: decodeURIComponent(readable.description) }}
        />
      </Box>
      <Box sx={{ ml: '2rem', flexShrink: 0 }}>
        <StyledButton
          sx={{
            px: '0.25rem',
            py: '0.25rem',
            display: 'inline-block',
            borderRadius: '100%',
            width: 48,
          }}
          bgcolor={canEdit ? 'grey.500' : 'transparent'}
          onClick={updateCanEdit}
          label="Modifica descrizione"
        >
          <ModeEditIcon fontSize="small" />
        </StyledButton>
        <StyledButton
          sx={{ px: '0.25rem', py: '0.25rem' }}
          style={{ width: 48 }}
          onClick={deleteDocument}
          label="Cancella documento"
        >
          <DeleteIcon fontSize="small" />
        </StyledButton>
      </Box>
    </Box>
  )
}
