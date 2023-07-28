import React from 'react'
import {
  IconButton,
  InputAdornment,
  List,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { TenantSelectItem } from './TenantSelectItem'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'
import { PartyQueries } from '@/api/party'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import type { CompactTenant } from '@/api/api.generatedTypes'

type TenantSelectProps = {
  selectedTenant: CompactTenant | null
  onSelectTenant: (value: CompactTenant | null) => void
}

export const TenantSelect: React.FC<TenantSelectProps> = ({ selectedTenant, onSelectTenant }) => {
  const { t } = useTranslation('assistance', { keyPrefix: 'tenantSelection' })

  const [query, setQuery] = useAutocompleteTextInput()
  const { data: tenants } = PartyQueries.useGetTenants(
    {
      name: query,
      limit: 50,
    },
    {
      keepPreviousData: true,
    }
  )

  const tenantsOptions = tenants?.results ?? []

  if (selectedTenant) {
    return (
      <TenantSelectWrapper>
        <TenantSelectItem
          component="div"
          tenant={selectedTenant}
          secondaryAction={
            <IconButton
              onClick={() => onSelectTenant(null)}
              edge="end"
              aria-label={t('deselectButtonLabel')}
            >
              <CloseIcon />
            </IconButton>
          }
        />
      </TenantSelectWrapper>
    )
  }

  return (
    <TenantSelectWrapper>
      <TextField
        fullWidth
        size="small"
        label={t('textFieldLabel')}
        autoFocus
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <List
        sx={{
          mt: 2,
          maxHeight: 220,
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'rgb(230, 233, 242) 10px 10px inset',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(0, 115, 230)',
            borderRadius: '16px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {tenantsOptions.map((tenantOption) => (
          <TenantSelectItem
            key={tenantOption.id}
            tenant={tenantOption}
            onClick={() => onSelectTenant(tenantOption)}
          />
        ))}
        {tenantsOptions.length === 0 && (
          <Typography fontWeight={700}>{t('noResultsLabel')}</Typography>
        )}
      </List>
    </TenantSelectWrapper>
  )
}

export const TenantSelectSkeleton: React.FC = () => {
  return (
    <Skeleton
      variant="rectangular"
      sx={{ maxWidth: 480, height: 343, width: '100%', borderRadius: 4 }}
    />
  )
}

const TenantSelectWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Paper elevation={8} sx={{ maxWidth: 480, p: 4, width: '100%', borderRadius: 4 }}>
      {children}
    </Paper>
  )
}
