import React, { useState } from 'react'
import type { SxProps } from '@mui/material'
import { InputAdornment, Stack, Tooltip, Button, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import DownloadIcon from '@mui/icons-material/Download'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { useTranslation } from 'react-i18next'
import { InputWrapper } from '@/components/shared/InputWrapper'
import type { EServiceDoc } from '@/api/api.generatedTypes'

type DocumentContainerProps = {
  doc: EServiceDoc
  onDownload?: (document: EServiceDoc) => void
  onDelete?: (document: EServiceDoc) => void
  onUpdateDescription?: (newDescription: string) => void
  sx?: SxProps
}

export function DocumentContainer({
  doc,
  onDownload,
  onDelete,
  onUpdateDescription,
  sx,
}: DocumentContainerProps) {
  const { t } = useTranslation('shared-components', { keyPrefix: 'documentContainer' })
  const [canEdit, setCanEdit] = useState(false)
  const [newValue, setNewValue] = useState(doc.prettyName)

  const handleStartEditing = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setCanEdit(true)
  }

  const handleUpdateDescription = () => {
    if (newValue !== doc.prettyName) {
      onUpdateDescription?.(newValue)
    }
    setCanEdit(false)
  }

  return (
    <Stack sx={sx} direction="row" justifyContent="space-between">
      <InputWrapper
        sx={{ my: 0, width: '100%' }}
        infoLabel={canEdit ? t('prettyName.infoLabel') : undefined}
      >
        <TextField
          size="small"
          inputRef={(input) => input && input.focus()}
          disabled={!canEdit}
          sx={{ my: 0, width: '100%', flexShrink: 1 }}
          name="prettyName"
          label={t('prettyName.label')}
          value={!canEdit ? doc.prettyName : newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onBlur={handleUpdateDescription}
          inputProps={{ maxLength: 60 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachFileIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </InputWrapper>

      <Stack direction="row" alignItems="start" sx={{ flexShrink: 0, ml: 1, mt: 0.8 }}>
        {onUpdateDescription && (
          <Tooltip title={t('editDocumentName')}>
            <Button
              sx={{
                p: 1,
                bgcolor: canEdit ? 'primary.main' : 'transparent',
                color: canEdit ? 'common.white' : 'primary.main',
              }}
              onClick={handleStartEditing}
            >
              <ModeEditIcon fontSize="small" />
            </Button>
          </Tooltip>
        )}
        {onDownload && (
          <Tooltip title={t('downloadDocument')}>
            <Button sx={{ p: 1 }} onClick={onDownload.bind(null, doc)}>
              <DownloadIcon fontSize="small" />
            </Button>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title={t('deleteDocument')}>
            <Button color="error" sx={{ p: 1 }} onClick={onDelete.bind(null, doc)}>
              <DeleteIcon fontSize="small" />
            </Button>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  )
}
