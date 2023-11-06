import React from 'react'
import {
  ClientAddPublicKeyButton,
  ClientAddPublicKeyButtonSkeleton,
} from './ClientAddPublicKeyButton'
import { ClientPublicKeysTable, ClientPublicKeysTableSkeleton } from './ClientPublicKeysTable'
import { Filters, useFilters } from '@pagopa/interop-fe-commons'
import { ClientQueries } from '@/api/client'
import type { GetClientKeysParams } from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'

interface ClientPublicKeysProps {
  clientId: string
}

export const ClientPublicKeys: React.FC<ClientPublicKeysProps> = ({ clientId }) => {
  const { t } = useTranslation('client', { keyPrefix: 'edit.filters' })
  const { data: currentOperators = [] } = ClientQueries.useGetOperatorsList(clientId, {
    suspense: false,
  })

  const relationshipOptions =
    currentOperators.map((o) => ({
      label: `${o.name} ${o.familyName}`,
      value: o.relationshipId,
    })) || []

  const { filtersParams, ...filtersHandlers } = useFilters<Omit<GetClientKeysParams, 'clientId'>>([
    {
      name: 'relationshipIds',
      label: t('operatorField.label'),
      type: 'autocomplete-multiple',
      options: relationshipOptions,
    },
  ])

  const params = {
    ...filtersParams,
    clientId: clientId,
  }

  return (
    <>
      <React.Suspense fallback={<ClientAddPublicKeyButtonSkeleton />}>
        <ClientAddPublicKeyButton clientId={clientId} />
      </React.Suspense>
      <Filters {...filtersHandlers} />
      <React.Suspense fallback={<ClientPublicKeysTableSkeleton />}>
        <ClientPublicKeysTable params={params} />
      </React.Suspense>
    </>
  )
}
