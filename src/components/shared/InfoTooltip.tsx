import React from 'react'
import { Info as InfoIcon } from '@mui/icons-material'
import { Skeleton, Tooltip } from '@mui/material'

type InfoTooltipProps = {
  label: string
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ label }) => {
  return (
    <Tooltip title={label}>
      <InfoIcon color="primary" fontSize="small" sx={{ ml: 1 }} />
    </Tooltip>
  )
}

export const InfoTooltipSkeleton: React.FC = () => {
  return <Skeleton variant="circular" width={20} height={20} />
}
