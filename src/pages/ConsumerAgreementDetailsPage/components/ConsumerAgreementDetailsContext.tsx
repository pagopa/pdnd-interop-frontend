import type { Agreement, DescriptorAttributes } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { createContext } from '@/utils/common.utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'

type ConsumerAgreementDetailsContextType = {
  agreement: Agreement
  descriptorAttributes: DescriptorAttributes
}

const initialState: ConsumerAgreementDetailsContextType = {
  agreement: undefined!,
  descriptorAttributes: undefined!,
}

const { useContext, Provider } = createContext<ConsumerAgreementDetailsContextType>(
  'ProviderAgreementDetailsContext',
  initialState
)

const ConsumerAgreementDetailsContextProvider: React.FC<{
  agreement: Agreement
  children: React.ReactNode
}> = ({ agreement, children }) => {
  // This should not stay here, waiting to get the attributes from the agreement itself

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorCatalog(agreement.eservice.id, agreement.descriptorId)
  )

  const providerValue = React.useMemo(
    () => ({
      agreement,
      descriptorAttributes: descriptor.attributes,
    }),
    [agreement, descriptor]
  )

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useConsumerAgreementDetailsContext, ConsumerAgreementDetailsContextProvider }
