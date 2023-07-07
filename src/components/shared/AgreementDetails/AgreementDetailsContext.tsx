import React from 'react'
import { createContext } from '@/utils/common.utils'
import { EServiceQueries } from '@/api/eservice'
import { remapDescriptorAttributes } from '@/utils/attribute.utils'
import type { RemappedDescriptorAttributes } from '@/types/attribute.types'
import { AgreementQueries } from '@/api/agreement'
import { useJwt } from '@/hooks/useJwt'
import { useCurrentRoute } from '@/router'
import { AttributeQueries } from '@/api/attribute'
import type {
  Agreement,
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  VerifiedTenantAttribute,
} from '@/api/api.generatedTypes'
import noop from 'lodash/noop'

type AgreementDetailsContextType = {
  agreement: Agreement | undefined
  descriptorAttributes: RemappedDescriptorAttributes | undefined
  partyAttributes:
    | {
        certified: CertifiedTenantAttribute[]
        verified: VerifiedTenantAttribute[]
        declared: DeclaredTenantAttribute[]
      }
    | undefined
  isAgreementEServiceMine: boolean
  isAttachedDocsDrawerOpen: boolean
  openAttachedDocsDrawer: VoidFunction
  closeAttachedDocsDrawer: VoidFunction
}

const initialState: AgreementDetailsContextType = {
  agreement: undefined,
  isAgreementEServiceMine: false,
  descriptorAttributes: undefined,
  partyAttributes: undefined,
  isAttachedDocsDrawerOpen: false,
  openAttachedDocsDrawer: noop,
  closeAttachedDocsDrawer: noop,
}

const { useContext, Provider } = createContext<AgreementDetailsContextType>(
  'AgreementDetailsContext',
  initialState
)

const AgreementDetailsContextProvider: React.FC<{
  agreementId: string
  children: React.ReactNode
}> = ({ agreementId, children }) => {
  const { jwt } = useJwt()
  const { mode } = useCurrentRoute()

  const { data: agreement } = AgreementQueries.useGetSingle(agreementId)

  // This should not stay here, waiting to get the attributes from the agreement itself
  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(
    agreement?.eservice.id as string,
    agreement?.descriptorId as string,
    { enabled: !!(agreement?.eservice.id && agreement?.descriptorId) }
  )

  const [isAttachedDocsDrawerOpen, setIsAttachedDocsDrawerOpen] = React.useState(false)

  const openAttachedDocsDrawer = React.useCallback(() => setIsAttachedDocsDrawerOpen(true), [])
  const closeAttachedDocsDrawer = React.useCallback(() => setIsAttachedDocsDrawerOpen(false), [])

  const partyId = mode === 'provider' ? agreement?.consumer.id : jwt?.organizationId

  const [{ data: certified }, { data: verified }, { data: declared }] =
    AttributeQueries.useGetListParty(partyId)

  const providerValue = React.useMemo(() => {
    if (!agreement || !descriptor || mode === null) return initialState

    const descriptorAttributes = remapDescriptorAttributes(descriptor.attributes)
    const isAgreementEServiceMine = agreement.producer.id === agreement.consumer.id

    const partyAttributes = {
      certified: certified?.attributes ?? [],
      verified: verified?.attributes ?? [],
      declared: declared?.attributes ?? [],
    }

    return {
      agreement,
      isAgreementEServiceMine,
      descriptorAttributes,
      partyAttributes,
      isAttachedDocsDrawerOpen,
      openAttachedDocsDrawer,
      closeAttachedDocsDrawer,
    }
  }, [
    agreement,
    descriptor,
    mode,
    certified,
    verified,
    declared,
    isAttachedDocsDrawerOpen,
    openAttachedDocsDrawer,
    closeAttachedDocsDrawer,
  ])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useAgreementDetailsContext, AgreementDetailsContextProvider }
