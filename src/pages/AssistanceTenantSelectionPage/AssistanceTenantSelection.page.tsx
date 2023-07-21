import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { TenantSelect, TenantSelectSkeleton } from './components/TenantSelect'
import { useTranslation } from 'react-i18next'
import { AssistencePartySelectionError } from '@/utils/errors.utils'
import { AuthServicesHooks } from '@/api/auth'
import { useAuth } from '@/stores'
import type { CompactTenant } from '@/api/api.generatedTypes'

function getJWTAndSAML2FromURLFragment() {
  const searchParams = new URLSearchParams(window.location.hash.split('#')[1])
  const jwt = searchParams.get('jwt')
  const saml2 = searchParams.get('saml2')
  if (!jwt || !saml2)
    throw new AssistencePartySelectionError(`Missing jwt (${jwt}) or saml2 (${saml2}) query param`)
  return { jwt, saml2 }
}

const AssistanceTenantSelectionPage: React.FC = () => {
  const { t } = useTranslation('assistance', { keyPrefix: 'tenantSelection' })

  const { setSessionToken } = useAuth()

  const [selectedTenant, setSelectedTenant] = React.useState<CompactTenant | null>(null)
  const { mutate: swapSAMLToken } = AuthServicesHooks.useSwapSAMLTokens()

  const { jwt, saml2 } = getJWTAndSAML2FromURLFragment()

  React.useEffect(() => {
    setSessionToken(jwt)
  }, [setSessionToken, jwt])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTenant) return
    swapSAMLToken({ tenantId: selectedTenant.id, saml2 })
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
