import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceCreateStepDocumentsDoc } from './EServiceCreateStepDocumentsDoc'
import { EServiceCreateStepDocumentsInterface } from './EServiceCreateStepDocumentsInterface'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from '@tanstack/react-router'

export const EServiceCreateStepDocuments: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice')
  const navigate = useNavigate()

  const { descriptor, back } = useEServiceCreateContext()

  const sectionDescription = `${t('create.step4.interface.description.before')} ${
    descriptor?.eservice.technology === 'REST' ? 'OpenAPI' : 'WSDL'
  }  ${t('create.step4.interface.description.after')}`

  return (
    <>
      <SectionContainer title={t('create.step4.interface.title')} description={sectionDescription}>
        <EServiceCreateStepDocumentsInterface />
      </SectionContainer>
      <SectionContainer
        title={t('create.step4.documentation.title')}
        description={t('create.step4.documentation.description')}
      >
        <EServiceCreateStepDocumentsDoc />
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
            navigate({
              to: '/erogazione/e-service/$eserviceId/$descriptorId/modifica/riepilogo',
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

export const EServiceCreateStepDocumentsSkeleton: React.FC = () => {
  return (
    <>
      <SectionContainerSkeleton height={365} />
      <SectionContainerSkeleton height={178} />
    </>
  )
}
