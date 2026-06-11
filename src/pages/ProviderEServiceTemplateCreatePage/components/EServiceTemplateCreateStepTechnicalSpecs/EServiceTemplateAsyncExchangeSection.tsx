import { EServiceAsyncExchangeSectionBase } from '@/pages/ProviderEServiceCreatePage/components/sections/EServiceAsyncExchangeSectionBase'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { UploadTemplateCallbackInterfaceDoc } from './UploadTemplateCallbackInterfaceDoc'

export const EServiceTemplateAsyncExchangeSection: React.FC = () => {
  const { eserviceTemplateVersion } = useEServiceTemplateCreateContext()
  const isSoap = eserviceTemplateVersion?.eserviceTemplate.technology === 'SOAP'

  return (
    <EServiceAsyncExchangeSectionBase
      areGeneralInfoEditable
      areAdvancedOptionsEditable
      asyncExchangeProperties={eserviceTemplateVersion?.asyncExchangeProperties}
      editableCallbackInterfaceContent={<UploadTemplateCallbackInterfaceDoc />}
      readOnlyCallbackInterfaceContent={<UploadTemplateCallbackInterfaceDoc />}
      isSoap={isSoap}
      forceBulkFalse
      translationNamespace="eserviceTemplate"
      translationKeyPrefix="create.step3.technicalSpecs.asyncExchangeSection"
    />
  )
}
