import React from 'react'
import { OverlayTrigger, Button, Tooltip } from 'react-bootstrap'

type BtnProps = {
  to?: string
  onClick?: any
  as?: any
}

type TableActionProps = {
  btnProps?: BtnProps
  label: string
  iconClass: string
}

export function TableAction({ btnProps, label, iconClass }: TableActionProps) {
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{label}</Tooltip>}>
      <Button variant="link" {...btnProps}>
        <i className={`text-primary fs-5 bi ${iconClass}`} />
      </Button>
    </OverlayTrigger>
  )
}
