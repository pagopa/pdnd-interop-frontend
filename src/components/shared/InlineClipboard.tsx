import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { Typography, Popover } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'

type InlineClipboardProps = {
  textToCopy: string
  label?: string
  successFeedbackText?: string
  autoHideDuration?: number
}

export const InlineClipboard: FunctionComponent<InlineClipboardProps> = ({
  textToCopy,
  label,
  successFeedbackText,
  autoHideDuration = 1500,
}) => {
  const { t } = useTranslation('shared-components')
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
      await navigator.clipboard.writeText(textToCopy)
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
      <ButtonNaked
        onClick={copyAttempt}
        sx={{ textAlign: 'left', '&:hover': { bgcolor: 'text.secondary', color: 'common.white' } }}
      >
        <Typography ref={anchorRef} component="span" color="inherit">
          {label || textToCopy}
        </Typography>
      </ButtonNaked>
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
          {successFeedbackText || t('inlineClipboard.defaultSuccessFeedbackText')}
        </Typography>
      </Popover>
    </React.Fragment>
  ) : (
    <Typography ref={anchorRef} component="span">
      {label ? `${label}: ${textToCopy}` : textToCopy}
    </Typography>
  )
}
