import { ClientQueries } from '@/api/client'
import { Table } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ClientPublicKeysTableRow,
  ClientPublicKeysTableRowSkeleton,
} from './ClientPublicKeysTableRow'
import type { GetClientKeysParams } from '@/api/api.generatedTypes'
import { useSuspenseQuery } from '@tanstack/react-query'

type ClientPublicKeysTableProps = {
  params: GetClientKeysParams
}

export const ClientPublicKeysTable: React.FC<ClientPublicKeysTableProps> = ({ params }) => {
  const { t: tCommon } = useTranslation('common')

  const { data } = useSuspenseQuery(ClientQueries.getKeyList(params))
  const publicKeys = data.keys

  const headLabels = [
    tCommon('table.headData.keyName'),
    tCommon('table.headData.keyUploader'),
    tCommon('table.headData.keyUploadDate'),
    '',
  ]
  const isEmpty = publicKeys.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {publicKeys.map((publicKey) => (
        <ClientPublicKeysTableRow
          key={publicKey.keyId}
          publicKey={publicKey}
          clientId={params.clientId}
        />
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
    </Table>
  )
}
