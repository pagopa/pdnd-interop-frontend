import { Table } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { KeychainMembersTableRow, KeychainMembersTableRowSkeleton } from './KeychainMembersTableRow'
import { KeychainQueries } from '@/api/keychain/keychain.queries'

type KeychainMembersTableProps = {
  keychainId: string
}

export const KeychainMembersTable: React.FC<KeychainMembersTableProps> = ({ keychainId }) => {
  const { t: tCommon } = useTranslation('common')

  const { data: keychainUsers } = useSuspenseQuery(
    KeychainQueries.getProducerKeychainUsersList(keychainId)
  )

  const headLabels = [tCommon('table.headData.userName'), '']
  const isEmpty = keychainUsers.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {keychainUsers.map((user) => (
        <KeychainMembersTableRow key={user.userId} user={user} keychainId={keychainId} />
      ))}
    </Table>
  )
}

export const KeychainMembersTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common')

  const headLabels = [tCommon('table.headData.userName'), '']
  return (
    <Table headLabels={headLabels}>
      <KeychainMembersTableRowSkeleton />
      <KeychainMembersTableRowSkeleton />
      <KeychainMembersTableRowSkeleton />
      <KeychainMembersTableRowSkeleton />
      <KeychainMembersTableRowSkeleton />
    </Table>
  )
}
