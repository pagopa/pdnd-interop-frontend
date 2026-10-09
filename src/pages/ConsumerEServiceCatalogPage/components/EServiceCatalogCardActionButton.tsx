import { Tooltip } from '@mui/material'
import { MIButton } from '@pagopa/mui-italia'
import { commonButtonTextStyle } from '../style/commonStyle'

type ActionButtonProps = {
  prefetchFn: () => void
  disabled: boolean
  handleInspectClick: () => void
  buttonLabel: string
  tooltipTitle?: string
  ariaLabel?: string
}

export const EServiceCatalogCardActionButton: React.FC<ActionButtonProps> = ({
  prefetchFn,
  disabled,
  handleInspectClick,
  buttonLabel,
  tooltipTitle,
  ariaLabel,
}) => {
  return disabled && tooltipTitle ? (
    <Tooltip title={tooltipTitle} arrow>
      <span tabIndex={0} role="button" aria-disabled="true" aria-label={ariaLabel ?? tooltipTitle}>
        <span aria-hidden="true">
          <MIButton
            variant="text"
            onClick={handleInspectClick}
            disabled={disabled}
            sx={commonButtonTextStyle}
            onFocus={prefetchFn}
          >
            {buttonLabel}
          </MIButton>
        </span>
      </span>
    </Tooltip>
  ) : (
    <MIButton
      onClick={handleInspectClick}
      disabled={disabled}
      sx={commonButtonTextStyle}
      onFocus={prefetchFn}
      variant="text"
    >
      {buttonLabel}
    </MIButton>
  )
}
