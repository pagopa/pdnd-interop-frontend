import React from 'react'
import { createSafeContext } from '@/contexts/utils'
import { EServiceQueries } from '@/api/eservice'
import { EServiceDescriptorRead, EServiceReadType } from '@/types/eservice.types'
import { getLatestActiveDescriptor } from '@/utils/eservice.utils'
import { DocumentRead } from '@/types/common.types'
import { remapEServiceAttributes } from '@/utils/attribute.utils'
import { FrontendAttributes } from '@/types/attribute.types'
import { AgreementState } from '@/types/agreement.types'
import { useCurrentRoute } from '@/router'

type EServiceDetailsContextType = {
  eservice: EServiceReadType | undefined
  latestActiveDescriptor: EServiceDescriptorRead | undefined
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

const initialState: EServiceDetailsContextType = {
  eservice: undefined,
  latestActiveDescriptor: undefined,
  eserviceAttributes: { certified: [], verified: [], declared: [] },
  isViewingDescriptorCurrentVersion: false,
  agreement: undefined,
  docs: [],
}

const { useContext, Provider } = createSafeContext<EServiceDetailsContextType>(
  'EServiceDetailsContext',
  initialState
)

const EServiceDetailsContextProvider: React.FC<{
  eserviceId: string
  descriptorId: string
  children: React.ReactNode
}> = ({ eserviceId, descriptorId, children }) => {
  const { mode } = useCurrentRoute()
  const { data: eservice } = EServiceQueries.useGetSingle(eserviceId, descriptorId)
  const eserviceFlat = EServiceQueries.useGetSingleFlat(eserviceId, descriptorId)

  const providerValue = React.useMemo(() => {
    if (!eservice) return initialState

    const latestActiveDescriptor = getLatestActiveDescriptor(eservice) as EServiceDescriptorRead
    const eserviceAttributes = remapEServiceAttributes(eservice.attributes)
    const isViewingDescriptorCurrentVersion =
      latestActiveDescriptor.id === eservice.viewingDescriptor?.id
    const agreement = mode === 'consumer' ? eserviceFlat?.agreement : undefined
    const docs = [
      ...latestActiveDescriptor.docs,
      ...(latestActiveDescriptor.interface ? [latestActiveDescriptor.interface] : []),
    ]
    return {
      eservice,
      latestActiveDescriptor,
      eserviceAttributes,
      isViewingDescriptorCurrentVersion,
      agreement,
      docs,
    }
  }, [eservice, eserviceFlat, mode])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceDetailsContext, EServiceDetailsContextProvider }
