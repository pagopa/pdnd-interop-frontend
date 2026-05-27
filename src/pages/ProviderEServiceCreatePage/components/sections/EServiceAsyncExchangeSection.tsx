import { useEServiceCreateContext } from '../EServiceCreateContext'
import { UploadCallbackInterfaceDoc } from '../components/UploadCallbackInterfaceDoc'
import { EServiceAsyncExchangeSectionBase } from './EServiceAsyncExchangeSectionBase'

type EServiceAsyncExchangeSectionProps = {
  areEServiceGeneralInfoEditable: boolean
  isEServiceCreatedFromTemplate?: boolean
}

export const EServiceAsyncExchangeSection: React.FC<EServiceAsyncExchangeSectionProps> = ({
  areEServiceGeneralInfoEditable,
  isEServiceCreatedFromTemplate = false,
}) => {
  const { descriptor } = useEServiceCreateContext()
  const isSoap = descriptor?.eservice.technology === 'SOAP'
  const readOnlyCallbackInterfaceContent = <UploadCallbackInterfaceDoc readOnly />
  const editableCallbackInterfaceContent = isEServiceCreatedFromTemplate ? (
    readOnlyCallbackInterfaceContent
  ) : (
    <UploadCallbackInterfaceDoc />
  )

  return (
    <EServiceAsyncExchangeSectionBase
      areGeneralInfoEditable={areEServiceGeneralInfoEditable}
      areAdvancedOptionsEditable={!isEServiceCreatedFromTemplate}
      asyncExchangeProperties={descriptor?.asyncExchangeProperties}
      editableCallbackInterfaceContent={editableCallbackInterfaceContent}
      readOnlyCallbackInterfaceContent={readOnlyCallbackInterfaceContent}
      isSoap={isSoap}
      forceBulkFalse={!isEServiceCreatedFromTemplate}
    />
  )
}
