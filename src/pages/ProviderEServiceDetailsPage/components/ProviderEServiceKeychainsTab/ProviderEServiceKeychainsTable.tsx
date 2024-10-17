import { Pagination, Table, usePagination } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ProviderEServiceKeychainsTableRow,
  ProviderEServiceKeychainsTableRowSkeleton,
} from './ProviderEServiceKeychainsTableRow'
import { KeychainQueries } from '@/api/keychain'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import type { GetProducerKeychainsParams } from '@/api/api.generatedTypes'

type ProviderEServiceKeychainsTableProps = {
  eserviceId: string
}

export const ProviderEServiceKeychainsTable: React.FC<ProviderEServiceKeychainsTableProps> = ({
  eserviceId,
}) => {
  const { jwt } = AuthHooks.useJwt()
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })

  const params: GetProducerKeychainsParams = {
    producerId: jwt?.organizationId as string,
    eserviceId: eserviceId,
    ...paginationParams,
  }

  const { data: associatedKeychainsTotalCount } = useQuery({
    ...KeychainQueries.getKeychainsList(params),
    select: (data) => data.pagination.totalCount,
  })

  return (
    <>
      <React.Suspense fallback={<ProviderEServiceKeychainsTableSkeleton />}>
        <KeychainsTableWrapper params={params} eserviceId={eserviceId} />
      </React.Suspense>
      <Pagination
        {...paginationProps}
        totalPages={getTotalPageCount(associatedKeychainsTotalCount)}
      />
    </>
  )
}

const KeychainsTableWrapper: React.FC<{
  params: GetProducerKeychainsParams
  eserviceId: string
}> = ({ params, eserviceId }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { data: associatedKeychains } = useSuspenseQuery(KeychainQueries.getKeychainsList(params))

  const headLabels = [tCommon('keychain'), '']
  const isEmpty = associatedKeychains.results.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {!isEmpty &&
        associatedKeychains?.results.map((keychain) => (
          <ProviderEServiceKeychainsTableRow
            key={keychain.id}
            eserviceId={eserviceId}
            keychain={keychain}
          />
        ))}
    </Table>
  )
}

export const ProviderEServiceKeychainsTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common')

  const headLabels = [tCommon('table.headData.keychain'), '']
  return (
    <Table headLabels={headLabels}>
      <ProviderEServiceKeychainsTableRowSkeleton />
      <ProviderEServiceKeychainsTableRowSkeleton />
      <ProviderEServiceKeychainsTableRowSkeleton />
      <ProviderEServiceKeychainsTableRowSkeleton />
      <ProviderEServiceKeychainsTableRowSkeleton />
    </Table>
  )
}
