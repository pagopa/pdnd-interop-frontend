import React, { FunctionComponent, useContext } from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ToastContext } from '../../lib/context'
import { ToastProps } from '../../../types'
import { StyledButton } from './StyledButton'
import { StyledTooltip } from './StyledTooltip'

type InlineClipboardProps = {
  text: string
  successTooltipText?: string
}

export const InlineClipboard: FunctionComponent<InlineClipboardProps> = ({
  text,
  successTooltipText = 'Messaggio copiato correttamente',
}) => {
  const { setToast } = useContext(ToastContext)

  const attemptCopy = async () => {
    const clipboardWritePermission = 'clipboard-write' as PermissionName
    const permission = await navigator.permissions.query({ name: clipboardWritePermission })

    const toastProps: ToastProps = {
      onClose: () => {
        setToast(null)
      },
      autoHideDuration: 1250,
      outcome: 'error',
      title: 'Errore',
      description: 'Verificare i permessi per accedere alla clipboard',
    }

    if (['granted', 'prompt'].includes(permission.state)) {
      // Write to clipboard
      navigator.clipboard.writeText(text)
      // Change toast props to success
      toastProps.outcome = 'success'
      toastProps.title = successTooltipText
      toastProps.description = 'Puoi ora incollare il contenuto altrove'
    }

    setToast({ ...toastProps })
  }

  return (
    <Box sx={{ mt: 1, py: 1 }}>
      <StyledTooltip title="Clicca per copiare nella clipboard">
        <StyledButton onClick={attemptCopy} sx={{ p: 0 }}>
          <Typography component="span">{text}</Typography>
        </StyledButton>
      </StyledTooltip>
    </Box>
  )
}
