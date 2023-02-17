import React, { useState, useRef, useEffect } from 'react'
import { Button, Link, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

interface CopyToClipboardProps {
  /** callback used to retrieve the text to be copied */
  value: (() => string) | string
  /** an optional text to be displayed near the "copy to clipboard" icon */
  text?: string
  tooltipMode?: boolean
  tooltip?: string
  disabled?: boolean
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  value,
  text,
  tooltipMode,
  tooltip = '',
  disabled = false,
}) => {
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<NodeJS.Timeout>()

  const handleCopyToClipboard = async () => {
    const valueToCopy = value instanceof Function ? value() : value

    if (tooltipMode && !copied) {
      clearTimeout(copiedTimeoutRef.current)
      setCopied(true)
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
    }

    try {
      await navigator.clipboard.writeText(valueToCopy)
    } catch (err) {
      console.error(err)
    }
  }

  /** Clears the timeout on component unmount */
  useEffect(() => {
    return () => {
      clearTimeout(copiedTimeoutRef.current)
    }
  }, [])

  const CopyToClipboardBtnIcon = copied ? CheckIcon : ContentCopyIcon

  return (
    <Button
      component={Link}
      color="primary"
      sx={{ textAlign: 'center', padding: tooltipMode ? 0 : undefined }}
      minWidth={{ md: 'max-content' }}
      onClick={handleCopyToClipboard}
      disabled={disabled}
      aria-label={tooltip}
    >
      <Tooltip open={copied} arrow={true} title={tooltip} placement="top">
        <CopyToClipboardBtnIcon fontSize="small" sx={{ m: '5px' }} />
      </Tooltip>
      {text}
    </Button>
  )
}

export default CopyToClipboard
