import React, { useState, useRef, useEffect } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import type { IconButtonProps } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

interface CopyToClipboardProps extends Omit<IconButtonProps, 'onClick' | 'value'> {
  /** callback used to retrieve the text to be copied */
  value: (() => string) | string
  tooltipTitle?: string
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ value, tooltipTitle, ...props }) => {
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<NodeJS.Timeout>()

  const handleCopyToClipboard = async () => {
    const valueToCopy = value instanceof Function ? value() : value

    if (tooltipTitle) {
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

  return (
    <Tooltip open={copied} arrow={true} title={tooltipTitle} placement="top">
      <IconButton color="primary" onClick={handleCopyToClipboard} {...props}>
        {copied && <CheckIcon fontSize="small" />}
        {!copied && <ContentCopyIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  )
}

export default CopyToClipboard
