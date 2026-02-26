import { SectionContainer } from '@/components/layout/containers'
import { UploadInterface } from '../components/UploadInterfaceDoc'
import { useTranslation } from 'react-i18next'
import { GenerateInterfaceForm } from '../components/GenerateInterfaceForm'

type EServiceInterfaceSectionProps = {
  isEServiceCreatedFromTemplate: boolean
  description: string | JSX.Element
}

export const EServiceInterfaceSection: React.FC<EServiceInterfaceSectionProps> = ({
  description,
  isEServiceCreatedFromTemplate,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step4.interface' })

  return (
    <SectionContainer title={t('title')} description={description}>
      {isEServiceCreatedFromTemplate ? <GenerateInterfaceForm /> : <UploadInterface />}
    </SectionContainer>
  )
}
