import { SectionContainer } from '@/components/layout/containers'
import { UploadInterfaceDoc } from '../components/UploadInterfaceDoc'
import { useTranslation } from 'react-i18next'
import { GenerateInterfaceForm } from '../components/GenerateInterfaceForm'

type EServiceInterfaceSectionProps = {
  isEServiceCreatedFromTemplate: boolean
  description: string | JSX.Element
  descriptionTypographyProps?: React.ComponentProps<
    typeof SectionContainer
  >['descriptionTypographyProps']
  error?: string
}

export const EServiceInterfaceSection: React.FC<EServiceInterfaceSectionProps> = ({
  description,
  descriptionTypographyProps,
  isEServiceCreatedFromTemplate,
  error,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step4.interface' })

  return (
    <SectionContainer
      title={t('title')}
      description={description}
      descriptionTypographyProps={descriptionTypographyProps}
    >
      {isEServiceCreatedFromTemplate ? (
        <GenerateInterfaceForm />
      ) : (
        <UploadInterfaceDoc error={error} />
      )}
    </SectionContainer>
  )
}
