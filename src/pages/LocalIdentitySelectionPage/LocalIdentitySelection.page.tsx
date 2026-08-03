import React from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
import { AuthQueries } from '@/api/auth'
import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { useNavigate } from '@/router'
import type { LangCode } from '@/types/common.types'
import localIdentitySelectionEnNs from '@/static/locales/en/local-identity-selection.json'
import localIdentitySelectionItNs from '@/static/locales/it/local-identity-selection.json'

const localIdentitiesEndpoint = '/__local-dashboard/api/identities'
const localIdentityEndpoint = '/__local-dashboard/api/identity'
const translationNamespace = 'local-identity-selection'

i18n.addResourceBundle('it', translationNamespace, localIdentitySelectionItNs)
i18n.addResourceBundle('en', translationNamespace, localIdentitySelectionEnNs)

const localIdentityUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()),
})

const localIdentitiesSchema = z.object({
  tenants: z.array(
    z.object({
      key: z.string(),
      id: z.string().uuid(),
      name: z.string(),
      users: z.array(localIdentityUserSchema),
    })
  ),
})

const sessionTokenSchema = z.object({
  sessionToken: z.string().min(1),
})

const requestJson = async (input: RequestInfo | URL, init?: RequestInit) => {
  const response = await fetch(input, init)
  if (!response.ok) throw new Error(`Local identity request failed with ${response.status}`)
  return response.json()
}

const LocalIdentitySelectionPage: React.FC<{ language: LangCode }> = ({ language }) => {
  const { t } = useTranslation(translationNamespace)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [tenantKey, setTenantKey] = React.useState('')
  const [userId, setUserId] = React.useState('')

  React.useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  const identitiesQuery = useQuery({
    queryKey: ['local-development', 'identities'],
    queryFn: async () => localIdentitiesSchema.parse(await requestJson(localIdentitiesEndpoint)),
    staleTime: Infinity,
  })
  const identityMutation = useMutation({
    mutationFn: async () =>
      sessionTokenSchema.parse(
        await requestJson(localIdentityEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantKey, userId }),
        })
      ),
    onSuccess: ({ sessionToken }) => {
      queryClient.clear()
      window.localStorage.setItem(STORAGE_KEY_SESSION_TOKEN, sessionToken)
      queryClient.setQueryData(AuthQueries.getSessionToken().queryKey, sessionToken)
      navigate('DEFAULT')
    },
  })

  const selectedTenant = identitiesQuery.data?.tenants.find((tenant) => tenant.key === tenantKey)

  const handleTenantChange = (value: string) => {
    setTenantKey(value)
    setUserId('')
  }

  return (
    <Stack justifyContent="center" alignItems="center" sx={{ minHeight: '100%', px: 2, py: 8 }}>
      <Box sx={{ width: '100%', maxWidth: 580 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
            {t('title')}
          </Typography>
          <Typography color="text.secondary">{t('subtitle')}</Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 } }}>
          {identitiesQuery.isError ? (
            <Alert severity="error">{t('loadError')}</Alert>
          ) : identitiesQuery.isLoading ? (
            <Stack alignItems="center" p={4}>
              <CircularProgress />
            </Stack>
          ) : (
            <Stack
              component="form"
              spacing={3}
              onSubmit={(event) => {
                event.preventDefault()
                identityMutation.mutate()
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="local-tenant-label">{t('tenantLabel')}</InputLabel>
                <Select
                  labelId="local-tenant-label"
                  label={t('tenantLabel')}
                  value={tenantKey}
                  onChange={(event) => handleTenantChange(event.target.value)}
                >
                  {identitiesQuery.data?.tenants.map((tenant) => (
                    <MenuItem key={tenant.key} value={tenant.key}>
                      {tenant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={!selectedTenant}>
                <InputLabel id="local-user-label">{t('userLabel')}</InputLabel>
                <Select
                  labelId="local-user-label"
                  label={t('userLabel')}
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                >
                  {selectedTenant?.users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} {user.surname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {identityMutation.isError && <Alert severity="error">{t('submitError')}</Alert>}
              <Button
                variant="contained"
                type="submit"
                disabled={!tenantKey || !userId || identityMutation.isPending}
              >
                {identityMutation.isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('submitButton')
                )}
              </Button>
            </Stack>
          )}
        </Paper>
      </Box>
    </Stack>
  )
}

export default LocalIdentitySelectionPage
