import { Table } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeychainPublicKeysTableRow,
  KeychainPublicKeysTableRowSkeleton,
} from './KeychainPublicKeysTableRow'
import type { PublicKey } from '@/api/api.generatedTypes'

type KeychainPublicKeysTableProps = {
  keys: PublicKey[]
  keychainId: string
}

export const KeychainPublicKeysTable: React.FC<KeychainPublicKeysTableProps> = ({
  keys,
  keychainId,
}) => {
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
      {keys.map((key) => (
        <KeychainPublicKeysTableRow key={key.keyId} publicKey={key} keychainId={keychainId} />
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
