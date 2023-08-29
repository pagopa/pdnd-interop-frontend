import type { Purpose } from '@/api/api.generatedTypes'
import { Link } from '@/router'
import { Stack } from '@mui/material'
import React from 'react'
import GroupIcon from '@mui/icons-material/Group'

type ConsumerPurposeSummaryClientsAccordionProps = {
  purpose: Purpose
}

export const ConsumerPurposeSummaryClientsAccordion: React.FC<
  ConsumerPurposeSummaryClientsAccordionProps
> = ({ purpose }) => {
  return (
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
  )
}
