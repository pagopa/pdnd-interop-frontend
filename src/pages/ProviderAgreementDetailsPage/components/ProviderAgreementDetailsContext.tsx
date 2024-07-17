import type { Agreement, DescriptorAttributes } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { createContext } from '@/utils/common.utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'

type ProviderAgreementDetailsContextType = {
  agreement: Agreement
  descriptorAttributes: DescriptorAttributes
}

const initialState: ProviderAgreementDetailsContextType = {
  agreement: undefined!,
  descriptorAttributes: undefined!,
}

const { useContext, Provider } = createContext<ProviderAgreementDetailsContextType>(
  'ProviderAgreementDetailsContext',
  initialState
)

const ProviderAgreementDetailsContextProvider: React.FC<{
  agreement: Agreement
  children: React.ReactNode
}> = ({ agreement, children }) => {
  // This should not stay here, waiting to get the attributes from the agreement itself
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorCatalog(agreement.eservice.id, agreement.descriptorId)
  )

  const providerValue = React.useMemo(() => {
    const descriptorAttributes = descriptor.attributes

    return {
      agreement,
      descriptorAttributes,
    }
  }, [agreement, descriptor])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useProviderAgreementDetailsContext, ProviderAgreementDetailsContextProvider }
