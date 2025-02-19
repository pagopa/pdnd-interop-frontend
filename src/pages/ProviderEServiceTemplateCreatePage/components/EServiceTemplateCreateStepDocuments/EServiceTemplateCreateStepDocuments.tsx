import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import { EServiceTemplateCreateStepDocumentsDoc } from './EServiceTemplateCreateStepDocumentsDoc'
import { EServiceTemplateCreateStepDocumentsInterface } from './EServiceTemplateCreateStepDocumentsInterface'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { IconLink } from '@/components/shared/IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import { openApiCheckerLink } from '@/config/constants'
import { trackEvent } from '@/config/tracking'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'

export const EServiceTemplateCreateStepDocuments: React.FC<ActiveStepProps> = () => {
  //TODO
  const { t } = useTranslation('eservice')
  const navigate = useNavigate()

  const { template, back } = useEServiceTemplateCreateContext()

  const sectionDescription =
    template?.eservice.technology === 'SOAP' ? (
      t(`create.step4.interface.description.soap`)
    ) : (
      <>
        {t(`create.step4.interface.description.rest`)}{' '}
        <IconLink
          href={openApiCheckerLink}
          target="_blank"
          endIcon={<LaunchIcon fontSize="small" />}
        >
          {t('create.step4.interface.description.restLinkLabel')}
        </IconLink>
      </>
    )

  return (
    <>
      <SectionContainer title={t('create.step4.interface.title')} description={sectionDescription}>
        <EServiceTemplateCreateStepDocumentsInterface />
      </SectionContainer>
      <SectionContainer
        title={t('create.step4.documentation.title')}
        description={t('create.step4.documentation.description')}
      >
        <EServiceTemplateCreateStepDocumentsDoc />
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
            if (!template) return //TODO
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

export const EServiceTemplateCreateStepDocumentsSkeleton: React.FC = () => {
  return (
    <>
      <SectionContainerSkeleton height={365} />
      <SectionContainerSkeleton height={178} />
    </>
  )
}
