import type { EServiceMode, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { useTranslation } from 'react-i18next'
import { EServiceDetailsSectionBase } from './EServiceDetailsSectionBase'

type EServiceDetailsSectionProps = {
  areEServiceGeneralInfoEditable: boolean
  eserviceMode: EServiceMode
  descriptor?: ProducerEServiceDescriptor
  onEserviceModeChange?: (value: EServiceMode) => void
}

export const EServiceDetailsSection: React.FC<EServiceDetailsSectionProps> = ({
  areEServiceGeneralInfoEditable,
  eserviceMode,
  descriptor,
  onEserviceModeChange,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.detailsSection' })
  const { isOperatorAPI } = AuthHooks.useJwt()

  return (
    <EServiceDetailsSectionBase
      isEditable={areEServiceGeneralInfoEditable}
      eserviceMode={eserviceMode}
      details={descriptor?.eservice}
      readOnlyDescription={t('readOnlyDescription')}
      showFirstVersionOnlyEditableInfo
      showOperatorApiWarning={isOperatorAPI}
      onEserviceModeChange={onEserviceModeChange}
    />
  )
}
