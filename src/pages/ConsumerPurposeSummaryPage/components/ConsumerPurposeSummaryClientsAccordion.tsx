import type { Purpose } from '@/api/api.generatedTypes'
import { Link } from '@/router'
import { Alert, Stack, Typography } from '@mui/material'
import React from 'react'
import GroupIcon from '@mui/icons-material/Group'
import { useTranslation } from 'react-i18next'

type ConsumerPurposeSummaryClientsAccordionProps = {
  purpose: Purpose
}

export const ConsumerPurposeSummaryClientsAccordion: React.FC<
  ConsumerPurposeSummaryClientsAccordionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'summary.clientsSection' })

  return (
    <Stack spacing={2} alignItems="start">
      {purpose.clients.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t('empty')}
        </Typography>
      )}
      <Stack spacing={1} alignItems="start">
        {purpose.clients.map((client) => {
          return (
            <Link
              key={client.id}
              to="SUBSCRIBE_CLIENT_EDIT"
              params={{
                clientId: client.id,
              }}
              as="button"
              startIcon={<GroupIcon />}
              variant="naked"
            >
              {client.name}
            </Link>
          )
        })}
      </Stack>
      <Alert severity="info" sx={{ width: '100%' }}>
        {t('infoAlert')}
      </Alert>
    </Stack>
  )
}
