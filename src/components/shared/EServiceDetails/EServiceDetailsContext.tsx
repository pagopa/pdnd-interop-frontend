import React from 'react'
import { createSafeContext } from '@/contexts/utils'
import { EServiceDescriptorCatalog, EServiceDescriptorProvider } from '@/types/eservice.types'
import { DocumentRead } from '@/types/common.types'
import { remapEServiceAttributes } from '@/utils/attribute.utils'
import { FrontendAttributes } from '@/types/attribute.types'
import { AgreementState } from '@/types/agreement.types'

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

const { useContext, Provider } = createSafeContext<EServiceDetailsContextType>(
  'EServiceDetailsContext',
  null!
)

const EServiceDetailsContextProvider: React.FC<{
  descriptor: EServiceDescriptorCatalog | EServiceDescriptorProvider
  children: React.ReactNode
}> = ({ descriptor, children }) => {
  const providerValue = React.useMemo(() => {
    const eserviceAttributes = remapEServiceAttributes(descriptor.eservice.attributes)

    console.log({ descriptor })
    const isViewingDescriptorCurrentVersion =
      'activeDescriptor' in descriptor.eservice &&
      descriptor.id === descriptor.eservice.activeDescriptor?.id

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
