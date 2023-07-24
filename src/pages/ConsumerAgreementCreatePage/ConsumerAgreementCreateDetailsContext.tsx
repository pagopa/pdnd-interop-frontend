import React from 'react'
import { createContext } from '@/utils/common.utils'
import type {
  Agreement,
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  VerifiedTenantAttribute,
} from '@/api/api.generatedTypes'
import { AgreementQueries } from '@/api/agreement'
import noop from 'lodash/noop'
import { EServiceQueries } from '@/api/eservice'
import { remapDescriptorAttributes } from '@/utils/attribute.utils'
import type { RemappedDescriptorAttributes } from '@/types/attribute.types'
// import { AttributeQueries } from '@/api/attribute'

type ConsumerAgreementCreateDetailsContextType = {
  agreement: Agreement | undefined
  descriptorAttributes: RemappedDescriptorAttributes | undefined
  partyAttributes:
    | {
        certified: CertifiedTenantAttribute[]
        verified: VerifiedTenantAttribute[]
        declared: DeclaredTenantAttribute[]
      }
    | undefined
  isCertifiedAttributesDrawerOpen: boolean
  openCertifiedAttributesDrawer: VoidFunction
  closeCertifiedAttributesDrawer: VoidFunction
}

const initialState: ConsumerAgreementCreateDetailsContextType = {
  agreement: undefined,
  descriptorAttributes: undefined,
  partyAttributes: undefined,
  isCertifiedAttributesDrawerOpen: false,
  openCertifiedAttributesDrawer: noop,
  closeCertifiedAttributesDrawer: noop,
}

const { useContext, Provider } = createContext<ConsumerAgreementCreateDetailsContextType>(
  'ConsumerAgreementCreateDetailsContext',
  initialState
)

const ConsumerAgreementCreateDetailsContextProvider: React.FC<{
  agreementId: string
  children: React.ReactNode
}> = ({ agreementId, children }) => {
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId)
  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(
    agreement?.eservice.id as string,
    agreement?.descriptorId as string,
    { enabled: !!(agreement?.eservice.id && agreement?.descriptorId) }
  )

  const [isCertifiedAttributesDrawerOpen, setIsCertifiedAttributesDrawerOpen] =
    React.useState(false)

  const openCertifiedAttributesDrawer = () => {
    setIsCertifiedAttributesDrawerOpen(true)
  }

  const closeCertifiedAttributesDrawer = () => {
    setIsCertifiedAttributesDrawerOpen(false)
  }

  const providerValue = React.useMemo(() => {
    if (!agreement || !descriptor) return initialState

    const descriptorAttributes = remapDescriptorAttributes(descriptor.attributes)

    const partyAttributes = {
      certified: agreement?.consumer.attributes.certified ?? [],
      verified: agreement?.consumer.attributes.verified ?? [],
      declared: agreement?.consumer.attributes.declared ?? [],
    }

    return {
      agreement,
      descriptorAttributes,
      partyAttributes,
      isCertifiedAttributesDrawerOpen,
      openCertifiedAttributesDrawer,
      closeCertifiedAttributesDrawer,
    }
  }, [agreement, descriptor, isCertifiedAttributesDrawerOpen])
  return <Provider value={providerValue}>{children}</Provider>
}

export {
  useContext as useConsumerAgreementCreateDetailsContext,
  ConsumerAgreementCreateDetailsContextProvider,
}
