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
}

export function ActionWithTooltip({
  btnProps,
  label,
  iconClass,
  isMock = false,
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
      <Button className={isMock ? 'mockFeature' : ''} variant="link" {...btnProps}>
        <i className={`text-primary fs-5 bi ${iconClass}`} />
      </Button>
    </OverlayTrigger>
  )
}
