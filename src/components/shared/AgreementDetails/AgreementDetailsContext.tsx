import React from 'react'
import { createSafeContext } from '@/contexts/utils'
import { EServiceQueries } from '@/api/eservice'
import { remapEServiceAttributes } from '@/utils/attribute.utils'
import { FrontendAttributes } from '@/types/attribute.types'
import { AgreementSummary } from '@/types/agreement.types'
import { AgreementQueries } from '@/api/agreement'
import { useJwt } from '@/hooks/useJwt'
import { useCurrentRoute } from '@/router'
import { canAgreementBeUpgraded } from '@/utils/agreement.utils'

type AgreementDetailsContextType = {
  agreement: AgreementSummary | undefined
  eserviceAttributes: FrontendAttributes
  isAgreementEServiceMine: boolean
  canBeUpgraded: boolean
}

const initialState: AgreementDetailsContextType = {
  agreement: undefined,
  isAgreementEServiceMine: false,
  eserviceAttributes: { certified: [], verified: [], declared: [] },
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
  const { data: eservice } = EServiceQueries.useGetSingle(
    agreement?.eservice.id,
    agreement?.descriptorId
  )

  const providerValue = React.useMemo(() => {
    if (!agreement || !eservice || mode === null) return initialState

    const eserviceAttributes = remapEServiceAttributes(eservice.attributes)
    const isAgreementEServiceMine = agreement?.consumer.id === jwt?.organizationId

    const canBeUpgraded = canAgreementBeUpgraded(agreement, mode)
    return {
      agreement,
      isAgreementEServiceMine,
      eserviceAttributes,
      canBeUpgraded,
    }
  }, [agreement, eservice, jwt?.organizationId, mode])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useAgreementDetailsContext, AgreementDetailsContextProvider }
