import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useLocation, useNavigate } from 'react-router-dom'
import { ThankYouPage } from '@/components/shared/ThankYouPage'

export type PublishThankYouState = {
  title: string
  description?: string
  subtitle?: string
  bulletPoints?: string[]
  buttonLabel: string
  closePath: string
}

const PublishThankYouPage: React.FC = () => {
  const { state } = useLocation() as { state: PublishThankYouState | null }
  const navigate = useNavigate()

  if (!state) {
    navigate('/', { replace: true })
    return null
  }

  const handleClose = () => {
    navigate(state.closePath)
  }

  const description = state.bulletPoints ? (
    <Stack spacing={1}>
      <Typography variant="body1">{state.subtitle}</Typography>
      <Box component="ul" sx={{ m: 0, pl: 2 }}>
        {state.bulletPoints.map((point, i) => (
          <li key={i}>
            <Typography variant="body1">{point}</Typography>
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
