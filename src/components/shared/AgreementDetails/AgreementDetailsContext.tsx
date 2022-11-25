import React from 'react'
import { createSafeContext } from '@/contexts/utils'
import { EServiceQueries } from '@/api/eservice'
import { remapEServiceAttributes } from '@/utils/attribute.utils'
import { FrontendAttributes, PartyAttributes } from '@/types/attribute.types'
import { AgreementSummary } from '@/types/agreement.types'
import { AgreementQueries } from '@/api/agreement'
import { useJwt } from '@/hooks/useJwt'
import { useCurrentRoute } from '@/router'
import { canAgreementBeUpgraded } from '@/utils/agreement.utils'
import { AttributeQueries } from '@/api/attribute'

type AgreementDetailsContextType = {
  agreement: AgreementSummary | undefined
  eserviceAttributes: FrontendAttributes | undefined
  partyAttributes: PartyAttributes | undefined
  isAgreementEServiceMine: boolean
  canBeUpgraded: boolean
}

const initialState: AgreementDetailsContextType = {
  agreement: undefined,
  isAgreementEServiceMine: false,
  eserviceAttributes: undefined,
  partyAttributes: undefined,
  canBeUpgraded: false,
}

const { useContext, Provider } = createSafeContext<AgreementDetailsContextType>(
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

  const partyId =
    mode === 'provider'
      ? agreement?.consumer.id
      : mode === 'consumer'
      ? jwt?.organizationId
      : undefined

  const [{ data: certified = [] }, { data: verified = [] }, { data: declared = [] }] =
    AttributeQueries.useGetListParty(partyId, agreement?.producer.id)

  const providerValue = React.useMemo(() => {
    if (!agreement || !descriptor || mode === null) return initialState

    const eserviceAttributes = remapEServiceAttributes(descriptor.eservice.attributes)
    const isAgreementEServiceMine = agreement.producer.id === agreement.consumer.id

    const canBeUpgraded = canAgreementBeUpgraded(agreement, mode)
    const partyAttributes = { certified, verified, declared }

    return {
      agreement,
      isAgreementEServiceMine,
      eserviceAttributes,
      partyAttributes,
      canBeUpgraded,
    }
  }, [agreement, descriptor, mode, certified, verified, declared])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useAgreementDetailsContext, AgreementDetailsContextProvider }
