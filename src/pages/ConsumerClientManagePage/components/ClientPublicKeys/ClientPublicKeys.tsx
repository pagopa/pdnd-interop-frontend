import React from 'react'
import {
  ClientAddPublicKeyButton,
  ClientAddPublicKeyButtonSkeleton,
} from './ClientAddPublicKeyButton'
import { ClientPublicKeysTable, ClientPublicKeysTableSkeleton } from './ClientPublicKeysTable'
import { Filters, useFilters } from '@pagopa/interop-fe-commons'
import { ClientQueries } from '@/api/client'
import type { GetClientKeysParams, User } from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'

interface ClientPublicKeysProps {
  clientId: string
}

export const ClientPublicKeys: React.FC<ClientPublicKeysProps> = ({ clientId }) => {
  const { t } = useTranslation('client', { keyPrefix: 'edit.filters' })
  const { data: currentOperators = [] } = ClientQueries.useGetOperatorsList(clientId, {
    suspense: false,
  })

  const userOptions =
    currentOperators.map((o: User) => ({
      label: `${o.name} ${o.surname}`,
      value: o.userId,
    })) || []

  const { filtersParams, ...filtersHandlers } = useFilters<Omit<GetClientKeysParams, 'clientId'>>([
    {
      name: 'userIds',
      label: t('operatorField.label'),
      type: 'autocomplete-multiple',
      options: userOptions,
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
