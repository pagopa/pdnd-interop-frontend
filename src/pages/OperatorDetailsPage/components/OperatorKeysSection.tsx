import React from 'react'
import { ClientQueries } from '@/api/client'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useClientKind } from '@/hooks/useClientKind'
import { RouterLink } from '@/router'
import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import KeyIcon from '@mui/icons-material/Key'

interface OperatorKeysSectionProps {
  clientId: string
  operatorId: string
}

export const OperatorKeysSection: React.FC<OperatorKeysSectionProps> = ({
  clientId,
  operatorId,
}) => {
  const { t } = useTranslation('user')
  const clientKind = useClientKind()
  const { data: operatorKeys = [] } = ClientQueries.useGetOperatorKeys(clientId, operatorId)

  const keyDetailsRouteKey =
    clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT' : 'SUBSCRIBE_CLIENT_KEY_EDIT'

  return (
    <SectionContainer title={t('edit.associatedKeysField.label')}>
      <Stack spacing={2}>
        {operatorKeys.map(({ key, name }, i) => (
          <RouterLink
            key={i}
            to={keyDetailsRouteKey}
            startIcon={<KeyIcon fontSize="small" />}
            params={{
              clientId,
              kid: key.kid,
            }}
            sx={{ display: 'block' }}
          >
            {name}
          </RouterLink>
        ))}

        {operatorKeys.length === 0 && (
          <Typography component="span">{t('edit.associatedKeysField.noDataLabel')}</Typography>
        )}
      </Stack>
    </SectionContainer>
  )
}

export const OperatorKeysSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={107} />
}
