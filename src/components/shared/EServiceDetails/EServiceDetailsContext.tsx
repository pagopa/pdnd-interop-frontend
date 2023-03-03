import React from 'react'
import { createContext } from '@/utils/common.utils'
import type { EServiceDescriptorCatalog, EServiceDescriptorProvider } from '@/types/eservice.types'
import type { DocumentRead } from '@/types/common.types'
import { remapEServiceAttributes } from '@/utils/attribute.utils'
import type { FrontendAttributes } from '@/types/attribute.types'
import type { AgreementState } from '@/types/agreement.types'

type EServiceDetailsContextType = {
  descriptor: EServiceDescriptorCatalog | EServiceDescriptorProvider
  eserviceAttributes: FrontendAttributes
  isViewingDescriptorCurrentVersion: boolean
  agreement:
    | {
        id: string
        state: AgreementState
      }
    | undefined
  docs: Array<DocumentRead>
}

const { useContext, Provider } = createContext<EServiceDetailsContextType>(
  'EServiceDetailsContext',
  null!
)

const EServiceDetailsContextProvider: React.FC<{
  descriptor: EServiceDescriptorCatalog | EServiceDescriptorProvider
  children: React.ReactNode
}> = ({ descriptor, children }) => {
  const providerValue = React.useMemo(() => {
    const eserviceAttributes = remapEServiceAttributes(descriptor.eservice.attributes)

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
      eserviceAttributes,
      isViewingDescriptorCurrentVersion,
      agreement,
      docs,
    }
  }, [descriptor])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceDetailsContext, EServiceDetailsContextProvider }
