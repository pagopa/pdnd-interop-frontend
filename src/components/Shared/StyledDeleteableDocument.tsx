import React, { useRef, useState } from 'react'
import { InputAdornment, Stack, Box } from '@mui/material'
import {
  Delete as DeleteIcon,
  ModeEdit as ModeEditIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material'
import { EServiceDocumentRead } from '../../../types'
import { RunActionOutput, useFeedback } from '../../hooks/useFeedback'
import { StyledButton } from './StyledButton'
import { StyledTooltip } from './StyledTooltip'
import { StyledInputControlledText } from './StyledInputControlledText'
import { useTranslation } from 'react-i18next'

type StyledDeleteableDocumentComponentProps = {
  eserviceId: string
  descriptorId: string
  readable: EServiceDocumentRead
  isLabelEditable?: boolean
  deleteDocument: () => Promise<void>
}

export function StyledDeleteableDocument({
  eserviceId,
  descriptorId,
  readable,
  isLabelEditable = true,
  deleteDocument,
}: StyledDeleteableDocumentComponentProps) {
  const { t } = useTranslation('shared-components')
  const inputRef = useRef<HTMLInputElement>(null)
  const { runAction } = useFeedback()
  const [canEdit, setCanEdit] = useState(false)
  const [fixedValue, setFixedValue] = useState(readable.prettyName)
  const [newValue, setNewValue] = useState(readable.prettyName)

  const updateCanEdit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const newState = !canEdit
    setCanEdit(newState)

    if (newState && inputRef && inputRef.current) {
      setTimeout(() => {
        ;(inputRef.current as HTMLInputElement).focus()
      }, 0)
    }
  }

  const updateNewValue = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement
    setNewValue(target.value)
  }

  const postDescription = async () => {
    const { outcome } = (await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DRAFT_UPDATE_DOCUMENT_DESCRIPTION',
          endpointParams: { eserviceId, descriptorId, documentId: readable.id },
        },
        config: { data: { prettyName: newValue } },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      setFixedValue(newValue)
    }
  }

  const onBlur = async () => {
    await postDescription()
    setCanEdit(false)
  }

  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      justifyContent="space-between"
      sx={{ mb: 1, p: 2, bgcolor: 'background.default' }}
    >
      <Box sx={{ mr: 4, flexShrink: 1 }}>
        <StyledInputControlledText
          ref={inputRef}
          disabled={!canEdit || !isLabelEditable}
          sx={{ my: 0, minWidth: 400 }}
          name="prettyName"
          label={t('styledDeleteableDocument.prettyNameLabel')}
          value={!canEdit ? fixedValue : newValue}
          onChange={updateNewValue}
          onBlur={onBlur}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachFileIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box sx={{ ml: 4, flexShrink: 0 }}>
        {isLabelEditable && (
          <StyledTooltip title={t('styledDeleteableDocument.editDocumentName')}>
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
        )}
        <StyledTooltip title={t('styledDeleteableDocument.deleteDocument')}>
          <StyledButton sx={{ px: 1, py: 1 }} onClick={deleteDocument}>
            <DeleteIcon fontSize="small" />
          </StyledButton>
        </StyledTooltip>
      </Box>
    </Stack>
  )
}
