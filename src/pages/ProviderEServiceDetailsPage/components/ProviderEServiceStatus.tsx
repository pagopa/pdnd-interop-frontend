import { AgreementQueries } from '@/api/agreement'
import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import type { ActionItem } from '@/types/common.types'
import { Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'

type ProviderEServiceStatusProps = {}

export const ProviderEServiceStatus: React.FC<ProviderEServiceStatusProps> = () => {
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(eserviceId, descriptorId)

  if (!descriptor) return <ProviderEServiceStatusSkeleton />

  return (
    <SectionContainer newDesign title="Dashboard">
      <Stack direction="row" justifyContent="space-around" sx={{ mt: 4 }}>
        <StatusItem value="45%" label="della soglia raggiunta per questa versione" />
        <StatusItem
          value="2"
          label="Fruitori over quota"
          button={{ label: 'Scopri quali', action: () => undefined }}
        />
        <StatusItem
          value="12"
          label="Richieste di fruizioni attive"
          button={{ label: 'Vai alle richieste', action: () => undefined }}
        />
        <StatusItem
          value="120"
          label="Finalità attive"
          button={{ label: 'Vai alle finalità', action: () => undefined }}
        />
      </Stack>
    </SectionContainer>
  )
}

type StatusItemProps = {
  label: string
  value: string
  button?: ActionItem
}

const StatusItem: React.FC<StatusItemProps> = ({ label, value, button }) => {
  return (
    <Box sx={{ textAlign: 'center', maxWidth: 220, ml: 0 }}>
      <Typography variant="h1" color="primary">
        {value}
      </Typography>
      <Typography sx={{ mt: 2 }} fontWeight={600}>
        {label}
      </Typography>
      {button && (
        <Button sx={{ mt: 1.5 }} size="small" variant="outlined" onClick={button.action}>
          {button.label}
        </Button>
      )}
    </Box>
  )
}

export const ProviderEServiceStatusSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={99} />
}
