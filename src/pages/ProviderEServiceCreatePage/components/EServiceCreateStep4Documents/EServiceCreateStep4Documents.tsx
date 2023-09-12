import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceCreateStep4DocumentsDoc } from './EServiceCreateStep4DocumentsDoc'
import { EServiceCreateStep4DocumentsInterface } from './EServiceCreateStep4DocumentsInterface'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export const EServiceCreateStep4Documents: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice')
  const navigate = useNavigate()

  const { descriptor, back } = useEServiceCreateContext()

  const sectionDescription = `${t('create.step4.interface.description.before')} ${
    descriptor?.eservice.technology === 'REST' ? 'OpenAPI' : 'WSDL'
  }  ${t('create.step4.interface.description.after')}`

  return (
    <>
      <SectionContainer
        newDesign
        title={t('create.step4.interface.title')}
        description={sectionDescription}
      >
        <EServiceCreateStep4DocumentsInterface />
      </SectionContainer>
      <SectionContainer
        newDesign
        title={t('create.step4.documentation.title')}
        description={t('create.step4.documentation.description')}
      >
        <EServiceCreateStep4DocumentsDoc />
      </SectionContainer>

      <StepActions
        back={{
          label: t('create.backWithoutSaveBtn'),
          type: 'button',
          onClick: back,
          startIcon: <ArrowBackIcon />,
        }}
        forward={{
          label: t('create.goToSummary'),
          type: 'button',
          onClick: () => {
            if (!descriptor) return
            navigate('PROVIDE_ESERVICE_SUMMARY', {
              params: {
                eserviceId: descriptor.eservice.id,
                descriptorId: descriptor.id,
              },
            })
          },
          endIcon: <ArrowForwardIcon />,
        }}
      />
    </>
  )
}

export const EServiceCreateStep4DocumentsSkeleton: React.FC = () => {
  return (
    <>
      <SectionContainerSkeleton height={365} />
      <SectionContainerSkeleton height={178} />
    </>
  )
}
