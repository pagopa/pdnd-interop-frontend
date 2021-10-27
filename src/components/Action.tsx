import React from 'react'
import { StyledButton } from './Shared/StyledButton'

type BtnProps = {
  to?: string
  onClick?: any
  component?: any
}

type ActionProps = {
  btnProps?: BtnProps
  label: string
  isMock?: boolean
  className?: string
  style?: any
}

export function Action({ btnProps, label, isMock = false, className, style }: ActionProps) {
  return (
    <StyledButton
      variant="outlined"
      className={`${isMock ? 'mockFeature' : ''} ${className || ''}`}
      sx={style || {}}
      {...btnProps}
    >
      {label}
    </StyledButton>
  )
}
