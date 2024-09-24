import { Table } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ProviderEServiceKeychainsTableRow,
  ProviderEServiceKeychainsTableRowSkeleton,
} from './ProviderEServiceKeychainsTableRow'
import { KeychainQueries } from '@/api/keychain'
import { useSuspenseQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'

type ProviderEServiceKeychainsTableProps = {
  eserviceId: string
}

export const ProviderEServiceKeychainsTable: React.FC<ProviderEServiceKeychainsTableProps> = ({
  eserviceId,
}) => {
  const { t: tCommon } = useTranslation('common')
  const { jwt } = AuthHooks.useJwt()

  const { data: associatedKeychains } = useSuspenseQuery({
    ...KeychainQueries.getKeychainsList({
      producerId: jwt?.organizationId as string,
      eserviceId: eserviceId,
      limit: 50,
      offset: 0,
    }),
    select: (d) => d.results,
  })

  const headLabels = [tCommon('table.headData.keychain'), '']
  const isEmpty = associatedKeychains.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {associatedKeychains.map((keychain) => (
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
