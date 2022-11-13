import { EServiceMutations } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { PageBottomActionsCardContainer } from '@/components/layout/containers/PageBottomCardContainer'
import { StepActions } from '@/components/shared/StepActions'
import { useToastNotification } from '@/contexts'
import { ActiveStepProps } from '@/hooks/useActiveStep'
import { useNavigateRouter } from '@/router'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceCreateStep3DocumentsDoc } from './EServiceCreateStep3DocumentsDoc'
import { EServiceCreateStep3DocumentsInterface } from './EServiceCreateStep3DocumentsInterface'

export const EServiceCreateStep3Documents: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice')
  const { t: tMutations } = useTranslation('mutations-feedback')
  const { navigate } = useNavigateRouter()

  const { showToast } = useToastNotification()
  const { eservice, back } = useEServiceCreateContext()

  const { mutate: deleteVersion } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: publishVersion } = EServiceMutations.usePublishVersionDraft()

  const goToProviderEServiceList = () => {
    navigate('PROVIDE_ESERVICE_LIST')
  }

  const handleDeleteVersion = () => {
    if (!eservice || !eservice?.viewingDescriptor) return
    deleteVersion(
      { eserviceId: eservice.id, descriptorId: eservice.viewingDescriptor.id },
      { onSuccess: goToProviderEServiceList }
    )
  }

  const handlePublishVersion = () => {
    if (!eservice || !eservice?.viewingDescriptor) return
    publishVersion(
      { eserviceId: eservice.id, descriptorId: eservice.viewingDescriptor.id },
      { onSuccess: goToProviderEServiceList }
    )
  }

  const sectionDescription = `${t('create.step3.interface.description.before')} ${
    eservice?.technology === 'REST' ? 'OpenAPI' : 'WSDL'
  }  ${t('create.step3.interface.description.after')}`

  return (
    <>
      <SectionContainer>
        <Typography component="h2" variant="h5">
          {t('create.step3.interface.title')}
        </Typography>
        <Typography color="text.secondary">{sectionDescription}</Typography>

        <Box sx={{ mt: 2 }}>
          <EServiceCreateStep3DocumentsInterface />
        </Box>

        <Typography sx={{ mt: 8 }} component="h2" variant="h5">
          {t('create.step3.documentation.title')}
        </Typography>
        <Typography color="text.secondary">
          {t('create.step3.documentation.description')}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <EServiceCreateStep3DocumentsDoc />
        </Box>
      </SectionContainer>

      <StepActions
        back={{ label: t('create.backWithoutSaveBtn'), type: 'button', onClick: back }}
        forward={{
          label: t('create.endWithSaveBtn'),
          type: 'button',
          onClick: () => {
            showToast(tMutations('eservice.updateVersionDraft.outcome.success'), 'success')
            navigate('PROVIDE_ESERVICE_LIST')
          },
        }}
      />

      <PageBottomActionsCardContainer
        title={t('create.quickPublish.title')}
        description={t('create.quickPublish.description')}
      >
        <Button variant="outlined" onClick={handleDeleteVersion}>
          {t('create.quickPublish.deleteBtn')}
        </Button>
        <Button variant="contained" onClick={handlePublishVersion}>
          {t('create.quickPublish.publishBtn')}
        </Button>
      </PageBottomActionsCardContainer>
    </>
  )
}

export const EServiceCreateStep3DocumentsSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
