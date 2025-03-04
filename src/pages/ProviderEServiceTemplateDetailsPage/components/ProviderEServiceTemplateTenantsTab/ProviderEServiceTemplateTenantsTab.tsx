import { AuthHooks } from '@/api/auth'
import { useDrawerState } from '@/hooks/useDrawerState'
import { Button, Stack, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useParams } from '@/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { KeychainQueries } from '@/api/keychain'
import { KeychainMutations } from '@/api/keychain/keychain.mutations'
import type { CompactProducerKeychain } from '@/api/api.generatedTypes'
import { PageContainer } from '@/components/layout/containers'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { TemplateQueries } from '@/api/template'
import { ProviderEServiceTemplateUsingTenantsTable } from './ProviderEServiceTemplateUsingTenantsTable'

export const ProviderEServiceTemplateTenantsTab: React.FC = () => {
  const { t } = useTranslation('template', { keyPrefix: 'read.tenants' })
  const { t: tCommon } = useTranslation('common')
  const { eServiceTemplateId } = useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()
  const queryClient = useQueryClient()
  const { jwt, isAdmin } = AuthHooks.useJwt()

  const { data: templateInstances } = useQuery(
    TemplateQueries.getProviderTemplateInstancesList(eServiceTemplateId)
  )

  const handlePrefetchKeychainList = () => {
    queryClient.prefetchQuery(TemplateQueries.getProviderTemplateInstancesList(eServiceTemplateId))
  }

  return (
    <>
      <ProviderEServiceTemplateUsingTenantsTable eserviceTemplateId={eServiceTemplateId} />
    </>
  )
}
