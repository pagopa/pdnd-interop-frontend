import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import { EServiceTemplateCreateStepDocumentsInterface } from './EServiceTemplateCreateStepDocumentsInterface'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateCreateStepDocumentsDoc } from './EServiceTemplateCreateStepDocumentsDoc'
import { Alert, Stack } from '@mui/material'

export const EServiceTemplateCreateStepDocuments: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('template')
  const navigate = useNavigate()

  const { template, back } = useEServiceTemplateCreateContext()

  const sectionDescription =
    template?.eserviceTemplate.technology === 'SOAP' ? (
      t(`create.step4.interface.description.soap`)
    ) : (
      <>{t(`create.step4.interface.description.rest`)} </>
    )

  return (
    <>
      <SectionContainer title={t('create.step4.interface.title')} description={sectionDescription}>
        <Stack spacing={3}>
          <Alert severity="info"> {t('create.step4.interface.alert')}</Alert>
          <EServiceTemplateCreateStepDocumentsInterface />
        </Stack>
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
            if (!template) return
            navigate('PROVIDE_ESERVICE_TEMPLATE_SUMMARY', {
              params: {
                eServiceTemplateId: template.id,
                eServiceTemplateVersionId: template.eserviceTemplate.id,
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
