import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('eservice', {
    keyPrefix: 'create.step4.asyncExchangeSection',
  })

  const { descriptor } = useEServiceCreateContext()
  const isSoap = descriptor?.eservice.technology === 'SOAP'
  const readOnlyCallbackInterfaceContent = <UploadCallbackInterfaceDoc readOnly />
  const editableCallbackInterfaceContent = isEServiceCreatedFromTemplate ? (
    <Stack sx={{ mt: 2 }}>
      <InformationContainer
        label={t('callbackInterface.readOnlyLabel')}
        content={readOnlyCallbackInterfaceContent}
      />
    </Stack>
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
