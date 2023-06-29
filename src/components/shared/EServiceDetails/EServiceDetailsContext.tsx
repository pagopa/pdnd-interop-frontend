import React from 'react'
import { createContext } from '@/utils/common.utils'
import { remapDescriptorAttributes } from '@/utils/attribute.utils'
import type { RemappedDescriptorAttributes } from '@/types/attribute.types'
import type {
  AgreementState,
  CatalogEServiceDescriptor,
  EServiceDoc,
  ProducerEServiceDescriptor,
} from '@/api/api.generatedTypes'

type EServiceDetailsContextType = {
  descriptor: CatalogEServiceDescriptor | ProducerEServiceDescriptor
  descriptorAttributes: RemappedDescriptorAttributes
  isViewingDescriptorCurrentVersion: boolean
  agreement:
    | {
        id: string
        state: AgreementState
      }
    | undefined
  docs: Array<EServiceDoc>
}

const { useContext, Provider } = createContext<EServiceDetailsContextType>(
  'EServiceDetailsContext',
  null!
)

const EServiceDetailsContextProvider: React.FC<{
  descriptor: CatalogEServiceDescriptor | ProducerEServiceDescriptor
  children: React.ReactNode
}> = ({ descriptor, children }) => {
  const providerValue = React.useMemo(() => {
    const descriptorAttributes = remapDescriptorAttributes(descriptor.attributes)

    const activeDescriptor = descriptor.eservice.descriptors.find(
      (descriptor) => descriptor.state === 'PUBLISHED'
    )

    const isViewingDescriptorCurrentVersion = descriptor.id === activeDescriptor?.id

    const agreement =
      'agreement' in descriptor.eservice &&
      descriptor.eservice?.agreement?.state &&
      !['DRAFT', 'REJECTED'].includes(descriptor.eservice.agreement.state)
        ? descriptor.eservice.agreement
        : undefined

    const docs = [...descriptor.docs, ...(descriptor.interface ? [descriptor.interface] : [])]

    return {
      descriptor,
      descriptorAttributes,
      isViewingDescriptorCurrentVersion,
      agreement,
      docs,
    }
  }, [descriptor])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceDetailsContext, EServiceDetailsContextProvider }
