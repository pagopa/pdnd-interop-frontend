import React, { useEffect, useRef, useState } from 'react'
import { Typography, Popover } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions'
import { useTranslation } from 'react-i18next'

type FixedClipboardProps = {
  textToCopy: string
  successFeedbackText?: string
  autoHideDuration?: number
}

const CopyToClipboardButton: React.FC<FixedClipboardProps> = ({
  textToCopy,
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
        title={t('copyToClipboardButton.copy')}
        onClick={copyAttempt}
        sx={{
          p: 1,
          textAlign: 'left',
          color: 'primary',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Typography component="span" ref={anchorRef} sx={{ visibility: 'hidden' }} />
        <IntegrationInstructionsIcon color="primary" />
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
          {successFeedbackText || t('copyToClipboardButton.copied')}
        </Typography>
      </Popover>
    </React.Fragment>
  ) : null
}

export default CopyToClipboardButton
