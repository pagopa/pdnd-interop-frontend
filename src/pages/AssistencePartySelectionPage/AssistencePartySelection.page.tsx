import React from 'react'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { PartySelect } from './components/PartySelect'
import { useTranslation } from 'react-i18next'

const AssistencePartySelectionPage: React.FC = () => {
  const { t } = useTranslation('assistance', { keyPrefix: 'partySelection' })
  const [selected, setSelected] = React.useState<number | null>(null)

  return (
    <Stack
      justifyContent="center"
      sx={{
        py: 16,
        height: '100%',
      }}
    >
      <Stack alignItems="center" spacing={4}>
        <Box sx={{ maxWidth: 580, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
            {t('title')}
          </Typography>
          <Typography variant="body1">{t('subtitle')}</Typography>
        </Box>
        <Paper elevation={8} sx={{ maxWidth: 480, p: 4, width: '100%', borderRadius: 4 }}>
          <PartySelect selected={selected} onSelect={setSelected} />
        </Paper>
        <Button disabled={!selected} variant="contained">
          {t('nextButtonLabel')}
        </Button>
      </Stack>
    </Stack>
  )
}

export default AssistencePartySelectionPage
