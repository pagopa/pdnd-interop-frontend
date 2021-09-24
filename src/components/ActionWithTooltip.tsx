import React from 'react'
import { OverlayTrigger, Button, Tooltip } from 'react-bootstrap'

type BtnProps = {
  to?: string
  onClick?: any
  as?: any
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
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip className="opacity-100" id="tooltip">
          {label}
        </Tooltip>
      }
    >
      <Button
        className={`${isMock ? 'mockFeature' : ''} ${className || ''}`}
        style={style || {}}
        variant="link"
        {...btnProps}
      >
        <i className={`text-primary fs-5 bi ${iconClass}`} />
      </Button>
    </OverlayTrigger>
  )
}
