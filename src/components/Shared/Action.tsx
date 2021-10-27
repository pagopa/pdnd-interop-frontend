import React from 'react'
import { ActionProps } from '../../../types'
import { StyledButton } from './StyledButton'

export function Action({ btnProps, label, isMock = false }: ActionProps) {
  return (
    <StyledButton variant="outlined" className={isMock ? 'mockFeature' : ''} {...btnProps}>
      {label}
    </StyledButton>
  )
}
