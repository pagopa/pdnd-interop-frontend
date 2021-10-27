import React from 'react'
import { ActionProps } from '../../../types'
import { StyledButton } from './StyledButton'

export function Action({ label, isMock = false, ...props }: ActionProps) {
  return (
    <StyledButton variant="outlined" className={isMock ? 'mockFeature' : ''} {...props}>
      {label}
    </StyledButton>
  )
}
