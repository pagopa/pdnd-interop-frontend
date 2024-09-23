import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { Filters, useFilters } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { KeychainPublicKeysTable, KeychainPublicKeysTableSkeleton } from './KeychainPublicKeysTable'
import {
  KeychainAddPublicKeyButton,
  KeychainAddPublicKeyButtonSkeleton,
} from './KeychainAddPublicKeyButton'

type KeychainPublicKeysTabProps = {
  keychainId: string
}

export const KeychainPublicKeysTab: React.FC<KeychainPublicKeysTabProps> = ({ keychainId }) => {
  const { t } = useTranslation('keychain')

  const { data: userOptions = [] } = useQuery({
    ...KeychainQueries.getProducerKeychainUsersList(keychainId),
    select: (data) =>
      data.map((user) => ({
        label: `${user.name} ${user.familyName}`,
        value: user.userId,
      })),
  })

  const { filtersParams, ...filtersHandlers } = useFilters<{ userIds: Array<string> }>([
    {
      name: 'userIds',
      label: t('filters.userField.label'),
      type: 'autocomplete-multiple',
      options: userOptions,
    },
  ])

  const params = {
    ...filtersParams,
    producerKeychainId: keychainId,
  }

  return (
    <>
      <React.Suspense fallback={<KeychainAddPublicKeyButtonSkeleton />}>
        <KeychainAddPublicKeyButton keychainId={keychainId} />
      </React.Suspense>
      <Filters {...filtersHandlers} />
      <React.Suspense fallback={<KeychainPublicKeysTableSkeleton />}>
        <KeychainPublicKeysTable params={params} />
      </React.Suspense>
    </>
  )
}
