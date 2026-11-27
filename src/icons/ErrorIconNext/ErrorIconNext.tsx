import React from 'react'
import type { SvgIconProps } from '@mui/material'
import { SvgIcon } from '@mui/material'

export const ErrorIconNext = React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} data-testid="ErrorIconNext">
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill="#CED8F9"
      />
      <circle cx="11.9992" cy="15.2" r="0.8" fill="#0B3EE3" />
      <rect x="11.1992" y="8" width="1.6" height="5.6" rx="0.8" fill="#0B3EE3" />
    </SvgIcon>
  )
})

ErrorIconNext.displayName = 'ErrorIconNext'
