import { Table } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ClientPublicKeysTableRow,
  ClientPublicKeysTableRowSkeleton,
} from './ClientPublicKeysTableRow'
import type { PublicKey } from '@/api/api.generatedTypes'

type ClientPublicKeysTableProps = {
  keys: PublicKey[]
  clientId: string
}

export const ClientPublicKeysTable: React.FC<ClientPublicKeysTableProps> = ({ keys, clientId }) => {
  const { t: tCommon } = useTranslation('common')

  const headLabels = [
    tCommon('table.headData.keyName'),
    tCommon('table.headData.keyUploader'),
    tCommon('table.headData.keyUploadDate'),
    '',
  ]
  const isEmpty = keys.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {keys.map((publicKey) => (
        <ClientPublicKeysTableRow key={publicKey.keyId} publicKey={publicKey} clientId={clientId} />
      ))}
    </Table>
  )
}

export const ClientPublicKeysTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common')

  const headLabels = [
    tCommon('table.headData.keyName'),
    tCommon('table.headData.keyUploader'),
    tCommon('table.headData.keyUploadDate'),
    '',
  ]

  return (
    <Table headLabels={headLabels}>
      <ClientPublicKeysTableRowSkeleton />
      <ClientPublicKeysTableRowSkeleton />
      <ClientPublicKeysTableRowSkeleton />
      <ClientPublicKeysTableRowSkeleton />
      <ClientPublicKeysTableRowSkeleton />
    </Table>
  )
}
