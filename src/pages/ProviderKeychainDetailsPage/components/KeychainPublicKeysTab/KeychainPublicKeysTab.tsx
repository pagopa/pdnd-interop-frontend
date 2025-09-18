import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { Filters, Pagination, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { KeychainPublicKeysTable, KeychainPublicKeysTableSkeleton } from './KeychainPublicKeysTable'
import {
  KeychainAddPublicKeyButton,
  KeychainAddPublicKeyButtonSkeleton,
} from './KeychainAddPublicKeyButton'
import type { GetProducerKeysParams } from '@/api/api.generatedTypes'

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

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })

  const params = {
    ...filtersParams,
    ...paginationParams,
    producerKeychainId: keychainId,
  }

  const { data: totalPageCount = 0 } = useQuery({
    ...KeychainQueries.getProducerKeychainKeysList(params),
    placeholderData: keepPreviousData,
    select: ({ pagination }) => getTotalPageCount(pagination?.totalCount),
  })

  return (
    <>
      <React.Suspense fallback={<KeychainAddPublicKeyButtonSkeleton />}>
        <KeychainAddPublicKeyButton keychainId={keychainId} />
      </React.Suspense>
      <Filters {...filtersHandlers} />
      <React.Suspense fallback={<KeychainPublicKeysTableSkeleton />}>
        <KeychainPublicKeysWrapper params={params} />
        <Pagination {...paginationProps} totalPages={totalPageCount} />
      </React.Suspense>
    </>
  )
}

const KeychainPublicKeysWrapper: React.FC<{ params: GetProducerKeysParams }> = ({ params }) => {
  const { data, isFetching } = useQuery(KeychainQueries.getProducerKeychainKeysList(params))

  if (!data && isFetching) return <KeychainPublicKeysTableSkeleton />
  return <KeychainPublicKeysTable keychainId={params.producerKeychainId} keys={data?.keys || []} />
}
