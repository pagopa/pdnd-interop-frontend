import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useLocation } from 'react-router-dom'
import { useNavigate } from '@/router'
import type { RouteKey } from '@/router'
import { ThankYouPage } from '@/components/shared/ThankYouPage'

export type PublishThankYouState = {
  title: string
  description?: string
  subtitle?: string
  bulletPoints?: string[]
  buttonLabel: string
  closeRouteKey: RouteKey
  closeRouteParams: Record<string, string>
}

const PublishThankYouPage: React.FC = () => {
  const { state } = useLocation() as { state: PublishThankYouState | null }
  const navigate = useNavigate()

  if (!state) {
    ;(navigate as Function)('SUBSCRIBE_CATALOG_LIST')
    return null
  }

  const handleClose = () => {
    ;(navigate as Function)(state.closeRouteKey, { params: state.closeRouteParams })
  }

  const description = state.bulletPoints ? (
    <Stack spacing={1}>
      <Typography variant="body1">{state.subtitle}</Typography>
      <Box component="ul" sx={{ m: 0, p: 0, listStyleType: 'square', listStylePosition: 'inside' }}>
        {state.bulletPoints.map((point, i) => (
          <li key={i}>
            <Typography variant="body1" component="span">
              {point}
            </Typography>
          </li>
        ))}
      </Box>
    </Stack>
  ) : (
    <Typography variant="body1">{state.description}</Typography>
  )

  return (
    <ThankYouPage
      icon={CheckIcon}
      title={state.title}
      description={description}
      buttonLabel={state.buttonLabel}
      onButtonClick={handleClose}
    />
  )
}

export default PublishThankYouPage
