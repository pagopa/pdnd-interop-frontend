import React from 'react'
import { SxProps } from '@mui/system'
import { Skeleton, Stack } from '@mui/material'

const _DatePicker = React.lazy(() => import('./_DatePicker'))

export type DatePickerProps = {
  name: string
  label?: string
  disabled?: boolean
  infoLabel?: string | JSX.Element
  focusOnMount?: boolean
  sx?: SxProps
  inputSx?: SxProps
}

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  return (
    <React.Suspense fallback={<DatePickerSkeleton sx={props?.sx} />}>
      <_DatePicker {...props} />
    </React.Suspense>
  )
}

export const DatePickerSkeleton: React.FC<{ sx?: SxProps }> = ({ sx }) => {
  return (
    <Stack sx={{ mt: 2, pb: 4, pt: 1, ...sx }} alignItems="center" justifyContent="center">
      <Skeleton variant="rectangular" width={300} height={290} />
    </Stack>
  )
}
