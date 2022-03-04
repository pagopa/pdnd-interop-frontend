import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { Typography, Popover } from '@mui/material'
import { StyledButton } from './StyledButton'

type InlineClipboardProps = {
  text: string
  successFeedbackText?: string
  autoHideDuration?: number
}

export const InlineClipboard: FunctionComponent<InlineClipboardProps> = ({
  text,
  successFeedbackText = 'Messaggio copiato correttamente',
  autoHideDuration = 1500,
}) => {
  const [permission, setPermission] = useState(false)
  const [popover, setPopover] = useState(false)
  const anchorRef = useRef() as React.MutableRefObject<HTMLSpanElement>

  useEffect(() => {
    async function asyncTestPermission() {
      try {
        const descriptor = { name: 'clipboard-write' as PermissionName }
        const permission = await navigator.permissions.query(descriptor)

        if (['granted', 'prompt'].includes(permission.state)) {
          setPermission(true)
        }
      } catch (err) {
        console.error(err)
        setPermission(false)
      }
    }

    asyncTestPermission()
  }, [])

  const copyAttempt = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setPopover(true)

      // TEMP REFACTOR: this autohide is probably not good for a11y
      setTimeout(() => {
        setPopover(false)
      }, autoHideDuration)
    } catch (err) {
      console.error(err)
      setPermission(false)
    }
  }

  return permission ? (
    <React.Fragment>
      <StyledButton onClick={copyAttempt} sx={{ p: 0 }}>
        <Typography ref={anchorRef} component="span">
          {text}
        </Typography>
      </StyledButton>
      <Popover
        anchorEl={anchorRef.current}
        open={popover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Typography
          sx={{ p: 1, display: 'inline-block' }}
          color="common.white"
          bgcolor="primary.main"
          variant="caption"
        >
          {successFeedbackText}
        </Typography>
      </Popover>
    </React.Fragment>
  ) : (
    <Typography ref={anchorRef} component="span">
      {text}
    </Typography>
  )
}
