import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { KeychainsTableRow, KeychainsTableRowSkeleton } from './KeychainsTableRow'
import { Filters, Pagination, Table, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import type { GetProducerKeychainsParams } from '@/api/api.generatedTypes'
import { keepPreviousData, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { AuthHooks } from '@/api/auth'

export const KeychainsTable: React.FC = () => {
  const { t } = useTranslation('keychain', { keyPrefix: 'list.filters' })
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { jwt } = AuthHooks.useJwt()

  const producerId = jwt?.organizationId as string

  const { filtersParams, ...handlers } = useFilters([
    { name: 'q', type: 'freetext', label: t('nameField.label') },
  ])

  const params = {
    producerId,
    ...filtersParams,
    ...paginationParams,
  }

  const { data: keychains } = useQuery({
    ...KeychainQueries.getKeychainsList(params),
    placeholderData: keepPreviousData,
  })

  return (
    <>
      <Filters {...handlers} />
      <Suspense fallback={<KeychainsTableSkeleton />}>
        <KeychainsTableWrapper params={params} producerId={producerId} />
      </Suspense>
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(keychains?.pagination.totalCount)}
      />
    </>
  )
}

const KeychainsTableWrapper: React.FC<{
  params: GetProducerKeychainsParams
  producerId: string
}> = ({ params }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t } = useTranslation('keychain')
  const { data: keychains } = useSuspenseQuery(KeychainQueries.getKeychainsList(params))

  const headLabels = [tCommon('keychain'), '']
  const isEmpty = keychains.results.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty} noDataLabel={t('noMultiDataLabel')}>
      {!isEmpty &&
        keychains?.results.map((keychain) => (
          <KeychainsTableRow key={keychain.id} keychain={keychain} />
        ))}
    </Table>
  )
}

export const KeychainsTableSkeleton: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })
  const headLabels = [t('keychain'), '']
  return (
    <Table headLabels={headLabels}>
      <KeychainsTableRowSkeleton />
      <KeychainsTableRowSkeleton />
      <KeychainsTableRowSkeleton />
      <KeychainsTableRowSkeleton />
      <KeychainsTableRowSkeleton />
    </Table>
  )
}
