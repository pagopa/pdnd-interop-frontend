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
  isMock?: boolean
}

export function TableAction({ btnProps, label, iconClass, isMock = false }: TableActionProps) {
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{label}</Tooltip>}>
      <Button className={isMock ? 'mockFeature' : ''} variant="link" {...btnProps}>
        <i className={`text-primary fs-5 bi ${iconClass}`} />
      </Button>
    </OverlayTrigger>
  )
}
