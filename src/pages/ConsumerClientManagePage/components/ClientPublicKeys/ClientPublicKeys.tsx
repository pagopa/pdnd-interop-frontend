import React from 'react'
import {
  ClientAddPublicKeyButton,
  ClientAddPublicKeyButtonSkeleton,
} from './ClientAddPublicKeyButton'
import { ClientPublicKeysTable, ClientPublicKeysTableSkeleton } from './ClientPublicKeysTable'

interface ClientPublicKeysProps {
  clientId: string
}

export const ClientPublicKeys: React.FC<ClientPublicKeysProps> = ({ clientId }) => {
  return (
    <>
      <React.Suspense fallback={<ClientAddPublicKeyButtonSkeleton />}>
        <ClientAddPublicKeyButton clientId={clientId} />
      </React.Suspense>
      <React.Suspense fallback={<ClientPublicKeysTableSkeleton />}>
        <ClientPublicKeysTable clientId={clientId} />
      </React.Suspense>
    </>
  )
}
