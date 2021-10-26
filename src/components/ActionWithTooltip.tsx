import React from 'react'
import { StyledButton } from './Shared/StyledButton'
import { StyledOverlayTrigger } from './Shared/StyledOverlayTrigger'
import { StyledTooltip } from './Shared/StyledTooltip'

type BtnProps = {
  to?: string
  onClick?: any
  component?: any
}

type ActionWithTooltipProps = {
  btnProps?: BtnProps
  label: string
  iconClass: string
  isMock?: boolean
  className?: string
  style?: any
}

export function ActionWithTooltip({
  btnProps,
  label,
  iconClass,
  isMock = false,
  className,
  style,
}: ActionWithTooltipProps) {
  return (
    <StyledOverlayTrigger
      placement="top"
      overlay={
        <StyledTooltip className="opacity-100" id="tooltip">
          {label}
        </StyledTooltip>
      }
    >
      <StyledButton
        className={`${isMock ? 'mockFeature' : ''} ${className || ''}`}
        sx={style || {}}
        {...btnProps}
      >
        <i className={`text-primary fs-5 bi ${iconClass}`} />
      </StyledButton>
    </StyledOverlayTrigger>
  )
}
