import type { Agreement, DescriptorAttributes } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { createContext } from '@/utils/common.utils'
import React from 'react'

type ProviderAgreementDetailsContextType = {
  agreement: Agreement | undefined
  descriptorAttributes: DescriptorAttributes | undefined
}

const initialState: ProviderAgreementDetailsContextType = {
  agreement: undefined,
  descriptorAttributes: undefined,
}

const { useContext, Provider } = createContext<ProviderAgreementDetailsContextType>(
  'ProviderAgreementDetailsContext',
  initialState
)

const ProviderAgreementDetailsContextProvider: React.FC<{
  agreement: Agreement | undefined
  children: React.ReactNode
}> = ({ agreement, children }) => {
  // This should not stay here, waiting to get the attributes from the agreement itself
  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(
    agreement?.eservice.id as string,
    agreement?.descriptorId as string,
    { enabled: !!(agreement?.eservice.id && agreement?.descriptorId) }
  )

  const providerValue = React.useMemo(() => {
    if (!agreement || !descriptor) return initialState

    const descriptorAttributes = descriptor.attributes

    return {
      agreement,
      descriptorAttributes,
    }
  }, [agreement, descriptor])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useProviderAgreementDetailsContext, ProviderAgreementDetailsContextProvider }
