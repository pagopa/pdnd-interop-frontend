import React, { useRef, useState } from 'react'
import { Delete as DeleteIcon, ModeEdit as ModeEditIcon } from '@mui/icons-material'
import { EServiceDocumentRead } from '../../../types'
import { useFeedback } from '../../hooks/useFeedback'
import { StyledButton } from './StyledButton'
import { Box } from '@mui/system'
import { StyledTooltip } from './StyledTooltip'

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
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        mb: 2,
        pb: 2,
        borderBottom: 1,
      }}
    >
      <Box sx={{ mr: 4, flexShrink: 1 }}>
        <strong>{readable.name}</strong>
        <br />

        <Box
          ref={contentEditableRef}
          contentEditable={canEdit}
          sx={{ mt: 1, py: 2, px: 1, mx: -1 }}
          onBlur={onBlur}
          dangerouslySetInnerHTML={{ __html: decodeURIComponent(readable.description) }}
        />
      </Box>
      <Box sx={{ ml: 4, flexShrink: 0 }}>
        <StyledTooltip title="Modifica descrizione">
          <StyledButton
            sx={{
              px: 1,
              py: 1,
              bgcolor: canEdit ? 'primary.main' : 'transparent',
              color: canEdit ? 'common.white' : 'primary.main',
            }}
            onClick={updateCanEdit}
          >
            <ModeEditIcon fontSize="small" />
          </StyledButton>
        </StyledTooltip>
        <StyledTooltip title="Cancella documento">
          <StyledButton sx={{ px: 1, py: 1 }} onClick={deleteDocument}>
            <DeleteIcon fontSize="small" />
          </StyledButton>
        </StyledTooltip>
      </Box>
    </Box>
  )
}
