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
  //TODO: fix this
  params: Omit<GetClientKeysParams, 'clientId' | 'offset' | 'limit'>
}

export const ClientPublicKeysTable: React.FC<ClientPublicKeysTableProps> = ({ params }) => {
  const { t: tCommon } = useTranslation('common')

  //TODO: fix this
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
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
          //TODO: fix this
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
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
      <ClientPublicKeysTableRowSkeleton />
      <ClientPublicKeysTableRowSkeleton />
    </Table>
  )
}
