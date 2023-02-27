import React from 'react'
import { ButtonProps, Skeleton, SkeletonProps } from '@mui/material'

type ButtonSkeletonProps = Omit<SkeletonProps, 'height' | 'variant'> & {
  width: number
  size?: ButtonProps['size']
}

const height: Record<NonNullable<ButtonProps['size']>, number> = {
  small: 40,
  medium: 48,
  large: 56,
}

export const ButtonSkeleton: React.FC<ButtonSkeletonProps> = ({
  width,
  size = 'medium',
  sx,
  ...props
}) => {
  return (
    <Skeleton
      variant="rectangular"
      width={width}
      height={height[size]}
      sx={{ borderRadius: 1, display: 'inline-block', ...sx }}
      {...props}
    />
  )
}
