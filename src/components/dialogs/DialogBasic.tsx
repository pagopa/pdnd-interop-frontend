import React from 'react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Link,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { DialogBasicProps } from '@/types/dialog.types'
import { useDialog } from '@/stores'

export const DialogBasic: React.FC<DialogBasicProps> = ({
  title = 'Conferma azione',
  description,
  descriptionLink,
  onProceed,
  onCancel,
  proceedLabel,
  disabled = false,
  maxWidth,
  checkbox,
}) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()
  const { closeDialog } = useDialog()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const handleCancel = () => {
    onCancel?.()
    closeDialog()
  }

  const handleProceed = () => {
    onProceed()
    closeDialog()
  }

  const [isCheckboxChecked, setIsCheckboxChecked] = React.useState<boolean>(false)

  const handleCheckBoxChange = () => {
    setIsCheckboxChecked((prev) => {
      return !prev
    })
  }

  const renderDescription = (text: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = []
    const tagRegex = /<(strong|1)>(.*?)<\/\1>/g
    let lastIndex = 0

    for (const match of text.matchAll(tagRegex)) {
      const [matchedText, tag, content] = match

      if (match.index > lastIndex) {
        nodes.push(text.slice(lastIndex, match.index))
      }

      if (tag === 'strong') {
        nodes.push(
          <Typography component="span" variant="inherit" fontWeight={600} key={match.index}>
            {renderDescription(content)}
          </Typography>
        )
      } else if (descriptionLink) {
        nodes.push(
          <Link href={descriptionLink.href} target="_blank" rel="noreferrer" key={match.index}>
            {renderDescription(content)}
          </Link>
        )
      } else {
        nodes.push(<React.Fragment key={match.index}>{renderDescription(content)}</React.Fragment>)
      }

      lastIndex = match.index + matchedText.length
    }

    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex))
    }

    return nodes
  }

  return (
    <Dialog
      open
      onClose={handleCancel}
      aria-labelledby={ariaLabelId}
      {...(description ? { 'aria-describedby': ariaDescriptionId } : {})}
      maxWidth={maxWidth}
      fullWidth
    >
      <DialogTitle id={ariaLabelId}>{title}</DialogTitle>

      {description && (
        <DialogContent id={ariaDescriptionId}>{renderDescription(description)}</DialogContent>
      )}
      {checkbox && (
        <FormControlLabel
          key={'confirmationCheckbox'}
          value={isCheckboxChecked}
          onChange={handleCheckBoxChange}
          control={<Checkbox />}
          label={checkbox}
          sx={{ mx: 1 }}
        />
      )}

      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          {tCommon('cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleProceed}
          disabled={disabled || (!!checkbox && !isCheckboxChecked)}
        >
          {proceedLabel ?? tCommon('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
