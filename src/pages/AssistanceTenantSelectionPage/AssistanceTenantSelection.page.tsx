import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { TenantSelect, TenantSelectSkeleton } from './components/TenantSelect'
import { useTranslation } from 'react-i18next'
import { AssistencePartySelectionError } from '@/utils/errors.utils'
import { AuthMutations, AuthQueries } from '@/api/auth'
import type { CompactTenant } from '@/api/api.generatedTypes'
import { useNavigate } from '@/router'
import { useQueryClient } from '@tanstack/react-query'
import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'

const AssistanceTenantSelectionPage: React.FC = () => {
  const { t } = useTranslation('assistance', { keyPrefix: 'tenantSelection' })

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [selectedTenant, setSelectedTenant] = React.useState<CompactTenant | null>(null)
  const { mutate: swapSAMLToken } = AuthMutations.useSwapSAMLTokens()

  const saml2 = window.location.hash.split('#saml2=')[1]?.split('&')[0]
  if (!saml2) throw new AssistencePartySelectionError(`Missing saml2 (${saml2}) from query param`)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTenant) return
    swapSAMLToken(
      { tenantId: selectedTenant.id, saml2 },
      {
        onSuccess: ({ session_token }) => {
          queryClient.setQueryData(AuthQueries.getSessionToken().queryKey, session_token)
          window.localStorage.setItem(STORAGE_KEY_SESSION_TOKEN, session_token)
          navigate('SUBSCRIBE_CATALOG_LIST')
        },
      }
    )
  }

  return (
    <Stack
      justifyContent="center"
      sx={{
        py: 16,
        height: '100%',
      }}
    >
      <Stack component="form" onSubmit={handleSubmit} alignItems="center" spacing={4}>
        <Box sx={{ maxWidth: 580, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
            {t('title')}
          </Typography>
          <Typography variant="body1">{t('subtitle')}</Typography>
        </Box>
        <React.Suspense fallback={<TenantSelectSkeleton />}>
          <TenantSelect selectedTenant={selectedTenant} onSelectTenant={setSelectedTenant} />
        </React.Suspense>
        <Button disabled={!selectedTenant} variant="contained" type="submit">
          {t('nextButtonLabel')}
        </Button>
      </Stack>
    </Stack>
  )
}

export default AssistanceTenantSelectionPage
