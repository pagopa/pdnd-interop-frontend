import React, { useState, useRef, useEffect } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import type { IconButtonProps } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

interface CopyToClipboardProps extends Omit<IconButtonProps, 'onClick' | 'value'> {
  value: (() => string) | string
  text?: string
  tooltipTitle?: string
}

function getDefaultAriaLabel() {
  if (typeof window !== 'undefined') {
    const activeLang = window.document.documentElement.lang
    if (activeLang && activeLang !== 'it') return 'Copy'
  }

  return 'Copia'
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  value,
  tooltipTitle,
  text,
  ...props
}) => {
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<NodeJS.Timeout>()

  const ariaLabel = props['aria-label'] ?? getDefaultAriaLabel()

  const handleCopyToClipboard = async () => {
    const valueToCopy = value instanceof Function ? value() : value

    try {
      await navigator.clipboard.writeText(valueToCopy)
      if (tooltipTitle) {
        clearTimeout(copiedTimeoutRef.current)
        setCopied(true)
        copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
      }
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
    <>
      {text}
      <Tooltip
        sx={{ ml: !!text ? 1 : 0 }}
        open={copied}
        arrow={true}
        title={tooltipTitle}
        placement="top"
      >
        <IconButton
          role="button"
          color="primary"
          onClick={handleCopyToClipboard}
          {...props}
          aria-label={copied ? tooltipTitle : ariaLabel}
        >
          {copied && <CheckIcon fontSize="small" />}
          {!copied && <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    </>
  )
}

export default CopyToClipboard
