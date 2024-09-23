import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { Table } from '@pagopa/interop-fe-commons'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeychainPublicKeysTableRow,
  KeychainPublicKeysTableRowSkeleton,
} from './KeychainPublicKeysTableRow'
import type { GetProducerKeysParams } from '@/api/api.generatedTypes.producerKeychain'

type KeychainPublicKeysTableProps = {
  params: GetProducerKeysParams
}

export const KeychainPublicKeysTable: React.FC<KeychainPublicKeysTableProps> = ({ params }) => {
  const { t: tCommon } = useTranslation('common')

  const { data: keychainPublicKeys } = useSuspenseQuery({
    ...KeychainQueries.getProducerKeychainKeysList(params),
    select: (data) => data.keys,
  })

  const headLabels = [
    tCommon('table.headData.keyName'),
    tCommon('table.headData.keyUploader'),
    tCommon('table.headData.keyUploadDate'),
    '',
  ]
  const isEmpty = keychainPublicKeys.length === 0

  return (
    <Table headLabels={headLabels} isEmpty={isEmpty}>
      {keychainPublicKeys.map((key) => (
        <KeychainPublicKeysTableRow
          key={key.keyId}
          publicKey={key}
          keychainId={params.producerKeychainId}
        />
      ))}
    </Table>
  )
}

export const KeychainPublicKeysTableSkeleton: React.FC = () => {
  const { t: tCommon } = useTranslation('common')

  const headLabels = [
    tCommon('table.headData.keyName'),
    tCommon('table.headData.keyUploader'),
    tCommon('table.headData.keyUploadDate'),
    '',
  ]
  return (
    <Table headLabels={headLabels}>
      <KeychainPublicKeysTableRowSkeleton />
      <KeychainPublicKeysTableRowSkeleton />
      <KeychainPublicKeysTableRowSkeleton />
    </Table>
  )
}
