import React, { FunctionComponent, useRef, useState } from 'react'
import { StyledTooltip } from './StyledTooltip'
import { StyledButton } from './StyledButton'
import {
  Delete as DeleteIcon,
  ModeEdit as ModeEditIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { forceReflow } from '../../lib/wait-utils'
import { useTranslation } from 'react-i18next'
import { Stack, Box } from '@mui/material'

type EditableFieldProps = {
  onSave: (updatedString: string | null) => void
  value: string
  multiline?: boolean
  ariaLabel: string
}

export const EditableField: FunctionComponent<EditableFieldProps> = ({
  onSave,
  value,
  multiline = false,
  ariaLabel,
}) => {
  const { t } = useTranslation('shared-components')
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
      if (!sel) return
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  const updateEditable = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const newState = !canEdit
    setCanEdit(newState)

    if (newState) {
      // This is ugly but needed. Some browsers, like Chrome, need it to explicitly
      // avoid a browser performance optimizations to take place. If so, focus would
      // end up in the same reflow cycle as other actions and won't be honored
      await forceReflow()
      const ref = contentEditableRef.current as HTMLDivElement
      ref.focus()
      placeCaretAtEnd(ref)
    }
  }

  const saveEdit = () => {
    const ref = contentEditableRef.current as HTMLDivElement
    setCanEdit(false)
    onSave(ref.textContent)
  }

  const undoEdit = () => {
    const ref = contentEditableRef.current as HTMLDivElement
    // This is an uncontrolled component, it cannot be controlled with useState
    ref.textContent = decodeURIComponent(value)
    setCanEdit(false)
  }

  const preventBlurUndoEdit = (e: React.SyntheticEvent) => {
    e.preventDefault()
  }

  const btnProps = { px: 1, py: 1, bgcolor: 'transparent', color: 'primary.main' }

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack direction="row" alignItems="center">
        <Box
          ref={contentEditableRef}
          contentEditable={canEdit}
          sx={{ position: 'relative', py: 1, pr: 1, zIndex: 1, display: 'inline-block' }}
          dangerouslySetInnerHTML={{ __html: decodeURIComponent(value) }}
          role="textbox"
          aria-multiline={multiline ? 'true' : 'false'}
          aria-label={ariaLabel}
          onBlur={undoEdit}
        />

        <StyledButton
          sx={{ ...btnProps, opacity: canEdit ? 0 : 1 }}
          onClick={updateEditable}
          disabled={canEdit}
        >
          <ModeEditIcon fontSize="small" />
        </StyledButton>
      </Stack>

      {canEdit && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            bgcolor: 'common.white',
            p: 1,
            border: 2,
            borderColor: 'primary.main',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
        >
          <Stack direction="row">
            <StyledTooltip title={t('saveEdit')} placement="bottom">
              <StyledButton sx={btnProps} onClick={saveEdit} onMouseDown={preventBlurUndoEdit}>
                <SaveIcon fontSize="small" />
              </StyledButton>
            </StyledTooltip>
            <StyledTooltip title={t('undoEdit')} placement="bottom">
              {/* This button is actually unused because the onBlur of the contentEditable takes precedence */}
              <StyledButton sx={btnProps} onClick={undoEdit}>
                <DeleteIcon fontSize="small" />
              </StyledButton>
            </StyledTooltip>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
